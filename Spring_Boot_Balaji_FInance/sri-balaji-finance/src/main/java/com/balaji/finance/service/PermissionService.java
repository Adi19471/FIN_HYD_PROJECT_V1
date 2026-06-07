package com.balaji.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.Permission;
import com.balaji.finance.repo.PermissionRepository;

@Service
public class PermissionService {

	@Autowired
	private PermissionRepository repository;

	public Permission createPermission(Permission permission) {

		return repository.save(permission);
	}

	public List<Permission> getAllPermissions() {
		return repository.findAll();
	}
}