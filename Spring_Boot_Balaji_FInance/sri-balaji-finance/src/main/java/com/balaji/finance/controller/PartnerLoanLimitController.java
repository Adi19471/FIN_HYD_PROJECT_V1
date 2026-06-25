package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.PartnerLoanLimitResponse;
import com.balaji.finance.service.PartnerLoanLimitService;

@RestController
@RequestMapping("/partners")
public class PartnerLoanLimitController {

	@Autowired
	private PartnerLoanLimitService partnerLoanLimitService;

	@GetMapping("/loan-limits")
	public ResponseEntity<List<PartnerLoanLimitResponse>> getAllPartnerLoanLimits() {

		List<PartnerLoanLimitResponse> response = partnerLoanLimitService.getAllPartnerLoanLimits();

		return ResponseEntity.ok(response);
	}
}