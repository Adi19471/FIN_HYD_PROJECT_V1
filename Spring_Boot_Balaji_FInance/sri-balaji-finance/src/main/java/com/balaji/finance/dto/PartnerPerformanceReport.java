package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface PartnerPerformanceReport {

    String getId();

    String getFirstName();

    String getLastName();

    BigDecimal getDisbursedAmount();

    BigDecimal getLoanInstallmentsReceived();

    BigDecimal getInterestReceived();

    BigDecimal getDocumentCharges();
}