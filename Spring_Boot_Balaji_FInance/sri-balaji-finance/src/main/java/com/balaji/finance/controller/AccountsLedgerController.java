package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.AccountsLedgerPojo;
import com.balaji.finance.pojo.CashBookLedgerPojo;
import com.balaji.finance.service.CashBookService;

@RestController
public class AccountsLedgerController {

	@Autowired
	private CashBookService cashBookService;

	@GetMapping("/getAccountsLedger/{fromDate}/{toDate}")
	public ResponseEntity<List<AccountsLedgerPojo>> getAccountsLedger(@PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = fromDate != null ? LocalDate.parse(fromDate, formatter) : null;
		LocalDate toLocalDate = toDate != null ? LocalDate.parse(toDate, formatter) : null;

		List<AccountsLedgerPojo> cbLedgerList = cashBookService.getAccountsLedgerData(fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(cbLedgerList);
	}
	
	@GetMapping("/getAccountsLedger")
	public ResponseEntity<List<AccountsLedgerPojo>> getAccountsLedgerAll() {

		List<AccountsLedgerPojo> cbLedgerList = cashBookService.getAccountsLedgerData(null, null);

		return ResponseEntity.ok().body(cbLedgerList);
	}

}
