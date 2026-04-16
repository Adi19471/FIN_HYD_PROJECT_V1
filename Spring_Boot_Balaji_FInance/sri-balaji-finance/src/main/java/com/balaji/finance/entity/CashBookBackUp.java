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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Immutable
@Entity
@Table(name = "CASH_BOOK_BACKUP")
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

	@Column(name = "TRANS_TYPE", length = 100)
	private String transType;

	@Column(name = "PARTICULARS", length = 255)
	private String particulars;

	@Column(name = "CREDIT", precision = 19, scale = 2)
	private BigDecimal credit = BigDecimal.ZERO;

	@Column(name = "DEBIT", precision = 19, scale = 2)
	private BigDecimal debit = BigDecimal.ZERO;

	@Column(name = "ENTRY_USER", length = 100)
	private String entryUser;

	@Column(name = "RECEIPT_REMARKS", length = 500)
	private String receiptRemarks;

	@Column(name = "BM_REMARKS", length = 500)
	private String bmRemarks;

	@Column(name = "CURRENT_INSTALLMENT_NUMBER")
	private Integer currentInstallmentNumber;

	@Column(name = "PENDING_BALANCE", precision = 19, scale = 2)
	private BigDecimal pendingBalance;

	@CreationTimestamp
	@Column(name = "DELETEDDATE", updatable = false)
	private LocalDateTime deletedDate;

	@Column(name = "DELETEDBY", length = 255)
	private String deletedBy;

	@Column(name = "COMMENTS", length = 255)
	private String comments;

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

	public String getTransType() {
		return transType;
	}

	public void setTransType(String transType) {
		this.transType = transType;
	}

	public String getParticulars() {
		return particulars;
	}

	public void setParticulars(String particulars) {
		this.particulars = particulars;
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

	public Integer getCurrentInstallmentNumber() {
		return currentInstallmentNumber;
	}

	public void setCurrentInstallmentNumber(Integer currentInstallmentNumber) {
		this.currentInstallmentNumber = currentInstallmentNumber;
	}

	public BigDecimal getPendingBalance() {
		return pendingBalance;
	}

	public void setPendingBalance(BigDecimal pendingBalance) {
		this.pendingBalance = pendingBalance;
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

	
}