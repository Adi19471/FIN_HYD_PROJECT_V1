package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface PartnerDueAmountProjection {

    String getPersonalInfoId();

    BigDecimal getDueAmount();
}