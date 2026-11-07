package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface CustomerOutstandingProjection {
	String getPersonInfoId();

	String getPersonName();

	Long getNoOfLoans();

	BigDecimal getTotalLoansAmount();

	BigDecimal getTotalPaidAmount();

	LocalDateTime getStartDate();

	LocalDateTime getEndDate();

}
