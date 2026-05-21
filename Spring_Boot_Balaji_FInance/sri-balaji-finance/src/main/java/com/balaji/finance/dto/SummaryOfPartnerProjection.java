package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface SummaryOfPartnerProjection {

    String getId();

    String getFirstName();

    String getLastName();

    BigDecimal getDisbursedAmount();
}