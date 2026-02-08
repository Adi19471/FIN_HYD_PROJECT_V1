package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.service.AccountMasterSetUpService;

@RestController
@RequestMapping("/account-master-droddown")
public class AccountMasterAutocompleteController {

	@Autowired
	private AccountMasterSetUpService accountMasterService;

	@GetMapping("/findAllMasterCodes")
	public ResponseEntity<List<String>> findAllMasterCodes() {

		List<String> toBeReturnedList = accountMasterService.findAllMasterCodes(); 

		return ResponseEntity.ok().body(toBeReturnedList);
	}

}
