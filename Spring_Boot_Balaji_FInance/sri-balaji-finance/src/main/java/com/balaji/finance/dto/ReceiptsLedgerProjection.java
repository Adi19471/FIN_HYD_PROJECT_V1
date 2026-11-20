package com.balaji.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** One Receipt Ledger line: a payment (cash book rows sharing a payment ref). */
public interface ReceiptsLedgerProjection {

	Long getTransId();

	LocalDateTime getTransDate();

	String getLoanId();

	LocalDateTime getLoanDate();

	String getFirstName();

	String getLastName();

	// This payment's installment amount
	BigDecimal getAmountPaid();

	// Everything paid on the loan up to and including this payment's date
	BigDecimal getTotalPaid();

	BigDecimal getLoanAmount();

	BigDecimal getInterest();

	BigDecimal getInstallment();

	Integer getDuration();
}
