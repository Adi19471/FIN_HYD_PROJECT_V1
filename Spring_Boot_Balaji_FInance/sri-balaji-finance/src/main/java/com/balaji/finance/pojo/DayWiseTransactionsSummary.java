package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.List;

public class DayWiseTransactionsSummary {

	private List<CashBookSumaryViewPojo> cashBookSumaryViewPojoList;
	private BigDecimal openingBalance;
	private BigDecimal credits;
	private BigDecimal debits;
	private BigDecimal closingBalance;

	public List<CashBookSumaryViewPojo> getCashBookSumaryViewPojoList() {
		return cashBookSumaryViewPojoList;
	}

	public void setCashBookSumaryViewPojoList(List<CashBookSumaryViewPojo> cashBookSumaryViewPojoList) {
		this.cashBookSumaryViewPojoList = cashBookSumaryViewPojoList;
	}

	public BigDecimal getOpeningBalance() {
		return openingBalance;
	}

	public void setOpeningBalance(BigDecimal openingBalance) {
		this.openingBalance = openingBalance;
	}

	public BigDecimal getCredits() {
		return credits;
	}

	public void setCredits(BigDecimal credits) {
		this.credits = credits;
	}

	public BigDecimal getDebits() {
		return debits;
	}

	public void setDebits(BigDecimal debits) {
		this.debits = debits;
	}

	public BigDecimal getClosingBalance() {
		return closingBalance;
	}

	public void setClosingBalance(BigDecimal closingBalance) {
		this.closingBalance = closingBalance;
	}

}
