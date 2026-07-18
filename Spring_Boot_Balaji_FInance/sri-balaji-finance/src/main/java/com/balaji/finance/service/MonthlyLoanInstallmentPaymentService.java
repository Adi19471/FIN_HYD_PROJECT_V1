package com.balaji.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.AccountMaster;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.entity.LoanStatus;
import com.balaji.finance.entity.PaymentAllocation;
import com.balaji.finance.pojo.EmiPaymentHistoryDto;
import com.balaji.finance.pojo.InstallmentDetails;
import com.balaji.finance.pojo.LoanInformation;
import com.balaji.finance.pojo.QuickCashBookRow;
import com.balaji.finance.repo.AccountMasterRepo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;
import com.balaji.finance.repo.PaymentAllocationRepo;

import jakarta.transaction.Transactional;

@Service
public class MonthlyLoanInstallmentPaymentService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private EmiRepo emiRepo;

	@Autowired
	private AccountMasterRepo accountMasterRepo;

	@Autowired
	private PaymentAllocationRepo paymentAllocationRepo;

	private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	@Transactional
	public LoanInformation loadMFLoanPaidInfo(String id) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(id);
		if (!opt.isPresent()) {
			return null;
		}

		BusinessMember bm = opt.get();
		if (bm.getCustomerId() == null || bm.getCustomerId().getFirstName() == null) {
			return null;
		}

		if (bm.getStartDate() == null || bm.getEndDate() == null) {
			return null;
		}

		LoanInformation info = new LoanInformation();
		DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

		// ACCOUNT DETAILS
		String accountNo = bm.getBusinessMemberId() + "-" + bm.getCustomerId().getFirstName() + "-"
				+ (bm.getCustomerId().getPersonalInfoId() != null ? bm.getCustomerId().getPersonalInfoId() : "");
		info.setAccountNo(accountNo);

		String partnerName = (bm.getPartnerId() != null)
				? (bm.getPartnerId().getFirstName() != null ? bm.getPartnerId().getFirstName() : "") + "-"
						+ (bm.getPartnerId().getPersonalInfoId() != null ? bm.getPartnerId().getPersonalInfoId() : "")
				: "";
		info.setPartnerName(partnerName);

		String guarantorName = (bm.getGuarantor1() != null)
				? (bm.getGuarantor1().getFirstName() != null ? bm.getGuarantor1().getFirstName() : "") + "-"
						+ (bm.getGuarantor1().getPersonalInfoId() != null ? bm.getGuarantor1().getPersonalInfoId() : "")
				: "";
		info.setGuarantorName(guarantorName);

		info.setPeriodFrom(bm.getStartDate().toLocalDate());
		info.setPeriodTo(bm.getEndDate().toLocalDate());
		

		info.setLoanAmount(bm.getAmount());
		BigDecimal installmentAmount = bm.getInstallment();
		info.setInstallmentAmount(installmentAmount);
		
		
		info.setDuration(bm.getDuration());
		info.setProcessingFee(bm.getProcessingFee());
		info.setInterestRate(bm.getInterestRate());
		
		
		
		

		List<CashBook> collectionsList = cashBookRepo.getAllMonthlyCollectionsByBusniesMember(bm.getBusinessMemberId());

		Map<String, List<CashBook>> paymentref_cashbookList = collectionsList.stream()
		        .sorted(Comparator.comparing(CashBook::getTransDate))
		        .collect(Collectors.groupingBy(
		                CashBook::getPaymentRefId,
		                LinkedHashMap::new,
		                Collectors.toList()
		        ));

		int count = 0;
		List<EmiPaymentHistoryDto> emiPaymentHistoryList = new ArrayList<EmiPaymentHistoryDto>();

		BigDecimal totalLoanAmount = bm.getAmount().add(bm.getInterest());
		BigDecimal totalAmountPaid = BigDecimal.ZERO;
		LocalDateTime lastPaidDate = bm.getStartDate();

		List<PaymentAllocation> allocations = paymentAllocationRepo
				.findByPaymentRefIdIn(paymentref_cashbookList.keySet());
		Map<String, List<PaymentAllocation>> paymentRefAllocations = allocations.stream()
				.collect(Collectors.groupingBy(PaymentAllocation::getPaymentRefId));

		for (Entry<String, List<CashBook>> entrySet : paymentref_cashbookList.entrySet()) {

			List<CashBook> cashBookList = entrySet.getValue();

			BigDecimal total = BigDecimal.ZERO;

			if (!cashBookList.isEmpty()) {

				CashBook sampleCashBook = cashBookList.get(0);

				for (CashBook transaction : cashBookList) {

					total = total.add(transaction.getCredit());
				}

				totalAmountPaid = totalAmountPaid.add(total);

				List<PaymentAllocation> allocationList = paymentRefAllocations
						.getOrDefault(sampleCashBook.getPaymentRefId(), Collections.emptyList());

				LocalDateTime dueDate = allocationList.stream().map(pa -> pa.getEmi().getDueDate())
						.filter(Objects::nonNull).min(LocalDateTime::compareTo).orElse(null);

				EmiPaymentHistoryDto inst = new EmiPaymentHistoryDto();
				inst.setSno(++count);
				inst.setId(sampleCashBook.getCashBookId());
				inst.setDate(sampleCashBook.getTransDate().toLocalDate());
				inst.setDueDate(dueDate != null ? dueDate.toLocalDate() : null);
				inst.setPaid(total);
				inst.setTotalPaid(totalAmountPaid);
				inst.setBalance(totalLoanAmount.subtract(totalAmountPaid));

				inst.setLateFee(BigDecimal.ZERO);

				inst.setCashier(sampleCashBook.getUser());

				emiPaymentHistoryList.add(inst);

				if (sampleCashBook.getTransDate() != null && sampleCashBook.getTransDate().isAfter(lastPaidDate)) {
					lastPaidDate = sampleCashBook.getTransDate();
				}
			}

		}

		Long pendingInstallmentsCount = emiRepo.getPendingInstallmentsCount(bm.getBusinessMemberId());
		Long completedInstallmentCount = bm.getDuration()-pendingInstallmentsCount;
		
		info.setPaid(totalAmountPaid);
		info.setBalance(totalLoanAmount.subtract(totalAmountPaid));
		info.setEmiPaymentHistoryList(emiPaymentHistoryList);
		info.setPendingInstallments(pendingInstallmentsCount);
		info.setCompletedInstallments(completedInstallmentCount);
		

		List<EMI> allEMIs = emiRepo.findByBusinessMember(bm);
		List<InstallmentDetails> allInstallmentDetails = new ArrayList<>();

		for (EMI emi : allEMIs) {

			InstallmentDetails inst = new InstallmentDetails();
			inst.setEmiId(emi.getEmiId());
			inst.setInstallmentNumber(emi.getInstallmentNumber());
			inst.setPrincipleAmount(emi.getPrincipalAmount());
			inst.setInterestAmount(emi.getInterestAmount());
			inst.setPaidAmount(emi.getPaidAmount());
			inst.setTotalAmount(emi.getTotalAmount());
			inst.setDueDate(emi.getDueDate().format(DATE_FORMAT));

			inst.setInstallmentAmount(emi.getRemainingAmount());

			LocalDate today = LocalDate.now();

			if (today.isAfter(emi.getDueDate().toLocalDate())) {
				inst.setLateFee(BigDecimal.ZERO);
			} else {
				inst.setLateFee(BigDecimal.ZERO);
			}
			inst.setLateFeeDate(null);
			inst.setStatus(emi.getStatus());

			allInstallmentDetails.add(inst);

		}
		
		
		info.setInstallmentDetailsList(allInstallmentDetails);

	
		
		return info;
	}

	private void processPayment(BusinessMember bm, BigDecimal paidAmount, BigDecimal lateFee,
			LocalDateTime transactionDate, List<EMI> allEMIs) {

		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		BigDecimal installmentPerMonth = bm.getInstallment();
		BigDecimal principal = bm.getAmount();

		String paymentRefId = System.currentTimeMillis() + "-" + UUID.randomUUID();

		List<EMI> pendingEMIs = allEMIs.stream().filter(emi -> !"PAID".equalsIgnoreCase(emi.getStatus()))
				.sorted(Comparator.comparing(EMI::getDueDate)).collect(Collectors.toList());

		BigDecimal remainingPayment = paidAmount;

		BigDecimal countOfEMisCompletedInThisInstant = BigDecimal.ZERO;
		for (EMI emi : pendingEMIs) {

			if (remainingPayment.compareTo(BigDecimal.ZERO) <= 0) {
				break;
			}

			boolean wasPaidBefore = "PAID".equalsIgnoreCase(emi.getStatus());

			BigDecimal emiRemaining = emi.getRemainingAmount();

			// 🔹 Calculate allocation
			BigDecimal allocation = remainingPayment.min(emiRemaining);

			PaymentAllocation pa = new PaymentAllocation();
			pa.setPaymentRefId(paymentRefId); // from your UUID
			pa.setEmi(emi);
			pa.setAllocatedAmount(allocation);

			paymentAllocationRepo.save(pa);

			emi.setPaidAmount(emi.getPaidAmount().add(allocation));
			emi.setPaymentDate(transactionDate);

			if (emi.getPaidAmount().compareTo(emi.getTotalAmount()) >= 0) {

				if (!wasPaidBefore) {
					countOfEMisCompletedInThisInstant = countOfEMisCompletedInThisInstant.add(BigDecimal.ONE);
				}

				emi.setStatus("PAID");

			} else if (emi.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {

				emi.setStatus("PARTIAL");

			} else {

				emi.setStatus("PENDING");
			}

			emiRepo.save(emi);

			remainingPayment = remainingPayment.subtract(allocation);
		}

		BigDecimal principalPerMonth = principal.divide(BigDecimal.valueOf(bm.getDuration()), 2, RoundingMode.HALF_UP);
		BigDecimal interestPerMonth = installmentPerMonth.subtract(principalPerMonth);

		BigDecimal interestPaid = interestPerMonth.multiply(countOfEMisCompletedInThisInstant);

		if (interestPaid.compareTo(paidAmount) > 0) {
			interestPaid = paidAmount;
		}

		BigDecimal principalPaid = paidAmount.subtract(interestPaid);

		// 🔹 Save Principal Entry
		if (principalPaid.compareTo(BigDecimal.ZERO) > 0) {

			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("MF LOAN INSTALLMENT",
					"MF LOAN INSTALLMENT");

			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(principalPaid);
			cb.setDebit(BigDecimal.ZERO);

			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMasterCode(accountMaster.getCode());

			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setSysDate(LocalDateTime.now());
			cb.setPersonalInfo(bm.getCustomerId());
			cb.setLineNo(1);
			cb.setPaymentRefId(paymentRefId);
			cashBookRepo.save(cb);
		}

		// 🔹 Save Interest Entry
		if (interestPaid.compareTo(BigDecimal.ZERO) > 0) {

			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("INTEREST",
					"MF INTEREST");

			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(interestPaid);
			cb.setDebit(BigDecimal.ZERO);

			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMasterCode(accountMaster.getCode());

			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setSysDate(LocalDateTime.now());
			cb.setPersonalInfo(bm.getCustomerId());
			cb.setLineNo(2);
			cb.setPaymentRefId(paymentRefId);

			cashBookRepo.save(cb);
		}

		boolean allPaid = allEMIs.stream()
				.allMatch(emi -> emi.getTotalAmount().subtract(emi.getPaidAmount()).compareTo(BigDecimal.ZERO) <= 0);

		if (allPaid) {
			bm.setLoanStatus(LoanStatus.COMPLETED.toString());
			businessMemberRepository.save(bm);
		}

		// 🔹 Save Late Fee
		if (lateFee != null && lateFee.compareTo(BigDecimal.ZERO) > 0) {

			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("LATE FEE",
					"MF LATE FEE");

			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(lateFee);
			cb.setDebit(BigDecimal.ZERO);

			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMasterCode(accountMaster.getCode());

			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setSysDate(LocalDateTime.now());
			cb.setPersonalInfo(bm.getCustomerId());
			cb.setLineNo(3);
			cb.setPaymentRefId(paymentRefId);

			cashBookRepo.save(cb);
		}

	}

	@Transactional
	public void saveMfLoanInstallments(String loanId, LoanInformation loanInformation) {

		BigDecimal paidAmount = loanInformation.getAmountPaid();
		BigDecimal lateFee = loanInformation.getLateFee();
		LocalDateTime transactionDate = loanInformation.getDate().atTime(LocalTime.now());
		

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);

		if (opt.isEmpty())
			return;

		BusinessMember bm = opt.get();

		List<EMI> allEMIs = emiRepo.findByBusinessMember(bm);
		BigDecimal totalRemaining = allEMIs.stream().map(EMI::getRemainingAmount).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		if (totalRemaining.compareTo(BigDecimal.ZERO) <= 0 && paidAmount.compareTo(BigDecimal.ZERO) > 0) {
			throw new IllegalArgumentException("Loan is already fully paid. Cannot accept more payment.");
		}

		if (paidAmount.compareTo(totalRemaining) > 0) {
			throw new IllegalArgumentException(
					"trying to paying excess amount , Remaining Balance : " + totalRemaining);
		}

		processPayment(bm, paidAmount, lateFee, transactionDate, allEMIs);
	}

	@Transactional
	public void saveMFLoanInstallmentFromQuickCashBook(String loanId, QuickCashBookRow row,
			LocalDateTime transactionDate) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);

		if (opt.isEmpty())
			return;

		BusinessMember bm = opt.get();

		List<EMI> allEMIs = emiRepo.findByBusinessMember(bm);
		BigDecimal totalRemaining = allEMIs.stream().map(EMI::getRemainingAmount).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		if (totalRemaining.compareTo(BigDecimal.ZERO) <= 0 && row.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
			throw new IllegalArgumentException("Loan is already fully paid. Cannot accept more payment.");
		}

		if (row.getPaidAmount().compareTo(totalRemaining) > 0) {
			throw new IllegalArgumentException(
					"trying to paying excess amount , Remaining Balance : " + totalRemaining);
		}

		processPayment(opt.get(), row.getPaidAmount(), row.getLateFee(), transactionDate, allEMIs);
	}
}