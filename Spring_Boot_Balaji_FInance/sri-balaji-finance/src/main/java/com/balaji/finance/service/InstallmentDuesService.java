package com.balaji.finance.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.InstallmentDueProjection;
import com.balaji.finance.pojo.InstallmentDuesPojo;
import com.balaji.finance.pojo.InstallmentsDuesRequestPojo;
import com.balaji.finance.repo.EmiRepo;

@Service
public class InstallmentDuesService {

	@Autowired
	private EmiRepo emiRepo;

	private static final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	public List<InstallmentDuesPojo> getInstallmentDues(InstallmentsDuesRequestPojo installmentsDuesRequestPojo) {

		List<InstallmentDuesPojo> returnList = new ArrayList<>();

		List<InstallmentDueProjection> loansList = null;
		if (installmentsDuesRequestPojo.getFromDate() != null && installmentsDuesRequestPojo.getToDate() != null) {

			LocalDateTime from = installmentsDuesRequestPojo.getFromDate().atStartOfDay();
			LocalDateTime to = installmentsDuesRequestPojo.getToDate().atTime(23, 59, 59);

			String starWithString = null;
			switch (installmentsDuesRequestPojo.getLoanType()) {
			case "DAILY_FINANCE":
				starWithString = "DF";
				break;

			case "MONTHLY_FINANCE":
				starWithString = "MF";
				break;

			default:

				break;
			}

			loansList = emiRepo.getInstallmentDues(starWithString,from, to,installmentsDuesRequestPojo.isActiveLoans());
			
			switch (installmentsDuesRequestPojo.getOrderBy()) {

		    case LOAN_START_DATE:
		    	loansList.sort(
		            Comparator.comparing(InstallmentDueProjection::getStartDate)
		        );
		        break;

		    case PARTNER:
		    	loansList.sort(
		            Comparator.comparing(
		                InstallmentDueProjection::getCustomerName,
		                String.CASE_INSENSITIVE_ORDER
		            )
		        );
		        break;

		    case INSTALLMENT_BALANCE:
		    	loansList.sort(
		            Comparator.comparing(
		                InstallmentDueProjection::getDueAmount
		            ).reversed()
		        );
		        break;

		    case INSTALLMENT_DATE:
		        loansList.sort(
		            Comparator.comparing(InstallmentDueProjection::getDueDate)
		        );
		        break;

		    case DELAYED_DAYS:
		        loansList.sort(
		            Comparator.comparingLong(
		                (InstallmentDueProjection dto) ->
		                    ChronoUnit.DAYS.between(
		                        dto.getEndDate(),
		                        LocalDateTime.now()
		                    )
		            ).reversed()
		        );
		        break;
		}
			
			

			int i = 0;
			for (InstallmentDueProjection bm : loansList) {

				InstallmentDuesPojo dto = new InstallmentDuesPojo();
				dto.setSno(++i);
				dto.setLoanId(bm.getLoanId());
				dto.setCustomerName(bm.getCustomerName());
				dto.setPartnerName(bm.getPartnerName());
				dto.setGuarentorName(bm.getGuarantorName());
				
				dto.setStartDate(bm.getStartDate() != null ? bm.getStartDate().format(fmt) : "");
				dto.setEndDate(bm.getEndDate() != null ? bm.getEndDate().format(fmt) : "");

				dto.setAmount(bm.getLoanAmount());
				dto.setInstallmentAmount(bm.getInstallmentAmount());
				dto.setNoOfInstallmentsPending(bm.getPendingCount());

				dto.setAmountPaid(bm.getPaidAmount());

				dto.setInstallmentDue(bm.getDueAmount());
				dto.setRemarks(""); // fill if you have any remarks

				returnList.add(dto);
			}
		}

		return returnList;
	}
}