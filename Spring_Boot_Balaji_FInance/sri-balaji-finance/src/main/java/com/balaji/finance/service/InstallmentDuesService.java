package com.balaji.finance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.InstallmentDueProjection;
import com.balaji.finance.pojo.InstallmentDuesPojo;
import com.balaji.finance.repo.EmiRepo;

@Service
public class InstallmentDuesService {

	@Autowired
	private EmiRepo emiRepo;

	private static final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	public List<InstallmentDuesPojo> getInstallmentDues(LocalDate fromDate, LocalDate toDate, String loanType) {

		List<InstallmentDuesPojo> returnList = new ArrayList<>();

		List<InstallmentDueProjection> loansList = null;
		if (fromDate != null && toDate != null) {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			String starWithString = null;
			switch (loanType) {
			case "DAILY_FINANCE":
				starWithString = "DF";
				break;

			case "MONTHLY_FINANCE":
				starWithString = "MF";
				break;

			default:

				break;
			}

			loansList = emiRepo.getInstallmentDues(starWithString, to);

			int i = 0;
			for (InstallmentDueProjection bm : loansList) {

				InstallmentDuesPojo dto = new InstallmentDuesPojo();
				dto.setSno(++i);
				dto.setLoanId(bm.getLoanId());
				dto.setCustomerName(bm.getCustomerName());

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