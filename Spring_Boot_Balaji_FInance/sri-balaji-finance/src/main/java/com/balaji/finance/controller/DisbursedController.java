package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CashBookLedgerPojo;
import com.balaji.finance.pojo.LoanReportDTO;
import com.balaji.finance.service.LoanReportService;

@RestController
public class DisbursedController {

	@Autowired
	private LoanReportService loanReportService;

	@GetMapping("/disbursedList/{fromDate}/{toDate}")
	public ResponseEntity<List<LoanReportDTO>> getAlldisbursedList(@PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		List<LoanReportDTO> resturnList = loanReportService.getLoanReport(fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(resturnList);
	}

	@GetMapping("/disbursedList")
	public ResponseEntity<List<LoanReportDTO>> getAlldisbursedList() {

		List<LoanReportDTO> resturnList = loanReportService.getLoanReport(null, null);

		return ResponseEntity.ok().body(resturnList);
	}

}
