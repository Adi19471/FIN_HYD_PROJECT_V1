package com.balaji.finance.masterInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.OtherPaymentService;
import com.balaji.finance.pojo.OtherPaymentSaveReq;

@RestController
public class OtherPaymentController {

	@Autowired
	private OtherPaymentService otherPaymentService;

	@PostMapping("/saveOtherPayments")
	public ResponseEntity<String> saveOtherPayments(@RequestBody OtherPaymentSaveReq otherPaymentSaveReq) {

		otherPaymentService.saveOtherPayment(otherPaymentSaveReq);

		return ResponseEntity.ok().body("Successfully Saved");
	}

}
