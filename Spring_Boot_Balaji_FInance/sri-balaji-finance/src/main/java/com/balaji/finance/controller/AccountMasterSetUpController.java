package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.AccountMasterSaveReqPojo;
import com.balaji.finance.service.AccountMasterSetUpService;
import com.balaji.finance.service.AccountMasterUsageService;

@RestController
@RequestMapping("/account-master-setup")
public class AccountMasterSetUpController {
	


	@Autowired
	private AccountMasterSetUpService accountMasterService;
	
	
	 
	@GetMapping("/findAll")
	public ResponseEntity<List<AccountMasterSaveReqPojo>> findAll() {

		List<AccountMasterSaveReqPojo> toBeReturnedList = accountMasterService.findAll();

		return ResponseEntity.ok().body(toBeReturnedList);
	}

	
	@GetMapping("/findAccountMasterById/{id}")
	public ResponseEntity<AccountMasterSaveReqPojo> findAccountMasterById(@PathVariable Long id) {

		AccountMasterSaveReqPojo accountMasterSaveReqPojo = accountMasterService.findById(id);

		return ResponseEntity.ok().body(accountMasterSaveReqPojo);
	}

	@GetMapping("/deleteAccountMasterById/{id}")
	public ResponseEntity<String> deleteAccountMasterById(@PathVariable Long id) {

		accountMasterService.deleteById(id);

		return ResponseEntity.ok().body("Successfully Deleted");
	}

	@PostMapping("/saveAccountMaster")
	public ResponseEntity<String> saveAccountMaster(@RequestBody AccountMasterSaveReqPojo accountMasterSaveReqPojo) {
		
		System.err.println(accountMasterSaveReqPojo);
		
		accountMasterService.saveAccountMaster(accountMasterSaveReqPojo);

		return ResponseEntity.ok().body("Successfully Saved");
	}

	@PostMapping("/UpdateAccountMaster")
	public ResponseEntity<String> updateAccountMaster(@RequestBody AccountMasterSaveReqPojo accountMasterSaveReqPojo) {
		
		accountMasterService.updateAccountMaster(accountMasterSaveReqPojo);

		return ResponseEntity.ok().body("Successfully Updated");
	}


}
