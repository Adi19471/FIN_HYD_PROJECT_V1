package com.balaji.finance.dto;

import java.math.BigDecimal;

/** One row per loan: total amount paid (from cash book). */
public interface LoanPaymentProjection {

	String getBusinessMemberId();

	BigDecimal getPaidAmount();

}
