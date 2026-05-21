package com.balaji.finance.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.PerformanceResponsePojo;
import com.balaji.finance.service.PerformanceService;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

	@Autowired
	private PerformanceService performanceService;

	// Without Date Range
	@GetMapping("/partners")
	public ResponseEntity<List<PerformanceResponsePojo>> getAllPartnersPerformance() {

		return ResponseEntity.ok().body(performanceService.getPerformanceOfPartner(null, null));
	}

	// With Date Range
	@GetMapping("/partners/{fromDate}/{toDate}")
	public ResponseEntity<List<PerformanceResponsePojo>> getPartnersPerformanceByDateRange(
			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

		return ResponseEntity.ok().body(performanceService.getPerformanceOfPartner(fromDate, toDate));
	}
}