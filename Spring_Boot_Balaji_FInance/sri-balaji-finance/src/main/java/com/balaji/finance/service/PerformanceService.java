package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.PartnerPerformanceReport;
import com.balaji.finance.pojo.PerformanceResponsePojo;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class PerformanceService {

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<PerformanceResponsePojo> getPerformanceOfPartner(LocalDate fromDate, LocalDate toDate) {

		boolean isDateRange = fromDate != null && toDate != null;

		List<PartnerPerformanceReport> reports;

		if (isDateRange) {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			reports = cashBookRepo.getLoanSummaryOfPartnersOfDateRange(from, to);

		} else {

			reports = cashBookRepo.getLoanSummaryOfPartners();
		}

		List<PerformanceResponsePojo> responseList = new ArrayList<>();
		
		int sno = 0;
		
		for (PartnerPerformanceReport report : reports) {

			BigDecimal disbursedAmount = defaultValue(report.getDisbursedAmount());

			BigDecimal installments = defaultValue(report.getLoanInstallmentsReceived());

			BigDecimal interest = defaultValue(report.getInterestReceived());

			BigDecimal documentCharges = defaultValue(report.getDocumentCharges());

			BigDecimal income = interest.add(documentCharges);

			PerformanceResponsePojo response = new PerformanceResponsePojo();
			response.setSno(++sno);
			response.setPartnerId(report.getId());

			response.setName((report.getFirstName() != null ? report.getFirstName() : "") + " "
					+ (report.getLastName() != null ? report.getLastName() : ""));

			response.setLoansDisbursed(disbursedAmount);
			response.setLoansPayment(installments);
			response.setInterest(interest);
			response.setDocumentCharges(documentCharges);
			response.setLateFee(BigDecimal.ZERO);
			response.setIncome(income);

			responseList.add(response);
		}

		return responseList;
	}

	private BigDecimal defaultValue(BigDecimal value) {
		return value != null ? value : BigDecimal.ZERO;
	}
}