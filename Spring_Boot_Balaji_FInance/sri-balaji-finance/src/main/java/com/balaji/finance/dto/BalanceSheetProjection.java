package com.balaji.finance.dto;

public interface BalanceSheetProjection {

    String getType();
    String getMasterCode();
    String getCode();
    Double getAmount();
}