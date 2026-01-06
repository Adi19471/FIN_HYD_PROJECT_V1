package com.balaji.finance.masterInfo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CashBookBK")
public class CashBookBK {

	@Id
	@Column(name = "ID")
	private Double id;

	@Column(name = "LineNo")
	private Integer lineNo;

	@Column(name = "TRANSDate")
	private LocalDateTime transDate;

	@Column(name = "SYSDATE")
	private LocalDateTime sysDate;

	@Column(name = "ACCOUNTNO")
	private String accountNo;

	@Column(name = "TRANSTYPE")
	private String transType;

	@Column(name = "CUSTOMERID")
	private String customerId;

	@Column(name = "PARTICULARS")
	private String particulars;

	@Column(name = "CREDIT")
	private Double credit;

	@Column(name = "DEBIT")
	private Double debit;

	@Column(name = "USER")
	private String user;

	@Column(name = "RECEIPTREMARKS")
	private String receiptRemarks;

	@Column(name = "BMREMARKS")
	private String bmRemarks;

	@Column(name = "DELETEDDATE")
	private LocalDateTime deletedDate;

	@Column(name = "DELETEDBY")
	private String deletedBy;

	@Column(name = "COMMENTS")
	private String comments;

	public Double getId() {
		return id;
	}

	public void setId(Double id) {
		this.id = id;
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

	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public String getTransType() {
		return transType;
	}

	public void setTransType(String transType) {
		this.transType = transType;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getParticulars() {
		return particulars;
	}

	public void setParticulars(String particulars) {
		this.particulars = particulars;
	}

	public Double getCredit() {
		return credit;
	}

	public void setCredit(Double credit) {
		this.credit = credit;
	}

	public Double getDebit() {
		return debit;
	}

	public void setDebit(Double debit) {
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

}
