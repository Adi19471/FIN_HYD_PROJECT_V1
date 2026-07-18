package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface InstallmentDueProjection {

    String getLoanId();

    String getCustomerName();

    LocalDateTime getStartDate();

    LocalDateTime getEndDate();

    BigDecimal getLoanAmount();

    BigDecimal getInstallmentAmount();

    BigDecimal getPaidAmount();

    BigDecimal getDueAmount();

    Long getPendingCount();
}