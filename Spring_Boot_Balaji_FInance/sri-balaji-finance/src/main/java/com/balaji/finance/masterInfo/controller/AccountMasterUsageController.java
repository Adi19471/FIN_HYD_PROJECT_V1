package com.balaji.finance.masterInfo.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.AccountMasterUsageService;
import com.balaji.finance.pojo.AccountUsage;


@RestController
@RequestMapping("/account-master-usage")
public class AccountMasterUsageController {

	@Autowired
	private AccountMasterUsageService accountMasterService;

	@GetMapping("/findAllMasterCodes")
	private ResponseEntity<List<String>> findAllMasterCodes() {

		List<String> toBeReturnedList = accountMasterService.findAllMasterCodes();

		return ResponseEntity.ok().body(toBeReturnedList);
	}

	@GetMapping("/findAllCodesByMasterCode/{masterCode}")
	public ResponseEntity<List<String>> findAllCodesByMasterCode(@PathVariable String masterCode) {

		List<String> toBeReturnedList = accountMasterService.findAllCodesByMasterCode(masterCode);

		return ResponseEntity.ok().body(toBeReturnedList);
	}

	@PostMapping("/findTransactionTypeBy")
	public ResponseEntity<List<String>> findAllCodesByMasterCode(@RequestBody AccountUsage reuestBody) {

		String transacTypeByMasterCodeAndCode = accountMasterService
				.findTransacTypeByMasterCodeAndCode(reuestBody.getMasterCode(), reuestBody.getCode());

		List<String> transacList = Arrays.asList(transacTypeByMasterCodeAndCode.split(","));

		return ResponseEntity.ok().body(transacList);
	}

}
