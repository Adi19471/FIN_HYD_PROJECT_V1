package com.balaji.finance.masterInfo.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.CashBookService;
import com.balaji.finance.pojo.CashBookDeletedViewPojo;
import com.balaji.finance.pojo.CashBookViewPojo;
import com.balaji.finance.pojo.DeleteCashBookReq;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
public class CashBookController {

	@Autowired
	private CashBookService cashBookService;

	@GetMapping("/loadAllDayWiseTransactions/{transactionDate}")
	public ResponseEntity<List<CashBookViewPojo>> loadAllDayWiseTransactions(@PathVariable String transactionDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

		LocalDateTime localDateTime = LocalDateTime.parse(transactionDate, formatter);

		List<CashBookViewPojo> allCashBookDetailsByTransactionDate = cashBookService
				.loadAllCashBookDetailsByTransactionDate(localDateTime);

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

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

		LocalDateTime localDateTime = LocalDateTime.parse(transactionDate, formatter);

		List<CashBookDeletedViewPojo> allCashBookDetailsByTransactionDate = cashBookService
				.loadAllDayWiseDeletedTransactions(localDateTime);

		return ResponseEntity.ok().body(allCashBookDetailsByTransactionDate);
	}

}
