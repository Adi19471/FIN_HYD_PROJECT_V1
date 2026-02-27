package com.balaji.finance.pojo;

import java.util.List;

public class DayWiseTransactionsSummary {

	private List<CashBookSumaryViewPojo> cashBookSumaryViewPojoList;
	private Double openingBalance = 0d;

	public List<CashBookSumaryViewPojo> getCashBookSumaryViewPojoList() {
		return cashBookSumaryViewPojoList;
	}

	public void setCashBookSumaryViewPojoList(List<CashBookSumaryViewPojo> cashBookSumaryViewPojoList) {
		this.cashBookSumaryViewPojoList = cashBookSumaryViewPojoList;
	}

	public Double getOpeningBalance() {
		return openingBalance;
	}

	public void setOpeningBalance(Double openingBalance) {
		this.openingBalance = openingBalance;
	}

}
