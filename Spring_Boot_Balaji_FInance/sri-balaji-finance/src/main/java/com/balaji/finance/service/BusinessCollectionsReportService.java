package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.LoanDueProjection;
import com.balaji.finance.dto.LoanPaymentProjection;
import com.balaji.finance.pojo.BusinessCollectionsReportResponse;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

/**
 * Business Collections Report.
 *
 * For every loan we calculate:
 *
 *   dueAmount   = total of all EMIs due before the period end         (EMI table)
 *   paidBefore  = amount paid before the period start                 (CASH_BOOK)
 *   paidInRange = amount paid inside the period                       (CASH_BOOK)
 *
 *   target   = dueAmount - paidBefore        (old pending + this period's dues)
 *   received = paidInRange, but not more than target
 *              (extra money paid in advance for future EMIs is not counted)
 *   balance  = target - received
 *
 * Loans are split into:
 *   ACTIVE  -> loan end date is on/after the period end
 *   MATURED -> loan end date falls inside the period
 *   (loans that ended before the period are skipped)
 */
@Service
public class BusinessCollectionsReportService {

	// Cash book account codes counted as EMI collections
	private static final List<String> COLLECTION_ACCOUNT_CODES = List.of(
			"MF LOAN INSTALLMENT", "MF INTEREST",
			"DF LOAN INSTALLMENT", "DF INTEREST");

	@Autowired
	private EmiRepo emiRepo;

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<BusinessCollectionsReportResponse> generateBusinessCollectionReport(LocalDate fromDate,
			LocalDate toDate) {

		if (fromDate == null || toDate == null || fromDate.isAfter(toDate)) {
			throw new IllegalArgumentException("Invalid collection report date range");
		}

		// from = start of fromDate, to = start of the day AFTER toDate
		// so the whole toDate is included (we always use "< to")
		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.plusDays(1).atStartOfDay();

	
		
		// Step 1: run the 3 simple queries
		List<LoanDueProjection> loanDues = emiRepo.getLoanDuesBefore(to);
		Map<String, BigDecimal> paidBeforeMap = toMap(
				cashBookRepo.getLoanPaymentsBefore(COLLECTION_ACCOUNT_CODES, from));
		Map<String, BigDecimal> paidInRangeMap = toMap(
				cashBookRepo.getLoanPaymentsBetween(COLLECTION_ACCOUNT_CODES, from, to));

		// Step 2: calculate target / received for each loan and add to its group
		// key = "ACTIVE|MONTHLY_FINANCE", "MATURED|DAILY_FINANCE", ...
		Map<String, BusinessCollectionsReportResponse> report = new LinkedHashMap<>();

		for (LoanDueProjection loan : loanDues) {

			String loanStatus = getLoanStatus(loan.getEndDate(), from, to);
			if (loanStatus == null) {
				continue; // loan ended before this period
			}

			BigDecimal dueAmount = zeroIfNull(loan.getDueAmount());
			BigDecimal paidBefore = paidBeforeMap.getOrDefault(loan.getBusinessMemberId(), BigDecimal.ZERO);
			BigDecimal paidInRange = paidInRangeMap.getOrDefault(loan.getBusinessMemberId(), BigDecimal.ZERO);

			BigDecimal target = dueAmount.subtract(paidBefore).max(BigDecimal.ZERO);
			BigDecimal received = paidInRange.min(target);

			BusinessCollectionsReportResponse row = report.computeIfAbsent(
					loanStatus + "|" + loan.getLoanType(),
					k -> newRow(loan.getLoanType(), loanStatus));

			row.setTargetCollections(row.getTargetCollections().add(target));
			row.setReceivedCollections(row.getReceivedCollections().add(received));
		}

		// Step 3: balance = target - received
		for (BusinessCollectionsReportResponse row : report.values()) {
			row.setBalanceCollections(row.getTargetCollections().subtract(row.getReceivedCollections()));
		}

		// Show ACTIVE rows first, then MATURED
		List<BusinessCollectionsReportResponse> result = new ArrayList<>();
		for (String status : List.of("ACTIVE", "MATURED")) {
			for (BusinessCollectionsReportResponse row : report.values()) {
				if (status.equals(row.getLoanStatus())) {
					result.add(row);
				}
			}
		}
		return result;
	}

	/** ACTIVE if loan ends on/after period end, MATURED if it ends inside the period, else null. */
	private String getLoanStatus(LocalDateTime endDate, LocalDateTime from, LocalDateTime to) {
		if (endDate == null) {
			return null;
		}
		if (!endDate.isBefore(to)) {
			return "ACTIVE";
		}
		if (!endDate.isBefore(from)) {
			return "MATURED";
		}
		return null;
	}

	private Map<String, BigDecimal> toMap(List<LoanPaymentProjection> payments) {
		Map<String, BigDecimal> map = new HashMap<>();
		for (LoanPaymentProjection p : payments) {
			map.put(p.getBusinessMemberId(), zeroIfNull(p.getPaidAmount()));
		}
		return map;
	}

	private BusinessCollectionsReportResponse newRow(String loanType, String loanStatus) {
		BusinessCollectionsReportResponse row = new BusinessCollectionsReportResponse();
		row.setLoanType(loanType);
		row.setLoanStatus(loanStatus);
		row.setTargetCollections(BigDecimal.ZERO);
		row.setReceivedCollections(BigDecimal.ZERO);
		row.setBalanceCollections(BigDecimal.ZERO);
		return row;
	}

	private BigDecimal zeroIfNull(BigDecimal amount) {
		return amount != null ? amount : BigDecimal.ZERO;
	}

}
