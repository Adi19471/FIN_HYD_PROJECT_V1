package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.dto.BalanceSheetProjection;
import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.service.BalanceSheetService;
import com.balaji.finance.service.RevenueExpenseService;

@RestController
public class BalanceSheetController {

	@Autowired
	private BalanceSheetService balanceSheetService;

	@GetMapping("/balanceSheet/{fromDate}/{toDate}")
	public List<BalanceSheetProjection> getBalanceSheetByTrasncDate(@PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		return balanceSheetService.getBalanceSheetByTrasncDate(fromLocalDate, toLocalDate);
	}

	@GetMapping("/balanceSheet")
	public List<BalanceSheetProjection> getBalanceSheet() {
		return balanceSheetService.getBalanceSheet();
	}

}