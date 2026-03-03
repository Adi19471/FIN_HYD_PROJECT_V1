package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface DateWiseCollectionProjection {
    LocalDate getTxnDate();
    BigDecimal getTotalCollection();
}