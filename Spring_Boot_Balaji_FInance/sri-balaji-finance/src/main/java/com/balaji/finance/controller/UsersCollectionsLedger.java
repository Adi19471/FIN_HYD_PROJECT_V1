package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.UserCollectionsLedgerPojo;
import com.balaji.finance.service.CashBookService;

@RestController
public class UsersCollectionsLedger {

	@Autowired
	private CashBookService cashBookService;

	@GetMapping("/getUsersCollectionsLedger/{userName}/{fromDate}/{toDate}")
	public ResponseEntity<List<UserCollectionsLedgerPojo>> getUsersCollectionsLedger(@PathVariable String userName,
			@PathVariable String fromDate, @PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		List<UserCollectionsLedgerPojo> cbLedgerCollectionsOnlyList = cashBookService
				.getUsersCollectionsLedger(userName, fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(cbLedgerCollectionsOnlyList);
	}
	
	
	@GetMapping("/getUsersCollectionsLedger/{userName}")
	public ResponseEntity<List<UserCollectionsLedgerPojo>> getUsersCollectionsLedger(@PathVariable String userName
			) {

		
		List<UserCollectionsLedgerPojo> cbLedgerCollectionsOnlyList = cashBookService
				.getUsersCollectionsLedger(userName, null, null);

		return ResponseEntity.ok().body(cbLedgerCollectionsOnlyList);
	}

}
