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

@Service
public class MonthlyLoanInstallmentPaymentService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;
	
	
	public LoanInformation loadMFLoanPaidInfo(String id) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(id);
		if (!opt.isPresent()) {
			return null;
		}

		BusinessMember bm = opt.get();
		if (bm.getCustomerId() == null || bm.getCustomerId().getFirstname() == null) {
			return null;
		}

		if (bm.getStartDate() == null || bm.getEndDate() == null) {
			return null;
		}

		LoanInformation info = new LoanInformation();
	    DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

	    // ACCOUNT DETAILS
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

		info.setLoanAmount(bm.getAmount());
		double installmentAmount = bm.getInstallment();
		info.setInstallmentAmount(installmentAmount);

		List<CashBook> paidList = cashBookRepo.findByAccountNo(bm.getId());
		if (paidList == null) {
			paidList = new ArrayList<>();
		}

	    long paidInstallments = bm.getPaidInstallments();
	    double totalAmountPaid = 0.0;
	    LocalDateTime lastPaidDate = bm.getStartDate();

		for (CashBook cb : paidList) {

			if (cb.getParticulars().equalsIgnoreCase("MF LOAN INSTALLMENT")
					|| cb.getParticulars().equalsIgnoreCase("MF INTEREST")) {

				totalAmountPaid += (cb.getCredit() != null ? cb.getCredit() : 0.0);

			}

			if (cb.getTransDate() != null 
					&& cb.getTransDate().isAfter(lastPaidDate)) {
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

	        // Extra paid -> reduce next installment
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


	public void saveMfLoanInstallments( String loanId, LoanInformation info) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);
		if (opt.isEmpty())
			return;

		
		String dateStr = info.getDate(); 
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime currentInstallmentDate = LocalDateTime.parse(dateStr, formatter);
		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();


		BusinessMember bm = opt.get();

		
		double principal = bm.getAmount();
		double installmentPerMonth = bm.getInstallment();
		
		
		double principalPerMonth = principal / bm.getDuration();
		double interestPerMonth = installmentPerMonth - principalPerMonth;
		
		
		double currentlyPaidAmount = info.getAmountPaid();

		double principalPaid = 0;
		double interestPaid = 0;
		
		System.out.println("-----------currentlyPaidAmount ::"+currentlyPaidAmount);
		System.out.println("-----------principalPerMonth ::"+principalPerMonth);
		

		if (currentlyPaidAmount <= principalPerMonth) {

			principalPaid = currentlyPaidAmount;
			interestPaid = 0;

		} else if (currentlyPaidAmount >= principalPerMonth + interestPerMonth) {

			principalPaid = currentlyPaidAmount - interestPerMonth;
			interestPaid = interestPerMonth;

		} else {
			
			
			interestPaid = currentlyPaidAmount - principalPerMonth ;
			principalPaid = currentlyPaidAmount - interestPaid;
			

		}
		
		System.out.println("-----------principalPaid ::"+principalPaid);

		if (principalPaid > 0) {
			
			
			CashBook cashBookForPrinciplePaid = new CashBook();
			cashBookForPrinciplePaid.setAccountNo(bm.getId());
			cashBookForPrinciplePaid.setCredit(principalPaid);         
			cashBookForPrinciplePaid.setDebit(0.0);                   
			cashBookForPrinciplePaid.setTransType("MF LOAN"); 
			cashBookForPrinciplePaid.setParticulars("MF LOAN INSTALLMENT");
			
			cashBookForPrinciplePaid.setBmRemarks(""); //doubt
			cashBookForPrinciplePaid.setReceiptRemarks(""); //doubt

			cashBookForPrinciplePaid.setLineNo(1);                    
			cashBookForPrinciplePaid.setUser(currentUser);          

			cashBookForPrinciplePaid.setTransDate(currentInstallmentDate); 
			cashBookForPrinciplePaid.setSysDate(LocalDateTime.now());   

			cashBookRepo.save(cashBookForPrinciplePaid);
			
		}
		
		System.out.println("-----------interestPaid ::"+interestPaid);


		if (interestPaid > 0) {
			
			CashBook cashBookForIntrestPaid = new CashBook();
			cashBookForIntrestPaid.setAccountNo(bm.getId());
			cashBookForIntrestPaid.setCredit(interestPaid);           
			cashBookForIntrestPaid.setDebit(0.0);
			cashBookForIntrestPaid.setTransType("MF INTEREST");
			cashBookForIntrestPaid.setParticulars("MF INTEREST");
			
			cashBookForIntrestPaid.setBmRemarks(""); //doubt
			cashBookForIntrestPaid.setReceiptRemarks(""); //doubt

			cashBookForIntrestPaid.setLineNo(2);                     
			cashBookForIntrestPaid.setUser(currentUser);

			cashBookForIntrestPaid.setTransDate(currentInstallmentDate);
			cashBookForIntrestPaid.setSysDate(LocalDateTime.now());

			cashBookRepo.save(cashBookForIntrestPaid);
			
		}
		
		if(info.getLateFee() != null
				&& info.getLateFee() > 0) {
			
			
			CashBook cashBookForLatefeePaid = new CashBook();
			cashBookForLatefeePaid.setAccountNo(bm.getId());
			cashBookForLatefeePaid.setCredit(info.getLateFee());           
			cashBookForLatefeePaid.setDebit(0.0);
			cashBookForLatefeePaid.setTransType("MF LATE FEE");
			cashBookForLatefeePaid.setParticulars("MF LATE FEE");
			
			cashBookForLatefeePaid.setBmRemarks(""); //doubt
			cashBookForLatefeePaid.setReceiptRemarks(""); //doubt

			cashBookForLatefeePaid.setLineNo(3);                     
			cashBookForLatefeePaid.setUser(currentUser);

			cashBookForLatefeePaid.setTransDate(currentInstallmentDate);
			cashBookForLatefeePaid.setSysDate(LocalDateTime.now());

			cashBookRepo.save(cashBookForLatefeePaid);
			
		}
		

		bm.setPaidInstallments(bm.getPaidInstallments() != null ? bm.getPaidInstallments() + 1 : 0);
		businessMemberRepository.save(bm);
	}

}
