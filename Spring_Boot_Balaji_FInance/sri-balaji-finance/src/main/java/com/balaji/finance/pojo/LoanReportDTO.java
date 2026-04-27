package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class LoanReportDTO {

	private int sno;
	private String loanId;
	private String customerName;
	private String guarentorName;
	private String partnerName;
	private String startDate;
	private String endDate;
	private BigDecimal amount;
	private BigDecimal principleAmountPaid;
	private int noofInstallmentsPaid;
	private BigDecimal installmentDue;
	private String status;
	private String remarks;
	private BigDecimal interestAmount;
	private BigDecimal interestAmountPaid;

	public int getSno() {
		return sno;
	}

	public void setSno(int sno) {
		this.sno = sno;
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

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	
	public BigDecimal getPrincipleAmountPaid() {
		return principleAmountPaid;
	}

	public void setPrincipleAmountPaid(BigDecimal principleAmountPaid) {
		this.principleAmountPaid = principleAmountPaid;
	}

	public int getNoofInstallmentsPaid() {
		return noofInstallmentsPaid;
	}

	public void setNoofInstallmentsPaid(int noofInstallmentsPaid) {
		this.noofInstallmentsPaid = noofInstallmentsPaid;
	}

	public BigDecimal getInstallmentDue() {
		return installmentDue;
	}

	public void setInstallmentDue(BigDecimal installmentDue) {
		this.installmentDue = installmentDue;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public BigDecimal getInterestAmount() {
		return interestAmount;
	}

	public void setInterestAmount(BigDecimal interestAmount) {
		this.interestAmount = interestAmount;
	}

	public BigDecimal getInterestAmountPaid() {
		return interestAmountPaid;
	}

	public void setInterestAmountPaid(BigDecimal interestAmountPaid) {
		this.interestAmountPaid = interestAmountPaid;
	}

}
