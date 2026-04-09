package com.balaji.finance.pojo;

import java.util.List;

import com.balaji.finance.dto.BusinessOverviewProjection;

public class BusinessOverviewResponsePojo {

	private List<BusinessSharePojo> loanDisbursedInformation;
	private List<BusinessOverviewProjection> businessOverviewProjections;

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

}
