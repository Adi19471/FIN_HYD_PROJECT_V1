package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class CustomerOutstandingView {

	private Integer sNo;
	private String customerId;
	private String customerName;
	private Long noOfLoans;
	private BigDecimal totalLoansAmount;
	private BigDecimal totalPaidAmount;
	private BigDecimal balanceOutstanding;
	private BigDecimal dueDateOutstanding;

	public Integer getsNo() {
		return sNo;
	}

	public void setsNo(Integer sNo) {
		this.sNo = sNo;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public Long getNoOfLoans() {
		return noOfLoans;
	}

	public void setNoOfLoans(Long noOfLoans) {
		this.noOfLoans = noOfLoans;
	}

	public BigDecimal getTotalLoansAmount() {
		return totalLoansAmount;
	}

	public void setTotalLoansAmount(BigDecimal totalLoansAmount) {
		this.totalLoansAmount = totalLoansAmount;
	}

	public BigDecimal getTotalPaidAmount() {
		return totalPaidAmount;
	}

	public void setTotalPaidAmount(BigDecimal totalPaidAmount) {
		this.totalPaidAmount = totalPaidAmount;
	}

	public BigDecimal getBalanceOutstanding() {
		return balanceOutstanding;
	}

	public void setBalanceOutstanding(BigDecimal balanceOutstanding) {
		this.balanceOutstanding = balanceOutstanding;
	}

	public BigDecimal getDueDateOutstanding() {
		return dueDateOutstanding;
	}

	public void setDueDateOutstanding(BigDecimal dueDateOutstanding) {
		this.dueDateOutstanding = dueDateOutstanding;
	}

}
