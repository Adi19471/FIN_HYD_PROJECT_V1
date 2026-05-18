package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class GroupBusinessDetailResponsePojo {

	private String partnerId;
	private String name;
	private BigDecimal noOfShares;
	private BigDecimal capital;
	private Long noOfLoans;
	private BigDecimal disbursedAmount;
	private BigDecimal disbursedAmountWithInterest;
	private BigDecimal paidAmount;
	private BigDecimal balanceOutStandingWithInterest;
	private BigDecimal balanceOutStandingWithOutInterest;
	private BigDecimal installmentDuesOutStanding;

	public String getPartnerId() {
		return partnerId;
	}

	public void setPartnerId(String partnerId) {
		this.partnerId = partnerId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getNoOfShares() {
		return noOfShares;
	}

	public void setNoOfShares(BigDecimal noOfShares) {
		this.noOfShares = noOfShares;
	}

	public BigDecimal getCapital() {
		return capital;
	}

	public void setCapital(BigDecimal capital) {
		this.capital = capital;
	}

	public Long getNoOfLoans() {
		return noOfLoans;
	}

	public void setNoOfLoans(Long noOfLoans) {
		this.noOfLoans = noOfLoans;
	}

	public BigDecimal getDisbursedAmount() {
		return disbursedAmount;
	}

	public void setDisbursedAmount(BigDecimal disbursedAmount) {
		this.disbursedAmount = disbursedAmount;
	}

	public BigDecimal getDisbursedAmountWithInterest() {
		return disbursedAmountWithInterest;
	}

	public void setDisbursedAmountWithInterest(BigDecimal disbursedAmountWithInterest) {
		this.disbursedAmountWithInterest = disbursedAmountWithInterest;
	}

	public BigDecimal getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(BigDecimal paidAmount) {
		this.paidAmount = paidAmount;
	}

	public BigDecimal getBalanceOutStandingWithInterest() {
		return balanceOutStandingWithInterest;
	}

	public void setBalanceOutStandingWithInterest(BigDecimal balanceOutStandingWithInterest) {
		this.balanceOutStandingWithInterest = balanceOutStandingWithInterest;
	}

	public BigDecimal getBalanceOutStandingWithOutInterest() {
		return balanceOutStandingWithOutInterest;
	}

	public void setBalanceOutStandingWithOutInterest(BigDecimal balanceOutStandingWithOutInterest) {
		this.balanceOutStandingWithOutInterest = balanceOutStandingWithOutInterest;
	}

	public BigDecimal getInstallmentDuesOutStanding() {
		return installmentDuesOutStanding;
	}

	public void setInstallmentDuesOutStanding(BigDecimal installmentDuesOutStanding) {
		this.installmentDuesOutStanding = installmentDuesOutStanding;
	}

}
