package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.LoanSummaryOfManagerProjection;
import com.balaji.finance.dto.ManagerDetailsProjection;
import com.balaji.finance.pojo.GroupBusinessResponsePojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class GroupBusinessService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private EmiRepo emiRepo;

	public List<GroupBusinessResponsePojo> getGroupBusiness(LocalDate fromDate, LocalDate toDate) {

		List<GroupBusinessResponsePojo> returnList = new ArrayList<>();

		List<ManagerDetailsProjection> managerDetails = personalInfoRepository.findManagerDetails();

		boolean isDateRange = fromDate != null && toDate != null;

		LocalDateTime from = null;
		LocalDateTime to = null;

		if (isDateRange) {
			from = fromDate.atStartOfDay();
			to = toDate.atTime(23, 59, 59);
		}

		for (ManagerDetailsProjection manager : managerDetails) {

			List<String> personInfoIds = new ArrayList<>();

			personInfoIds.add(manager.getManagerId());

			if (manager.getPartnerIds() != null && !manager.getPartnerIds().isBlank()) {
				personInfoIds.addAll(Arrays.asList(manager.getPartnerIds().split(",")));
			}

			LoanSummaryOfManagerProjection loanSummary;

			BigDecimal capitalAmount;
			BigDecimal paidAmount;
			BigDecimal paidInterest;
			BigDecimal dueAmount;

			if (isDateRange) {

				loanSummary = businessMemberRepository.getLoanSummaryOfManagerDaterange(personInfoIds, from, to);

				capitalAmount = cashBookRepo.getCreditOfAccountCodeDateRange(Arrays.asList("CAPITAL"), personInfoIds,
						from, to);

				paidAmount = cashBookRepo.getCreditOfAccountCodeDateRange(
						Arrays.asList("DF LOAN INSTALLMENT", "MF LOAN INSTALLMENT"), personInfoIds, from, to);

				paidInterest = cashBookRepo.getCreditOfAccountCodeDateRange(Arrays.asList("DF INTEREST", "MF INTEREST"),
						personInfoIds, from, to);

				dueAmount = emiRepo.getDueAmountOfManagerDateRange(personInfoIds, from, to);

			} else {

				loanSummary = businessMemberRepository.getLoanSummaryOfManager(personInfoIds);

				capitalAmount = cashBookRepo.getCreditOfAccountCode(Arrays.asList("CAPITAL"), personInfoIds);

				paidAmount = cashBookRepo.getCreditOfAccountCode(
						Arrays.asList("DF LOAN INSTALLMENT", "MF LOAN INSTALLMENT"), personInfoIds);

				paidInterest = cashBookRepo.getCreditOfAccountCode(Arrays.asList("DF INTEREST", "MF INTEREST"),
						personInfoIds);

				dueAmount = emiRepo.getDueAmountOfManager(personInfoIds);
			}

			// Null Safety
			BigDecimal disbursedAmount = defaultValue(loanSummary.getDisbursedAmount());
			BigDecimal disbursedAmountWithInterest = defaultValue(loanSummary.getDisbursedAmountWithInterest());

			capitalAmount = defaultValue(capitalAmount);
			paidAmount = defaultValue(paidAmount);
			paidInterest = defaultValue(paidInterest);
			dueAmount = defaultValue(dueAmount);

			GroupBusinessResponsePojo response = new GroupBusinessResponsePojo();

			response.setPartnerId(manager.getManagerId());
			response.setName(manager.getManagerName() + " " + manager.getManagerLastName());

			response.setNoOfShares(manager.getNoOfSharesUnderManager());

			response.setNoOfLoans(loanSummary.getNoOfLoans());

			response.setDisbursedAmount(disbursedAmount);

			response.setDisbursedAmountWithInterest(disbursedAmountWithInterest);

			response.setCapital(capitalAmount);

			response.setPaidAmount(paidAmount);

			response.setBalanceOutStandingWithInterest(
					disbursedAmountWithInterest.subtract(paidAmount.add(paidInterest)));

			response.setBalanceOutStandingWithOutInterest(disbursedAmount.subtract(paidAmount));

			response.setInstallmentDuesOutStanding(dueAmount);

			returnList.add(response);
		}

		return returnList;
	}

	private BigDecimal defaultValue(BigDecimal value) {
		return value != null ? value : BigDecimal.ZERO;
	}
}