package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BusniessCollectionProjection;
import com.balaji.finance.pojo.BusinessCollectionsReportResponse;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

/**
 * Business Collections Report.
 *
 * For every loan we calculate:
 *
 * dueAmount = total of all EMIs due before the period end (EMI table)
 * paidBefore = amount paid before the period start (CASH_BOOK) paidInRange =
 * amount paid inside the period (CASH_BOOK)
 *
 * target = dueAmount - paidBefore (old pending + this period's dues) received =
 * paidInRange, but not more than target (extra money paid in advance for future
 * EMIs is not counted) balance = target - received
 *
 * Loans are split into: ACTIVE -> loan end date is on/after the period end
 * MATURED -> loan end date falls inside the period (loans that ended before the
 * period are skipped)
 */
@Service
public class BusinessCollectionsReportService {

	// Cash book account codes counted as EMI collections
	private static final List<String> COLLECTION_ACCOUNT_CODES = List.of("MF LOAN INSTALLMENT", "MF INTEREST",
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

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.plusDays(1).atStartOfDay();

		Map<String, BusinessCollectionsReportResponse> resultMap = new LinkedHashMap<>();

		// ==========================================
		// ACTIVE LOANS
		// ==========================================

		List<BusniessCollectionProjection> activeTarget = emiRepo.getTargetCollectionsOfActiveLoans(from, to);

		List<BusniessCollectionProjection> activePrevious = emiRepo.getPreviousPendingCollectionsOfActiveLoans(from,
				to);

		List<BusniessCollectionProjection> activeReceived = cashBookRepo.getReceivedCollectionsOfActiveLoans(from, to);

		setCollectionData(resultMap, activeTarget, "ACTIVE", 1);
		setCollectionData(resultMap, activePrevious, "ACTIVE", 2);
		setCollectionData(resultMap, activeReceived, "ACTIVE", 3);

		// ==========================================
		// MATURED LOANS
		// ==========================================

		List<BusniessCollectionProjection> maturedTarget = emiRepo.getTargetCollectionsOfMaturedLoans(from, to);

		List<BusniessCollectionProjection> maturedPrevious = emiRepo.getPreviousPendingCollectionsOfMaturedLoans(from,
				to);

		List<BusniessCollectionProjection> maturedReceived = cashBookRepo.getReceivedCollectionsOfMaturedLoans(from,
				to);

		setCollectionData(resultMap, maturedTarget, "MATURED", 1);
		setCollectionData(resultMap, maturedPrevious, "MATURED", 2);
		setCollectionData(resultMap, maturedReceived, "MATURED", 3);

		// ==========================================
		// CALCULATE BALANCE
		// ==========================================

		List<BusinessCollectionsReportResponse> result = new ArrayList<>();

		for (BusinessCollectionsReportResponse response : resultMap.values()) {

			BigDecimal currentTarget = zeroIfNull(response.getTargetCollectionsofCurrentMonth());

			BigDecimal previousTarget = zeroIfNull(response.getTargetCollectionsofPreviousMonths());

			BigDecimal received = zeroIfNull(response.getReceivedCollections());

			BigDecimal totalTarget = currentTarget.add(previousTarget);

			BigDecimal balance = totalTarget.subtract(received);

			response.setBalanceCollections(balance);

			result.add(response);
		}

		return result;
	}

// ==========================================
// COMMON MAPPING METHOD
// ==========================================

	private void setCollectionData(Map<String, BusinessCollectionsReportResponse> resultMap,
			List<BusniessCollectionProjection> projections, String loanStatus, int type) {

		if (projections == null) {
			return;
		}

		for (BusniessCollectionProjection projection : projections) {

			String loanType = projection.getLoanType();

			String key = loanType + "_" + loanStatus;

			BusinessCollectionsReportResponse response = resultMap.computeIfAbsent(key, k -> {

				BusinessCollectionsReportResponse obj = new BusinessCollectionsReportResponse();

				obj.setLoanType(loanType);
				obj.setLoanStatus(loanStatus);

				obj.setTargetCollectionsofCurrentMonth(BigDecimal.ZERO);
				obj.setTargetCollectionsofPreviousMonths(BigDecimal.ZERO);
				obj.setReceivedCollections(BigDecimal.ZERO);
				obj.setBalanceCollections(BigDecimal.ZERO);

				return obj;
			});

			BigDecimal amount = zeroIfNull(projection.getAmount());

			switch (type) {

			case 1:
				response.setTargetCollectionsofCurrentMonth(amount);
				break;

			case 2:
				response.setTargetCollectionsofPreviousMonths(amount);
				break;

			case 3:
				response.setReceivedCollections(amount);
				break;

			default:
				throw new IllegalArgumentException("Invalid collection type");
			}
		}
	}

// ==========================================
// NULL HANDLING
// ==========================================

	private BigDecimal zeroIfNull(BigDecimal amount) {
		return amount == null ? BigDecimal.ZERO : amount;
	}

}
