package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class LoanInformation {

	private String accountNo;
	private String partnerName;
	private String guarantorName;

	private BigDecimal loanAmount;
	private BigDecimal installmentAmount;

	private String periodFrom;
	private String periodTo;

	private String date;
	private BigDecimal paid;
	private BigDecimal balance;
	private BigDecimal amountPaid;
	private BigDecimal lateFee;

	private BigDecimal pendingLateFee;
	private BigDecimal dueAmount;

	private List<InstallmentDetails> installmentDetailsList = new ArrayList<InstallmentDetails>();

	// Getters and Setters

	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}

	public String getGuarantorName() {
		return guarantorName;
	}

	public void setGuarantorName(String guarantorName) {
		this.guarantorName = guarantorName;
	}

	public BigDecimal getLoanAmount() {
		return loanAmount;
	}

	public void setLoanAmount(BigDecimal loanAmount) {
		this.loanAmount = loanAmount;
	}

	public BigDecimal getInstallmentAmount() {
		return installmentAmount;
	}

	public void setInstallmentAmount(BigDecimal installmentAmount) {
		this.installmentAmount = installmentAmount;
	}

	public String getPeriodFrom() {
		return periodFrom;
	}

	public void setPeriodFrom(String periodFrom) {
		this.periodFrom = periodFrom;
	}

	public String getPeriodTo() {
		return periodTo;
	}

	public void setPeriodTo(String periodTo) {
		this.periodTo = periodTo;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public BigDecimal getPaid() {
		return paid;
	}

	public void setPaid(BigDecimal paid) {
		this.paid = paid;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
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

	public BigDecimal getPendingLateFee() {
		return pendingLateFee;
	}

	public void setPendingLateFee(BigDecimal pendingLateFee) {
		this.pendingLateFee = pendingLateFee;
	}

	public BigDecimal getDueAmount() {
		return dueAmount;
	}

	public void setDueAmount(BigDecimal dueAmount) {
		this.dueAmount = dueAmount;
	}

	public List<InstallmentDetails> getInstallmentDetailsList() {
		return installmentDetailsList;
	}

	public void setInstallmentDetailsList(List<InstallmentDetails> installmentDetailsList) {
		this.installmentDetailsList = installmentDetailsList;
	}

}
