package com.balaji.finance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.OtherPaymentSaveReq;
import com.balaji.finance.service.OtherPaymentService;

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
