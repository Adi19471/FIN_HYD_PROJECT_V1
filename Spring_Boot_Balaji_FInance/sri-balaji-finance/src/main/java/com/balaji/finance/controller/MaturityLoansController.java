package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.InstallmentsDuesRequestPojo;
import com.balaji.finance.pojo.MaturedLoansPojo;
import com.balaji.finance.service.MaturityLoansService;

@RestController
public class MaturityLoansController {

	@Autowired
	private MaturityLoansService maturityLoansService;

	@PostMapping("/maturityLoansList")
	public ResponseEntity<List<MaturedLoansPojo>> getMaturityLoans(
			@RequestBody InstallmentsDuesRequestPojo installmentsDuesRequestPojo) {

		List<MaturedLoansPojo> resturnList = maturityLoansService.getMaturityLoans(
				installmentsDuesRequestPojo.getFromDate(), installmentsDuesRequestPojo.getToDate(),
				installmentsDuesRequestPojo.getLoanType());

		return ResponseEntity.ok().body(resturnList);
	}

}
