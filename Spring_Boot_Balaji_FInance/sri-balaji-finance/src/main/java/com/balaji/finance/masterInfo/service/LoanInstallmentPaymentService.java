package com.balaji.finance.masterInfo.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.masterInfo.entity.BusinessMember;
import com.balaji.finance.masterInfo.repo.BusinessMemberRepository;
import com.balaji.finance.pojo.InstallmentDetails;
import com.balaji.finance.pojo.LoanInformation;
import com.balaji.finance.transaction.entity.CashBook;
import com.balaji.finance.transaction.entity.CashBookRepo;

import io.jsonwebtoken.lang.Collections;

@Service
public class LoanInstallmentPaymentService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	public LoanInformation loadMFLoanPaidInfo(String id) {

	    Optional<BusinessMember> opt = businessMemberRepository.findById(id);
	    if (!opt.isPresent()) return null;

	    BusinessMember bm = opt.get();
	    if (bm.getCustomerId() == null || bm.getCustomerId().getFirstname() == null) return null;
	    if (bm.getStartDate() == null || bm.getEndDate() == null) return null;

	    LoanInformation info = new LoanInformation();
	    DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

	    // -------------------------------
	    // ACCOUNT DETAILS
	    // -------------------------------
	    String accountNo = bm.getBusinessId() + "-" +
	                       bm.getCustomerId().getFirstname() + "-" +
	                       (bm.getCustomerId().getId() != null ? bm.getCustomerId().getId() : "");
	    info.setAccountNo(accountNo);

	    String partnerName = (bm.getPartnerId() != null)
	            ? (bm.getPartnerId().getFirstname() != null ? bm.getPartnerId().getFirstname() : "") 
	              + "-" + (bm.getPartnerId().getId() != null ? bm.getPartnerId().getId() : "")
	            : "";
	    info.setPartnerName(partnerName);

	    String guarantorName = (bm.getGuarantor1() != null)
	            ? (bm.getGuarantor1().getFirstname() != null ? bm.getGuarantor1().getFirstname() : "")
	              + "-" + (bm.getGuarantor1().getId() != null ? bm.getGuarantor1().getId() : "")
	            : "";
	    info.setGuarantorName(guarantorName);

	    info.setPeriodFrom(bm.getStartDate().format(fmt));
	    info.setPeriodTo(bm.getEndDate().format(fmt));
	    info.setDate(LocalDateTime.now().format(fmt));

	    // -------------------------------
	    // INTEREST FIX — PERCENT → AMOUNT
	    // -------------------------------
	  
	    double principal = bm.getAmount();
	    double interestPercent = bm.getInterest() != null ? bm.getInterest() : 0.0;
	    double interestAmount = principal * (interestPercent / 100.0);
	    double totalLoan = principal + interestAmount;

	    info.setLoanAmount(principal);
	    //info.setInterestAmount(interestAmount);    
	   // info.setTotalLoanAmount(totalLoan);        

	    // EMI fixed amount (you already store installment amount)
	    double installmentAmount = bm.getInstallment();

	    // -------------------------------
	    // PAID INSTALLMENTS FROM CASHBOOK
	    // -------------------------------
	    List<CashBook> paidList = cashBookRepo.findByAccountNo(bm.getId());
	    if (paidList == null) paidList = new ArrayList<>();

	    long paidInstallments = 0;
	    double totalAmountPaid = 0.0;
	    LocalDateTime lastPaidDate = bm.getStartDate();

	    for (CashBook cb : paidList) {
	        if (cb == null) continue;

	        totalAmountPaid += (cb.getCredit() != null ? cb.getCredit() : 0.0);

	        if ("MF LOAN".equalsIgnoreCase(cb.getTransType())) {
	            paidInstallments++;
	        }

	        if (cb.getTransDate() != null && cb.getTransDate().isAfter(lastPaidDate)) {
	            lastPaidDate = cb.getTransDate();
	        }
	    }

	    // Extra paid or deficit
	    double expectedPaid = paidInstallments * installmentAmount;
	    double balanceCarry = totalAmountPaid - expectedPaid;

	    // -------------------------------
	    // NEXT PENDING INSTALLMENTS
	    // -------------------------------
	    List<InstallmentDetails> pending = new ArrayList<>();

	    Double totalInstallments = bm.getDuration(); // FIX: create installmentCount in entity
	    LocalDateTime dueDate = lastPaidDate;

	    for (long i = paidInstallments + 1; i <= totalInstallments; i++) {

	        InstallmentDetails inst = new InstallmentDetails();
	        inst.setInstallmentNumber(i);

	        dueDate = dueDate.plusMonths(1);
	        inst.setDueDate(dueDate.format(fmt));

	        double calcInstall = installmentAmount;

	        // Extra paid → reduce next installment
	        if (balanceCarry > 0) {
	          
	        	double reduced = calcInstall - balanceCarry;
	           
	        	if (reduced < 0) {
	                inst.setInstallmentAmount(0);
	                balanceCarry = Math.abs(reduced);
	            } else {
	                inst.setInstallmentAmount(reduced);
	                balanceCarry = 0;
	            }
	        	
			} else if (balanceCarry < 0) {  // Less paid → increase next installment
	            inst.setInstallmentAmount(calcInstall + Math.abs(balanceCarry));
	            balanceCarry = 0;
			} else {// Normal
	            inst.setInstallmentAmount(calcInstall);
	        }

	        inst.setLateFee(0);
	        inst.setPaid(0);
	        inst.setTotal(installmentAmount);
	        inst.setLateFeeDate(null);

	        pending.add(inst);
	    }

	    info.setInstallmentDetailsList(pending);

	    return info;
	}


	public void saveMfLoanInstallments(LoanInformation info) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(info.getAccountNo());
		if (opt.isEmpty())
			return;
		
		
		List<CashBook> paidList = cashBookRepo.findByAccountNo(info.getAccountNo());
		double paidInstallments = 0d;
		for (CashBook cb : paidList) {
			if ("MF LOAN".equalsIgnoreCase(cb.getTransType())) {
				paidInstallments++;
			}
		}

		double currentInstallmentNumber = paidInstallments+1;
		String dateStr = info.getDate(); 
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		LocalDateTime currentInstallmentDate = LocalDateTime.parse(dateStr, formatter);
		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		
		
		
		

		BusinessMember bm = opt.get();

		
		double principal = bm.getAmount();
		double interestPercent = bm.getInterest() != null ? bm.getInterest() : 0.0;
		double interestAmount = principal * (interestPercent / 100.0);
		
		
		double principalPerMonth = principal / bm.getDuration();
		double interestPerMonth = interestAmount/ bm.getDuration();
		double paid = info.getAmountPaid();

		double principalPaid = 0;
		double interestPaid = 0;

		if (paid <= principalPerMonth) {
		
			principalPaid = paid;
			interestPaid = 0;
		
		} else {
			principalPaid = principalPerMonth;

			interestPaid = paid - principalPerMonth;
			if (interestPaid > interestPerMonth) {
				interestPaid = interestPerMonth; // cap interest
			}
		}

		if (principalPaid > 0) {
			
			
			CashBook cbP = new CashBook();
			cbP.setAccountNo(info.getAccountNo());
			cbP.setCredit(principalPaid);         
			cbP.setDebit(0.0);                   
			cbP.setTransType("MF LOAN"); 
			cbP.setParticulars("");
			cbP.setBmRemarks("");
			cbP.setReceiptRemarks("");

			cbP.setLineNo(currentInstallmentNumber);                    
			cbP.setUser(currentUser);          

			cbP.setTransDate(currentInstallmentDate); 
			cbP.setSysDate(LocalDateTime.now());   

			cashBookRepo.save(cbP);
			
		}

		if (interestPaid > 0) {
			
			CashBook cbI = new CashBook();
			cbI.setAccountNo(info.getAccountNo());
			cbI.setCredit(interestPaid);           
			cbI.setDebit(0.0);
			cbI.setTransType("MF-LOAN-INTEREST");
			cbI.setParticulars("");
			cbI.setBmRemarks("");
			cbI.setReceiptRemarks("");

			cbI.setLineNo(currentInstallmentNumber);                     
			cbI.setUser(currentUser);

			cbI.setTransDate(currentInstallmentDate);
			cbI.setSysDate(LocalDateTime.now());

			cashBookRepo.save(cbI);

			
			
		}
	}



}
