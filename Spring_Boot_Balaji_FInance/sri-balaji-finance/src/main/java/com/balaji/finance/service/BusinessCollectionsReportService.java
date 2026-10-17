package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.CashBookProjection;
import com.balaji.finance.dto.LoansGranted;
import com.balaji.finance.dto.TargetCollections;
import com.balaji.finance.pojo.BusinessCollectionsReportResponse;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

@Service
public class BusinessCollectionsReportService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private EmiRepo emiRepo;

	
	@Autowired
	private CashBookRepo cashBookRepo;

	public List<BusinessCollectionsReportResponse> generateBusinessCollectionReport(LocalDate fromDate,
			LocalDate toDate) {

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<TargetCollections> allTargetCollections = emiRepo.getTargetCollectionOfActiveLoans(from, to);

		List<CashBookProjection> allreceivedCollections = cashBookRepo.getCreditSummary(
				Arrays.asList("MF LOAN INSTALLMENT", "DF LOAN INSTALLMENT", "MF INTEREST", "DF INTEREST"), from, to,
				"ACTIVE");

		List<TargetCollections> allMaturedLoansTargetCollections = emiRepo.getTargetCollectionOfMaturedLoans(from, to);

		List<CashBookProjection> allMaturedreceivedCollections = cashBookRepo.getCreditSummary(
				Arrays.asList("MF LOAN INSTALLMENT", "DF LOAN INSTALLMENT", "MF INTEREST", "DF INTEREST"), from, to,
				"COMPLETED");

		List<BusinessCollectionsReportResponse> responseList = new ArrayList<>();

		for (TargetCollections loan : allTargetCollections) {

			String loanType = loan.getLoanType();
			BigDecimal target = loan.getLoansDisbursed();

			// find received amount
			BigDecimal received = BigDecimal.ZERO;

			for (CashBookProjection cb : allreceivedCollections) {

				if (("MONTHLY_FINANCE".equalsIgnoreCase(loanType)
				        && ("MF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())
				            || "MF INTEREST".equalsIgnoreCase(cb.getAccountMasterCode())))
				    || ("DAILY_FINANCE".equalsIgnoreCase(loanType)
				        && ("DF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())
				            || "DF INTEREST".equalsIgnoreCase(cb.getAccountMasterCode())))) {

				    received = received.add(cb.getCredit());
				}
			}

			BigDecimal balance = target.subtract(received);

			BusinessCollectionsReportResponse dto = new BusinessCollectionsReportResponse();
			dto.setLoanType(loanType);
			dto.setLoanStatus("ACTIVE");
			dto.setTargetCollections(target);
			dto.setReceivedCollections(received);
			dto.setBalanceCollections(balance);

			responseList.add(dto);
		}

		for (TargetCollections loan : allMaturedLoansTargetCollections) {

			String loanType = loan.getLoanType();
			BigDecimal target = loan.getLoansDisbursed();

			BigDecimal received = BigDecimal.ZERO;

			for (CashBookProjection cb : allMaturedreceivedCollections) {

				if (("MONTHLY_FINANCE".equals(loanType) && "MF LOAN INSTALLMENT".equals(cb.getAccountMasterCode()))
						|| ("DAILY_FINANCE".equals(loanType)
								&& "DF LOAN INSTALLMENT".equals(cb.getAccountMasterCode()))) {

					received = received.add(cb.getCredit());
				}
			}

			BigDecimal balance = target.subtract(received);

			BusinessCollectionsReportResponse dto = new BusinessCollectionsReportResponse();
			dto.setLoanType(loanType);
			dto.setLoanStatus("COMPLETED");
			dto.setTargetCollections(target);
			dto.setReceivedCollections(received);
			dto.setBalanceCollections(balance);

			responseList.add(dto);
		}

		return responseList;
	}

}
