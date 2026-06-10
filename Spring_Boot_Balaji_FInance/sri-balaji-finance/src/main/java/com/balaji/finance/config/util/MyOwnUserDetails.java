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
	public UserDetails loadUserByUsername(String username)
	        throws UsernameNotFoundException {

	    Users user = userRepository.findByName(username)
	            .orElseThrow(() ->
	                    new UsernameNotFoundException("User not found"));

	    List<GrantedAuthority> authorities = new ArrayList<>();

	    // Add Role
	    authorities.add(
	            new SimpleGrantedAuthority("ROLE_" + user.getRole())
	    );

	    // Add Permissions
	    if ("ADMIN".equalsIgnoreCase(user.getRole())) {

	        permissionRepository.findAll()
	                .forEach(permission ->
	                        authorities.add(
	                                new SimpleGrantedAuthority(
	                                        permission.getRoutePath()
	                                )));

	    } else {

	        userPermissionRepo.findByUser(user)
	                .forEach(mapping ->
	                        authorities.add(
	                                new SimpleGrantedAuthority(
	                                        mapping.getPermission()
	                                               .getRoutePath()
	                                )));
	    }

	    return new CustomUserDetails(user, authorities);
	}
}