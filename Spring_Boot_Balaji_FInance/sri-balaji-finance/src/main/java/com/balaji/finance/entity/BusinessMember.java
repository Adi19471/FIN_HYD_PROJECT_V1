package com.balaji.finance.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "BUSINESS_MEMBER")
public class BusinessMember {

	@Id
	@Column(name = "BUSINESS_MEMBER_ID", length = 255, nullable = false)
	private String businessMemberId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CUSTOMER_ID")
	private PersonalInfo customerId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "GUARANTOR1_ID")
	private PersonalInfo guarantor1;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "GUARANTOR2_ID")
	private PersonalInfo guarantor2;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "GUARANTOR23ID")
	private PersonalInfo guarantor3;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARTNER_ID")
	private PersonalInfo partnerId;

	@Column(name = "START_DATE")
	private LocalDateTime startDate;

	@Column(name = "END_DATE")
	private LocalDateTime endDate;

	@Column(name = "AMOUNT")
	private BigDecimal amount;

	@Column(name = "DURATION")
	private Integer duration;

	@Column(name = "INTEREST")
	private BigDecimal interest;

	@Column(name = "INSTALLMENT")
	private BigDecimal installment;

	@Column(name = "SECURITY", length = 255)
	private String security;

	@Column(name = "STATUS")
	private boolean status;

	@Column(name = "PAID_INSTALLMENTS")
	private Integer paidInstallments;

	@Column(name = "PART_PRINCIPAL")
	private Integer partPrincipal;

	@Column(name = "PART_INTEREST")
	private Integer partInterest;

	@Column(name = "UNPAID_LATE_FEE")
	private BigDecimal unpaidLateFee;

	@Column(name = "CHEQUE_REMINDER")
	private boolean chequeReminder;

	@Column(name = "BUSINESS_ID")
	private String businessId;

	@Column(name = "LOAN_STATUS")
	private String loanStatus;

	@CreationTimestamp
	@Column(name = "SYS_DATE", updatable = false)
	private LocalDateTime sysDate;

	public String getLoanStatus() {
		return loanStatus;
	}

	public void setLoanStatus(String loanStatus) {
		this.loanStatus = loanStatus;
	}

	public String getBusinessMemberId() {
		return businessMemberId;
	}

	public void setBusinessMemberId(String businessMemberId) {
		this.businessMemberId = businessMemberId;
	}

	public PersonalInfo getCustomerId() {
		return customerId;
	}

	public void setCustomerId(PersonalInfo customerId) {
		this.customerId = customerId;
	}

	public PersonalInfo getGuarantor1() {
		return guarantor1;
	}

	public void setGuarantor1(PersonalInfo guarantor1) {
		this.guarantor1 = guarantor1;
	}

	public PersonalInfo getGuarantor2() {
		return guarantor2;
	}

	public void setGuarantor2(PersonalInfo guarantor2) {
		this.guarantor2 = guarantor2;
	}

	public PersonalInfo getGuarantor3() {
		return guarantor3;
	}

	public void setGuarantor3(PersonalInfo guarantor3) {
		this.guarantor3 = guarantor3;
	}

	public PersonalInfo getPartnerId() {
		return partnerId;
	}

	public void setPartnerId(PersonalInfo partnerId) {
		this.partnerId = partnerId;
	}

	public LocalDateTime getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDateTime startDate) {
		this.startDate = startDate;
	}

	public LocalDateTime getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDateTime endDate) {
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

	public BigDecimal getInterest() {
		return interest;
	}

	public void setInterest(BigDecimal interest) {
		this.interest = interest;
	}

	public BigDecimal getInstallment() {
		return installment;
	}

	public void setInstallment(BigDecimal installment) {
		this.installment = installment;
	}

	public String getSecurity() {
		return security;
	}

	public void setSecurity(String security) {
		this.security = security;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public Integer getPaidInstallments() {
		return paidInstallments;
	}

	public void setPaidInstallments(Integer paidInstallments) {
		this.paidInstallments = paidInstallments;
	}

	public Integer getPartPrincipal() {
		return partPrincipal;
	}

	public void setPartPrincipal(Integer partPrincipal) {
		this.partPrincipal = partPrincipal;
	}

	public Integer getPartInterest() {
		return partInterest;
	}

	public void setPartInterest(Integer partInterest) {
		this.partInterest = partInterest;
	}

	public BigDecimal getUnpaidLateFee() {
		return unpaidLateFee;
	}

	public void setUnpaidLateFee(BigDecimal unpaidLateFee) {
		this.unpaidLateFee = unpaidLateFee;
	}

	public boolean isChequeReminder() {
		return chequeReminder;
	}

	public void setChequeReminder(boolean chequeReminder) {
		this.chequeReminder = chequeReminder;
	}

	public String getBusinessId() {
		return businessId;
	}

	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}

	public LocalDateTime getSysDate() {
		return sysDate;
	}

	public void setSysDate(LocalDateTime sysDate) {
		this.sysDate = sysDate;
	}

}
