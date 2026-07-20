package com.balaji.finance.pojo;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public class InstallmentsDuesRequestPojo {

	private String loanType;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate fromDate;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate toDate;
	
	private InstallmentDueOrderBy orderBy;
	

	public String getLoanType() {
		return loanType;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}

	public LocalDate getFromDate() {
		return fromDate;
	}

	public void setFromDate(LocalDate fromDate) {
		this.fromDate = fromDate;
	}

	public LocalDate getToDate() {
		return toDate;
	}

	public void setToDate(LocalDate toDate) {
		this.toDate = toDate;
	}

	public InstallmentDueOrderBy getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(InstallmentDueOrderBy orderBy) {
		this.orderBy = orderBy;
	}
	

}
