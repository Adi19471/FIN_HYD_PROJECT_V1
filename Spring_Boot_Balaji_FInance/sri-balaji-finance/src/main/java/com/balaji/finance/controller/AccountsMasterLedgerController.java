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
import com.balaji.finance.pojo.AccountsMasterLedgerPojo;
import com.balaji.finance.service.CashBookService;

@RestController
public class AccountsMasterLedgerController {

	@Autowired
	private CashBookService cashBookService;

	@GetMapping("/getAccountsLedger/{masterName}/{fromDate}/{toDate}")
	public ResponseEntity<List<AccountsMasterLedgerPojo>> getAccountsLedger(@PathVariable String masterName, @PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = fromDate != null ? LocalDate.parse(fromDate, formatter) : null;
		LocalDate toLocalDate = toDate != null ? LocalDate.parse(toDate, formatter) : null;

		List<AccountsMasterLedgerPojo> cbLedgerList = cashBookService.getRecordsByAccountMasterCode(masterName,fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(cbLedgerList);
	}

}
