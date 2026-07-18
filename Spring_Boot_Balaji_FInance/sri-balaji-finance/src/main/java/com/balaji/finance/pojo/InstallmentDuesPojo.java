package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class InstallmentDuesPojo {

	private int sno;
	private String loanId;
	private String customerName;
	private String guarentorName;
	private String partnerName;
	private String startDate;
	private String endDate;
	private BigDecimal amount;
	private int totalNoOfInstallments;
	private BigDecimal installmentAmount;

	private BigDecimal amountPaid;
	private Long noOfInstallmentsPaid;
	private BigDecimal installmentDue;
	private Long noOfInstallmentsPending;

	private BigDecimal lateFee;
	private String remarks;

	public int getSno() {
		return sno;
	}

	public void setSno(int sno) {
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

	public String getGuarentorName() {
		return guarentorName;
	}

	public void setGuarentorName(String guarentorName) {
		this.guarentorName = guarentorName;
	}

	public String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public BigDecimal getAmountPaid() {
		return amountPaid;
	}

	public void setAmountPaid(BigDecimal amountPaid) {
		this.amountPaid = amountPaid;
	}

	public BigDecimal getInstallmentDue() {
		return installmentDue;
	}

	public void setInstallmentDue(BigDecimal installmentDue) {
		this.installmentDue = installmentDue;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public int getTotalNoOfInstallments() {
		return totalNoOfInstallments;
	}

	public void setTotalNoOfInstallments(int totalNoOfInstallments) {
		this.totalNoOfInstallments = totalNoOfInstallments;
	}

	public BigDecimal getInstallmentAmount() {
		return installmentAmount;
	}

	public void setInstallmentAmount(BigDecimal installmentAmount) {
		this.installmentAmount = installmentAmount;
	}

	public Long getNoOfInstallmentsPaid() {
		return noOfInstallmentsPaid;
	}

	public void setNoOfInstallmentsPaid(Long noOfInstallmentsPaid) {
		this.noOfInstallmentsPaid = noOfInstallmentsPaid;
	}

	public Long getNoOfInstallmentsPending() {
		return noOfInstallmentsPending;
	}

	public void setNoOfInstallmentsPending(Long noOfInstallmentsPending) {
		this.noOfInstallmentsPending = noOfInstallmentsPending;
	}

	public BigDecimal getLateFee() {
		return lateFee;
	}

	public void setLateFee(BigDecimal lateFee) {
		this.lateFee = lateFee;
	}

}
