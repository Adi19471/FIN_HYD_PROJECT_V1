package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface LoanTypeInterestProjection {

    String getLoanType();

    BigDecimal getInterestAmount();
}