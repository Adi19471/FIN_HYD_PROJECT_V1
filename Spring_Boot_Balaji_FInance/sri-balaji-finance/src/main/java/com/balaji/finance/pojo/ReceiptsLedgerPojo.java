package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public class ReceiptsLedgerPojo {

	private Integer sno;
	private LocalDate date;
	private Long transId;
	private String loanId;
	private LocalDate loanDate;
	private String customerName;
	private BigDecimal amountPaid;
	private BigDecimal lateFee;
	private BigDecimal total;
	private BigDecimal totalPaid;
	private BigDecimal balance;
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

	public Long getTransId() {
		return transId;
	}

	public void setTransId(Long transId) {
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

	public BigDecimal getAmountPaid() {
		return amountPaid;
	}

	public void setAmountPaid(BigDecimal amountPaid) {
		this.amountPaid = amountPaid;
	}

	public BigDecimal getLateFee() {
		return lateFee;
	}

	public void setLateFee(BigDecimal lateFee) {
		this.lateFee = lateFee;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public BigDecimal getTotalPaid() {
		return totalPaid;
	}

	public void setTotalPaid(BigDecimal totalPaid) {
		this.totalPaid = totalPaid;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
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
