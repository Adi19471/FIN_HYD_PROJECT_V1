package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class OtherPaymentSaveReq {

	private String transactionDate;
	private String accountMasterCode;
	private String accountCode;
	private String customerId;
	private String particulars;
	private String transaction;

	private BigDecimal amount;

	public String getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(String transactionDate) {
		this.transactionDate = transactionDate;
	}

	public String getAccountCode() {
		return accountCode;
	}

	public void setAccountCode(String accountCode) {
		this.accountCode = accountCode;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getParticulars() {
		return particulars;
	}

	public void setParticulars(String particulars) {
		this.particulars = particulars;
	}

	public String getTransaction() {
		return transaction;
	}

	public void setTransaction(String transaction) {
		this.transaction = transaction;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getAccountMasterCode() {
		return accountMasterCode;
	}

	public void setAccountMasterCode(String accountMasterCode) {
		this.accountMasterCode = accountMasterCode;
	}

	
}
