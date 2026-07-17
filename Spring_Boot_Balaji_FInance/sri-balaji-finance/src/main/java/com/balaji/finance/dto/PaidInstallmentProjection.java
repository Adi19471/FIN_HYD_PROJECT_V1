package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface PaidInstallmentProjection {

	BigDecimal getLoanInstallmentsPaid();

	BigDecimal getLoanInterestPaid();
}