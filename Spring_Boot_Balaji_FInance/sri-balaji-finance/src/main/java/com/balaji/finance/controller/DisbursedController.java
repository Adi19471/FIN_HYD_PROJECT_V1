package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CashBookLedgerPojo;
import com.balaji.finance.pojo.LoanReportDTO;
import com.balaji.finance.service.LoanReportService;

@RestController
public class DisbursedController {

	@Autowired
	private LoanReportService loanReportService;

	
	@GetMapping("/disbursedList")
	public ResponseEntity<List<LoanReportDTO>> getAlldisbursedListByQueryParams(
			@RequestParam(required = false) String fromDate,
			@RequestParam(required = false) String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = fromDate != null ? LocalDate.parse(fromDate, formatter) : null;
		LocalDate toLocalDate = toDate != null ? LocalDate.parse(toDate, formatter) : null;

		List<LoanReportDTO> resturnList = loanReportService.getLoanReport(fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(resturnList);
	}

}
