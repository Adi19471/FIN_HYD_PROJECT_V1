package com.balaji.finance.pojo;

import java.math.BigDecimal;

public class PartnerLoanLimitResponse {

	private int sno;
	private String account;
	private String partnerName;
	private BigDecimal authLimit;
	private BigDecimal currentLimit;

	public int getSno() {
		return sno;
	}

	public void setSno(int sno) {
		this.sno = sno;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}

	public BigDecimal getAuthLimit() {
		return authLimit;
	}

	public void setAuthLimit(BigDecimal authLimit) {
		this.authLimit = authLimit;
	}

	public BigDecimal getCurrentLimit() {
		return currentLimit;
	}

	public void setCurrentLimit(BigDecimal currentLimit) {
		this.currentLimit = currentLimit;
	}

}
