package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface LoanSummaryOfManagerProjection {

    Long getNoOfLoans();

    BigDecimal getDisbursedAmount();

    BigDecimal getDisbursedAmountWithInterest();
}