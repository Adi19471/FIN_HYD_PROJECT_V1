package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.LoanSummaryOfPartnerProjection;
import com.balaji.finance.dto.PartnerCreditSummaryProjection;
import com.balaji.finance.dto.PartnerDueAmountProjection;
import com.balaji.finance.dto.PersonsUnderManagerProjection;
import com.balaji.finance.pojo.GroupBusinessDetailResponsePojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class GroupBusinessDetailsService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private EmiRepo emiRepo;

	public List<GroupBusinessDetailResponsePojo> getGroupBusinessDetail(LocalDate fromDate, LocalDate toDate,
			String managerId) {

		List<GroupBusinessDetailResponsePojo> returnList = new ArrayList<>();
		List<PersonsUnderManagerProjection> allPartnerDetails = personalInfoRepository
				.findPersonsUnderManager(managerId);

		boolean isDateRange = fromDate != null && toDate != null;

		LocalDateTime from = null;
		LocalDateTime to = null;

		if (isDateRange) {
			from = fromDate.atStartOfDay();
			to = toDate.atTime(23, 59, 59);
		}

		Map<String, PersonsUnderManagerProjection> personIdItsDetail = new HashMap<>();

		for (PersonsUnderManagerProjection person : allPartnerDetails) {
			personIdItsDetail.put(person.getId(), person);
		}

		List<LoanSummaryOfPartnerProjection> loanSummaryOfPartnerLis;
		List<PartnerCreditSummaryProjection> capitalAmountOfEachPartner;
		List<PartnerCreditSummaryProjection> paidAmountForPartnerList;
		List<PartnerCreditSummaryProjection> paidInterestForPartnerList;
		List<PartnerDueAmountProjection> dueAmountForPartnerList;

		if (isDateRange) {

			loanSummaryOfPartnerLis = businessMemberRepository
					.getLoanSummaryOfPartnerDateRange(new ArrayList<>(personIdItsDetail.keySet()), from, to);

			capitalAmountOfEachPartner = cashBookRepo.getCreditOfAccountCodeForEveryPartnerDaterange(
					Arrays.asList("CAPITAL"), new ArrayList<>(personIdItsDetail.keySet()), from, to);

			paidAmountForPartnerList = cashBookRepo.getCreditOfAccountCodeForEveryPartnerDaterange(
					Arrays.asList("DF LOAN INSTALLMENT", "MF LOAN INSTALLMENT"),
					new ArrayList<>(personIdItsDetail.keySet()), from, to);

			paidInterestForPartnerList = cashBookRepo.getCreditOfAccountCodeForEveryPartnerDaterange(
					Arrays.asList("DF INTEREST", "MF INTEREST"), new ArrayList<>(personIdItsDetail.keySet()), from, to);

			dueAmountForPartnerList = emiRepo
					.getDueAmountOfEveryPartnerDateRange(new ArrayList<>(personIdItsDetail.keySet()), from, to);

		} else {

			loanSummaryOfPartnerLis = businessMemberRepository
					.getLoanSummaryOfPartner(new ArrayList<>(personIdItsDetail.keySet()));

			capitalAmountOfEachPartner = cashBookRepo.getCreditOfAccountCodeForEveryPartner(Arrays.asList("CAPITAL"),
					new ArrayList<>(personIdItsDetail.keySet()));

			paidAmountForPartnerList = cashBookRepo.getCreditOfAccountCodeForEveryPartner(
					Arrays.asList("DF LOAN INSTALLMENT", "MF LOAN INSTALLMENT"),
					new ArrayList<>(personIdItsDetail.keySet()));

			paidInterestForPartnerList = cashBookRepo.getCreditOfAccountCodeForEveryPartner(
					Arrays.asList("DF INTEREST", "MF INTEREST"), new ArrayList<>(personIdItsDetail.keySet()));

			dueAmountForPartnerList = emiRepo.getDueAmountOfEveryPartner(new ArrayList<>(personIdItsDetail.keySet()));

		}

		Map<String, LoanSummaryOfPartnerProjection> loanSummaryMap = new HashMap<>();

		for (LoanSummaryOfPartnerProjection data : loanSummaryOfPartnerLis) {

			loanSummaryMap.put(data.getPersonalInfoId(), data);
		}

		Map<String, PartnerCreditSummaryProjection> capitalSummaryMap = new HashMap<>();

		for (PartnerCreditSummaryProjection data : capitalAmountOfEachPartner) {

			capitalSummaryMap.put(data.getPersonalInfoId(), data);
		}

		Map<String, PartnerCreditSummaryProjection> paidAmountMap = new HashMap<>();

		for (PartnerCreditSummaryProjection data : paidAmountForPartnerList) {

			paidAmountMap.put(data.getPersonalInfoId(), data);
		}

		Map<String, PartnerCreditSummaryProjection> paidInterestMap = new HashMap<>();

		for (PartnerCreditSummaryProjection data : paidInterestForPartnerList) {

			paidInterestMap.put(data.getPersonalInfoId(), data);
		}

		Map<String, PartnerDueAmountProjection> dueAmountMap = new HashMap<>();

		for (PartnerDueAmountProjection data : dueAmountForPartnerList) {

			dueAmountMap.put(data.getPersonalInfoId(), data);
		}

		for (Entry<String, PersonsUnderManagerProjection> eachPartnerEntry : personIdItsDetail.entrySet()) {

			String partnerId = eachPartnerEntry.getKey();
			PersonsUnderManagerProjection partnerObject = eachPartnerEntry.getValue();

			LoanSummaryOfPartnerProjection loanSummary = loanSummaryMap.get(partnerId);

			PartnerCreditSummaryProjection capitalSummary = capitalSummaryMap.get(partnerId);

			PartnerCreditSummaryProjection paidAmountSummary = paidAmountMap.get(partnerId);

			PartnerCreditSummaryProjection paidInterestSummary = paidInterestMap.get(partnerId);

			PartnerDueAmountProjection dueAmountSummary = dueAmountMap.get(partnerId);

			// Null Safe Values

			Long noOfLoans = loanSummary != null ? loanSummary.getNoOfLoans() : 0L;

			BigDecimal disbursedAmount = loanSummary != null ? defaultValue(loanSummary.getDisbursedAmount())
					: BigDecimal.ZERO;

			BigDecimal disbursedAmountWithInterest = loanSummary != null
					? defaultValue(loanSummary.getDisbursedAmountWithInterest())
					: BigDecimal.ZERO;

			BigDecimal capitalAmount = capitalSummary != null ? defaultValue(capitalSummary.getTotalCredit())
					: BigDecimal.ZERO;

			BigDecimal paidAmount = paidAmountSummary != null ? defaultValue(paidAmountSummary.getTotalCredit())
					: BigDecimal.ZERO;

			BigDecimal paidInterest = paidInterestSummary != null ? defaultValue(paidInterestSummary.getTotalCredit())
					: BigDecimal.ZERO;

			BigDecimal dueAmount = dueAmountSummary != null ? defaultValue(dueAmountSummary.getDueAmount())
					: BigDecimal.ZERO;

			GroupBusinessDetailResponsePojo response = new GroupBusinessDetailResponsePojo();

			response.setPartnerId(partnerId);

			response.setName(partnerObject.getFirstName() + " " + partnerObject.getLastName());

			response.setNoOfShares(partnerObject.getShares());

			response.setNoOfLoans(noOfLoans);

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