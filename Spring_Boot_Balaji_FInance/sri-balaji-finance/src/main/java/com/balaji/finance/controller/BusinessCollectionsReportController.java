package com.balaji.finance.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.BusinessCollectionsReportResponse;
import com.balaji.finance.service.BusinessCollectionsReportService;

@RestController
public class BusinessCollectionsReportController {

	@Autowired
	private BusinessCollectionsReportService businessCollectionsReportService;

	@GetMapping("/businessCollectionsReport/{fromDate}/{toDate}")
	public ResponseEntity<List<BusinessCollectionsReportResponse>> getBusinessOverView(@PathVariable String fromDate,
			@PathVariable String toDate) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		LocalDate fromLocalDate = LocalDate.parse(fromDate, formatter);
		LocalDate toLocalDate = LocalDate.parse(toDate, formatter);

		List<BusinessCollectionsReportResponse> resturnList = businessCollectionsReportService
				.generateBusinessCollectionReport(fromLocalDate, toLocalDate);

		return ResponseEntity.ok().body(resturnList);
	}

}
