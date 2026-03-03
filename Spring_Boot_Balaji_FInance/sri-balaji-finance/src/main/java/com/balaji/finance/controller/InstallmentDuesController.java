package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.InstallmentDuesPojo;
import com.balaji.finance.pojo.InstallmentsDuesRequestPojo;
import com.balaji.finance.service.InstallmentDuesService;

@RestController
public class InstallmentDuesController {

	@Autowired
	private InstallmentDuesService installmentDuesService;

	@PostMapping("/installmentDuesList")
	public ResponseEntity<List<InstallmentDuesPojo>> getAlldisbursedList(
			@RequestBody InstallmentsDuesRequestPojo installmentsDuesRequestPojo) {

		List<InstallmentDuesPojo> resturnList = installmentDuesService.getInstallmentDues(
				installmentsDuesRequestPojo.getFromDate(), installmentsDuesRequestPojo.getToDate(),
				installmentsDuesRequestPojo.getLoanType());

		return ResponseEntity.ok().body(resturnList);
	}

}
