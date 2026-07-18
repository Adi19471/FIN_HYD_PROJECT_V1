package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class InstallmentDetails {

	private Integer emiId;
	private long installmentNumber;
	private BigDecimal principleAmount;
	private BigDecimal interestAmount;
	private BigDecimal paidAmount;
	private BigDecimal totalAmount;
	private BigDecimal installmentAmount;
	private String dueDate;
	private String lateFeeDate;
	private BigDecimal lateFee;
	private String status;
	private String transactionDate;
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

	public Integer getEmiId() {
		return emiId;
	}

	public void setEmiId(Integer emiId) {
		this.emiId = emiId;
	}

	public BigDecimal getPrincipleAmount() {
		return principleAmount;
	}

	public void setPrincipleAmount(BigDecimal principleAmount) {
		this.principleAmount = principleAmount;
	}

	public BigDecimal getInterestAmount() {
		return interestAmount;
	}

	public void setInterestAmount(BigDecimal interestAmount) {
		this.interestAmount = interestAmount;
	}

	public BigDecimal getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(BigDecimal paidAmount) {
		this.paidAmount = paidAmount;
	}

	public BigDecimal getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(String transactionDate) {
		this.transactionDate = transactionDate;
	}

	
}
