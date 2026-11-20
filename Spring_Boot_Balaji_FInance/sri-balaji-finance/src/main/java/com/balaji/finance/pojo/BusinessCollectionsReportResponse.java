package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class BusinessCollectionsReportResponse {

	private String loanType;
	private String loanStatus;
	private BigDecimal targetCollectionsofCurrentMonth;
	private BigDecimal targetCollectionsofPreviousMonths;
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

	public BigDecimal getTargetCollectionsofCurrentMonth() {
		return targetCollectionsofCurrentMonth;
	}

	public void setTargetCollectionsofCurrentMonth(BigDecimal targetCollectionsofCurrentMonth) {
		this.targetCollectionsofCurrentMonth = targetCollectionsofCurrentMonth;
	}

	public BigDecimal getTargetCollectionsofPreviousMonths() {
		return targetCollectionsofPreviousMonths;
	}

	public void setTargetCollectionsofPreviousMonths(BigDecimal targetCollectionsofPreviousMonths) {
		this.targetCollectionsofPreviousMonths = targetCollectionsofPreviousMonths;
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
