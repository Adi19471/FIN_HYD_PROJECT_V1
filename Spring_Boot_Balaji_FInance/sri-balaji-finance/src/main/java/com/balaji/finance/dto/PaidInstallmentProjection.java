package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PaidInstallmentProjection {

	LocalDateTime getTransactionDate();

	String getPaymentRefId();

	BigDecimal getInstallmentPaidAtTime();
}