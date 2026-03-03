package com.balaji.finance.service;

import java.math.BigDecimal;
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

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.entity.LoanStatus;
import com.balaji.finance.pojo.InstallmentDetails;
import com.balaji.finance.pojo.LoanInformation;
import com.balaji.finance.pojo.QuickCashBookRow;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

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

		// ---------------- ACCOUNT DETAILS ----------------

		String accountNo = bm.getBusinessMemberId() + "-" + bm.getCustomerId().getFirstName() + "-"
				+ (bm.getCustomerId().getPersonalInfoId() != null ? bm.getCustomerId().getPersonalInfoId() : "");

		info.setAccountNo(accountNo);

		info.setPartnerName(bm.getPartnerId() != null
				? bm.getPartnerId().getFirstName() + "-" + bm.getPartnerId().getPersonalInfoId()
				: "");

		info.setGuarantorName(bm.getGuarantor1() != null
				? bm.getGuarantor1().getFirstName() + "-" + bm.getGuarantor1().getPersonalInfoId()
				: "");

		info.setPeriodFrom(bm.getStartDate().format(DATE_FORMAT));
		info.setPeriodTo(bm.getEndDate().format(DATE_FORMAT));
		info.setDate(LocalDateTime.now().format(DATE_FORMAT));
		info.setLoanAmount(bm.getAmount());
		BigDecimal installmentAmount = bm.getInstallment();
		info.setInstallmentAmount(installmentAmount);
		
		
		List<EMI> listOfEMI = emiRepo.findByBusinessMember(bm);

		List<InstallmentDetails> pending = new ArrayList<>();

		listOfEMI.stream().filter(p -> !p.getStatus().equalsIgnoreCase("PAID")).forEach(p -> {

			InstallmentDetails inst = new InstallmentDetails();
			inst.setEmiId(p.getEmiId());
			inst.setInstallmentNumber(p.getInstallmentNumber());
			inst.setDueDate(p.getDueDate().format(DATE_FORMAT));
			inst.setInstallmentAmount(p.getRemainingAmount());

			LocalDate today = LocalDate.now();

			if (today.isAfter(p.getDueDate().toLocalDate())) {
				inst.setLateFee(BigDecimal.ZERO);
			} else {
				inst.setLateFee(BigDecimal.ZERO);
			}

			inst.setPaid(BigDecimal.ZERO);
			inst.setTotal(inst.getInstallmentAmount());
			inst.setLateFeeDate(null);

			pending.add(inst);

		});

		info.setInstallmentDetailsList(pending);


		
		
		BigDecimal totalLoanAmount = installmentAmount.multiply(new BigDecimal(bm.getDuration()));
		BigDecimal totalAmountPaid = BigDecimal.ZERO;

		LocalDateTime lastPaidDate = bm.getStartDate();
		List<CashBook> paidList = cashBookRepo.findByBusinessMember(bm);
		if (paidList == null) {
			paidList = new ArrayList<>();
		}
		
		for (CashBook cb : paidList) {

			if (cb.getParticulars().equalsIgnoreCase("DF LOAN INSTALLMENT")
					|| cb.getParticulars().equalsIgnoreCase("DF INTEREST")) {

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

	@Transactional
	public void saveDFLoanInstallments(String loanId, LoanInformation info) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);

		if (opt.isEmpty())
			return;

		BusinessMember bm = opt.get();
		LocalDateTime transDate = LocalDateTime.parse(info.getDate(), DATE_FORMAT);
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
		
		
		if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {

			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(paidAmount);
			cb.setDebit(BigDecimal.ZERO);
			cb.setTransType("DF LOAN");
			cb.setParticulars("DF LOAN INSTALLMENT");
			cb.setLineNo(1);
			cb.setUser(currentUser);
			cb.setTransDate(transDate);
			cb.setPersonalInfo(bm.getCustomerId());

			cashBookRepo.save(cb);
		}

		BigDecimal lateFee = info.getLateFee() != null ? info.getLateFee() : BigDecimal.ZERO;
		if (lateFee.compareTo(BigDecimal.ZERO) > 0) {

			CashBook lateCb = new CashBook();
			lateCb.setBusinessMember(bm);
			lateCb.setCredit(lateFee);
			lateCb.setDebit(BigDecimal.ZERO);
			lateCb.setTransType("DF LATE FEE");
			lateCb.setParticulars("DF LATE FEE");
			lateCb.setLineNo(2);
			lateCb.setUser(currentUser);
			lateCb.setTransDate(transDate);
			lateCb.setPersonalInfo(bm.getCustomerId());

			cashBookRepo.save(lateCb);
		}
		
		

		List<EMI> pendingEMIs = allEMIs.stream().filter(emi -> !emi.getStatus().equalsIgnoreCase("PAID")).collect(Collectors.toList());

		BigDecimal remainingPayment = paidAmount;
		for (EMI emi : pendingEMIs) {

			BigDecimal emiRemaining = emi.getRemainingAmount();

			if (remainingPayment.compareTo(emiRemaining) < 0) {
				// Partial payment → update paid & remaining
				emi.setPaidAmount(emi.getPaidAmount().add(remainingPayment));
				emi.setPaymentDate(transDate);

				remainingPayment = BigDecimal.ZERO;

				break; // no more payment left

			} else {

				// Full or excess payment → mark as paid
				emi.setPaidAmount(emi.getPaidAmount().add(emiRemaining));
				emi.setPaymentDate(transDate);
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

			CashBook cb = new CashBook();
			cb.setBusinessMember(bm);
			cb.setCredit(paidAmount);
			cb.setDebit(BigDecimal.ZERO);
			cb.setTransType("DF LOAN");
			cb.setParticulars("DF LOAN INSTALLMENT");
			cb.setLineNo(1);
			cb.setUser(currentUser);
			cb.setTransDate(transactionDate);
			cb.setPersonalInfo(bm.getCustomerId());

			cashBookRepo.save(cb);
		}

		BigDecimal lateFee = quickRow.getLateFee() != null ? quickRow.getLateFee() : BigDecimal.ZERO;
		if (lateFee.compareTo(BigDecimal.ZERO) > 0) {

			CashBook lateCb = new CashBook();
			lateCb.setBusinessMember(bm);
			lateCb.setCredit(lateFee);
			lateCb.setDebit(BigDecimal.ZERO);
			lateCb.setTransType("DF LATE FEE");
			lateCb.setParticulars("DF LATE FEE");
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