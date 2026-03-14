package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface RevenueExpenseProjection {

    String getType();
    String getCode();
    BigDecimal getAmount();
}