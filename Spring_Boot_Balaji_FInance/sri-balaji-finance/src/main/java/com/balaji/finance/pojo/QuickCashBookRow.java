package com.balaji.finance.pojo;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuickCashBookRow {

	@NotBlank(message = "Account number is required")
	private String accountNo;

	@NotBlank(message = "Customer name is required")
	private String name;

	@NotNull(message = "Installment amount is required")
	private Double installment;

	private Double dueAmount;
	private Double lateFee;

	@NotNull(message = "Paid amount is required")
	@DecimalMin(value = "0.0", inclusive = true, message = "Paid amount cannot be negative")
	private Double paidAmount;

	@NotNull(message = "Paid late fee is required")
	@DecimalMin(value = "0.0", inclusive = true, message = "Paid late fee cannot be negative")
	private Double paidLateFee;

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

	public Double getInstallment() {
		return installment;
	}

	public void setInstallment(Double installment) {
		this.installment = installment;
	}

	public Double getDueAmount() {
		return dueAmount;
	}

	public void setDueAmount(Double dueAmount) {
		this.dueAmount = dueAmount;
	}

	public Double getLateFee() {
		return lateFee;
	}

	public void setLateFee(Double lateFee) {
		this.lateFee = lateFee;
	}

	public Double getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(Double paidAmount) {
		this.paidAmount = paidAmount;
	}

	public Double getPaidLateFee() {
		return paidLateFee;
	}

	public void setPaidLateFee(Double paidLateFee) {
		this.paidLateFee = paidLateFee;
	}

	@Override
	public String toString() {
		return "QuickCashBookRow [accountNo=" + accountNo + ", name=" + name + ", installment=" + installment
				+ ", dueAmount=" + dueAmount + ", lateFee=" + lateFee + ", paidAmount=" + paidAmount + ", paidLateFee="
				+ paidLateFee + "]";
	}

}
