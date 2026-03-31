package com.balaji.finance.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "business_member_daily_finance_sequence")
public class BusinessMemberDailyFinanceSequence {

	@Id
	private Integer year;

	private Integer lastNumber;

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Integer getLastNumber() {
		return lastNumber;
	}

	public void setLastNumber(Integer lastNumber) {
		this.lastNumber = lastNumber;
	}
}