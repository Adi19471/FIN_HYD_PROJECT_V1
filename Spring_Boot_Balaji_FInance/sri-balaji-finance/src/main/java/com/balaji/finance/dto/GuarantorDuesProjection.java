package com.balaji.finance.dto;

import java.time.LocalDateTime;

public interface GuarantorDuesProjection {
	
	String getBusinessMemberId();

	String getCustomerId();

	String getCustomerFirstName();

	String getCustomerPhoneNumber();

	String getGuarentorId();

	String getGuarentorFirstName();

	String getGuarentorPhoneNumber();

	String getPartnerId();

	String getPartnerFirstName();

	String getPartnerPhoneNumber();

	LocalDateTime getStartDate();

	LocalDateTime getEndDate();

	java.math.BigDecimal getAmount();

	Integer getDuration();

	java.math.BigDecimal getInstallmentPerMonth();

	java.math.BigDecimal getTotalInstallmentAmountPaid();

	Integer getNoOfEmisPaid();

	String getLoanType();
}
