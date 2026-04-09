package com.balaji.finance.pojo;

import java.time.LocalDate;

public class CustomerOutstandingRequest {

	private LocalDate selectedDate;
	private boolean loadMonthlyFinanceTransactions;
	private boolean loadDailyFinanceTransactions;

	public LocalDate getSelectedDate() {
		return selectedDate;
	}

	public void setSelectedDate(LocalDate selectedDate) {
		this.selectedDate = selectedDate;
	}

	public boolean isLoadMonthlyFinanceTransactions() {
		return loadMonthlyFinanceTransactions;
	}

	public void setLoadMonthlyFinanceTransactions(boolean loadMonthlyFinanceTransactions) {
		this.loadMonthlyFinanceTransactions = loadMonthlyFinanceTransactions;
	}

	public boolean isLoadDailyFinanceTransactions() {
		return loadDailyFinanceTransactions;
	}

	public void setLoadDailyFinanceTransactions(boolean loadDailyFinanceTransactions) {
		this.loadDailyFinanceTransactions = loadDailyFinanceTransactions;
	}

}
