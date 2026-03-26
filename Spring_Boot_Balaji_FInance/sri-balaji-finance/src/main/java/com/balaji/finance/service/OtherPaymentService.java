package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.AccountMaster;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.pojo.OtherPaymentSaveReq;
import com.balaji.finance.repo.AccountMasterRepo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class OtherPaymentService {

	

	@Autowired
	private CashBookRepo cashBookRepo;
	
	@Autowired
	private AccountMasterRepo accountMasterRepo;

	@Autowired
	private PersonalInfoRepository personalInfoRepository;


	public void saveOtherPayment(OtherPaymentSaveReq otherPaymentSaveReq) {

		String dateStr = otherPaymentSaveReq.getTransactionDate();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime currentInstallmentDate = LocalDateTime.parse(dateStr, formatter);
		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		CashBook cashBookForPrinciplePaid = new CashBook();
		cashBookForPrinciplePaid.setBusinessMember(null);

		switch (otherPaymentSaveReq.getTransaction().toUpperCase()) {
		case "CREDIT":
			cashBookForPrinciplePaid.setCredit(otherPaymentSaveReq.getAmount());
			cashBookForPrinciplePaid.setDebit(BigDecimal.ZERO);
			break;

		case "DEBIT":
			cashBookForPrinciplePaid.setCredit(BigDecimal.ZERO);
			cashBookForPrinciplePaid.setDebit(otherPaymentSaveReq.getAmount());

			break;

		default:
			break;
		}
		
		AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode(otherPaymentSaveReq.getAccountMasterCode(), otherPaymentSaveReq.getAccountCode());
		cashBookForPrinciplePaid.setAccountMastertype(accountMaster.getType());
		cashBookForPrinciplePaid.setAccountMasterMasterCode(accountMaster.getMasterCode());
		cashBookForPrinciplePaid.setAccountMastercode(accountMaster.getCode());

		cashBookForPrinciplePaid.setBmRemarks(otherPaymentSaveReq.getParticulars()); // doubt
		cashBookForPrinciplePaid.setReceiptRemarks(""); // doubt

		cashBookForPrinciplePaid.setLineNo(1);
		cashBookForPrinciplePaid.setUser(currentUser);

		cashBookForPrinciplePaid.setTransDate(currentInstallmentDate);
		cashBookForPrinciplePaid.setSysDate(LocalDateTime.now());
		
	
		Optional<PersonalInfo> byId = personalInfoRepository.findById(otherPaymentSaveReq.getCustomerId());
		
		cashBookForPrinciplePaid.setPersonalInfo(byId.get());

		cashBookRepo.save(cashBookForPrinciplePaid);

	}

}
