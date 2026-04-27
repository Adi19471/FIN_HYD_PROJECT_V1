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
import com.balaji.finance.pojo.BusinessCollectionsReportResponse;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class BusinessCollectionsReportService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<BusinessCollectionsReportResponse> generateBusinessCollectionReport(LocalDate fromDate,
			LocalDate toDate) {

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<LoansGranted> allTargetCollections = businessMemberRepository.findAllTargetCollections(from, to, "ACTIVE");
		List<CashBookProjection> allreceivedCollections = cashBookRepo
				.getCreditSummary(Arrays.asList("MF LOAN INSTALLMENT", "DF LOAN INSTALLMENT"), from, to, "ACTIVE");

		List<LoansGranted> allMaturedLoansTargetCollections = businessMemberRepository.findAllTargetCollections(from,
				to, "COMPLETED");
		List<CashBookProjection> allMaturedreceivedCollections = cashBookRepo
				.getCreditSummary(Arrays.asList("MF LOAN INSTALLMENT", "DF LOAN INSTALLMENT"), from, to, "COMPLETED");

		List<BusinessCollectionsReportResponse> responseList = new ArrayList<>();

		for (LoansGranted loan : allTargetCollections) {

			String loanType = loan.getLoanType();
			BigDecimal target = loan.getLoansDisbursed();

			// find received amount
			BigDecimal received = BigDecimal.ZERO;

			for (CashBookProjection cb : allreceivedCollections) {

				if (("MF".equals(loanType) && "MF LOAN INSTALLMENT".equals(cb.getAccountMasterCode()))
						|| ("DF".equals(loanType) && "DF LOAN INSTALLMENT".equals(cb.getAccountMasterCode()))) {

					received = cb.getCredit();
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

		for (LoansGranted loan : allMaturedLoansTargetCollections) {

			String loanType = loan.getLoanType();
			BigDecimal target = loan.getLoansDisbursed();

			BigDecimal received = BigDecimal.ZERO;

			for (CashBookProjection cb : allMaturedreceivedCollections) {

				if (("MF".equals(loanType) && "MF LOAN INSTALLMENT".equals(cb.getAccountMasterCode()))
						|| ("DF".equals(loanType) && "DF LOAN INSTALLMENT".equals(cb.getAccountMasterCode()))) {

					received = cb.getCredit();
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
