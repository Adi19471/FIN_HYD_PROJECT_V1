package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface CashBookProjection {

    String getAccountMasterCode();

    BigDecimal getCredit();
}