package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CashBookLedgerCollectionsPojo;
import com.balaji.finance.pojo.CashBookLedgerPojo;
import com.balaji.finance.service.CashBookService;

@RestController
public class CBLedgerController {

	@Autowired
	private CashBookService cashBookService;

	@GetMapping("/getAllCBLedgerData/{fromDate}/{toDate}")
	public ResponseEntity<List<CashBookLedgerPojo>> getAllCBLedgerData(@PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		List<CashBookLedgerPojo> cbLedgerList = cashBookService.getCashBookLedger(fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(cbLedgerList);
	}

	@GetMapping("/getCollectionsCBLedgerData/{fromDate}/{toDate}")
	public ResponseEntity<List<CashBookLedgerCollectionsPojo>> getCollectionsOnlyCBLedgerData(
			@PathVariable String fromDate, @PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		List<CashBookLedgerCollectionsPojo> cbLedgerCollectionsOnlyList = cashBookService
				.getCollectionsOnlyCBLedgerData(fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(cbLedgerCollectionsOnlyList);
	}

}
