package com.balaji.finance.pojo;

import java.time.LocalDate;
import java.util.Date;

public class ReceiptsLedgerPojo {

	private Integer sno;
	private LocalDate date;
	private Double transId;
	private String loanId;
	private LocalDate loanDate;
	private String customerName;
	private Double amountPaid;
	private Double lateFee;
	private Double total;
	private Double totalPaid;
	private Double balance;
	private Integer currentInstallmentNumber;
	private Integer balanceInstallmentNumber;
	private String particulars;

	public Integer getSno() {
		return sno;
	}

	public void setSno(Integer sno) {
		this.sno = sno;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Double getTransId() {
		return transId;
	}

	public void setTransId(Double transId) {
		this.transId = transId;
	}

	public String getLoanId() {
		return loanId;
	}

	public void setLoanId(String loanId) {
		this.loanId = loanId;
	}

	public LocalDate getLoanDate() {
		return loanDate;
	}

	public void setLoanDate(LocalDate loanDate) {
		this.loanDate = loanDate;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public Double getAmountPaid() {
		return amountPaid;
	}

	public void setAmountPaid(Double amountPaid) {
		this.amountPaid = amountPaid;
	}

	public Double getLateFee() {
		return lateFee;
	}

	public void setLateFee(Double lateFee) {
		this.lateFee = lateFee;
	}

	public Double getTotal() {
		return total;
	}

	public void setTotal(Double total) {
		this.total = total;
	}

	public Double getTotalPaid() {
		return totalPaid;
	}

	public void setTotalPaid(Double totalPaid) {
		this.totalPaid = totalPaid;
	}

	public Double getBalance() {
		return balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}

	public Integer getCurrentInstallmentNumber() {
		return currentInstallmentNumber;
	}

	public void setCurrentInstallmentNumber(Integer currentInstallmentNumber) {
		this.currentInstallmentNumber = currentInstallmentNumber;
	}

	public Integer getBalanceInstallmentNumber() {
		return balanceInstallmentNumber;
	}

	public void setBalanceInstallmentNumber(Integer balanceInstallmentNumber) {
		this.balanceInstallmentNumber = balanceInstallmentNumber;
	}

	public String getParticulars() {
		return particulars;
	}

	public void setParticulars(String particulars) {
		this.particulars = particulars;
	}

	
}
