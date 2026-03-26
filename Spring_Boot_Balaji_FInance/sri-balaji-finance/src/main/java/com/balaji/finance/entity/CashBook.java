package com.balaji.finance.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "CASH_BOOK")
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
	private String accountMastercode;

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

	public String getAccountMastercode() {
		return accountMastercode;
	}

	public void setAccountMastercode(String accountMastercode) {
		this.accountMastercode = accountMastercode;
	}

	
}
