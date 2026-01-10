package com.balaji.finance.masterInfo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.AccountMasterSetUpService;
import com.balaji.finance.pojo.AccountMasterSaveReqPojo;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/account-master-setup")
public class AccountMasterSetUpController {

	@Autowired
	private AccountMasterSetUpService accountMasterService;
	
	
	
	@GetMapping("/findAll")
	private ResponseEntity<List<AccountMasterSaveReqPojo>> findAll() {

		List<AccountMasterSaveReqPojo> toBeReturnedList = accountMasterService.findAll();

		return ResponseEntity.ok().body(toBeReturnedList);
	}

	
	@GetMapping("/findAccountMasterById/{id}")
	private ResponseEntity<AccountMasterSaveReqPojo> findAccountMasterById(@PathVariable Long id) {

		AccountMasterSaveReqPojo accountMasterSaveReqPojo = accountMasterService.findById(id);

		return ResponseEntity.ok().body(accountMasterSaveReqPojo);
	}

	@GetMapping("/deleteAccountMasterById/{id}")
	private ResponseEntity<String> deleteAccountMasterById(@PathVariable Long id) {

		accountMasterService.deleteById(id);

		return ResponseEntity.ok().body("Successfully Deleted");
	}

	@PostMapping("/saveAccountMaster")
	private ResponseEntity<String> saveAccountMaster(@RequestBody AccountMasterSaveReqPojo accountMasterSaveReqPojo) {
		
		accountMasterService.saveAccountMaster(accountMasterSaveReqPojo);

		return ResponseEntity.ok().body("Successfully Saved");
	}

	@PostMapping("/UpdateAccountMaster")
	private ResponseEntity<String> updateAccountMaster(@RequestBody AccountMasterSaveReqPojo accountMasterSaveReqPojo) {
		
		accountMasterService.updateAccountMaster(accountMasterSaveReqPojo);

		return ResponseEntity.ok().body("Successfully Updated");
	}

}
