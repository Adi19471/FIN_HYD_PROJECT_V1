package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class BusinessCollectionsReportResponse {

	private String loanType;
	private String loanStatus;
	private BigDecimal targetCollections;
	private BigDecimal receivedCollections;
	private BigDecimal balanceCollections;

	public String getLoanType() {
		return loanType;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}

	public String getLoanStatus() {
		return loanStatus;
	}

	public void setLoanStatus(String loanStatus) {
		this.loanStatus = loanStatus;
	}

	public BigDecimal getTargetCollections() {
		return targetCollections;
	}

	public void setTargetCollections(BigDecimal targetCollections) {
		this.targetCollections = targetCollections;
	}

	public BigDecimal getReceivedCollections() {
		return receivedCollections;
	}

	public void setReceivedCollections(BigDecimal receivedCollections) {
		this.receivedCollections = receivedCollections;
	}

	public BigDecimal getBalanceCollections() {
		return balanceCollections;
	}

	public void setBalanceCollections(BigDecimal balanceCollections) {
		this.balanceCollections = balanceCollections;
	}

}
