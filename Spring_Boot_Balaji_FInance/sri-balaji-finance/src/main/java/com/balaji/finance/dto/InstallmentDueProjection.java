package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface InstallmentDueProjection {

	String getLoanId();

	String getCustomerName();

	String getPartnerName();

	String getGuarantorName();
	
	LocalDateTime getStartDate();

	LocalDateTime getEndDate();

	BigDecimal getLoanAmount();

	BigDecimal getInstallmentAmount();

	LocalDateTime getDueDate();

	BigDecimal getPaidAmount();

	BigDecimal getDueAmount();

	Long getPendingCount();
}