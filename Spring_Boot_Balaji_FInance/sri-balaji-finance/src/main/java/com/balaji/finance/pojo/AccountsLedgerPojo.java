package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class AccountsLedgerPojo {

	private Long sno;
	private String accountMaster;
	private BigDecimal credit;
	private BigDecimal debit;
	private BigDecimal balance;

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

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

}
