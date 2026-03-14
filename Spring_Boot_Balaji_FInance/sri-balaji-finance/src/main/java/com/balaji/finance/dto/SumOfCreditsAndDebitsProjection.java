package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface SumOfCreditsAndDebitsProjection {

    BigDecimal getDebits();

    BigDecimal getCredits();
}