package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.ReceiptsLedgerPojo;
import com.balaji.finance.service.CashBookService;

@RestController
public class ReceiptsLedgerController {

	@Autowired
	private CashBookService cashBookService;

	@GetMapping("/ReceiptsLedger/{fromDate}/{toDate}") 
	public ResponseEntity<List<ReceiptsLedgerPojo>> getAllCBLedgerData(@PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		List<ReceiptsLedgerPojo> cbLedgerList = cashBookService.getReceiptsLedger(fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(cbLedgerList);
	}

	
	@GetMapping("/ReceiptsLedger") 
	public ResponseEntity<List<ReceiptsLedgerPojo>> getAllCBLedgerData() {

		List<ReceiptsLedgerPojo> cbLedgerList = cashBookService.getReceiptsLedger(null, null);

		return ResponseEntity.ok().body(cbLedgerList);
	}
	
}
