package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CustomerTransactionsRequest;
import com.balaji.finance.pojo.CustomerTransactionsResponse;
import com.balaji.finance.service.CustomerTransactionsService;

@RestController
public class CustomerTransactionController {

	@Autowired
	private CustomerTransactionsService customerTransactionsService;

	@PostMapping("/CustomerTransaction")
	public ResponseEntity<List<CustomerTransactionsResponse>> getCustomerTransactionsOnAccountMasterCode(
			@RequestBody CustomerTransactionsRequest customerTransactionsRequest) {
		List<CustomerTransactionsResponse> customerTransactionsOnAccountMasterCode = customerTransactionsService
				.getCustomerTransactionsOnAccountMasterCode(customerTransactionsRequest);
		return ResponseEntity.ok().body(customerTransactionsOnAccountMasterCode);

	}
}
