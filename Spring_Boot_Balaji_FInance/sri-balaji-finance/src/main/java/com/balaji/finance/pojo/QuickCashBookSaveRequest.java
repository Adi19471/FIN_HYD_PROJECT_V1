package com.balaji.finance.pojo;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuickCashBookSaveRequest {
	
	@NotBlank(message = "Transaction date is required")
	private String transactionDate;
	
	@Valid
	@NotNull(message = "Rows cannot be null")
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

	@Override
	public String toString() {
		return "QuickCashBookSaveRequest [transactionDate=" + transactionDate + ", quickCashBookRows="
				+ quickCashBookRows + "]";
	}

	
}
