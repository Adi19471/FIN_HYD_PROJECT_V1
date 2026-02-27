package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.service.UserService;

@RestController
public class UserDropDownController {

	@Autowired
	private UserService userService;

	@GetMapping("/userDropDown")
	public ResponseEntity<List<String>> saveUser() {

		List<String> allUserNames = userService.loadAllUserNames();
		return ResponseEntity.ok().body(allUserNames);

	}

}
