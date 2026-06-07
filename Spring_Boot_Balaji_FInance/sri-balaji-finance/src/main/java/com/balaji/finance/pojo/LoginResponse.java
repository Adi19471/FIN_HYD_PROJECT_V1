package com.balaji.finance.pojo;

import java.util.List;

public class LoginResponse {

	private String message;
	private String token;
	private String username;
	private List<String> roles;

	public LoginResponse() {
	}

	public LoginResponse(String message, String token, String username, List<String> roles) {
		this.message = message;
		this.token = token;
		this.username = username;
		this.roles = roles;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

}