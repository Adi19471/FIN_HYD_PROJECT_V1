package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.List;

import com.balaji.finance.dto.BusinessOverviewProjection;

public class BusinessOverviewResponsePojo {

	private List<BusinessSharePojo> loanDisbursedInformation;
	private List<BusinessOverviewProjection> businessOverviewProjections;
	
	private BigDecimal totalShares;
	private BigDecimal openingBalance;
	private BigDecimal closingBalance;
	
	
	public List<BusinessSharePojo> getLoanDisbursedInformation() {
		return loanDisbursedInformation;
	}

	public void setLoanDisbursedInformation(List<BusinessSharePojo> loanDisbursedInformation) {
		this.loanDisbursedInformation = loanDisbursedInformation;
	}

	public List<BusinessOverviewProjection> getBusinessOverviewProjections() {
		return businessOverviewProjections;
	}

	public void setBusinessOverviewProjections(List<BusinessOverviewProjection> businessOverviewProjections) {
		this.businessOverviewProjections = businessOverviewProjections;
	}


	public BigDecimal getTotalShares() {
		return totalShares;
	}

	public void setTotalShares(BigDecimal totalShares) {
		this.totalShares = totalShares;
	}

	public BigDecimal getOpeningBalance() {
		return openingBalance;
	}

	public void setOpeningBalance(BigDecimal openingBalance) {
		this.openingBalance = openingBalance;
	}

	public BigDecimal getClosingBalance() {
		return closingBalance;
	}

	public void setClosingBalance(BigDecimal closingBalance) {
		this.closingBalance = closingBalance;
	}

	
	
}
