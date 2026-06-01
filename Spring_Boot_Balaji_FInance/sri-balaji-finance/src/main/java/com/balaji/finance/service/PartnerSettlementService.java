package com.balaji.finance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.PartnerLoanDetailsProjection;
import com.balaji.finance.pojo.PartnerSettlementResponse;
import com.balaji.finance.repo.BusinessMemberRepository;

@Service
public class PartnerSettlementService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	public List<PartnerSettlementResponse> getPartnerSettlementResponse(LocalDate targetDate, String partnerId) {

		LocalDateTime targetDateTime = targetDate.atTime(23, 59, 59);
		
		List<PartnerLoanDetailsProjection> allLoanDetailsByPartner = businessMemberRepository
				.getAllLoanDetailsByPartner(partnerId, targetDateTime);

		List<PartnerSettlementResponse> returnList = new ArrayList<>();

		for (PartnerLoanDetailsProjection projection : allLoanDetailsByPartner) {

			PartnerSettlementResponse response = new PartnerSettlementResponse();

			response.setPartnerName(projection.getPartnerId() + " " + projection.getPartnerFirstName() + " "
					+ projection.getPartnerPhoneNumber());

			response.setLoanType(projection.getLoanType());
			response.setLoanId(projection.getBusinessMemberId());

			response.setCustomerName(projection.getCustomerId() + " " + projection.getCustomerFirstName() + " "
					+ projection.getCustomerPhoneNumber());

			response.setGuarantorName(projection.getGuarentorId() + " " + projection.getGuarentorFirstName() + " "
					+ projection.getGuarentorPhoneNumber());

			response.setStartDate(projection.getStartDate().toLocalDate());
			response.setEndDate(projection.getEndDate().toLocalDate());

			response.setAmount(projection.getAmount());
			response.setDuration(projection.getDuration());

			response.setInstallmentAmount(projection.getInstallmentPerMonth());

			response.setInstallmentPaid(projection.getTotalInstallmentAmountPaid());

			response.setNoofInstallmentsPaid(projection.getNoOfEmisPaid());

			response.setNoOfInstallmentsPending(projection.getDuration() - projection.getNoOfEmisPaid().intValue());

			response.setBalanceAmount(projection.getAmount().subtract(projection.getTotalInstallmentAmountPaid()));

			returnList.add(response);
		}

		return returnList;
	}
}