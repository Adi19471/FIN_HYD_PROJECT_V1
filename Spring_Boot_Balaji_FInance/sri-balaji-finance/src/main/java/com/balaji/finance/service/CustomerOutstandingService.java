package com.balaji.finance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.CustomerOutstandingProjection;
import com.balaji.finance.pojo.CustomerOutstandingRequest;
import com.balaji.finance.pojo.CustomerOutstandingView;
import com.balaji.finance.repo.BusinessMemberRepository;

@Service
public class CustomerOutstandingService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	public List<CustomerOutstandingView> loadCustomerOutstandingView(
			CustomerOutstandingRequest customerOutstandingRequest) {

		List<String> loanTypes = new ArrayList<String>();

		if (customerOutstandingRequest.isLoadDailyFinanceTransactions()) {
			loanTypes.add("DAILY_FINANCE");
		}

		if (customerOutstandingRequest.isLoadMonthlyFinanceTransactions()) {
			loanTypes.add("MONTHLY_FINANCE");
		}

		if (loanTypes.isEmpty()) {
			loanTypes.add("DAILY_FINANCE");
			loanTypes.add("MONTHLY_FINANCE");
		}
		List<CustomerOutstandingProjection> customerOutstandingProjectionList = businessMemberRepository
				.customerLoansOverview(loanTypes, customerOutstandingRequest.getSelectedDate().atTime(23, 59, 59));

		List<CustomerOutstandingView> customerOutstandingViewList = new ArrayList<CustomerOutstandingView>();

		int sno = 0;
		for (CustomerOutstandingProjection customerOutstandingProjection : customerOutstandingProjectionList) {

			CustomerOutstandingView customerOutstandingView = new CustomerOutstandingView();
			customerOutstandingView.setsNo(++sno);
			customerOutstandingView.setCustomerId(customerOutstandingProjection.getPersonInfoId());
			customerOutstandingView.setCustomerName(customerOutstandingProjection.getPersonName());
			customerOutstandingView.setNoOfLoans(customerOutstandingProjection.getNoOfLoans());
			customerOutstandingView.setTotalLoansAmount(customerOutstandingProjection.getTotalLoansAmount());
			customerOutstandingView.setTotalPaidAmount(customerOutstandingProjection.getTotalPaidAmount());
			customerOutstandingView.setBalanceOutstanding(customerOutstandingProjection.getTotalLoansAmount()
					.subtract(customerOutstandingProjection.getTotalPaidAmount()));
			customerOutstandingView.setDueDateOutstanding(BigDecimal.ZERO);

			customerOutstandingViewList.add(customerOutstandingView);
		}

		return customerOutstandingViewList;
	}

}
