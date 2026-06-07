package com.balaji.finance.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.entity.Permission;
import com.balaji.finance.service.PermissionService;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

	private final PermissionService service;

	public PermissionController(PermissionService service) {
		this.service = service;
	}

	@PostMapping
	public Permission createPermission(@RequestBody Permission permission) {

		return service.createPermission(permission);
	}

	@GetMapping
	public List<Permission> getAllPermissions() {

		return service.getAllPermissions();
	}
}