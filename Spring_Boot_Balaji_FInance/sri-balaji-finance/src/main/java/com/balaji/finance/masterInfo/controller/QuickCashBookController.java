package com.balaji.finance.masterInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.QuickCashBookService;
import com.balaji.finance.pojo.QuickCashBookRow;
import com.balaji.finance.pojo.QuickCashBookSaveRequest;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
public class QuickCashBookController {

	@Autowired
	private QuickCashBookService quickCashBookService;

	@GetMapping("/retriveQuickCashBookRecord/{loanId}")
	public ResponseEntity<QuickCashBookRow> retriveQuickCashBookRecord(@PathVariable String loanId) {

		QuickCashBookRow retriveQuickCashBookRecord = quickCashBookService.retriveQuickCashBookRecord(loanId);

		return ResponseEntity.ok().body(retriveQuickCashBookRecord);
	}

	@PostMapping("/saveQuickCashBookRecords")
	public ResponseEntity<String> saveQuickCashBookRecords(
			@RequestBody QuickCashBookSaveRequest quickCashBookSaveRequest) {

		try {
			
			quickCashBookService.saveQuickCashBookRecords(quickCashBookSaveRequest);
			return ResponseEntity.ok().body("Successfully Saved");
		
		} catch (Exception e) {
			
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
			
		}
	}

}
