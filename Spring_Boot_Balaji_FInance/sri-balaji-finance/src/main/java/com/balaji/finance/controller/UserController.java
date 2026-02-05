package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.UserSaveReq;
import com.balaji.finance.service.UserService;

import jakarta.validation.Valid;

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

	@DeleteMapping("/users/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Integer id) {

		userService.deleteUser(id);
		return ResponseEntity.ok("User deleted successfully");
	}
	
	@GetMapping("/users")
	public ResponseEntity<List<UserSaveReq>> loadAllUsers() {

		List<UserSaveReq> all =	userService.loadAllUsers();
		return ResponseEntity.status(HttpStatus.CREATED).body(all);
	}
}
