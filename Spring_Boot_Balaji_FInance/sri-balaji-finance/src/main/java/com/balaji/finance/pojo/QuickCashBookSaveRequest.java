package com.balaji.finance.pojo;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuickCashBookSaveRequest {
	
	@NotBlank(message = "Transaction date is required")
	private LocalDate transactionDate;
	
	@Valid
	@NotNull(message = "Rows cannot be null")
	private List<QuickCashBookRow> quickCashBookRows;

	public List<QuickCashBookRow> getQuickCashBookRows() {
		return quickCashBookRows;
	}

	public void setQuickCashBookRows(List<QuickCashBookRow> quickCashBookRows) {
		this.quickCashBookRows = quickCashBookRows;
	}

	public LocalDate getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(LocalDate transactionDate) {
		this.transactionDate = transactionDate;
	}

	@Override
	public String toString() {
		return "QuickCashBookSaveRequest [transactionDate=" + transactionDate + ", quickCashBookRows="
				+ quickCashBookRows + "]";
	}

	
}
