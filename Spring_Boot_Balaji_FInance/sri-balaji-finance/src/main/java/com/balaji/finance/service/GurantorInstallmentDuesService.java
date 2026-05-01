package com.balaji.finance.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.GuarantorDuesProjection;
import com.balaji.finance.pojo.GuarantorInstallmentDuesResponse;
import com.balaji.finance.repo.BusinessMemberRepository;

@Service
public class GurantorInstallmentDuesService {
	
	@Autowired
	private BusinessMemberRepository businessMemberRepository;
	

	  public List<GuarantorInstallmentDuesResponse> getGuarantorInstallmentDuesList(
	            String guarantorId, boolean activeLoans, boolean lateFee) {

	        List<GuarantorInstallmentDuesResponse> returnList = new ArrayList<>();

	        String status = activeLoans ? "ACTIVE" : "COMPLETED";

	        List<GuarantorDuesProjection> allLoansOnGuarantor;

	        if (guarantorId == null || guarantorId.isEmpty()) {
	            allLoansOnGuarantor =
	                    businessMemberRepository.getAllLoansOnGuarantor(status);
	        } else {
	            allLoansOnGuarantor =
	                    businessMemberRepository.getAllLoansOnGuarantor(guarantorId, status);
	        }

	        int sno = 0;

	        for (GuarantorDuesProjection projection : allLoansOnGuarantor) {

	            GuarantorInstallmentDuesResponse response =
	                    new GuarantorInstallmentDuesResponse();

	            response.setSno(++sno);
	            response.setLoanId(projection.getBusinessMemberId());

	            // Customer Name
	            response.setCustomerName(String.format("%s %s %s",
	                    safe(projection.getCustomerId()),
	                    safe(projection.getCustomerFirstName()),
	                    safe(projection.getCustomerPhoneNumber())
	            ));

	            // Guarantor Name
	            response.setGuarantorName(String.format("%s %s %s",
	                    safe(projection.getGuarentorId()),
	                    safe(projection.getGuarentorFirstName()),
	                    safe(projection.getGuarentorPhoneNumber())
	            ));

				// Dates
				if (projection.getStartDate() != null) {
					response.setStartDate(projection.getStartDate().toLocalDate());

					LocalDate start = projection.getStartDate().toLocalDate();
					int paid = projection.getNoOfEmisPaid() == null ? 0 : projection.getNoOfEmisPaid();

					// Next EMI due date
					LocalDate dueDate = start.plusMonths(paid + 1);

					response.setDueDate(dueDate);
				}

	            if (projection.getEndDate() != null) {
	                response.setEndDate(projection.getEndDate().toLocalDate());
	            }

	            // Financials
	            response.setAmount(projection.getAmount());
	            response.setDuration(projection.getDuration());
	            response.setInstallmentAmount(projection.getInstallmentPerMonth());

	            response.setTotalAmountPaid(projection.getTotalInstallmentAmountPaid());
	            response.setNoOfInstallmentsPaid(projection.getNoOfEmisPaid());

	            // Pending installments
	            if (projection.getDuration() != null && projection.getNoOfEmisPaid() != null) {
	                int pending = Math.max(0,
	                        projection.getDuration() - projection.getNoOfEmisPaid());
	                response.setNoOfInstallmentsPending(pending);
	            }

	            // Balance amount
	            if (projection.getAmount() != null
	                    && projection.getTotalInstallmentAmountPaid() != null) {

	                response.setBalanceAmount(
	                        projection.getAmount()
	                                .subtract(projection.getTotalInstallmentAmountPaid()));
	            }
	            
	            response.setLoanType(projection.getLoanType());

	            returnList.add(response);
	        }

	        return returnList;
	    }

	    private String safe(Object value) {
	        return value == null ? "" : value.toString();
	    }

}
