package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class AccountsLedgerPojo {

	private Long sno;
	private String accountMaster;
	private Double credit;
	private Double debit;
	private Double balance;

	public Long getSno() {
		return sno;
	}

	public void setSno(Long sno) {
		this.sno = sno;
	}

	public String getAccountMaster() {
		return accountMaster;
	}

	public void setAccountMaster(String accountMaster) {
		this.accountMaster = accountMaster;
	}

	public Double getCredit() {
		return credit;
	}

	public void setCredit(Double credit) {
		this.credit = credit;
	}

	public Double getDebit() {
		return debit;
	}

	public void setDebit(Double debit) {
		this.debit = debit;
	}

	public Double getBalance() {
		return balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}

}
