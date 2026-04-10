package com.balaji.finance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.CustomerDuesProjection;
import com.balaji.finance.pojo.CustomerDuesResponse;
import com.balaji.finance.repo.BusinessMemberRepository;

@Service
public class CustomerDuesService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	public List<CustomerDuesResponse> getAllLoansOnCustomer(String customerId) {

		List<CustomerDuesProjection> allLoansOnCustomer = businessMemberRepository.getAllLoansOnCustomer(customerId);
		List<CustomerDuesResponse> returnList = new ArrayList<>();
		System.out.println(allLoansOnCustomer);
		int sno = 0;

		for (CustomerDuesProjection p : allLoansOnCustomer) {

			CustomerDuesResponse res = new CustomerDuesResponse();

			// Serial No
			res.setsNo(++sno);

			// Basic Loan Info
			res.setLoanId(p.getBusinessMemberId());
			res.setCustomerId(p.getCustomerId());
			res.setCustomerName(p.getCustomerFirstName());
			res.setCustomerPhoneNumber(p.getCustomerPhoneNumber());

			// Guarantor
			res.setGuarentorId(p.getGuarentorId());
			res.setGuarentorName(p.getGuarentorFirstName());
			res.setGuarentorPhoneNumber(p.getGuarentorPhoneNumber());

			// Partner
			res.setPartnerId(p.getPartnerId());
			res.setPartnerName(p.getPartnerFirstName());
			res.setPartnerPhoneNumber(p.getPartnerPhoneNumber());

			// Loan Details
			res.setStartDate(p.getStartDate().toLocalDate());
			res.setEndDate(p.getEndDate().toLocalDate());
			res.setAmount(p.getAmount());
			res.setDuration(p.getDuration());
			res.setInstallmentPerMonth(p.getInstallmentPerMonth());

			// Payments
			BigDecimal paid = p.getTotalInstallmentAmountPaid() != null ? p.getTotalInstallmentAmountPaid()
					: BigDecimal.ZERO;

			res.setTotalInstallmentAmountPaid(paid);
			res.setNoOfEmisPaid(p.getNoOfEmisPaid());

			BigDecimal totalAmount = p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO;
			BigDecimal pendingAmount = totalAmount.subtract(paid);

			res.setInstallmentAmountPending(pendingAmount);

			Integer totalEmis = p.getDuration() != null ? p.getDuration() : 0;
			Integer paidEmis = p.getNoOfEmisPaid() != null ? p.getNoOfEmisPaid() : 0;

			res.setNoOfEmisPending(totalEmis - paidEmis);

			if (p.getStartDate() != null && p.getNoOfEmisPaid() != null) {
				res.setDueDate(p.getStartDate().plusMonths(p.getNoOfEmisPaid()).toLocalDate());
			}

			res.setRemarks("");
			res.setLoanType(p.getLoanType());

			returnList.add(res);
		}

		return returnList;
	}

}
