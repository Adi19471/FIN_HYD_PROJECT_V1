package com.balaji.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BalanceSheetProjection;
import com.balaji.finance.dto.LoanCollectionProjection;
import com.balaji.finance.dto.LoanSummaryProjection;
import com.balaji.finance.pojo.BusinessSharePojo;
import com.balaji.finance.pojo.BusinessShareResponsePojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class BusinessShareService {

	private static final String DAILY_FINANCE = "DAILY_FINANCE";
	private static final String MONTHLY_FINANCE = "MONTHLY_FINANCE";

	/**
	 * The account groups the value block is built from, spelled as the account
	 * master spells them - "FD DIPOSIT" included - with the sane spelling
	 * accepted alongside each.
	 *
	 * LOANS is named only so it can be left out of Other Assets: the balance
	 * sheet posts every disbursement there but never nets the repayments off,
	 * because those are credited to 'MF LOAN INSTALLMENT', whose type is LOANS
	 * rather than ASSETS. Its figure is what was lent, not what is still owed,
	 * so this report works the outstanding out from the loans themselves.
	 */
	
	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;


	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	/**
	 * The report: what was lent and collected inside the range, what is still
	 * outstanding as on its last day, and what the business is worth once its
	 * liabilities come off - divided by the partners' shares.
	 */
	public BusinessShareResponsePojo getBusinessShareStatement(LocalDate fromDate, LocalDate toDate) {

		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<BusinessSharePojo> loanInformation = getBusinessShare(fromDate, toDate);

		setOutstanding(loanInformation, to);

		BusinessShareResponsePojo response = new BusinessShareResponsePojo();
		response.setLoanInformation(loanInformation);

		setValueOfBusiness(response, loanInformation, to);

		return response;
	}

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

			BigDecimal loansDisbursed = nz(loanSummary.getLoansDisbursed());

			BigDecimal interestReceivable = nz(loanSummary.getInterestReceivable());

			businessSharePojo.setLoansDisbursed(loansDisbursed);
			businessSharePojo.setInterestReceivable(interestReceivable);

			businessSharePojo.setSumOfLoansDisbursedAndInterestReceivable(loansDisbursed.add(interestReceivable));

			if (DAILY_FINANCE.equalsIgnoreCase(loanSummary.getLoanType())) {

				businessSharePojo.setLoansPaid(installmentsReceived(loanCollectionData, DAILY_FINANCE));

				businessSharePojo.setInterestPaid(interestReceived(loanCollectionData, DAILY_FINANCE));

			} else if (MONTHLY_FINANCE.equalsIgnoreCase(loanSummary.getLoanType())) {

				businessSharePojo.setLoansPaid(installmentsReceived(loanCollectionData, MONTHLY_FINANCE));

				businessSharePojo.setInterestPaid(interestReceived(loanCollectionData, MONTHLY_FINANCE));

			}

			businessSharePojo.setSumOfloansPaidAndInterestPaid(
					nz(businessSharePojo.getLoansPaid()).add(nz(businessSharePojo.getInterestPaid())));

			returnList.add(businessSharePojo);
		}

		return returnList;
	}

	/**
	 * What is still owed as on the report's last day. Both sides are taken from
	 * the start of the books rather than from the range, since a loan let out
	 * before it is just as outstanding as one let out inside it; a loan type
	 * with nothing lent in the range still gets its row here.
	 *
	 * The principal and the interest are collected under separate account codes,
	 * so what is left of each can be told apart:
	 *
	 *   outstanding excluding interest = lent - installments collected
	 *   total outstanding              = lent + interest due - everything collected
	 */
	private void setOutstanding(List<BusinessSharePojo> loanInformation, LocalDateTime to) {

		List<LoanSummaryProjection> loansToDate = businessMemberRepository.findAllLoansDisbursedUpTo(to);

		LoanCollectionProjection collectedToDate = cashBookRepo.getLoanCollectionDataUpTo(to);

		Map<String, BusinessSharePojo> rowsByType = new LinkedHashMap<>();
		for (BusinessSharePojo row : loanInformation) {
			rowsByType.put(typeKey(row.getLoanType()), row);
		}

		for (LoanSummaryProjection loanSummary : loansToDate) {

			String loanType = loanSummary.getLoanType();

			BusinessSharePojo row = rowsByType.get(typeKey(loanType));

			if (row == null) {
				row = new BusinessSharePojo();
				row.setLoanType(loanType);
				rowsByType.put(typeKey(loanType), row);
				loanInformation.add(row);
			}

			BigDecimal lent = nz(loanSummary.getLoansDisbursed());
			BigDecimal interestDue = nz(loanSummary.getInterestReceivable());

			BigDecimal installmentsCollected = installmentsReceived(collectedToDate, loanType);
			BigDecimal interestCollected = interestReceived(collectedToDate, loanType);

			row.setOutstandingExcludingInterest(lent.subtract(installmentsCollected));
			row.setTotalOutstanding(
					lent.add(interestDue).subtract(installmentsCollected).subtract(interestCollected));
		}
	}

	/**
	 * Everything the business holds on the day, less everything it owes, split
	 * over the shares.
	 *
	 * Hand loans and FD deposits are liabilities in their own right, so they are
	 * given on their own and the rest of that side is gathered into Other
	 * Liabilities - each figure comes off once, not twice. The balance sheet
	 * signs its amounts by the side they sit on, so only their size is used
	 * here; the block itself decides what adds and what comes off.
	 */
	private void setValueOfBusiness(BusinessShareResponsePojo response, List<BusinessSharePojo> loanInformation,
			LocalDateTime toDate) {

		List<BalanceSheetProjection> balanceSheetByTrasncDate = cashBookRepo.getBalanceSheetByTrasncDate(toDate,
				Arrays.asList("ASSETS", "LIABILITIES"));

		balanceSheetByTrasncDate = balanceSheetByTrasncDate.stream()
				.filter(p -> !p.getMasterCode().equalsIgnoreCase("LOANS")).collect(Collectors.toList());

		response.setBalanceSheetProjectionList(balanceSheetByTrasncDate);
		
		
		BigDecimal totalAssets = BigDecimal.ZERO;
		BigDecimal totalLiabilities = BigDecimal.ZERO;

		for (BalanceSheetProjection balance : balanceSheetByTrasncDate) {

		    if ("ASSETS".equalsIgnoreCase(balance.getType())) {
		        totalAssets = totalAssets.add(
		                balance.getAmount() != null ? balance.getAmount() : BigDecimal.ZERO
		        );

		    } else if ("LIABILITIES".equalsIgnoreCase(balance.getType())) {
		        totalLiabilities = totalLiabilities.add(
		                balance.getAmount() != null ? balance.getAmount() : BigDecimal.ZERO
		        );
		    }
		}
		
	
		BigDecimal loansOutstanding = loanInformation.stream().map(row -> nz(row.getOutstandingExcludingInterest()))
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal totalShares = nz(personalInfoRepository.findTotalShares());
		
		
		BigDecimal assestProperties = totalAssets
        .add(loansOutstanding);
		
		BigDecimal netBusiness = assestProperties.subtract(totalLiabilities);
		
		response.setNetBusinessValue(netBusiness);
		response.setLoansOutstanding(loansOutstanding);
		response.setTotalShares(totalShares);
		response.setTotalLiabilities(totalLiabilities);
		response.setTotalAssets(totalAssets);
		
		response.setValuePerShare(
				totalShares.compareTo(BigDecimal.ZERO) > 0 ? netBusiness.divide(totalShares, 2, RoundingMode.HALF_UP)
						: BigDecimal.ZERO);
	}

	private BigDecimal installmentsReceived(LoanCollectionProjection collection, String loanType) {

		if (collection == null) {
			return BigDecimal.ZERO;
		}

		return DAILY_FINANCE.equalsIgnoreCase(loanType) ? nz(collection.getDailyLoanInstallmentsReceived())
				: nz(collection.getMonthlyLoanInstallmentsReceived());
	}

	private BigDecimal interestReceived(LoanCollectionProjection collection, String loanType) {

		if (collection == null) {
			return BigDecimal.ZERO;
		}

		return DAILY_FINANCE.equalsIgnoreCase(loanType) ? nz(collection.getDailyLoanInterestReceived())
				: nz(collection.getMonthlyLoanInterestReceived());
	}

	private BigDecimal sumOfGroups(List<BalanceSheetProjection> rows, List<String> groups) {

		return rows.stream().filter(row -> groups.contains(groupKey(row))).map(row -> nz(row.getAmount()).abs())
				.reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	private BigDecimal sumExceptGroups(List<BalanceSheetProjection> rows, List<String> groups) {

		return rows.stream().filter(row -> !groups.contains(groupKey(row))).map(row -> nz(row.getAmount()).abs())
				.reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	private boolean isLiability(BalanceSheetProjection row) {

		return row.getType() != null && row.getType().trim().toUpperCase().contains("LIABIL");
	}

	private String groupKey(BalanceSheetProjection row) {

		return row.getMasterCode() == null ? "OTHERS" : row.getMasterCode().trim().toUpperCase();
	}

	private String typeKey(String loanType) {

		return loanType == null ? "" : loanType.trim().toUpperCase();
	}

	private BigDecimal nz(BigDecimal value) {

		return value == null ? BigDecimal.ZERO : value;
	}
}
