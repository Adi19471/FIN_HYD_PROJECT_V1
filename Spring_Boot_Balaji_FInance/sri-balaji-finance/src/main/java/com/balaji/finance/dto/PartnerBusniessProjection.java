package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface PartnerBusniessProjection {

	String getPersonalInfoId();

	Long getDailyLoanCount();

	BigDecimal getDailyLoanAmount();

	Long getMonthlyLoanCount();

	BigDecimal getMonthlyLoanAmount();

}