package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AccountsMasterLedgerPojo {

	private Long sno;
	private LocalDate date;
	private String transCode;
	private String name;
	private String particulars;
	private BigDecimal credit;
	private BigDecimal debit;

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

	public String getTransCode() {
		return transCode;
	}

	public void setTransCode(String transCode) {
		this.transCode = transCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getParticulars() {
		return particulars;
	}

	public void setParticulars(String particulars) {
		this.particulars = particulars;
	}

	public BigDecimal getCredit() {
		return credit;
	}

	public void setCredit(BigDecimal credit) {
		this.credit = credit;
	}

	public BigDecimal getDebit() {
		return debit;
	}

	public void setDebit(BigDecimal debit) {
		this.debit = debit;
	}

}
