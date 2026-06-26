package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class BusinessReportResponsePojo {

	private int sno;
	private String partnerId;
	private String partnerName;
	private BigDecimal shares;
	private String bussinessExemption;
	private Long noOfMonthlyLoans;
	private BigDecimal monthlyLoanAmount;
	private Long noOfDailyLoans;
	private BigDecimal dailyLoanAmount;
	private BigDecimal totalLoanAmount;
	private BigDecimal targetAmount;
	private BigDecimal excess_or_deficit;
	private BigDecimal amount;

	public int getSno() {
		return sno;
	}

	public void setSno(int sno) {
		this.sno = sno;
	}

	public String getPartnerId() {
		return partnerId;
	}

	public void setPartnerId(String partnerId) {
		this.partnerId = partnerId;
	}

	public String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}

	public BigDecimal getShares() {
		return shares;
	}

	public void setShares(BigDecimal shares) {
		this.shares = shares;
	}

	

	public String getBussinessExemption() {
		return bussinessExemption;
	}

	public void setBussinessExemption(String bussinessExemption) {
		this.bussinessExemption = bussinessExemption;
	}

	public Long getNoOfMonthlyLoans() {
		return noOfMonthlyLoans;
	}

	public void setNoOfMonthlyLoans(Long noOfMonthlyLoans) {
		this.noOfMonthlyLoans = noOfMonthlyLoans;
	}

	public BigDecimal getMonthlyLoanAmount() {
		return monthlyLoanAmount;
	}

	public void setMonthlyLoanAmount(BigDecimal monthlyLoanAmount) {
		this.monthlyLoanAmount = monthlyLoanAmount;
	}

	public Long getNoOfDailyLoans() {
		return noOfDailyLoans;
	}

	public void setNoOfDailyLoans(Long noOfDailyLoans) {
		this.noOfDailyLoans = noOfDailyLoans;
	}

	public BigDecimal getDailyLoanAmount() {
		return dailyLoanAmount;
	}

	public void setDailyLoanAmount(BigDecimal dailyLoanAmount) {
		this.dailyLoanAmount = dailyLoanAmount;
	}

	public BigDecimal getTotalLoanAmount() {
		return totalLoanAmount;
	}

	public void setTotalLoanAmount(BigDecimal totalLoanAmount) {
		this.totalLoanAmount = totalLoanAmount;
	}

	public BigDecimal getTargetAmount() {
		return targetAmount;
	}

	public void setTargetAmount(BigDecimal targetAmount) {
		this.targetAmount = targetAmount;
	}

	public BigDecimal getExcess_or_deficit() {
		return excess_or_deficit;
	}

	public void setExcess_or_deficit(BigDecimal excess_or_deficit) {
		this.excess_or_deficit = excess_or_deficit;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

}
