package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class BusinessSharePojo {

	private String loanType;
	private BigDecimal loansDisbursed;
	private BigDecimal interestReceivable;
	private BigDecimal sumOfLoansDisbursedAndInterestReceivable;
	private BigDecimal loansPaid;
	private BigDecimal interestPaid;
	private BigDecimal sumOfloansPaidAndInterestPaid;

	// A position as on the report's To date rather than a total for the range:
	// everything lent up to that day, less everything collected back by it.
	private BigDecimal totalOutstanding;
	private BigDecimal outstandingExcludingInterest;

	public String getLoanType() {
		return loanType;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}

	public BigDecimal getLoansDisbursed() {
		return loansDisbursed;
	}

	public void setLoansDisbursed(BigDecimal loansDisbursed) {
		this.loansDisbursed = loansDisbursed;
	}

	public BigDecimal getInterestReceivable() {
		return interestReceivable;
	}

	public void setInterestReceivable(BigDecimal interestReceivable) {
		this.interestReceivable = interestReceivable;
	}

	public BigDecimal getSumOfLoansDisbursedAndInterestReceivable() {
		return sumOfLoansDisbursedAndInterestReceivable;
	}

	public void setSumOfLoansDisbursedAndInterestReceivable(BigDecimal sumOfLoansDisbursedAndInterestReceivable) {
		this.sumOfLoansDisbursedAndInterestReceivable = sumOfLoansDisbursedAndInterestReceivable;
	}

	public BigDecimal getLoansPaid() {
		return loansPaid;
	}

	public void setLoansPaid(BigDecimal loansPaid) {
		this.loansPaid = loansPaid;
	}

	public BigDecimal getInterestPaid() {
		return interestPaid;
	}

	public void setInterestPaid(BigDecimal interestPaid) {
		this.interestPaid = interestPaid;
	}

	public BigDecimal getSumOfloansPaidAndInterestPaid() {
		return sumOfloansPaidAndInterestPaid;
	}

	public void setSumOfloansPaidAndInterestPaid(BigDecimal sumOfloansPaidAndInterestPaid) {
		this.sumOfloansPaidAndInterestPaid = sumOfloansPaidAndInterestPaid;
	}

	public BigDecimal getTotalOutstanding() {
		return totalOutstanding;
	}

	public void setTotalOutstanding(BigDecimal totalOutstanding) {
		this.totalOutstanding = totalOutstanding;
	}

	public BigDecimal getOutstandingExcludingInterest() {
		return outstandingExcludingInterest;
	}

	public void setOutstandingExcludingInterest(BigDecimal outstandingExcludingInterest) {
		this.outstandingExcludingInterest = outstandingExcludingInterest;
	}

}
