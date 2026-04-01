package com.balaji.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.AccountMaster;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.entity.LoanStatus;
import com.balaji.finance.pojo.InstallmentDetails;
import com.balaji.finance.pojo.LoanInformation;
import com.balaji.finance.pojo.QuickCashBookRow;
import com.balaji.finance.repo.AccountMasterRepo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

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

		info.setPeriodFrom(bm.getStartDate().format(fmt));
		info.setPeriodTo(bm.getEndDate().format(fmt));
		info.setDate(LocalDateTime.now().format(fmt));

		info.setLoanAmount(bm.getAmount());
		BigDecimal installmentAmount = bm.getInstallment();
		info.setInstallmentAmount(installmentAmount);

		

		

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

	
		
		
		BigDecimal totalLoanAmount = installmentAmount.multiply(new BigDecimal(bm.getDuration()));
		BigDecimal totalAmountPaid = BigDecimal.ZERO;

		LocalDateTime lastPaidDate = bm.getStartDate();
		List<CashBook> paidList = cashBookRepo.findByBusinessMember(bm);
		
		if (paidList == null) {
			paidList = new ArrayList<>();
		}
		
		for (CashBook cb : paidList) {

			if (cb.getAccountMastercode().equalsIgnoreCase("MF LOAN INSTALLMENT")
					|| cb.getAccountMastercode().equalsIgnoreCase("MF INTEREST")) {

				totalAmountPaid = totalAmountPaid.add(cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO);

			}

			if (cb.getTransDate() != null && cb.getTransDate().isAfter(lastPaidDate)) {
				lastPaidDate = cb.getTransDate();
			}
		}
		info.setPaid(totalAmountPaid);
		info.setBalance(totalLoanAmount.subtract(totalAmountPaid));
		
		

		return info;
	}

	
	private void processPayment(BusinessMember bm, BigDecimal paidAmount, BigDecimal lateFee,
			LocalDateTime transactionDate, List<EMI> allEMIs) {

		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		BigDecimal installmentPerMonth = bm.getInstallment();
		BigDecimal principal = bm.getAmount();

		BigDecimal principalPerMonth = principal.divide(BigDecimal.valueOf(bm.getDuration()), 2, RoundingMode.HALF_UP);

		BigDecimal interestPerMonth = installmentPerMonth.subtract(principalPerMonth);

		BigDecimal principalPaid = BigDecimal.ZERO;
		BigDecimal interestPaid = BigDecimal.ZERO;

		// 🔹 Split Principal & Interest
		if (paidAmount.compareTo(principalPerMonth) <= 0) {

			principalPaid = paidAmount;

		} else if (paidAmount.compareTo(installmentPerMonth) >= 0) {

			principalPaid = paidAmount.subtract(interestPerMonth);
			interestPaid = interestPerMonth;

		} else {

			interestPaid = paidAmount.subtract(principalPerMonth);
			principalPaid = paidAmount.subtract(interestPaid);
		}

		// 🔹 Save Principal Entry
		if (principalPaid.compareTo(BigDecimal.ZERO) > 0) {
			
			
			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("MF LOAN INSTALLMENT", "MF LOAN INSTALLMENT");



			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(principalPaid);
			cb.setDebit(BigDecimal.ZERO);
			
			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMastercode(accountMaster.getCode());
			
			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setSysDate(LocalDateTime.now());
			cb.setPersonalInfo(bm.getCustomerId());
			cb.setLineNo(1);

			cashBookRepo.save(cb);
		}

		// 🔹 Save Interest Entry
		if (interestPaid.compareTo(BigDecimal.ZERO) > 0) {
			
			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("INTEREST", "MF INTEREST");


			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(interestPaid);
			cb.setDebit(BigDecimal.ZERO);
		
			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMastercode(accountMaster.getCode());
			
			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setSysDate(LocalDateTime.now());
			cb.setPersonalInfo(bm.getCustomerId());
			cb.setLineNo(2);

			cashBookRepo.save(cb);
		}

		// 🔹 Save Late Fee
		if (lateFee != null && lateFee.compareTo(BigDecimal.ZERO) > 0) {
			

			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("LATE FEE", "MF LATE FEE");


			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(lateFee);
			cb.setDebit(BigDecimal.ZERO);
			
			cb.setAccountMastertype(accountMaster.getType());
			cb.setAccountMasterMasterCode(accountMaster.getMasterCode());
			cb.setAccountMastercode(accountMaster.getCode());
			
			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setSysDate(LocalDateTime.now());
			cb.setPersonalInfo(bm.getCustomerId());
			cb.setLineNo(3);

			cashBookRepo.save(cb);
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

	@Transactional
	public void saveMfLoanInstallments(String loanId,LoanInformation loanInformation) {
		
		
		BigDecimal paidAmount = loanInformation.getAmountPaid();
		BigDecimal lateFee = loanInformation.getLateFee();
		String dateStr = loanInformation.getDate();

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);

		if (opt.isEmpty())
			return;

		BusinessMember bm = opt.get();
		
		LocalDateTime transactionDate = LocalDateTime.parse(dateStr, DATE_FORMAT);

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
		
		processPayment(bm , paidAmount, lateFee, transactionDate,allEMIs);
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