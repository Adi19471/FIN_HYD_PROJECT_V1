package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface LoanCollectionWithOutInterestProjection {

	BigDecimal getDailyLoanInstallmentsReceived();

	BigDecimal getMonthlyLoanInstallmentsReceived();

}