package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface CustomerReportProjection {

    String getPersonalInfoId();

    String getCustomerName();

    BigDecimal getCredits();

    BigDecimal getDebits();
}