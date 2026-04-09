package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface CustomerOutstandingProjection {
	String getPersonInfoId();

	String getPersonName();

	Long getNoOfLoans();

	BigDecimal getTotalLoansAmount();

	BigDecimal getTotalPaidAmount();

}
