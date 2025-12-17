package com.balaji.finance.masterInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.DailyLoanInstallmentPaymentService;
import com.balaji.finance.pojo.LoanInformation;

@RestController
public class DailyLoanViewController {

	@Autowired
	private DailyLoanInstallmentPaymentService dailyLoanInstallmentPaymentService;

	@GetMapping("/loadDFLoanInformation/{loanId}")
	public ResponseEntity<LoanInformation> loadDFLoanInformation(@PathVariable String loanId) {

		LoanInformation dfLoanPaidInfo = dailyLoanInstallmentPaymentService.loadDFLoanPaidInfo(loanId);

		return ResponseEntity.ok().body(dfLoanPaidInfo);
	}

	@PostMapping("/saveDFLoanInformation/{loanId}")
	public ResponseEntity<String> saveDFLoanInformation(@PathVariable String loanId,
			@RequestBody LoanInformation loanInformation) {

		dailyLoanInstallmentPaymentService.saveDFLoanInstallments(loanId, loanInformation);

		return ResponseEntity.ok().body("SuccessfullySaved");
	}

}
