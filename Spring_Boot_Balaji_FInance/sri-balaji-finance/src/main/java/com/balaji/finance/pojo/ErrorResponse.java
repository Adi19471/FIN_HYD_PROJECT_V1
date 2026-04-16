package com.balaji.finance.pojo;

import java.util.Date;

public class ErrorResponse {

	private String message;
	private String code;
	private Object details;
	private Date timestamp;

	public ErrorResponse() {
		this.timestamp = new Date();
	}

	public ErrorResponse(String message) {
		this.message = message;
		this.code = "ERROR";
		this.timestamp = new Date();
	}

	public ErrorResponse(String message, String code, Object details) {
		this.message = message;
		this.code = code;
		this.details = details;
		this.timestamp = new Date();
	}

	// 🔹 Getters & Setters

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Object getDetails() {
		return details;
	}

	public void setDetails(Object details) {
		this.details = details;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
}