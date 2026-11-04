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
import com.balaji.finance.util.PersonNames;

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

			response.setPartnerName(label(projection.getPartnerId(),
					PersonNames.fullName(projection.getPartnerFirstName(), projection.getPartnerLastName()),
					projection.getPartnerPhoneNumber()));

			response.setLoanType(projection.getLoanType());
			response.setLoanId(projection.getBusinessMemberId());

			response.setCustomerName(label(projection.getCustomerId(),
					PersonNames.fullName(projection.getCustomerFirstName(), projection.getCustomerLastName()),
					projection.getCustomerPhoneNumber()));

			response.setGuarantorName(label(projection.getGuarentorId(),
					PersonNames.fullName(projection.getGuarentorFirstName(), projection.getGuarentorLastName()),
					projection.getGuarentorPhoneNumber()));

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

	/** "ID Name Phone", leaving out whatever is missing (no "null" in the cell). */
	private static String label(String id, String name, String phone) {
		return java.util.stream.Stream.of(id, name, phone).filter(part -> part != null && !part.isBlank())
				.collect(java.util.stream.Collectors.joining(" "));
	}
}