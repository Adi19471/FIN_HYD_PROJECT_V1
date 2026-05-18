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

import com.balaji.finance.pojo.GroupBusinessResponsePojo;
import com.balaji.finance.service.GroupBusinessService;

@RestController
@RequestMapping("/group-business")
public class GroupBusinessController {

	@Autowired
	private GroupBusinessService groupBusinessService;

	/**
	 * Without Date Range Example: GET /group-business
	 */
	@GetMapping
	public ResponseEntity<List<GroupBusinessResponsePojo>> getGroupBusiness() {

		List<GroupBusinessResponsePojo> response = groupBusinessService.getGroupBusiness(null, null);

		return ResponseEntity.ok(response);
	}

	/**
	 * With Date Range Example: GET /group-business/2026-01-01/2026-01-31
	 */
	@GetMapping("/{fromDate}/{toDate}")
	public ResponseEntity<List<GroupBusinessResponsePojo>> getGroupBusinessByDateRange(

			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,

			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

		// Validation
		if (fromDate.isAfter(toDate)) {
			return ResponseEntity.badRequest().build();
		}

		List<GroupBusinessResponsePojo> response = groupBusinessService.getGroupBusiness(fromDate, toDate);

		return ResponseEntity.ok(response);
	}
}