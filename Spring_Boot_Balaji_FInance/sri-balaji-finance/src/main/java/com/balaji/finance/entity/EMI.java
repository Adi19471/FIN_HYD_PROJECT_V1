package com.balaji.finance.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "EMI")
public class EMI {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer emiId;

	@ManyToOne
	@JoinColumn(name = "business_member_id")
	private BusinessMember businessMember;

	private int installmentNumber;
	private BigDecimal principalAmount;
	private BigDecimal interestAmount;
	private BigDecimal totalAmount;

	private BigDecimal paidAmount = BigDecimal.ZERO;
	private LocalDateTime dueDate;
	private LocalDateTime paymentDate;

	private String status; // PENDING, PAID, LATE

	public BigDecimal getRemainingAmount() {
		return totalAmount.subtract(paidAmount);
	}

	public Integer getEmiId() {
		return emiId;
	}

	public void setEmiId(Integer emiId) {
		this.emiId = emiId;
	}

	public BusinessMember getBusinessMember() {
		return businessMember;
	}

	public void setBusinessMember(BusinessMember businessMember) {
		this.businessMember = businessMember;
	}

	public int getInstallmentNumber() {
		return installmentNumber;
	}

	public void setInstallmentNumber(int installmentNumber) {
		this.installmentNumber = installmentNumber;
	}

	public BigDecimal getPrincipalAmount() {
		return principalAmount;
	}

	public void setPrincipalAmount(BigDecimal principalAmount) {
		this.principalAmount = principalAmount;
	}

	public BigDecimal getInterestAmount() {
		return interestAmount;
	}

	public void setInterestAmount(BigDecimal interestAmount) {
		this.interestAmount = interestAmount;
	}

	public BigDecimal getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}

	public BigDecimal getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(BigDecimal paidAmount) {
		this.paidAmount = paidAmount;
	}

	public LocalDateTime getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}

	public LocalDateTime getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDateTime paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}