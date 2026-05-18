package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface LoanSummaryOfPartnerProjection {

    String getPersonalInfoId();

    Long getNoOfLoans();

    BigDecimal getDisbursedAmount();

    BigDecimal getDisbursedAmountWithInterest();
}