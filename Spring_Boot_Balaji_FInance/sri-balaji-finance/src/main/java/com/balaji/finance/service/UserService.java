package com.balaji.finance.service;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.balaji.finance.entity.Users;
import com.balaji.finance.pojo.UserSaveReq;
import com.balaji.finance.repo.UserRepo;

@Service
public class UserService {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public void saveUser(UserSaveReq userSaveReq) {

		validateUserRequest(userSaveReq, false);

		// Check duplicate user by name (recommended)
		if (userRepo.existsByName(userSaveReq.getName())) {
			throw new IllegalArgumentException("User already exists with name: " + userSaveReq.getName());
		}

		Users user = new Users();
		user.setName(userSaveReq.getName().trim());
		user.setPassword(passwordEncoder.encode(userSaveReq.getPassword()));
		user.setRole(userSaveReq.getRole());

		userRepo.save(user);
	}

	public void updateUser(UserSaveReq userSaveReq) {

		if (userSaveReq.getId() == null) {
			throw new IllegalArgumentException("User ID must not be null for update");
		}

		validateUserRequest(userSaveReq, true);

		Users user = userRepo.findById(userSaveReq.getId())
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userSaveReq.getId()));

		user.setName(userSaveReq.getName().trim());
		user.setRole(userSaveReq.getRole());

		// Update password only if provided
		if (StringUtils.hasText(userSaveReq.getPassword())) {
			user.setPassword(passwordEncoder.encode(userSaveReq.getPassword()));
		}

		userRepo.save(user);
	}

	public void deleteUser(Integer id) {

		if (id == null) {
			throw new IllegalArgumentException("User ID must not be null");
		}

		Users user = userRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

		userRepo.delete(user);
	}

	private void validateUserRequest(UserSaveReq userSaveReq, boolean isUpdate) {

		if (userSaveReq == null) {
			throw new IllegalArgumentException("User request must not be null");
		}

		if (!StringUtils.hasText(userSaveReq.getName())) {
			throw new IllegalArgumentException("User name must not be empty");
		}

		if (!isUpdate && !StringUtils.hasText(userSaveReq.getPassword())) {
			throw new IllegalArgumentException("Password must not be empty");
		}

		/*
		 * if (Objects.isNull(userSaveReq.getRole())) { throw new
		 * IllegalArgumentException("Role must not be null"); }
		 */
	}
}
