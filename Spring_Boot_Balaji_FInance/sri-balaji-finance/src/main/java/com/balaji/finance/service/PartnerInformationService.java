package com.balaji.finance.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.PartnerInformationProjection;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.pojo.ParnterInformationResponse;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class PartnerInformationService {

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	public List<ParnterInformationResponse> getAllPartners() {

		List<PartnerInformationProjection> partners = personalInfoRepository.findAllPartnersAndInvestments();

		List<ParnterInformationResponse> responseList = new ArrayList<>();

		int count = 1;

		for (PartnerInformationProjection projection : partners) {

			PersonalInfo partner = projection.getPartner();

			ParnterInformationResponse response = new ParnterInformationResponse();

			response.setSno(count++);

			response.setPartnerId(partner.getPersonalInfoId());

			response.setPartnerName(partner.getFirstName());

			response.setFatherName(partner.getFatherName());

			response.setShares(partner.getShares());

			response.setAddress(partner.getAddress());

			response.setMobile(partner.getPhone());

			response.setInvestment(projection.getInvestments());

			response.setStatus(partner.isDisable() ? "IN-ACTIVE" : "ACTiVE");

			responseList.add(response);
		}

		return responseList;
	}
}