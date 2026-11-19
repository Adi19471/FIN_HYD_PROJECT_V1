package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** One row per loan: total EMI amount due up to a date. */
public interface LoanDueProjection {

	String getBusinessMemberId();

	String getLoanType();

	LocalDateTime getEndDate();

	BigDecimal getDueAmount();

}
