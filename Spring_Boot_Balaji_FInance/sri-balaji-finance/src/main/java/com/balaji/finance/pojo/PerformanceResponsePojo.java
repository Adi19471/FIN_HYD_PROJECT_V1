package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class PerformanceResponsePojo {

	private int sno;
	private String partnerId;
	private String name;
	private BigDecimal loansDisbursed;
	private BigDecimal loansPayment;
	private BigDecimal interest;
	private BigDecimal documentCharges;
	private BigDecimal lateFee;
	private BigDecimal income;

	public int getSno() {
		return sno;
	}

	public void setSno(int sno) {
		this.sno = sno;
	}

	public String getPartnerId() {
		return partnerId;
	}

	public void setPartnerId(String partnerId) {
		this.partnerId = partnerId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getLoansDisbursed() {
		return loansDisbursed;
	}

	public void setLoansDisbursed(BigDecimal loansDisbursed) {
		this.loansDisbursed = loansDisbursed;
	}

	public BigDecimal getLoansPayment() {
		return loansPayment;
	}

	public void setLoansPayment(BigDecimal loansPayment) {
		this.loansPayment = loansPayment;
	}

	public BigDecimal getInterest() {
		return interest;
	}

	public void setInterest(BigDecimal interest) {
		this.interest = interest;
	}

	public BigDecimal getDocumentCharges() {
		return documentCharges;
	}

	public void setDocumentCharges(BigDecimal documentCharges) {
		this.documentCharges = documentCharges;
	}

	public BigDecimal getLateFee() {
		return lateFee;
	}

	public void setLateFee(BigDecimal lateFee) {
		this.lateFee = lateFee;
	}

	public BigDecimal getIncome() {
		return income;
	}

	public void setIncome(BigDecimal income) {
		this.income = income;
	}

}
