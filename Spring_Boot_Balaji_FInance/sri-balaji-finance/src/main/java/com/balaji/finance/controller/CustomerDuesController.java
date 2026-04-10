package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CustomerDuesResponse;
import com.balaji.finance.service.CustomerDuesService;

@RestController
public class CustomerDuesController {

	@Autowired
	private CustomerDuesService customerDuesService;

	@GetMapping("customerDues/{customerId}")
	public ResponseEntity<List<CustomerDuesResponse>> getCustomerDues(@PathVariable String customerId) {

		return ResponseEntity.ok().body(customerDuesService.getAllLoansOnCustomer(customerId));

	}
}