package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface BusinessOverviewProjection {

	String getType();

	String getMasterCode();

	String getCode();

	BigDecimal getAmount();
}