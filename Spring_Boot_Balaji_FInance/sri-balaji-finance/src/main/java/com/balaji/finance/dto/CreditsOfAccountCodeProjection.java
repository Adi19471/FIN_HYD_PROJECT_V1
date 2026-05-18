package com.balaji.finance.dto;

import java.math.BigDecimal;

public interface CreditsOfAccountCodeProjection {

    String getAccountMasterCode();

    BigDecimal getCreditsOfAccountCode();
}