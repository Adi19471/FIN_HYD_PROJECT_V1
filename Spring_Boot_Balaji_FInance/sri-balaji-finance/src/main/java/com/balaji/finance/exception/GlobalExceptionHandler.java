package com.balaji.finance.exception;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.balaji.finance.pojo.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
		ex.printStackTrace();
		List<String> errors = ex.getBindingResult().getFieldErrors().stream()
				.map(err -> err.getField() + ": " + err.getDefaultMessage()).collect(Collectors.toList());

		ErrorResponse errorResponse = new ErrorResponse("Validation Failed", "VALIDATION_ERROR", errors);

		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
		ex.printStackTrace();
		ErrorResponse errorResponse = new ErrorResponse("Something went wrong", "INTERNAL_ERROR", null);

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	}

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ErrorResponse> handleApiException(ApiException ex) {
		ex.printStackTrace();
		ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), "BUSINESS_ERROR", null);

		return ResponseEntity.status(ex.getStatus()).body(errorResponse);
	}

	// You can also handle ConstraintViolationException if needed
}