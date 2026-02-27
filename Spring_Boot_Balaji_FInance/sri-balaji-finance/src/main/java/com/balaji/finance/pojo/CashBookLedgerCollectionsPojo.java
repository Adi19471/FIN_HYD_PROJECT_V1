package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CashBookLedgerCollectionsPojo {

	private Long sno;
	private LocalDate date;
	private Double monthlyFinanceCollections = 0d;
	private Double dailyFinanceCollections = 0d;
	private Double total;

	public Long getSno() {
		return sno;
	}

	public void setSno(Long sno) {
		this.sno = sno;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Double getMonthlyFinanceCollections() {
		return monthlyFinanceCollections;
	}

	public void setMonthlyFinanceCollections(Double monthlyFinanceCollections) {
		this.monthlyFinanceCollections = monthlyFinanceCollections;
	}

	public Double getDailyFinanceCollections() {
		return dailyFinanceCollections;
	}

	public void setDailyFinanceCollections(Double dailyFinanceCollections) {
		this.dailyFinanceCollections = dailyFinanceCollections;
	}

	public Double getTotal() {
		return total;
	}

	public void setTotal(Double total) {
		this.total = total;
	}

}
