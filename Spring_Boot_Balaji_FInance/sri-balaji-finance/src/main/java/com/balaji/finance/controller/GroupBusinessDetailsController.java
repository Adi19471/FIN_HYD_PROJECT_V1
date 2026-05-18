package com.balaji.finance.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.GroupBusinessDetailResponsePojo;
import com.balaji.finance.service.GroupBusinessDetailsService;

@RestController
public class GroupBusinessDetailsController {

	@Autowired
	private GroupBusinessDetailsService groupBusinessDetailsService;

	// Without Date Range
	@GetMapping("/group-business-details/{managerId}")
	public List<GroupBusinessDetailResponsePojo> getGroupBusinessDetail(@PathVariable String managerId) {

		return groupBusinessDetailsService.getGroupBusinessDetail(null, null, managerId);
	}

	// With Date Range
	@GetMapping("/group-business-details/{managerId}/{fromDate}/{toDate}")
	public List<GroupBusinessDetailResponsePojo> getGroupBusinessDetailDateRange(

			@PathVariable String managerId,

			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,

			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

		return groupBusinessDetailsService.getGroupBusinessDetail(fromDate, toDate, managerId);
	}
}