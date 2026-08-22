package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.List;

/**
 * The whole Business Share report in one answer: the loan rows the report has
 * always printed, and under them what the business is worth and what one share
 * of it comes to.
 *
 * The value figures are a position as on the report's To date, not a total for
 * the range - what is still owed and still held on that day - so they are given
 * once for the report rather than per loan type.
 */
public class BusinessShareResponsePojo {

	private List<BusinessSharePojo> loanInformation;

	private BigDecimal loansOutstanding;
	private BigDecimal advances;
	private BigDecimal bankDeposits;
	private BigDecimal cashInHand;
	private BigDecimal otherAssets;
	private BigDecimal totalAssets;

	private BigDecimal handLoans;
	private BigDecimal fdDeposits;
	private BigDecimal otherLiabilities;
	private BigDecimal totalLiabilities;

	private BigDecimal netBusinessValue;
	private BigDecimal totalShares;
	private BigDecimal valuePerShare;

	public List<BusinessSharePojo> getLoanInformation() {
		return loanInformation;
	}

	public void setLoanInformation(List<BusinessSharePojo> loanInformation) {
		this.loanInformation = loanInformation;
	}

	public BigDecimal getLoansOutstanding() {
		return loansOutstanding;
	}

	public void setLoansOutstanding(BigDecimal loansOutstanding) {
		this.loansOutstanding = loansOutstanding;
	}

	public BigDecimal getAdvances() {
		return advances;
	}

	public void setAdvances(BigDecimal advances) {
		this.advances = advances;
	}

	public BigDecimal getBankDeposits() {
		return bankDeposits;
	}

	public void setBankDeposits(BigDecimal bankDeposits) {
		this.bankDeposits = bankDeposits;
	}

	public BigDecimal getCashInHand() {
		return cashInHand;
	}

	public void setCashInHand(BigDecimal cashInHand) {
		this.cashInHand = cashInHand;
	}

	public BigDecimal getOtherAssets() {
		return otherAssets;
	}

	public void setOtherAssets(BigDecimal otherAssets) {
		this.otherAssets = otherAssets;
	}

	public BigDecimal getTotalAssets() {
		return totalAssets;
	}

	public void setTotalAssets(BigDecimal totalAssets) {
		this.totalAssets = totalAssets;
	}

	public BigDecimal getHandLoans() {
		return handLoans;
	}

	public void setHandLoans(BigDecimal handLoans) {
		this.handLoans = handLoans;
	}

	public BigDecimal getFdDeposits() {
		return fdDeposits;
	}

	public void setFdDeposits(BigDecimal fdDeposits) {
		this.fdDeposits = fdDeposits;
	}

	public BigDecimal getOtherLiabilities() {
		return otherLiabilities;
	}

	public void setOtherLiabilities(BigDecimal otherLiabilities) {
		this.otherLiabilities = otherLiabilities;
	}

	public BigDecimal getTotalLiabilities() {
		return totalLiabilities;
	}

	public void setTotalLiabilities(BigDecimal totalLiabilities) {
		this.totalLiabilities = totalLiabilities;
	}

	public BigDecimal getNetBusinessValue() {
		return netBusinessValue;
	}

	public void setNetBusinessValue(BigDecimal netBusinessValue) {
		this.netBusinessValue = netBusinessValue;
	}

	public BigDecimal getTotalShares() {
		return totalShares;
	}

	public void setTotalShares(BigDecimal totalShares) {
		this.totalShares = totalShares;
	}

	public BigDecimal getValuePerShare() {
		return valuePerShare;
	}

	public void setValuePerShare(BigDecimal valuePerShare) {
		this.valuePerShare = valuePerShare;
	}

}
