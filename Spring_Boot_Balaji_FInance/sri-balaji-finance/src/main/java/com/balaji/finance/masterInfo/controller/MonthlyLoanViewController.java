package com.balaji.finance.masterInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.MonthlyLoanInstallmentPaymentService;
import com.balaji.finance.pojo.LoanInformation;

@RestController
public class MonthlyLoanViewController {

	@Autowired
	private MonthlyLoanInstallmentPaymentService monthlyLoanInstallmentPaymentService;

	@GetMapping("/loadMFLoanInformation/{loanId}")
	public ResponseEntity<LoanInformation> loadMFLoanInformation(@PathVariable("loanId") String loanId) {
		LoanInformation mfLoanPaidInfo = monthlyLoanInstallmentPaymentService.loadMFLoanPaidInfo(loanId);

		return ResponseEntity.ok().body(mfLoanPaidInfo);
	}

	@PostMapping("/saveMFLoanInformation/{loanId}")
	public ResponseEntity<String> saveMFLoanInformation(@PathVariable("loanId") String loanId,
			@RequestBody LoanInformation loanInformation) {
		monthlyLoanInstallmentPaymentService.saveMfLoanInstallments(loanId, loanInformation);

		return ResponseEntity.ok().body("SuccessfullySaved");
	}

	
}
