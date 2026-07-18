package com.balaji.finance.service;

import java.math.BigDecimal;
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
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.Map.Entry;
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
@Transactional
public class DailyLoanInstallmentPaymentService {

	private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

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


	public LoanInformation loadDFLoanPaidInfo(String id) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(id);
		if (opt.isEmpty())
			return null;

		BusinessMember bm = opt.get();

		if (bm.getCustomerId() == null || bm.getCustomerId().getFirstName() == null || bm.getStartDate() == null
				|| bm.getEndDate() == null) {
			return null;
		}

		LoanInformation info = new LoanInformation();

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

		List<CashBook> collectionsList = cashBookRepo.getAllDailyCollectionsByBusniesMember(bm.getBusinessMemberId());
		Map<String, List<CashBook>> paymentref_cashbookList = collectionsList.stream()
				.filter(p->p.getPaymentRefId() != null)
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

		
		
		for (CashBook transaction : collectionsList) {

			totalAmountPaid = totalAmountPaid.add(transaction.getCredit());
			
			
			List<PaymentAllocation> allocationList = transaction.getPaymentRefId() != null
					? paymentRefAllocations.getOrDefault(transaction.getPaymentRefId(), Collections.emptyList())
					: Collections.emptyList();

			LocalDateTime dueDate = allocationList.stream().map(pa -> pa.getEmi().getDueDate())
					.filter(Objects::nonNull).min(LocalDateTime::compareTo).orElse(null);

			
			
			EmiPaymentHistoryDto inst = new EmiPaymentHistoryDto();
			inst.setSno(++count);
			inst.setId(transaction.getCashBookId());
			inst.setDate(transaction.getTransDate().toLocalDate());
			inst.setDueDate(dueDate != null ? dueDate.toLocalDate() : null);
			inst.setPaid(transaction.getCredit());
			inst.setTotalPaid(totalAmountPaid);
			inst.setBalance(totalLoanAmount.subtract(totalAmountPaid));

			inst.setLateFee(BigDecimal.ZERO);

			inst.setCashier(transaction.getUser());

			emiPaymentHistoryList.add(inst);

			if (transaction.getTransDate() != null && transaction.getTransDate().isAfter(lastPaidDate)) {
				lastPaidDate = transaction.getTransDate();
			}
		}

		Long pendingInstallmentsCount = emiRepo.getPendingInstallmentsCount(bm.getBusinessMemberId());
		Long completedInstallmentCount = bm.getDuration() - pendingInstallmentsCount;

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

	@Transactional
	public void saveDFLoanInstallments(String loanId, LoanInformation info) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);

		if (opt.isEmpty())
			return;

		BusinessMember bm = opt.get();
		LocalDateTime transDate = info.getDate().atTime(LocalTime.now());
		
		
		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		BigDecimal paidAmount = info.getAmountPaid() != null ? info.getAmountPaid() : BigDecimal.ZERO;

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

		String paymentRefId = System.currentTimeMillis() + "-" + UUID.randomUUID();

		if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {

			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("DF LOAN INSTALLMENT",
					"DF LOAN INSTALLMENT");

			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(paidAmount);
			cb.setDebit(BigDecimal.ZERO);

			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMasterCode(accountMaster.getCode());

			cb.setLineNo(1);
			cb.setUser(currentUser);
			cb.setTransDate(transDate);
			cb.setPersonalInfo(bm.getCustomerId());
			cb.setPaymentRefId(paymentRefId);

			cashBookRepo.save(cb);
		}

		BigDecimal lateFee = info.getLateFee() != null ? info.getLateFee() : BigDecimal.ZERO;
		if (lateFee.compareTo(BigDecimal.ZERO) > 0) {

			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("LATE FEE",
					"DF LATE FEE");

			CashBook lateCb = new CashBook();
			lateCb.setBusinessMember(bm);
			lateCb.setCredit(lateFee);
			lateCb.setDebit(BigDecimal.ZERO);
			lateCb.setAccountMastertype(accountMaster.getType());
			lateCb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			lateCb.setAccountMasterCode(accountMaster.getCode());
			lateCb.setLineNo(2);
			lateCb.setUser(currentUser);
			lateCb.setTransDate(transDate);
			lateCb.setPersonalInfo(bm.getCustomerId());
			lateCb.setPaymentRefId(paymentRefId);

			cashBookRepo.save(lateCb);
		}

		List<EMI> pendingEMIs = allEMIs.stream().filter(emi -> !emi.getStatus().equalsIgnoreCase("PAID"))
				.collect(Collectors.toList());

		BigDecimal remainingPayment = paidAmount;
		for (EMI emi : pendingEMIs) {

			if (remainingPayment.compareTo(BigDecimal.ZERO) <= 0) {
				break;
			}

			BigDecimal emiRemaining = emi.getRemainingAmount();

			// 🔹 Calculate allocation
			BigDecimal allocation = remainingPayment.min(emiRemaining);

			PaymentAllocation pa = new PaymentAllocation();
			pa.setPaymentRefId(paymentRefId); // from your UUID
			pa.setEmi(emi);
			pa.setAllocatedAmount(allocation);

			paymentAllocationRepo.save(pa);

			emi.setPaidAmount(emi.getPaidAmount().add(allocation));
			emi.setPaymentDate(transDate);

			if (emi.getPaidAmount().compareTo(emi.getTotalAmount()) >= 0) {
				emi.setStatus("PAID");
			} else if (emi.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
		        emi.setStatus("PARTIAL");
		    } else {
				emi.setStatus("PENDING");
			}

			emiRepo.save(emi);

			remainingPayment = remainingPayment.subtract(allocation);
		}

		// Check if all EMIs are paid → mark BusinessMember as PAID
		boolean allPaid = allEMIs.stream().allMatch(emi -> emi.getRemainingAmount().compareTo(BigDecimal.ZERO) == 0);

		if (allPaid) {
			bm.setLoanStatus(LoanStatus.COMPLETED.toString());
			businessMemberRepository.save(bm);
		}

	}

	@Transactional
	public void saveDFLoanInstallmentFromQuickCashBook(String loanId, QuickCashBookRow quickRow,
			LocalDateTime transactionDate) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);

		if (opt.isEmpty())
			return;

		BusinessMember bm = opt.get();
		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		BigDecimal paidAmount = quickRow.getPaidAmount() != null ? quickRow.getPaidAmount() : BigDecimal.ZERO;

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

		if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
			
			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("DF LOAN INSTALLMENT", "DF LOAN INSTALLMENT");



			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(paidAmount);
			cb.setDebit(BigDecimal.ZERO);
			
			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMasterCode(accountMaster.getCode());
			
			cb.setLineNo(1);
			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setPersonalInfo(bm.getCustomerId());

			cashBookRepo.save(cb);
		}

		BigDecimal lateFee = quickRow.getLateFee() != null ? quickRow.getLateFee() : BigDecimal.ZERO;
		if (lateFee.compareTo(BigDecimal.ZERO) > 0) {
			
			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("LATE FEE", "DF LATE FEE");


			CashBook lateCb = new CashBook();
			lateCb.setBusinessMember(bm);
			lateCb.setCredit(lateFee);
			lateCb.setDebit(BigDecimal.ZERO);
			
			lateCb.setAccountMastertype(accountMaster.getType());
			lateCb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			lateCb.setAccountMasterCode(accountMaster.getCode());
			
			lateCb.setLineNo(2);
			lateCb.setUser(currentUser);
			lateCb.setTransDate(transactionDate);
			lateCb.setPersonalInfo(bm.getCustomerId());

			cashBookRepo.save(lateCb);
		}

		List<EMI> pendingEMIs = allEMIs.stream().filter(emi -> !emi.getStatus().equalsIgnoreCase("PAID"))
				.collect(Collectors.toList());

		BigDecimal remainingPayment = paidAmount;
		for (EMI emi : pendingEMIs) {

			BigDecimal emiRemaining = emi.getRemainingAmount();

			if (remainingPayment.compareTo(emiRemaining) < 0) {
				// Partial payment → update paid & remaining
				emi.setPaidAmount(emi.getPaidAmount().add(remainingPayment));
				emi.setPaymentDate(transactionDate);

				remainingPayment = BigDecimal.ZERO;

				break; // no more payment left

			} else {

				// Full or excess payment → mark as paid
				emi.setPaidAmount(emi.getPaidAmount().add(emiRemaining));
				emi.setPaymentDate(transactionDate);
				emi.setStatus("PAID");

				remainingPayment = remainingPayment.subtract(emiRemaining);

				// continue to next EMI if excess remains
			}

			emiRepo.save(emi);
		}

		// Check if all EMIs are paid → mark BusinessMember as PAID
		boolean allPaid = pendingEMIs.stream()
				.allMatch(emi -> emi.getRemainingAmount().compareTo(BigDecimal.ZERO) == 0);

		if (allPaid) {
			bm.setLoanStatus(LoanStatus.COMPLETED.toString());
			businessMemberRepository.save(bm);
		}

	}
}