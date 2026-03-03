package com.balaji.finance.pojo;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuickCashBookRow {

	@NotBlank(message = "Account number is required")
	private String accountNo;

	@NotBlank(message = "Customer name is required")
	private String name;

	@NotNull(message = "Installment amount is required")
	private BigDecimal installment;

	private BigDecimal dueAmount;
	private BigDecimal lateFee;

	@NotNull(message = "Paid amount is required")
	@DecimalMin(value = "0.0", inclusive = true, message = "Paid amount cannot be negative")
	private BigDecimal paidAmount;

	@NotNull(message = "Paid late fee is required")
	@DecimalMin(value = "0.0", inclusive = true, message = "Paid late fee cannot be negative")
	private BigDecimal paidLateFee;

	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getInstallment() {
		return installment;
	}

	public void setInstallment(BigDecimal installment) {
		this.installment = installment;
	}

	public BigDecimal getDueAmount() {
		return dueAmount;
	}

	public void setDueAmount(BigDecimal dueAmount) {
		this.dueAmount = dueAmount;
	}

	public BigDecimal getLateFee() {
		return lateFee;
	}

	public void setLateFee(BigDecimal lateFee) {
		this.lateFee = lateFee;
	}

	public BigDecimal getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(BigDecimal paidAmount) {
		this.paidAmount = paidAmount;
	}

	public BigDecimal getPaidLateFee() {
		return paidLateFee;
	}

	public void setPaidLateFee(BigDecimal paidLateFee) {
		this.paidLateFee = paidLateFee;
	}

	@Override
	public String toString() {
		return "QuickCashBookRow [accountNo=" + accountNo + ", name=" + name + ", installment=" + installment
				+ ", dueAmount=" + dueAmount + ", lateFee=" + lateFee + ", paidAmount=" + paidAmount + ", paidLateFee="
				+ paidLateFee + "]";
	}

}
