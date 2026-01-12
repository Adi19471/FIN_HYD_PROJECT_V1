package com.balaji.finance.masterInfo.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.masterInfo.service.UserService;
import com.balaji.finance.pojo.UserSaveReq;

@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/users")
	public ResponseEntity<String> saveUser(@Valid @RequestBody UserSaveReq userSaveReq) {

		userService.saveUser(userSaveReq);
		return ResponseEntity.status(HttpStatus.CREATED).body("User saved successfully");
	}

	@PutMapping("/users")
	public ResponseEntity<String> updateUser(@Valid @RequestBody UserSaveReq userSaveReq) {

		userService.updateUser(userSaveReq);
		return ResponseEntity.ok("User updated successfully");
	}

	@DeleteMapping("/users")
	public ResponseEntity<String> deleteUser(@RequestParam Integer id) {

		userService.deleteUser(id);
		return ResponseEntity.ok("User deleted successfully");
	}
}
