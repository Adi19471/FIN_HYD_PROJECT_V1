package com.balaji.finance.controller;

import com.balaji.finance.service.BranchService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.config.util.CustomUserDetails;
import com.balaji.finance.config.util.JwtUtil;
import com.balaji.finance.config.util.MyOwnUserDetails;
import com.balaji.finance.entity.RefreshToken;
import com.balaji.finance.entity.Users;
import com.balaji.finance.exception.ApiException;
import com.balaji.finance.pojo.ApiResponse;
import com.balaji.finance.pojo.ErrorResponse;
import com.balaji.finance.pojo.LoginReqPojo;
import com.balaji.finance.pojo.LoginResponse;
import com.balaji.finance.pojo.RefreshTokenRequest;
import com.balaji.finance.repo.RefreshTokenRepo;
import com.balaji.finance.service.RefreshTokenService;

@RestController
@RequestMapping("/auth")
public class LoginController {

	@Autowired
	private BranchService branchService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private RefreshTokenService refreshTokenService;

	@Autowired
	private RefreshTokenRepo refreshTokenRepo;

	@Autowired
	private MyOwnUserDetails userDetailsService;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginReqPojo loginReqPojo) {

		try {

			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginReqPojo.getName(), loginReqPojo.getPassword()));

			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

			List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

			String token = jwtUtil.generateToken(userDetails.getUsername(), roles);

			RefreshToken refreshToken = refreshTokenService.create(userDetails.getUser());

			LoginResponse response = new LoginResponse("Login success", token, refreshToken.getToken(),
					userDetails.getUsername(), roles);
			// A user with no open branch has nothing to work in.
			if (!withBranches(response, userDetails.getUser())) {
				refreshTokenRepo.deleteByToken(refreshToken.getToken());
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
						new ErrorResponse("No branch is assigned to this user. Please contact the administrator."));
			}

			return ResponseEntity.ok(response);

		} catch (BadCredentialsException e) {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new ErrorResponse("Invalid username or password"));

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new ErrorResponse("Login failed due to server error"));
		}

	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) {

		RefreshToken existing = refreshTokenRepo.findByToken(request.getRefreshToken())
				.orElseThrow(() -> new ApiException("Invalid refresh token", HttpStatus.UNAUTHORIZED));

		if (refreshTokenService.isExpired(existing)) {
			refreshTokenRepo.delete(existing);
			throw new ApiException("Refresh token expired, please log in again", HttpStatus.UNAUTHORIZED);
		}

		Users user = existing.getUser();
		RefreshToken rotated = refreshTokenService.rotate(existing);

		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getName());
		List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

		String newAccessToken = jwtUtil.generateToken(user.getName(), roles);

		LoginResponse response = new LoginResponse("Token refreshed", newAccessToken, rotated.getToken(),
				user.getName(), roles);
		withBranches(response, user);

		return ResponseEntity.ok(response);
	}

	/** Adds the user's open branches; false when there are none. */
	private boolean withBranches(LoginResponse response, Users user) {
		response.setBranches(branchService.accessibleBranches(user));
		return !response.getBranches().isEmpty();
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {

		if (request.getRefreshToken() != null) {
			refreshTokenRepo.deleteByToken(request.getRefreshToken());
		}

		ApiResponse response = new ApiResponse();
		response.setStatus("success");
		response.setMessage("Logged out successfully");

		return ResponseEntity.ok(response);
	}

}
