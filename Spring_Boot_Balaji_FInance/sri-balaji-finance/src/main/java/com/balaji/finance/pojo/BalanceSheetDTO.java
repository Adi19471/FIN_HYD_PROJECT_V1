package com.balaji.finance.pojo;

import java.math.BigDecimal;

import com.balaji.finance.dto.BalanceSheetProjection;

public class BalanceSheetDTO implements BalanceSheetProjection {

    private String type;
    private String masterCode;
    private String code;
    private BigDecimal amount;

    public BalanceSheetDTO(String type, String masterCode,
                           String code, BigDecimal amount) {
        this.type = type;
        this.masterCode = masterCode;
        this.code = code;
        this.amount = amount;
    }

    @Override
    public String getType() {
        return type;
    }

    @Override
    public String getMasterCode() {
        return masterCode;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}