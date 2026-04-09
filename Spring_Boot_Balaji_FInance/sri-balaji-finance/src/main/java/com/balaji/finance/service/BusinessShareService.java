package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.LoanCollectionProjection;
import com.balaji.finance.dto.LoanSummaryProjection;
import com.balaji.finance.pojo.BusinessSharePojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class BusinessShareService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<BusinessSharePojo> getBusinessShare(LocalDate fromDate, LocalDate toDate) {

		List<BusinessSharePojo> returnList = new ArrayList<>();

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<LoanSummaryProjection> allLoansDisbursedByDateRange = businessMemberRepository
				.findAllLoansDisbursedByDateRange(from, to);

		LoanCollectionProjection loanCollectionData = cashBookRepo.getLoanCollectionDataByDateRange(from, to);

		for (LoanSummaryProjection loanSummary : allLoansDisbursedByDateRange) {

			BusinessSharePojo businessSharePojo = new BusinessSharePojo();

			businessSharePojo.setLoanType(loanSummary.getLoanType());

			BigDecimal loansDisbursed = loanSummary.getLoansDisbursed() == null ? BigDecimal.ZERO
					: loanSummary.getLoansDisbursed();

			BigDecimal interestReceivable = loanSummary.getInterestReceivable() == null ? BigDecimal.ZERO
					: loanSummary.getInterestReceivable();

			businessSharePojo.setLoansDisbursed(loansDisbursed);
			businessSharePojo.setInterestReceivable(interestReceivable);

			businessSharePojo.setSumOfLoansDisbursedAndInterestReceivable(loansDisbursed.add(interestReceivable));

			if ("DAILY_FINANCE".equalsIgnoreCase(loanSummary.getLoanType())) {

				businessSharePojo.setLoansPaid(loanCollectionData.getDailyLoanInstallmentsReceived());

				businessSharePojo.setInterestPaid(loanCollectionData.getDailyLoanInterestReceived());

			} else if ("MONTHLY_FINANCE".equalsIgnoreCase(loanSummary.getLoanType())) {

				businessSharePojo.setLoansPaid(loanCollectionData.getMonthlyLoanInstallmentsReceived());

				businessSharePojo.setInterestPaid(loanCollectionData.getMonthlyLoanInterestReceived()); // FIXED HERE

			}

			returnList.add(businessSharePojo);
		}

		return returnList;
	}
}
