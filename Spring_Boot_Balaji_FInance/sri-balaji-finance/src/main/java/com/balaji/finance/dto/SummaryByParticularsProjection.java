package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface SummaryByParticularsProjection {

    BigDecimal getCredit();
    BigDecimal getDebit();
    BigDecimal getBalance();
    String getParticulars();
}