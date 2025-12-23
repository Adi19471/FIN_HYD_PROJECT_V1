package com.balaji.finance.pojo;

import java.util.Date;
import java.util.List;

public class QuickCashBookSaveRequest {
	
	private String transactionDate;

	private List<QuickCashBookRow> quickCashBookRows;

	public List<QuickCashBookRow> getQuickCashBookRows() {
		return quickCashBookRows;
	}

	public void setQuickCashBookRows(List<QuickCashBookRow> quickCashBookRows) {
		this.quickCashBookRows = quickCashBookRows;
	}

	public String getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(String transactionDate) {
		this.transactionDate = transactionDate;
	}

	
}
