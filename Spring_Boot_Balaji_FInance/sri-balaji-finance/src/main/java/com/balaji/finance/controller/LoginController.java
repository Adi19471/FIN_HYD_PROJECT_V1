package com.balaji.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.config.util.CustomUserDetails;
import com.balaji.finance.config.util.JwtUtil;
import com.balaji.finance.pojo.ErrorResponse;
import com.balaji.finance.pojo.LoginReqPojo;
import com.balaji.finance.pojo.LoginResponse;

@RestController
@RequestMapping("/auth")
public class LoginController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginReqPojo loginReqPojo) {

		try {

			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginReqPojo.getName(), loginReqPojo.getPassword()));

			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

			List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

			String token = jwtUtil.generateToken(userDetails.getUsername(), roles);

			LoginResponse response = new LoginResponse("Login success", token, userDetails.getUsername(), roles);

			return ResponseEntity.ok(response);

		} catch (BadCredentialsException e) {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new ErrorResponse("Invalid username or password"));

		} catch (Exception e) {

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("Login failed due to server error"));
		}

	}

}
