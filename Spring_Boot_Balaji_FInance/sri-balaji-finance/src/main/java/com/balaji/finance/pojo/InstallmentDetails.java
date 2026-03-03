package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class InstallmentDetails {

	private Integer emiId;
	private long installmentNumber;
	private String dueDate;
	private String lateFeeDate;
	private BigDecimal installmentAmount;
	private BigDecimal lateFee;
	private BigDecimal total;
	private BigDecimal paid;

	// Getters and Setters

	public long getInstallmentNumber() {
		return installmentNumber;
	}

	public void setInstallmentNumber(long installmentNumber) {
		this.installmentNumber = installmentNumber;
	}

	public String getDueDate() {
		return dueDate;
	}

	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}

	public String getLateFeeDate() {
		return lateFeeDate;
	}

	public void setLateFeeDate(String lateFeeDate) {
		this.lateFeeDate = lateFeeDate;
	}

	public BigDecimal getInstallmentAmount() {
		return installmentAmount;
	}

	public void setInstallmentAmount(BigDecimal installmentAmount) {
		this.installmentAmount = installmentAmount;
	}

	public BigDecimal getLateFee() {
		return lateFee;
	}

	public void setLateFee(BigDecimal lateFee) {
		this.lateFee = lateFee;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public BigDecimal getPaid() {
		return paid;
	}

	public void setPaid(BigDecimal paid) {
		this.paid = paid;
	}

	public Integer getEmiId() {
		return emiId;
	}

	public void setEmiId(Integer emiId) {
		this.emiId = emiId;
	}

}
