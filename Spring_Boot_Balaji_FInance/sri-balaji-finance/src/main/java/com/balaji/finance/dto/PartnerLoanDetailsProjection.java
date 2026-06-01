package com.balaji.finance.dto;
public interface PartnerLoanDetailsProjection {

    // Partner Details
    String getPartnerId();
    String getPartnerFirstName();
    String getPartnerPhoneNumber();

    // Loan Details
    String getLoanType();
    String getBusinessMemberId();

    // Customer Details
    String getCustomerId();
    String getCustomerFirstName();
    String getCustomerPhoneNumber();

    // Guarantor Details
    String getGuarentorId();
    String getGuarentorFirstName();
    String getGuarentorPhoneNumber();

    // Loan Dates
    java.time.LocalDateTime getStartDate();
    java.time.LocalDateTime getEndDate();

    // Financial Details
    java.math.BigDecimal getAmount();
    Integer getDuration();
    java.math.BigDecimal getInstallmentPerMonth();

    // EMI Details
    java.math.BigDecimal getTotalInstallmentAmountPaid();
    Integer getNoOfEmisPaid();
}