package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface BalanceSheetProjection {

    String getType();
    String getMasterCode();
    String getCode();
    BigDecimal getAmount();
}