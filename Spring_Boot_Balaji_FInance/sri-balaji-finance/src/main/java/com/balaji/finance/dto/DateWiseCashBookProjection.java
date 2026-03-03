package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DateWiseCashBookProjection {

    LocalDate getTxnDate();
    BigDecimal getCredit();
    BigDecimal getDebit();
    BigDecimal getBalance();
}