package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.dto.BusinessMemberDto;
import com.balaji.finance.pojo.BusinessMemberAutoCompletePojo;
import com.balaji.finance.service.BusinessMemberService;

@RestController
@RequestMapping("/BusinessMember")
public class BusinessMemberController {

	@Autowired
	private BusinessMemberService businessMemberService;

	@GetMapping("/createLoan/{loanType}")
	public ResponseEntity<BusinessMemberDto> update(@PathVariable String loanType) {

		BusinessMemberDto response = null;

		response = businessMemberService.createLoanObject(loanType);

		return ResponseEntity.ok().body(response);
	}

	@PostMapping("/update/{loanType}")
	public ResponseEntity<String> update(@RequestBody BusinessMemberDto businessMemberDto,
			@PathVariable String loanType) {

		String response = null;

		response = businessMemberService.updateInformation(businessMemberDto, loanType);

		return ResponseEntity.ok().body(response);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> delete(@PathVariable String id) {

		String response = businessMemberService.deleteBusinessMember(id);

		return ResponseEntity.ok().body(response);
	}

	@GetMapping("/findById/{id}")
	public ResponseEntity<BusinessMemberDto> findById(@PathVariable String id) {

		BusinessMemberDto businessMemberDto = businessMemberService.findById(id);

		return ResponseEntity.ok().body(businessMemberDto);
	}

	@GetMapping("/findAll/{loanType}")
	public ResponseEntity<List<BusinessMemberDto>> findAll(@PathVariable String loanType) {

		List<BusinessMemberDto> all = businessMemberService.findAll(loanType);

		return ResponseEntity.ok().body(all);
	}

	@GetMapping("/loanDetailsAutoComplete/{loanType}")
	public ResponseEntity<List<BusinessMemberAutoCompletePojo>> loanDetailsAutoComplete(@RequestParam String q,
			@PathVariable("loanType") String loanType) {

		List<BusinessMemberAutoCompletePojo> all = businessMemberService.businessMemberAutoCompletebyLoanType(q,
				loanType);

		return ResponseEntity.ok().body(all);

	}

	@GetMapping("/allLoanDetailsAutoComplete")
	public ResponseEntity<List<BusinessMemberAutoCompletePojo>> allLoanDetailsAutoComplete(@RequestParam String q) {

		List<BusinessMemberAutoCompletePojo> all = businessMemberService.allbusinessMemberAutoComplete(q);

		return ResponseEntity.ok().body(all);

	}

}
