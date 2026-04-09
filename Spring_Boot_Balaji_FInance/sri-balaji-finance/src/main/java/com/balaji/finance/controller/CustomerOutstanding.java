package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CustomerOutstandingRequest;
import com.balaji.finance.pojo.CustomerOutstandingView;
import com.balaji.finance.service.CustomerOutstandingService;

@RestController
public class CustomerOutstanding {

	@Autowired
	private CustomerOutstandingService customerOutstandingService;

	@PostMapping("/customerOutstanding")
	public ResponseEntity<List<CustomerOutstandingView>> loadCustomerOutstanding(
			@RequestBody CustomerOutstandingRequest customerOutstandingRequest) {

		List<CustomerOutstandingView> customerOutstandingView = customerOutstandingService
				.loadCustomerOutstandingView(customerOutstandingRequest);

		return ResponseEntity.ok().body(customerOutstandingView);
	}

}
