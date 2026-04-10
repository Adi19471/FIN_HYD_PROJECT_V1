package com.balaji.finance.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface CustomerTransactionsProjection {

    Long getCashBookId();

    LocalDateTime getTransDate();

    String getBusinessMemberId();

    String getAccountMasterCode();

    String getBmRemarks();

    BigDecimal getCredit();

    BigDecimal getDebit();
}