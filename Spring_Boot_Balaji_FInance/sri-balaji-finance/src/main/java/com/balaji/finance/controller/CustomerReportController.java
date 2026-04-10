package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.CustomerReportResponse;
import com.balaji.finance.service.CustomerReportService;

@RestController
public class CustomerReportController {

	@Autowired
	private CustomerReportService customerReportService;

	@GetMapping("/customerReportController/{accountCode}")
	public ResponseEntity<List<CustomerReportResponse>> loadCustomerReport(@PathVariable String accountCode) {

		List<CustomerReportResponse> customerReportOnAccountCode = customerReportService
				.getCustomerReportOnAccountCode(accountCode);

		return ResponseEntity.ok().body(customerReportOnAccountCode);

	}

}
