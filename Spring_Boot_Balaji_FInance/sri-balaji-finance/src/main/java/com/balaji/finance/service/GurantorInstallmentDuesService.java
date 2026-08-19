package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
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

	public List<GuarantorInstallmentDuesResponse> getGuarantorInstallmentDuesList(String guarantorId,
			boolean activeLoans, boolean lateFee) {

		List<GuarantorInstallmentDuesResponse> returnList = new ArrayList<>();

		String status = activeLoans ? "ACTIVE" : "COMPLETED";

		List<GuarantorDuesProjection> allLoansOnGuarantor;

		if (guarantorId == null || guarantorId.isEmpty()) {
			allLoansOnGuarantor = businessMemberRepository.getAllLoansOnGuarantor(status);
		} else {
			allLoansOnGuarantor = businessMemberRepository.getAllLoansOnGuarantor(guarantorId, status);
		}

		int sno = 0;

		LocalDate today = LocalDate.now();

		for (GuarantorDuesProjection projection : allLoansOnGuarantor) {

			GuarantorInstallmentDuesResponse response = new GuarantorInstallmentDuesResponse();

			response.setSno(++sno);

			response.setLoanId(projection.getBusinessMemberId());

			// ---------------------------------------------------------
			// Customer
			// ---------------------------------------------------------

			response.setCustomerName(String.format("%s %s %s", safe(projection.getCustomerId()),
					safe(projection.getCustomerFirstName()), safe(projection.getCustomerPhoneNumber())));

			// ---------------------------------------------------------
			// Guarantor
			// ---------------------------------------------------------

			response.setGuarantorName(String.format("%s %s %s", safe(projection.getGuarentorId()),
					safe(projection.getGuarentorFirstName()), safe(projection.getGuarentorPhoneNumber())));

			// ---------------------------------------------------------
			// Dates
			// ---------------------------------------------------------

			LocalDate startDate = null;
			LocalDate endDate = null;

			if (projection.getStartDate() != null) {

				startDate = projection.getStartDate().toLocalDate();

				response.setStartDate(startDate);
			}

			if (projection.getEndDate() != null) {

				endDate = projection.getEndDate().toLocalDate();

				response.setEndDate(endDate);
			}

			// ---------------------------------------------------------
			// Financials
			// ---------------------------------------------------------

			BigDecimal loanAmount = projection.getAmount();

			BigDecimal installmentAmount = projection.getInstallmentPerMonth();

			BigDecimal totalPaid = projection.getTotalInstallmentAmountPaid() == null ? BigDecimal.ZERO
					: projection.getTotalInstallmentAmountPaid();

			int duration = projection.getDuration() == null ? 0 : projection.getDuration();

			int paidInstallments = projection.getNoOfEmisPaid() == null ? 0 : projection.getNoOfEmisPaid();

			response.setAmount(loanAmount);

			response.setDuration(duration);

			response.setInstallmentAmount(installmentAmount);

			response.setTotalAmountPaid(totalPaid);

			response.setNoOfInstallmentsPaid(paidInstallments);

			// ---------------------------------------------------------
			// Calculate EMI due
			// ---------------------------------------------------------

			int installmentsDue = 0;

			int installmentsPending = 0;

			BigDecimal installmentDueAmount = BigDecimal.ZERO;

			LocalDate nextDueDate = null;

			if (startDate != null && duration > 0) {

				/*
				 * EMI starts one month after the loan start date.
				 *
				 * Example:
				 *
				 * Start Date = 10-Jan
				 *
				 * EMI 1 = 10-Feb EMI 2 = 10-Mar EMI 3 = 10-Apr
				 *
				 */

				LocalDate firstDueDate = startDate.plusMonths(1);

				// -----------------------------------------------------
				// Calculate number of EMIs whose due date has arrived
				// -----------------------------------------------------

				if (!today.isBefore(firstDueDate)) {

					int months = (int) ChronoUnit.MONTHS.between(YearMonth.from(firstDueDate), YearMonth.from(today));

					LocalDate dueDateThisMonth = firstDueDate.plusMonths(months);

					/*
					 * Exact day-wise check.
					 *
					 * Example:
					 *
					 * EMI date = 20th Today = 19th
					 *
					 * This month's EMI is NOT due yet.
					 *
					 * EMI date = 20th Today = 20th
					 *
					 * This month's EMI IS due.
					 */

					if (today.isBefore(dueDateThisMonth)) {
						months--;
					}

					installmentsDue = months + 1;

					// Never exceed loan duration
					installmentsDue = Math.min(installmentsDue, duration);
				}

				// -----------------------------------------------------
				// Unpaid installments which are currently due
				// -----------------------------------------------------

				installmentsPending = Math.max(0, installmentsDue - paidInstallments);

				// -----------------------------------------------------
				// Due amount
				// -----------------------------------------------------

				if (installmentAmount != null) {

					installmentDueAmount = installmentAmount.multiply(BigDecimal.valueOf(installmentsPending));
				}

				// -----------------------------------------------------
				// Next unpaid EMI date
				// -----------------------------------------------------

				nextDueDate = startDate.plusMonths(paidInstallments + 1);

				/*
				 * If loan is completed, there is no next due date.
				 */

				if (paidInstallments >= duration) {
					nextDueDate = null;
				}

				response.setDueDate(nextDueDate);
			}

			// ---------------------------------------------------------
			// Set EMI due information
			// ---------------------------------------------------------

			response.setNoOfInstallmentsPending(installmentsPending);

			response.setInstallmentDue(installmentDueAmount);

			// ---------------------------------------------------------
			// Balance amount
			// ---------------------------------------------------------

			if (loanAmount != null) {

				BigDecimal balanceAmount = loanAmount.subtract(totalPaid);

				response.setBalanceAmount(balanceAmount);
			}

			// ---------------------------------------------------------
			// Loan type
			// ---------------------------------------------------------

			response.setLoanType(projection.getLoanType());

			returnList.add(response);
		}

		return returnList;
	}

	private String safe(Object value) {
		return value == null ? "" : value.toString();
	}

}
