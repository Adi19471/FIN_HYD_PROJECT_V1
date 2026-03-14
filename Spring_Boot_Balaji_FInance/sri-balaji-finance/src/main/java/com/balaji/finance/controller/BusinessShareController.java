package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.pojo.BusinessSharePojo;
import com.balaji.finance.service.BusinessShareService;

@RestController
public class BusinessShareController {

	@Autowired
	private BusinessShareService businessShareService;

	@GetMapping("/businessShareStatement/{fromDate}/{toDate}")
	public ResponseEntity<List<BusinessSharePojo>> getRevenueExpense(@PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		return ResponseEntity.ok().body(businessShareService.getBusinessShare(fromLocalDate, toLocalDate));
	}

}