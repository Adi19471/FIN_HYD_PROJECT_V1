package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.List;

public class DayWiseTransactionsSummary {

	private List<CashBookSumaryViewPojo> cashBookSumaryViewPojoList;
	private BigDecimal openingBalance;

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

}
