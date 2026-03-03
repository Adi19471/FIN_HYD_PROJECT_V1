package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DateWiseCollectionsProjection {

    LocalDate getTxnDate();
    BigDecimal getDailyTotal();
    BigDecimal getMonthlyTotal();
}