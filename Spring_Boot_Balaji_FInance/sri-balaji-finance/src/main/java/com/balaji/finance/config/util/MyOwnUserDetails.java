package com.balaji.finance.config.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.Users;
import com.balaji.finance.repo.PermissionRepository;
import com.balaji.finance.repo.UserPermissionRepository;
import com.balaji.finance.repo.UserRepo;

@Service
public class MyOwnUserDetails implements UserDetailsService {

	@Autowired
	private UserRepo userRepository;

	@Autowired
	private UserPermissionRepository userPermissionRepo;

	@Autowired
	private PermissionRepository permissionRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Users user = userRepository.findByName(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		List<GrantedAuthority> authorities = new ArrayList<>();

		// Safe role handling
		String role = user.getRole();

		System.out.println("ROLE FROM DB: " + role);

		if (role == null || role.trim().isEmpty()) {
			throw new RuntimeException("Role is null or empty");
		}

		if (!role.startsWith("ROLE_")) {
			role = "ROLE_" + role;
		}

		authorities.add(new SimpleGrantedAuthority(role));

		// Permissions
		if ("ADMIN".equalsIgnoreCase(user.getRole()) || "ROLE_ADMIN".equalsIgnoreCase(user.getRole())) {

			permissionRepository.findAll()
					.forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.getPermissionCode())));

		} else {

			userPermissionRepo.findByUser(user).forEach(mapping -> authorities
					.add(new SimpleGrantedAuthority(mapping.getPermission().getPermissionCode())));
		}

		return new CustomUserDetails(user, authorities);
	}
}