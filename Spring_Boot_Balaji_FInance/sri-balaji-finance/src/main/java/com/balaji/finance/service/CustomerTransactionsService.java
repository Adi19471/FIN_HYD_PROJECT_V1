package com.balaji.finance.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.CustomerTransactionsProjection;
import com.balaji.finance.pojo.CustomerTransactionsRequest;
import com.balaji.finance.pojo.CustomerTransactionsResponse;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class CustomerTransactionsService {

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<CustomerTransactionsResponse> getCustomerTransactionsOnAccountMasterCode(
			CustomerTransactionsRequest customerTransactionsRequest) {

		List<CustomerTransactionsResponse> returnList = new ArrayList<CustomerTransactionsResponse>();
		List<CustomerTransactionsProjection> customerTransactionsOnAccountMasterCode = new ArrayList<>();
		if (customerTransactionsRequest.getFromDate() != null && customerTransactionsRequest.getToDate() != null) {

			LocalDateTime from = customerTransactionsRequest.getFromDate().atStartOfDay();
			LocalDateTime to = customerTransactionsRequest.getToDate().atTime(23, 59, 59);
			customerTransactionsOnAccountMasterCode = cashBookRepo
					.getCustomerTransactionsOnAccountMasterCodeAndDateRange(
							customerTransactionsRequest.getAccountCode(), customerTransactionsRequest.getCustomerId(),
							from, to);

		} else {

			customerTransactionsOnAccountMasterCode = cashBookRepo.getCustomerTransactionsOnAccountMasterCode(
					customerTransactionsRequest.getAccountCode(), customerTransactionsRequest.getCustomerId());

		}

		int sno = 0;
		for (CustomerTransactionsProjection customerTransactionsProjection : customerTransactionsOnAccountMasterCode) {
			
			CustomerTransactionsResponse customerTransactionsResponse = new CustomerTransactionsResponse();
			customerTransactionsResponse.setSno(++sno);
			customerTransactionsResponse.setTransactionId(customerTransactionsProjection.getCashBookId());
			customerTransactionsResponse
					.setTransactionDate(customerTransactionsProjection.getTransDate().toLocalDate());
			customerTransactionsResponse.setAccountNumber(customerTransactionsProjection.getBusinessMemberId() != null
					? customerTransactionsProjection.getBusinessMemberId()
					: "");
			customerTransactionsResponse.setTransactionName(customerTransactionsProjection.getAccountMasterCode());
			customerTransactionsResponse.setParticulars(customerTransactionsProjection.getBmRemarks());
			customerTransactionsResponse.setCredit(customerTransactionsProjection.getCredit());
			customerTransactionsResponse.setDebit(customerTransactionsProjection.getDebit());

			

			returnList.add(customerTransactionsResponse);
		}
		return returnList;

	}

}
