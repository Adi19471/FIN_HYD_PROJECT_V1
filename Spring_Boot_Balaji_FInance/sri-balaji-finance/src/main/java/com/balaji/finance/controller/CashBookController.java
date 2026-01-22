package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CashBookDeletedViewPojo;
import com.balaji.finance.pojo.CashBookViewPojo;
import com.balaji.finance.pojo.DayWiseTransactionsSummary;
import com.balaji.finance.pojo.DeleteCashBookReq;
import com.balaji.finance.service.CashBookService;

@RestController
public class CashBookController {

	@Autowired
	private CashBookService cashBookService;

	@GetMapping("/loadAllDayWiseTransactions/{transactionDate}")
	public ResponseEntity<List<CashBookViewPojo>> loadAllDayWiseTransactions(@PathVariable String transactionDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate localDate = LocalDate.parse(transactionDate, formatter);

		List<CashBookViewPojo> allCashBookDetailsByTransactionDate = cashBookService
				.loadAllCashBookDetailsByTransactionDate(localDate);

		return ResponseEntity.ok().body(allCashBookDetailsByTransactionDate);
	}

	@PostMapping("/deleteCashBookRecords")
	public ResponseEntity<String> loadDFLoanInformation(@RequestBody DeleteCashBookReq deleteCashBookReq) {

		String message = cashBookService.deleteCashBook(deleteCashBookReq.getTransactionId(),
				deleteCashBookReq.getComments());

		return ResponseEntity.ok().body(message);
	}

	@GetMapping("/loadAllDayWiseDeletedTransactions/{transactionDate}")
	public ResponseEntity<List<CashBookDeletedViewPojo>> loadAllDayWiseDeletedTransactions(
			@PathVariable String transactionDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate localDateTime = LocalDate.parse(transactionDate, formatter);

		List<CashBookDeletedViewPojo> allCashBookDetailsByTransactionDate = cashBookService
				.loadAllDayWiseDeletedTransactions(localDateTime);

		return ResponseEntity.ok().body(allCashBookDetailsByTransactionDate);
	}

}
