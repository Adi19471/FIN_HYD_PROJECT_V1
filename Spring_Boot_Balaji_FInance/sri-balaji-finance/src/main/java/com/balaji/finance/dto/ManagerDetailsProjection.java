package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface ManagerDetailsProjection {

	String getManagerId();

	String getManagerName();

	String getManagerLastName();

	BigDecimal getNoOfSharesUnderManager();

	String getPartnerIds();
}