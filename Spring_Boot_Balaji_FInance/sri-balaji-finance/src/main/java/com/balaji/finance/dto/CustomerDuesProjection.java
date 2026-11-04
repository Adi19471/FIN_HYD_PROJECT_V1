package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface CustomerDuesProjection {
	String getBusinessMemberId();

	String getCustomerId();

	String getCustomerFirstName();

	String getCustomerLastName();

	String getCustomerPhoneNumber();

	String getGuarentorId();

	String getGuarentorFirstName();

	String getGuarentorLastName();

	String getGuarentorPhoneNumber();

	String getPartnerId();

	String getPartnerFirstName();

	String getPartnerLastName();

	String getPartnerPhoneNumber();

	LocalDateTime getStartDate();

	LocalDateTime getEndDate();

	java.math.BigDecimal getAmount();

	Integer getDuration();

	java.math.BigDecimal getInstallmentPerMonth();

	java.math.BigDecimal getTotalInstallmentAmountPaid();

	Integer getNoOfEmisPaid();

	String getLoanType();
	
	BigDecimal getInterest();
}
