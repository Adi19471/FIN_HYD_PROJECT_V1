package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.ParnterInformationResponse;
import com.balaji.finance.service.PartnerInformationService;

@RestController
public class PartnerInformationController {

	@Autowired
	private PartnerInformationService partnerInformationService;

	@GetMapping("/partners-information")
	public List<ParnterInformationResponse> getAllPartners() {

		return partnerInformationService.getAllPartners();
	}
}