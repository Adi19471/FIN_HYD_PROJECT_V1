package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.List;

import com.balaji.finance.dto.BalanceSheetProjection;

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
	private List<BalanceSheetProjection> balanceSheetProjectionList;

	private BigDecimal netBusinessValue;
	private BigDecimal totalShares;
	private BigDecimal valuePerShare;

	private BigDecimal totalAssets;
	private BigDecimal totalLiabilities;

	
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

	public List<BalanceSheetProjection> getBalanceSheetProjectionList() {
		return balanceSheetProjectionList;
	}

	public void setBalanceSheetProjectionList(List<BalanceSheetProjection> balanceSheetProjectionList) {
		this.balanceSheetProjectionList = balanceSheetProjectionList;
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

	public BigDecimal getTotalAssets() {
		return totalAssets;
	}

	public void setTotalAssets(BigDecimal totalAssets) {
		this.totalAssets = totalAssets;
	}

	public BigDecimal getTotalLiabilities() {
		return totalLiabilities;
	}

	public void setTotalLiabilities(BigDecimal totalLiabilities) {
		this.totalLiabilities = totalLiabilities;
	}

	
}
