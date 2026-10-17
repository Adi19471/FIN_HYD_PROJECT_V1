package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface GuarantorDuesProjection {
	String getLoanId();

	String getCustomerName();

	String getGuarantorName();

	LocalDateTime getStartDate();

	LocalDateTime getEndDate();

	BigDecimal getLoanAmount();

	Integer getDuration();

	BigDecimal getInstallmentAmount();

	Long getNoOfInstallmentsPaid();

	BigDecimal getTotalAmountPaid();

	Long getNoOfInstallmentsPending();

	BigDecimal getDueAmount();

	String getCustomerMobile();

	String getPartnerName();

	LocalDateTime getDueDate();

	String getLoanType();
}
