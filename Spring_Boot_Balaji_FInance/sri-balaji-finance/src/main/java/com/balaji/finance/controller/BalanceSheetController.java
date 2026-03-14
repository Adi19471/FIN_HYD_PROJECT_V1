package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.dto.BalanceSheetProjection;
import com.balaji.finance.service.BalanceSheetService;

@RestController
public class BalanceSheetController {

	@Autowired
	private BalanceSheetService balanceSheetService;

	@GetMapping("/balanceSheet/{toDate}")
	public ResponseEntity<List<BalanceSheetProjection>> getBalanceSheetByTrasncDate(@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		return ResponseEntity.ok().body(balanceSheetService.getBalanceSheetByTrasncDate(toLocalDate));
	}

}