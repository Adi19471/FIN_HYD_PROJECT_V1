package com.balaji.finance.masterInfo.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.masterInfo.entity.CashBook;
import com.balaji.finance.masterInfo.repo.BusinessMemberRepository;
import com.balaji.finance.masterInfo.repo.CashBookRepo;
import com.balaji.finance.pojo.OtherPaymentSaveReq;

@Service
public class OtherPaymentService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	public void saveOtherPayment(OtherPaymentSaveReq otherPaymentSaveReq) {

		String dateStr = otherPaymentSaveReq.getTransactionDate();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime currentInstallmentDate = LocalDateTime.parse(dateStr, formatter);
		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		CashBook cashBookForPrinciplePaid = new CashBook();
		cashBookForPrinciplePaid.setAccountNo(null);

		switch (otherPaymentSaveReq.getTransaction()) {
		case "CREDIT":
			cashBookForPrinciplePaid.setCredit(otherPaymentSaveReq.getAmount());
			cashBookForPrinciplePaid.setDebit(0.0);
			break;

		case "DEBIT":
			cashBookForPrinciplePaid.setCredit(0.0);
			cashBookForPrinciplePaid.setDebit(otherPaymentSaveReq.getAmount());

			break;

		default:
			break;
		}

		cashBookForPrinciplePaid.setTransType(otherPaymentSaveReq.getAccountCode());
		cashBookForPrinciplePaid.setParticulars(otherPaymentSaveReq.getParticulars());

		cashBookForPrinciplePaid.setBmRemarks(""); // doubt
		cashBookForPrinciplePaid.setReceiptRemarks(""); // doubt

		cashBookForPrinciplePaid.setLineNo(1);
		cashBookForPrinciplePaid.setUser(currentUser);

		cashBookForPrinciplePaid.setTransDate(currentInstallmentDate);
		cashBookForPrinciplePaid.setSysDate(LocalDateTime.now());
		cashBookForPrinciplePaid.setCustomerId(otherPaymentSaveReq.getCustomerId());

		cashBookRepo.save(cashBookForPrinciplePaid);

	}

}
