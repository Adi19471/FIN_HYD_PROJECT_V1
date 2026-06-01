package com.balaji.finance.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.PartnerSettlementResponse;
import com.balaji.finance.service.PartnerSettlementService;

@RestController
public class PartnerSettlementController {

	@Autowired
	private PartnerSettlementService partnerSettlementService;

	@GetMapping("/partner-settlement/{partnerId}/{targetDate}")
	public List<PartnerSettlementResponse> getPartnerSettlementDetails(@PathVariable("partnerId") String partnerId,
			@PathVariable("targetDate") LocalDate targetDate) {

		return partnerSettlementService.getPartnerSettlementResponse(targetDate, partnerId);
	}
}