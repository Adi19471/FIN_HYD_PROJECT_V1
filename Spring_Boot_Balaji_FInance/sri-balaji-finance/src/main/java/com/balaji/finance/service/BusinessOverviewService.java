package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BusinessOverviewProjection;
import com.balaji.finance.dto.LoanCollectionProjection;
import com.balaji.finance.dto.LoanSummaryProjection;
import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.pojo.BusinessOverviewResponsePojo;
import com.balaji.finance.pojo.BusinessSharePojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class BusinessOverviewService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	
	@Autowired
	private CashBookRepo cashBookRepo;

	public BusinessOverviewResponsePojo getBusinessOverViewByDateRange(LocalDate fromDate, LocalDate toDate,boolean excludeDividends,boolean accruedRevenue) {

		List<BusinessSharePojo> loanDisbursedInformation = getAllLoansDisbursedByDateRange(fromDate, toDate);
		List<BusinessOverviewProjection> businessOverviewTrasncDate = getBusinessOverviewTrasncDate(fromDate, toDate, excludeDividends, accruedRevenue);

		BusinessOverviewResponsePojo businessOverviewResponsePojo = new BusinessOverviewResponsePojo();
		businessOverviewResponsePojo.setLoanDisbursedInformation(loanDisbursedInformation);
		businessOverviewResponsePojo.setBusinessOverviewProjections(businessOverviewTrasncDate);
		businessOverviewResponsePojo.setTotalShares(personalInfoRepository.findTotalShares());	
		
		
		businessOverviewResponsePojo.setOpeningBalance(BigDecimal.ZERO);
		businessOverviewResponsePojo.setClosingBalance(BigDecimal.ZERO);
		
		return businessOverviewResponsePojo;
	}

	public BusinessOverviewResponsePojo getBusinessOverView(boolean excludeDividends,boolean accruedRevnue) {

		List<BusinessSharePojo> loanDisbursedInformation = getAllLoansDisbursed();
		List<BusinessOverviewProjection> businessOverviewTrasncDate = getBusinessOverviewStatement(excludeDividends, accruedRevnue);

		BusinessOverviewResponsePojo businessOverviewResponsePojo = new BusinessOverviewResponsePojo();
		businessOverviewResponsePojo.setLoanDisbursedInformation(loanDisbursedInformation);
		businessOverviewResponsePojo.setBusinessOverviewProjections(businessOverviewTrasncDate);

		return businessOverviewResponsePojo;
	}

	public List<BusinessSharePojo> getAllLoansDisbursedByDateRange(LocalDate fromDate, LocalDate toDate) {

		List<BusinessSharePojo> loanDisbursedInformation = new ArrayList<>();

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<LoanSummaryProjection> allLoansDisbursedByDateRange = businessMemberRepository
				.findAllLoansDisbursedByDateRange(from, to);
		LoanCollectionProjection loanCollectionData = cashBookRepo.getLoanCollectionDataByDateRange(from, to);

		loanDisbursedInformation = setLoanDisbursedInformation(allLoansDisbursedByDateRange, loanCollectionData);

		return loanDisbursedInformation;

	}

	public List<BusinessSharePojo> getAllLoansDisbursed() {

		List<BusinessSharePojo> loanDisbursedInformation = new ArrayList<>();

		List<LoanSummaryProjection> allLoansDisbursedByDateRange = businessMemberRepository.findAllLoansDisbursed();
		LoanCollectionProjection loanCollectionData = cashBookRepo.getLoanCollectionData();

		loanDisbursedInformation = setLoanDisbursedInformation(allLoansDisbursedByDateRange, loanCollectionData);

		return loanDisbursedInformation;

	}

	public List<BusinessSharePojo> setLoanDisbursedInformation(List<LoanSummaryProjection> allLoansDisbursedByDateRange,
			LoanCollectionProjection loanCollectionData) {

		List<BusinessSharePojo> loanDisbursedInformation = new ArrayList<>();

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

			loanDisbursedInformation.add(businessSharePojo);
		}

		return loanDisbursedInformation;

	}

	public List<BusinessOverviewProjection> getBusinessOverviewTrasncDate(LocalDate fromDate, LocalDate toDate,
			boolean excludeDividends, boolean accruedRevenue) {

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<BusinessOverviewProjection> businessOverviewTrasncDate = cashBookRepo.getBusinessOverviewTrasncDate(from,
				to, Arrays.asList("EXPENSES", "REVENUES"));

		if (excludeDividends) {
			businessOverviewTrasncDate = businessOverviewTrasncDate.stream()
					.filter(p -> !p.getMasterCode().equalsIgnoreCase("DIVIDENDS")).collect(Collectors.toList());
		}

		if (!accruedRevenue) {
			businessOverviewTrasncDate = businessOverviewTrasncDate.stream()
					.filter(p -> !p.getMasterCode().equalsIgnoreCase("INTEREST")).collect(Collectors.toList());
		}

		return businessOverviewTrasncDate;
	}

	public List<BusinessOverviewProjection> getBusinessOverviewStatement(boolean excludeDividends,
			boolean accruedRevenue) {

		List<BusinessOverviewProjection> businessOverviewTrasncDate = cashBookRepo
				.getBusinessOverviewStatement(Arrays.asList("EXPENSES", "REVENUES"));

		if (excludeDividends) {
			businessOverviewTrasncDate = businessOverviewTrasncDate.stream()
					.filter(p -> !p.getMasterCode().equalsIgnoreCase("DIVIDENDS")).collect(Collectors.toList());
		}

		if (!accruedRevenue) {
			businessOverviewTrasncDate = businessOverviewTrasncDate.stream()
					.filter(p -> !p.getMasterCode().equalsIgnoreCase("INTEREST")).collect(Collectors.toList());
		}

		return businessOverviewTrasncDate;

	}

}
