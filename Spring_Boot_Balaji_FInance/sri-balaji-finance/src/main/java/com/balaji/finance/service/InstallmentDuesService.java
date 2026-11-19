package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.InstallmentDueProjection;
import com.balaji.finance.dto.ReceivedInstallmentDueProjection;
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

		if (installmentsDuesRequestPojo.getFromDate() == null || installmentsDuesRequestPojo.getToDate() == null) {
			return returnList;
		}

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

		if (starWithString == null) {
			return returnList;
		}

		boolean showReceivedDues = installmentsDuesRequestPojo.isShowReceivedDues();

		int i = 0;

		if (showReceivedDues) {

			// Received installment records
			List<ReceivedInstallmentDueProjection> loansList = emiRepo.getReceivedInstallmentDues(starWithString, from,
					to, installmentsDuesRequestPojo.isActiveLoans());

			switch (installmentsDuesRequestPojo.getOrderBy()) {

			case LOAN_START_DATE:
				loansList.sort(Comparator.comparing(ReceivedInstallmentDueProjection::getStartDate,
						Comparator.nullsLast(Comparator.naturalOrder())));
				break;

			case PARTNER:
				loansList.sort(Comparator.comparing(ReceivedInstallmentDueProjection::getCustomerName,
						Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)));
				break;

			case INSTALLMENT_BALANCE:
				loansList.sort(Comparator.comparing(ReceivedInstallmentDueProjection::getDueAmount,
						Comparator.nullsLast(Comparator.naturalOrder())).reversed());
				break;

			case INSTALLMENT_DATE:
				loansList.sort(Comparator.comparingInt(
						loan -> loan.getStartDate() != null ? loan.getStartDate().getDayOfMonth() : Integer.MAX_VALUE));
				break;

			case DELAYED_DAYS:
				loansList.sort(
						Comparator.comparingLong((ReceivedInstallmentDueProjection dto) -> dto.getEndDate() != null
								? ChronoUnit.DAYS.between(dto.getEndDate(), LocalDateTime.now())
								: Long.MIN_VALUE).reversed());
				break;
			}

			for (ReceivedInstallmentDueProjection bm : loansList) {

				if (bm.getCurrentMonthPaidAmount() == null
						|| bm.getCurrentMonthPaidAmount().compareTo(BigDecimal.ZERO) == 0) {
					continue;
				}

				InstallmentDuesPojo dto = new InstallmentDuesPojo();

				dto.setSno(++i);
				dto.setLoanId(bm.getLoanId());
				dto.setCustomerName(bm.getCustomerName());
				dto.setCustomerMobile(bm.getCustomerMobile());
				dto.setPartnerName(bm.getPartnerName());
				dto.setGuarentorName(bm.getGuarantorName());

				dto.setStartDate(bm.getStartDate() != null ? bm.getStartDate().format(fmt) : "");

				dto.setEndDate(bm.getEndDate() != null ? bm.getEndDate().format(fmt) : "");

				dto.setAmount(bm.getLoanAmount());
				dto.setInstallmentAmount(bm.getInstallmentAmount());
				dto.setNoOfInstallmentsPending(bm.getPendingCount());
				dto.setAmountPaid(bm.getPaidAmount());
				dto.setInstallmentDue(bm.getDueAmount());
				dto.setRemarks("");
				dto.setTotalNoOfInstallments(bm.getTotalNoOfInstallments());
				dto.setNoOfInstallmentsPaid(bm.getPaidInstallments());

				// Additional received amount for selected date range
				dto.setCurrentMonthPaidAmount(bm.getCurrentMonthPaidAmount());

				returnList.add(dto);
			}

		} else {

			// Normal pending installment records
			List<InstallmentDueProjection> loansList = emiRepo.getInstallmentDues(starWithString, to,
					installmentsDuesRequestPojo.isActiveLoans());

			switch (installmentsDuesRequestPojo.getOrderBy()) {

			case LOAN_START_DATE:
				loansList.sort(Comparator.comparing(InstallmentDueProjection::getStartDate,
						Comparator.nullsLast(Comparator.naturalOrder())));
				break;

			case PARTNER:
				loansList.sort(Comparator.comparing(InstallmentDueProjection::getCustomerName,
						Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)));
				break;

			case INSTALLMENT_BALANCE:
				loansList.sort(Comparator.comparing(InstallmentDueProjection::getDueAmount,
						Comparator.nullsLast(Comparator.naturalOrder())).reversed());
				break;

			case INSTALLMENT_DATE:
				loansList.sort(Comparator.comparingInt(
						loan -> loan.getStartDate() != null ? loan.getStartDate().getDayOfMonth() : Integer.MAX_VALUE));
				break;

			case DELAYED_DAYS:
				loansList.sort(Comparator.comparingLong((InstallmentDueProjection dto) -> dto.getEndDate() != null
						? ChronoUnit.DAYS.between(dto.getEndDate(), LocalDateTime.now())
						: Long.MIN_VALUE).reversed());
				break;
			}

			for (InstallmentDueProjection bm : loansList) {

				InstallmentDuesPojo dto = new InstallmentDuesPojo();

				dto.setSno(++i);
				dto.setLoanId(bm.getLoanId());
				dto.setCustomerName(bm.getCustomerName());
				dto.setCustomerMobile(bm.getCustomerMobile());
				dto.setPartnerName(bm.getPartnerName());
				dto.setGuarentorName(bm.getGuarantorName());

				dto.setStartDate(bm.getStartDate() != null ? bm.getStartDate().format(fmt) : "");

				dto.setEndDate(bm.getEndDate() != null ? bm.getEndDate().format(fmt) : "");

				dto.setAmount(bm.getLoanAmount());
				dto.setInstallmentAmount(bm.getInstallmentAmount());
				dto.setNoOfInstallmentsPending(bm.getPendingCount());
				dto.setAmountPaid(bm.getPaidAmount());
				dto.setInstallmentDue(bm.getDueAmount());
				dto.setRemarks("");
				dto.setTotalNoOfInstallments(bm.getTotalNoOfInstallments());
				dto.setNoOfInstallmentsPaid(bm.getPaidInstallments());

				returnList.add(dto);
			}
		}

		return returnList;
	}
}