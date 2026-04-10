package com.balaji.finance.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.CustomerReportProjection;
import com.balaji.finance.pojo.CustomerReportResponse;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class CustomerReportService {

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<CustomerReportResponse> getCustomerReportOnAccountCode(String accountCode) {

		List<CustomerReportProjection> customerReportOnAccountCode = cashBookRepo
				.getCustomerReportOnAccountCode(accountCode);

		List<CustomerReportResponse> returnList = new ArrayList<CustomerReportResponse>();

		int sno = 0;
		for (CustomerReportProjection customerReportProjection : customerReportOnAccountCode) {

			CustomerReportResponse customerReportResponse = new CustomerReportResponse();
			customerReportResponse.setSno(++sno);
			customerReportResponse.setCustomerId(customerReportProjection.getPersonalInfoId());
			customerReportResponse.setCustomerName(customerReportProjection.getCustomerName());
			customerReportResponse.setCredits(customerReportProjection.getCredits());
			customerReportResponse.setDebits(customerReportProjection.getDebits());
			customerReportResponse
					.setBalance(customerReportProjection.getCredits().subtract(customerReportProjection.getDebits()));
			returnList.add(customerReportResponse);

		}

		return returnList;

	}

}