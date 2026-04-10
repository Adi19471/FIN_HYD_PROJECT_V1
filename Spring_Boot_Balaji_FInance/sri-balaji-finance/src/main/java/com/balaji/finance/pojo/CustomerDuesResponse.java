package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CustomerDuesResponse {

	private Integer sNo;
	private String loanId;
	private String customerId;
	private String customerName;
	private String customerPhoneNumber;
	private String guarentorId;
	private String guarentorName;
	private String guarentorPhoneNumber;
	private String partnerId;
	private String partnerName;
	private String partnerPhoneNumber;
	private LocalDate startDate;
	private LocalDate endDate;
	private BigDecimal amount;
	private Integer duration;
	private BigDecimal installmentPerMonth;
	private BigDecimal totalInstallmentAmountPaid;
	private Integer noOfEmisPaid;
	private BigDecimal installmentAmountPending;
	private Integer noOfEmisPending;
	private LocalDate dueDate;
	private String remarks;
	private String loanType;

	public Integer getsNo() {
		return sNo;
	}

	public void setsNo(Integer sNo) {
		this.sNo = sNo;
	}

	public String getLoanId() {
		return loanId;
	}

	public void setLoanId(String loanId) {
		this.loanId = loanId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getGuarentorName() {
		return guarentorName;
	}

	public void setGuarentorName(String guarentorName) {
		this.guarentorName = guarentorName;
	}

	public String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public BigDecimal getInstallmentPerMonth() {
		return installmentPerMonth;
	}

	public void setInstallmentPerMonth(BigDecimal installmentPerMonth) {
		this.installmentPerMonth = installmentPerMonth;
	}

	public BigDecimal getTotalInstallmentAmountPaid() {
		return totalInstallmentAmountPaid;
	}

	public void setTotalInstallmentAmountPaid(BigDecimal totalInstallmentAmountPaid) {
		this.totalInstallmentAmountPaid = totalInstallmentAmountPaid;
	}

	public Integer getNoOfEmisPaid() {
		return noOfEmisPaid;
	}

	public void setNoOfEmisPaid(Integer noOfEmisPaid) {
		this.noOfEmisPaid = noOfEmisPaid;
	}

	public BigDecimal getInstallmentAmountPending() {
		return installmentAmountPending;
	}

	public void setInstallmentAmountPending(BigDecimal installmentAmountPending) {
		this.installmentAmountPending = installmentAmountPending;
	}

	public Integer getNoOfEmisPending() {
		return noOfEmisPending;
	}

	public void setNoOfEmisPending(Integer noOfEmisPending) {
		this.noOfEmisPending = noOfEmisPending;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getLoanType() {
		return loanType;
	}

	public void setLoanType(String loanType) {
		this.loanType = loanType;
	}

	public String getCustomerPhoneNumber() {
		return customerPhoneNumber;
	}

	public void setCustomerPhoneNumber(String customerPhoneNumber) {
		this.customerPhoneNumber = customerPhoneNumber;
	}

	public String getGuarentorPhoneNumber() {
		return guarentorPhoneNumber;
	}

	public void setGuarentorPhoneNumber(String guarentorPhoneNumber) {
		this.guarentorPhoneNumber = guarentorPhoneNumber;
	}

	public String getPartnerPhoneNumber() {
		return partnerPhoneNumber;
	}

	public void setPartnerPhoneNumber(String partnerPhoneNumber) {
		this.partnerPhoneNumber = partnerPhoneNumber;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getGuarentorId() {
		return guarentorId;
	}

	public void setGuarentorId(String guarentorId) {
		this.guarentorId = guarentorId;
	}

	public String getPartnerId() {
		return partnerId;
	}

	public void setPartnerId(String partnerId) {
		this.partnerId = partnerId;
	}

}
