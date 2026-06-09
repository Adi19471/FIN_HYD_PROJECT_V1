package com.balaji.finance.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.balaji.finance.entity.Permission;
import com.balaji.finance.entity.UserPermission;
import com.balaji.finance.entity.Users;
import com.balaji.finance.pojo.UserSaveReq;
import com.balaji.finance.repo.PermissionRepository;
import com.balaji.finance.repo.UserPermissionRepository;
import com.balaji.finance.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class UserService {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserPermissionRepository userPermissionRepo;

	@Autowired
	private PermissionRepository permissionRepository;

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

		if (userSaveReq.getPermissionIds() != null) {

			for (Long permissionId : userSaveReq.getPermissionIds()) {

				Permission permission = permissionRepository.findById(permissionId)
						.orElseThrow(() -> new IllegalArgumentException("Permission not found: " + permissionId));

				UserPermission mapping = new UserPermission();

				mapping.setUser(user);
				mapping.setPermission(permission);

				userPermissionRepo.save(mapping);
			}
		}

	}

	@Transactional
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

		userPermissionRepo.deleteByUser(user);

		if (userSaveReq.getPermissionIds() != null) {

			for (Long permissionId : userSaveReq.getPermissionIds()) {

				Permission permission = permissionRepository.findById(permissionId)
						.orElseThrow(() -> new IllegalArgumentException("Permission not found: " + permissionId));

				UserPermission mapping = new UserPermission();

				mapping.setUser(user);
				mapping.setPermission(permission);

				userPermissionRepo.save(mapping);
			}
		}
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
	public List<UserSaveReq> loadAllUsers() {

	    // Load all users
	    List<Users> users = userRepo.findAll();

	    if (users.isEmpty()) {
	        return Collections.emptyList();
	    }

	    // Collect user IDs
	    List<Integer> userIds = users.stream()
	            .map(Users::getId)
	            .toList();

	    // Fetch all permissions in single query
	    List<UserPermission> permissions =
	            userPermissionRepo.findAllByUserIds(userIds);

	    // Group permission IDs by user ID
	    Map<Integer, List<Long>> permissionMap = permissions.stream()
	            .collect(Collectors.groupingBy(
	                    p -> p.getUser().getId(),
	                    Collectors.mapping(UserPermission::getId, Collectors.toList())
	            ));

	    // Convert Users -> DTO
	    return users.stream().map(user -> {

	        UserSaveReq dto = new UserSaveReq();

	        dto.setId(user.getId());
	        dto.setName(user.getName());
	        dto.setRole(user.getRole());

	        // Set permission IDs
	        dto.setPermissionIds(
	                permissionMap.getOrDefault(user.getId(), Collections.emptyList())
	        );

	        return dto;

	    }).toList();
	}

	public List<String> loadAllUserNames() {

		List<Users> all = userRepo.findAll();

		List<String> allUserNames = all.stream().map(p -> p.getName()).collect(Collectors.toList());

		return allUserNames;
	}
}
