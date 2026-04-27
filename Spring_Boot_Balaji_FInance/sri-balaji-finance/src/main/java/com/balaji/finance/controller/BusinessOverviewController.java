package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.BusinessOverviewResponsePojo;
import com.balaji.finance.service.BusinessOverviewService;

@RestController
public class BusinessOverviewController {

	@Autowired
	private BusinessOverviewService businessOverviewService;

	@GetMapping("/businessOverview/{fromDate}/{toDate}/{excludeDividends}/{accruedRevenue}")
	public ResponseEntity<BusinessOverviewResponsePojo> getBusinessOverView(@PathVariable String fromDate,
			@PathVariable String toDate, @PathVariable String excludeDividends, @PathVariable String accruedRevenue) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		BusinessOverviewResponsePojo resturnList = businessOverviewService.getBusinessOverViewByDateRange(fromLocalDate,
				toLocalDate, Boolean.valueOf(excludeDividends), Boolean.valueOf(accruedRevenue));

		return ResponseEntity.ok().body(resturnList);
	}

	@GetMapping("/businessOverview/{excludeDividends}/{accruedRevenue}")
	public ResponseEntity<BusinessOverviewResponsePojo> getBusinessOverView(@PathVariable String excludeDividends,
			@PathVariable String accruedRevenue) {

		BusinessOverviewResponsePojo resturnList = businessOverviewService
				.getBusinessOverView(Boolean.valueOf(excludeDividends), Boolean.valueOf(accruedRevenue));

		return ResponseEntity.ok().body(resturnList);
	}

}
