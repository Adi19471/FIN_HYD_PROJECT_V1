package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface PartnerCreditSummaryProjection {

    String getPersonalInfoId();

    BigDecimal getTotalCredit();
}