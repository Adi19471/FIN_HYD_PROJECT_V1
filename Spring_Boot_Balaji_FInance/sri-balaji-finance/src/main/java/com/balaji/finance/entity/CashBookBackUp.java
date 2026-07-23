package com.balaji.finance.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Immutable;
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

@Immutable
@Entity
@Table(name = "CASH_BOOK_BACKUP", indexes = {
		@Index(name = "idx_cbb_trans_date", columnList = "TRANS_DATE") })
@EntityListeners(AuditingEntityListener.class)
public class CashBookBackUp {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CASH_BOOK_BACKUP_ID")
	private Long cashBookBackUpId;

	@Column(name = "CASH_BOOK_OLD_ID", nullable = false)
	private Long cashBookOldId;

	@Column(name = "LINE_NO")
	private Integer lineNo;

	@Column(name = "TRANS_DATE")
	private LocalDateTime transDate;

	@Column(name = "SYS_DATE")
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

	@Column(name = "ENTRY_USER", length = 100)
	private String entryUser;

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

	@CreationTimestamp
	@Column(name = "DELETEDDATE", updatable = false)
	private LocalDateTime deletedDate;

	@Column(name = "DELETEDBY", length = 255)
	private String deletedBy;

	@Column(name = "COMMENTS", length = 255)
	private String comments;

	/* ===================== GETTERS & SETTERS ===================== */

	public Long getCashBookBackUpId() {
		return cashBookBackUpId;
	}

	public void setCashBookBackUpId(Long cashBookBackUpId) {
		this.cashBookBackUpId = cashBookBackUpId;
	}

	public Long getCashBookOldId() {
		return cashBookOldId;
	}

	public void setCashBookOldId(Long cashBookOldId) {
		this.cashBookOldId = cashBookOldId;
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

	public String getEntryUser() {
		return entryUser;
	}

	public void setEntryUser(String entryUser) {
		this.entryUser = entryUser;
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

	public LocalDateTime getDeletedDate() {
		return deletedDate;
	}

	public void setDeletedDate(LocalDateTime deletedDate) {
		this.deletedDate = deletedDate;
	}

	public String getDeletedBy() {
		return deletedBy;
	}

	public void setDeletedBy(String deletedBy) {
		this.deletedBy = deletedBy;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
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

}