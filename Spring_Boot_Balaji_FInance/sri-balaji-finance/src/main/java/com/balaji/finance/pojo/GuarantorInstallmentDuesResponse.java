package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GuarantorInstallmentDuesResponse {

	private Integer sno;
	private String loanId;
	private String customerName;
	private String guarantorName;
	private LocalDate startDate;
	private LocalDate endDate;
	private BigDecimal amount;
	private Integer duration;
	private BigDecimal installmentAmount;
	private Integer noOfInstallmentsPaid;
	private BigDecimal totalAmountPaid;
	private Integer noOfInstallmentsPending;
	private BigDecimal balanceAmount;
	private BigDecimal installmentDue;
	private LocalDate dueDate;
	private BigDecimal lateFee;
	private String loanType;

	public Integer getSno() {
		return sno;
	}

	public void setSno(Integer sno) {
		this.sno = sno;
	}

	public String getLoanId() {
		return loanId;
	}

	public void setLoanId(String loanId) {
		this.loanId = loanId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getGuarantorName() {
		return guarantorName;
	}

	public void setGuarantorName(String guarantorName) {
		this.guarantorName = guarantorName;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public BigDecimal getInstallmentAmount() {
		return installmentAmount;
	}

	public void setInstallmentAmount(BigDecimal installmentAmount) {
		this.installmentAmount = installmentAmount;
	}

	public Integer getNoOfInstallmentsPaid() {
		return noOfInstallmentsPaid;
	}

	public void setNoOfInstallmentsPaid(Integer noOfInstallmentsPaid) {
		this.noOfInstallmentsPaid = noOfInstallmentsPaid;
	}

	public BigDecimal getTotalAmountPaid() {
		return totalAmountPaid;
	}

	public void setTotalAmountPaid(BigDecimal totalAmountPaid) {
		this.totalAmountPaid = totalAmountPaid;
	}

	public Integer getNoOfInstallmentsPending() {
		return noOfInstallmentsPending;
	}

	public void setNoOfInstallmentsPending(Integer noOfInstallmentsPending) {
		this.noOfInstallmentsPending = noOfInstallmentsPending;
	}

	public BigDecimal getBalanceAmount() {
		return balanceAmount;
	}

	public void setBalanceAmount(BigDecimal balanceAmount) {
		this.balanceAmount = balanceAmount;
	}

	public BigDecimal getInstallmentDue() {
		return installmentDue;
	}

	public void setInstallmentDue(BigDecimal installmentDue) {
		this.installmentDue = installmentDue;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public BigDecimal getLateFee() {
		return lateFee;
	}

	public void setLateFee(BigDecimal lateFee) {
		this.lateFee = lateFee;
	}

	public String getLoanType() {
		return loanType;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}

}
