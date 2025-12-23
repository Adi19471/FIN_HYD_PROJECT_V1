package com.balaji.finance.pojo;

public class QuickCashBookRow {

	private String accountNo;
	private String name;
	private Double installment;
	private Double dueAmount;
	private Double lateFee;
	private Double paidAmount;
	private Double paidLateFee;

	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getInstallment() {
		return installment;
	}

	public void setInstallment(Double installment) {
		this.installment = installment;
	}

	public Double getDueAmount() {
		return dueAmount;
	}

	public void setDueAmount(Double dueAmount) {
		this.dueAmount = dueAmount;
	}

	public Double getLateFee() {
		return lateFee;
	}

	public void setLateFee(Double lateFee) {
		this.lateFee = lateFee;
	}

	public Double getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(Double paidAmount) {
		this.paidAmount = paidAmount;
	}

	public Double getPaidLateFee() {
		return paidLateFee;
	}

	public void setPaidLateFee(Double paidLateFee) {
		this.paidLateFee = paidLateFee;
	}

}
