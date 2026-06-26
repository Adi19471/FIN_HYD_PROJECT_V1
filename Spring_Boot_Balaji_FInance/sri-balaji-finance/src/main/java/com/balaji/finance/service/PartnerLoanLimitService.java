package com.balaji.finance.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.PartnerInformationProjection;
import com.balaji.finance.pojo.PartnerLoanLimitResponse;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class PartnerLoanLimitService {

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	public List<PartnerLoanLimitResponse> getAllPartnerLoanLimits() {

		List<PartnerInformationProjection> allPartners = personalInfoRepository.findAllPartnersAndInvestments();

		List<PartnerLoanLimitResponse> responseList = new ArrayList<>();

		int sno = 1;

		for (PartnerInformationProjection projection : allPartners) {

			PartnerLoanLimitResponse response = new PartnerLoanLimitResponse();

			response.setSno(sno++);

			String partnerName = Stream
					.of(projection.getPartner().getFirstName(), projection.getPartner().getLastName())
					.filter(Objects::nonNull).collect(Collectors.joining(" "));
			response.setAccount(projection.getPartner().getPersonalInfoId());
			response.setPartnerName(partnerName);
			response.setAuthLimit(projection.getPartner().getLoanlimit());
			response.setCurrentLimit(projection.getInvestments());

			responseList.add(response);
		}

		return responseList;
	}
}
