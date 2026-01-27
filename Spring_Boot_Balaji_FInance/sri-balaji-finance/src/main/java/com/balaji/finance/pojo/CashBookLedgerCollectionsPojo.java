package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CashBookLedgerCollectionsPojo {

	private Long sno;
	private LocalDate date;
	private BigDecimal monthlyFinanceCollections;
	private BigDecimal dailyFinanceCollections;
	private BigDecimal total;

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

	public BigDecimal getMonthlyFinanceCollections() {
		return monthlyFinanceCollections;
	}

	public void setMonthlyFinanceCollections(BigDecimal monthlyFinanceCollections) {
		this.monthlyFinanceCollections = monthlyFinanceCollections;
	}

	public BigDecimal getDailyFinanceCollections() {
		return dailyFinanceCollections;
	}

	public void setDailyFinanceCollections(BigDecimal dailyFinanceCollections) {
		this.dailyFinanceCollections = dailyFinanceCollections;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

}
