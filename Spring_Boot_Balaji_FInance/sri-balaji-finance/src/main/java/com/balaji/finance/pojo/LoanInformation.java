package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class LoanInformation {

	private String accountNo;
	private String partnerName;
	private String guarantorName;

	private BigDecimal loanAmount;
	private BigDecimal installmentAmount;

	private BigDecimal processingFee;
	private BigDecimal interestRate;

	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDate periodFrom;

	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDate periodTo;

	@JsonFormat(pattern = "dd-MM-yyyy")
	private LocalDate date;
	private BigDecimal paid;
	private BigDecimal balance;
	private BigDecimal amountPaid;
	private BigDecimal lateFee;

	private BigDecimal pendingLateFee;
	private BigDecimal dueAmount;
	private Integer duration;

	private Long pendingInstallments;
	private Long completedInstallments;

	private List<InstallmentDetails> installmentDetailsList = new ArrayList<InstallmentDetails>();
	private List<EmiPaymentHistoryDto> emiPaymentHistoryList = new ArrayList<EmiPaymentHistoryDto>();

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

	public LocalDate getPeriodFrom() {
		return periodFrom;
	}

	public void setPeriodFrom(LocalDate periodFrom) {
		this.periodFrom = periodFrom;
	}

	public LocalDate getPeriodTo() {
		return periodTo;
	}

	public void setPeriodTo(LocalDate periodTo) {
		this.periodTo = periodTo;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
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

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public List<EmiPaymentHistoryDto> getEmiPaymentHistoryList() {
		return emiPaymentHistoryList;
	}

	public void setEmiPaymentHistoryList(List<EmiPaymentHistoryDto> emiPaymentHistoryList) {
		this.emiPaymentHistoryList = emiPaymentHistoryList;
	}

	public BigDecimal getProcessingFee() {
		return processingFee;
	}

	public void setProcessingFee(BigDecimal processingFee) {
		this.processingFee = processingFee;
	}

	public BigDecimal getInterestRate() {
		return interestRate;
	}

	public void setInterestRate(BigDecimal interestRate) {
		this.interestRate = interestRate;
	}

	public Long getPendingInstallments() {
		return pendingInstallments;
	}

	public void setPendingInstallments(Long pendingInstallments) {
		this.pendingInstallments = pendingInstallments;
	}

	public Long getCompletedInstallments() {
		return completedInstallments;
	}

	public void setCompletedInstallments(Long completedInstallments) {
		this.completedInstallments = completedInstallments;
	}

}
