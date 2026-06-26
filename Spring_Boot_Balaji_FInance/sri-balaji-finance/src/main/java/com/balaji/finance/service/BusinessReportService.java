package com.balaji.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.PartnerBusniessProjection;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.pojo.BusinessReportResponsePojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class BusinessReportService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	public List<BusinessReportResponsePojo> getBusinessReport(LocalDate fromDate, LocalDate toDate,
			BigDecimal percentage) {

		List<BusinessReportResponsePojo> responseList = new ArrayList<>();

		if (fromDate == null || toDate == null) {
			return responseList;
		}

		List<PersonalInfo> allPartnerDetails = personalInfoRepository.findAllPartners();

		Map<String, PersonalInfo> personIdItsDetail = allPartnerDetails.stream()
				.collect(Collectors.toMap(PersonalInfo::getPersonalInfoId, p -> p));

		BigDecimal totalIncludedShares = allPartnerDetails.stream().filter(p -> !p.isBussinessExemption())
				.map(p -> p.getShares() == null ? BigDecimal.ZERO : p.getShares())
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		
		
		
		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<PartnerBusniessProjection> businessReportOfPartners = businessMemberRepository
				.getBusinessReportOfPartners(new ArrayList<>(personIdItsDetail.keySet()), from, to);

		BigDecimal totalLoanAmountOfAllPartners = businessReportOfPartners.stream()
				.map(p -> (p.getDailyLoanAmount() == null ? BigDecimal.ZERO : p.getDailyLoanAmount())
						.add(p.getMonthlyLoanAmount() == null ? BigDecimal.ZERO : p.getMonthlyLoanAmount()))
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal eachShare = BigDecimal.ZERO;

		if (totalIncludedShares.compareTo(BigDecimal.ZERO) > 0) {
			eachShare = totalLoanAmountOfAllPartners.divide(totalIncludedShares, 2, RoundingMode.HALF_UP);
		}

		Map<String, PartnerBusniessProjection> partnerIdBusinessReportMap = businessReportOfPartners.stream()
				.collect(Collectors.toMap(PartnerBusniessProjection::getPersonalInfoId, p -> p));

		int sno = 0;

		for (PersonalInfo partner : allPartnerDetails) {

			PartnerBusniessProjection report = partnerIdBusinessReportMap.get(partner.getPersonalInfoId());

			long dailyLoanCount = report != null && report.getDailyLoanCount() != null ? report.getDailyLoanCount()
					: 0L;

			long monthlyLoanCount = report != null && report.getMonthlyLoanCount() != null
					? report.getMonthlyLoanCount()
					: 0L;

			BigDecimal dailyLoanAmount = report != null && report.getDailyLoanAmount() != null
					? report.getDailyLoanAmount()
					: BigDecimal.ZERO;

			BigDecimal monthlyLoanAmount = report != null && report.getMonthlyLoanAmount() != null
					? report.getMonthlyLoanAmount()
					: BigDecimal.ZERO;

			BigDecimal totalLoanAmount = dailyLoanAmount.add(monthlyLoanAmount);

			BigDecimal shares = partner.getShares() == null ? BigDecimal.ZERO : partner.getShares();

			BigDecimal targetAmount = shares.multiply(eachShare);

			BigDecimal excessOrDeficit = totalLoanAmount.subtract(targetAmount);

			String partnerName = Stream.of(partner.getFirstName(), partner.getLastName()).filter(Objects::nonNull)
					.collect(Collectors.joining(" "));

			BusinessReportResponsePojo response = new BusinessReportResponsePojo();

			response.setSno(++sno);
			response.setPartnerId(partner.getPersonalInfoId());
			response.setPartnerName(partnerName);
			response.setShares(shares);
			response.setBussinessExemption(partner.isBussinessExemption() ? "Y" : "N");

			response.setNoOfDailyLoans(dailyLoanCount);
			response.setDailyLoanAmount(dailyLoanAmount);

			response.setNoOfMonthlyLoans(monthlyLoanCount);
			response.setMonthlyLoanAmount(monthlyLoanAmount);

			response.setTotalLoanAmount(totalLoanAmount);

			response.setTargetAmount(targetAmount);

			response.setExcess_or_deficit(excessOrDeficit);

			response.setAmount(excessOrDeficit);

			responseList.add(response);
		}

		return responseList;
	}

}
