package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface PersonsUnderManagerProjection {

    String getId();
    String getFirstName();
    String getLastName();
    BigDecimal getShares();
}