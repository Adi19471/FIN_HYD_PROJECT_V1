package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PartnerSettlementResponse {

	private String partnerName;
	private String loanType;
	private String loanId;
	private String customerName;
	private String guarantorName;
	private LocalDate startDate;
	private LocalDate endDate;
	private BigDecimal amount;
	private Integer duration;
	private BigDecimal installmentAmount;
	private BigDecimal installmentPaid;
	private Integer noofInstallmentsPaid;
	private Integer noOfInstallmentsPending;
	private BigDecimal balanceAmount;
	private BigDecimal excemption;
	private BigDecimal settledAmount;

	public String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}

	public String getLoanType() {
		return loanType;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
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

	public BigDecimal getInstallmentPaid() {
		return installmentPaid;
	}

	public void setInstallmentPaid(BigDecimal installmentPaid) {
		this.installmentPaid = installmentPaid;
	}

	public Integer getNoofInstallmentsPaid() {
		return noofInstallmentsPaid;
	}

	public void setNoofInstallmentsPaid(Integer noofInstallmentsPaid) {
		this.noofInstallmentsPaid = noofInstallmentsPaid;
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

	public BigDecimal getExcemption() {
		return excemption;
	}

	public void setExcemption(BigDecimal excemption) {
		this.excemption = excemption;
	}

	public BigDecimal getSettledAmount() {
		return settledAmount;
	}

	public void setSettledAmount(BigDecimal settledAmount) {
		this.settledAmount = settledAmount;
	}

}
