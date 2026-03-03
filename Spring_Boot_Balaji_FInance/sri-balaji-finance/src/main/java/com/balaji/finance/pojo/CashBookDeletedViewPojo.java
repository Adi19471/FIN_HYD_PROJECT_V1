package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class CashBookDeletedViewPojo {

	private Long transactionId;
	private String accountNumber;
	private String name;
	private String transactionType;
	private String particulars;
	private BigDecimal credit;
	private BigDecimal debit;
	private String deletedDate;
	private String deletedByUser;

	public Long getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(Long transactionId) {
		this.transactionId = transactionId;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
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

	public String getDeletedDate() {
		return deletedDate;
	}

	public void setDeletedDate(String deletedDate) {
		this.deletedDate = deletedDate;
	}

	public String getDeletedByUser() {
		return deletedByUser;
	}

	public void setDeletedByUser(String deletedByUser) {
		this.deletedByUser = deletedByUser;
	}

}
