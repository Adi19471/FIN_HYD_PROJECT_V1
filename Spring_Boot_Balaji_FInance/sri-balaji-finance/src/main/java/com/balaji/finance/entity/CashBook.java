package com.balaji.finance.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "CASH_BOOK", indexes = {
		@Index(name = "idx_cb_member_code", columnList = "BUSINESS_MEMBER_ID, ACCOUNT_MASTER_CODE"),
		@Index(name = "idx_cb_code_date", columnList = "ACCOUNT_MASTER_CODE, TRANS_DATE"),
		@Index(name = "idx_cb_date_type", columnList = "TRANS_DATE, ACCOUNT_MASTER_TYPE"),
		@Index(name = "idx_cb_person_code", columnList = "PERSONAL_INFO_ID, ACCOUNT_MASTER_CODE"),
		@Index(name = "idx_cb_user_date", columnList = "ENTRY_USER, TRANS_DATE"),
		@Index(name = "idx_cb_payment_ref", columnList = "PAYMENT_REF_ID") })
@EntityListeners(AuditingEntityListener.class)
public class CashBook {

	@Id
	@Column(name = "CASH_BOOK_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cashBookId;

	@Column(name = "LINE_NO")
	private Integer lineNo;

	@Column(name = "TRANS_DATE")
	private LocalDateTime transDate;

	@CreationTimestamp
	@Column(name = "SYS_DATE", updatable = false)
	private LocalDateTime sysDate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PERSONAL_INFO_ID")
	private PersonalInfo personalInfo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BUSINESS_MEMBER_ID")
	private BusinessMember businessMember;

	@Column(name = "CREDIT", nullable = false)
	private BigDecimal credit = BigDecimal.ZERO;

	@Column(name = "DEBIT", nullable = false)
	private BigDecimal debit = BigDecimal.ZERO;

	@Column(name = "ENTRY_USER")
	private String user;

	@Column(name = "RECEIPT_REMARKS")
	private String receiptRemarks;

	@Column(name = "BM_REMARKS")
	private String bmRemarks;

	@Column(name = "ACCOUNT_MASTER_TYPE")
	private String accountMastertype;

	@Column(name = "ACCOUNT_MASTER_MASTER_CODE")
	private String accountMasterMasterCode;

	@Column(name = "ACCOUNT_MASTER_CODE")
	private String accountMasterCode;

	@CreatedDate
	@Column(updatable = false)
	private LocalDateTime createdDate;

	@LastModifiedDate
	private LocalDateTime modifiedDate;

	@CreatedBy
	@Column(updatable = false)
	private String createdBy;

	@LastModifiedBy
	private String modifiedBy;
	
	
	@Column(name = "PAYMENT_REF_ID")
	private String paymentRefId;

	public Long getCashBookId() {
		return cashBookId;
	}

	public void setCashBookId(Long cashBookId) {
		this.cashBookId = cashBookId;
	}

	public Integer getLineNo() {
		return lineNo;
	}

	public void setLineNo(Integer lineNo) {
		this.lineNo = lineNo;
	}

	public LocalDateTime getTransDate() {
		return transDate;
	}

	public void setTransDate(LocalDateTime transDate) {
		this.transDate = transDate;
	}

	public LocalDateTime getSysDate() {
		return sysDate;
	}

	public void setSysDate(LocalDateTime sysDate) {
		this.sysDate = sysDate;
	}

	public PersonalInfo getPersonalInfo() {
		return personalInfo;
	}

	public void setPersonalInfo(PersonalInfo personalInfo) {
		this.personalInfo = personalInfo;
	}

	public BusinessMember getBusinessMember() {
		return businessMember;
	}

	public void setBusinessMember(BusinessMember businessMember) {
		this.businessMember = businessMember;
	}

	public BigDecimal getCredit() {
		return credit;
	}

	public void setCredit(BigDecimal credit) {
		this.credit = credit;
	}

	public BigDecimal getDebit() {
		return debit;
	}

	public void setDebit(BigDecimal debit) {
		this.debit = debit;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getReceiptRemarks() {
		return receiptRemarks;
	}

	public void setReceiptRemarks(String receiptRemarks) {
		this.receiptRemarks = receiptRemarks;
	}

	public String getBmRemarks() {
		return bmRemarks;
	}

	public void setBmRemarks(String bmRemarks) {
		this.bmRemarks = bmRemarks;
	}

	public String getAccountMastertype() {
		return accountMastertype;
	}

	public void setAccountMastertype(String accountMastertype) {
		this.accountMastertype = accountMastertype;
	}

	public String getAccountMasterMasterCode() {
		return accountMasterMasterCode;
	}

	public void setAccountMasterMasterCode(String accountMasterMasterCode) {
		this.accountMasterMasterCode = accountMasterMasterCode;
	}

	public String getAccountMasterCode() {
		return accountMasterCode;
	}

	public void setAccountMasterCode(String accountMasterCode) {
		this.accountMasterCode = accountMasterCode;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public LocalDateTime getModifiedDate() {
		return modifiedDate;
	}

	public void setModifiedDate(LocalDateTime modifiedDate) {
		this.modifiedDate = modifiedDate;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public String getPaymentRefId() {
		return paymentRefId;
	}

	public void setPaymentRefId(String paymentRefId) {
		this.paymentRefId = paymentRefId;
	}

	
}
