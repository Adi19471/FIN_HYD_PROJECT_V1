package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.GuarantorDuesProjection;
import com.balaji.finance.pojo.GuarantorInstallmentDuesResponse;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.EmiRepo;

@Service
public class GurantorInstallmentDuesService {

	@Autowired
	private EmiRepo emiRepo;

	public List<GuarantorInstallmentDuesResponse> getGuarantorInstallmentDuesList(String guarantorId,
			boolean activeLoans, boolean lateFee) {


		List<GuarantorDuesProjection> projections;

		if (guarantorId == null || guarantorId.isEmpty()) {
			projections = emiRepo.getInstallmentDuesAllGuarenter(activeLoans);

		} else {

			projections = emiRepo.getInstallmentDuesByGuranter(activeLoans, guarantorId);
		}

		List<GuarantorInstallmentDuesResponse> responseList = new ArrayList<>();

		int sno = 1;

		System.err.println(projections.size());
		
		for (GuarantorDuesProjection projection : projections) {

			GuarantorInstallmentDuesResponse response = new GuarantorInstallmentDuesResponse();

			response.setSno(sno++);
			response.setLoanId(projection.getLoanId());
			response.setCustomerName(projection.getCustomerName());
			response.setGuarantorName(projection.getGuarantorName());
			response.setStartDate(projection.getStartDate().toLocalDate());
			response.setEndDate(projection.getEndDate().toLocalDate());
			response.setAmount(projection.getLoanAmount());
			response.setDuration(projection.getDuration());
			response.setInstallmentAmount(projection.getInstallmentAmount());

			response.setNoOfInstallmentsPaid(
					projection.getNoOfInstallmentsPaid() != null ? projection.getNoOfInstallmentsPaid().intValue() : 0);

			response.setTotalAmountPaid(
					projection.getTotalAmountPaid() != null ? projection.getTotalAmountPaid() : BigDecimal.ZERO);

			response.setNoOfInstallmentsPending(
					projection.getNoOfInstallmentsPending() != null ? projection.getNoOfInstallmentsPending().intValue()
							: 0);

			response.setBalanceAmount(projection.getDueAmount() != null ? projection.getDueAmount() : BigDecimal.ZERO);

			response.setInstallmentDue(projection.getDueAmount() != null ? projection.getDueAmount() : BigDecimal.ZERO);

			response.setDueDate(projection.getDueDate() != null ? projection.getDueDate().toLocalDate() : null);

			response.setLoanType(projection.getLoanType());

			// Populate this using your existing late-fee calculation.
			response.setLateFee(BigDecimal.ZERO);
			response.setPartnerName(projection.getPartnerName());

			responseList.add(response);
		}

		return responseList;
	}

}
