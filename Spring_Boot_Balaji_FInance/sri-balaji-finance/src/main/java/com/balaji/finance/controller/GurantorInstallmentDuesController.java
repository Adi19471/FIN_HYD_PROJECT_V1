package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.GuarantorInstallmentDuesResponse;
import com.balaji.finance.service.GurantorInstallmentDuesService;

@RestController
public class GurantorInstallmentDuesController {

	@Autowired
	private GurantorInstallmentDuesService gurantorInstallmentDuesService;

	@GetMapping("gurantorInstallmentDues/by-guarantor/{guarantoId}/{activeLoans}/{lateFee}")
	public ResponseEntity<List<GuarantorInstallmentDuesResponse>> getByGuarantor(@PathVariable String guarantoId,
			@PathVariable String activeLoans, @PathVariable String lateFee) {

		return ResponseEntity.ok(gurantorInstallmentDuesService.getGuarantorInstallmentDuesList(guarantoId,
				Boolean.valueOf(activeLoans), Boolean.valueOf(lateFee)));
	}

	@GetMapping("gurantorInstallmentDues/all/{activeLoans}/{lateFee}")
	public ResponseEntity<List<GuarantorInstallmentDuesResponse>> getAll(@PathVariable String activeLoans,
			@PathVariable String lateFee) {

		return ResponseEntity.ok(gurantorInstallmentDuesService.getGuarantorInstallmentDuesList(null,
				Boolean.valueOf(activeLoans), Boolean.valueOf(lateFee)));
	}
}
