package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface LoanCollectionProjection {

    BigDecimal getDailyLoanInstallmentsReceived();

    BigDecimal getDailyLoanInterestReceived();

    BigDecimal getMonthlyLoanInstallmentsReceived();

    BigDecimal getMonthlyLoanInterestReceived();
}