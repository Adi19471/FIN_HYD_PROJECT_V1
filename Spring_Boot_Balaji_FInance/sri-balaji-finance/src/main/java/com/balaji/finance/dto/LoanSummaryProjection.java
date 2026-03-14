package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface LoanSummaryProjection {

	String getLoanType();

	BigDecimal getLoansDisbursed();

	BigDecimal getInterestReceivable();

}