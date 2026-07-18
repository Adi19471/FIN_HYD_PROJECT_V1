package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.pojo.MaturedLoansPojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

@Service
public class MaturityLoansService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private EmiRepo emiRepo;

	private static final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	public List<MaturedLoansPojo> getMaturityLoans(LocalDate fromDate, LocalDate toDate, String loanType) {

		List<MaturedLoansPojo> returnList = new ArrayList<>();

		List<BusinessMember> loansList = null;
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

			loansList = businessMemberRepository.findAllByLoanTypeAndEndDateRange(starWithString, from, to,"ACTIVE");

			int i = 0;
			for (BusinessMember bm : loansList) {

				MaturedLoansPojo dto = new MaturedLoansPojo();
				dto.setSno(++i);
				dto.setLoanId(bm.getBusinessMemberId());
				dto.setCustomerName(bm.getCustomerId() != null ? bm.getCustomerId().getFirstName() : "");
				dto.setGuarentorName(bm.getGuarantor1() != null ? bm.getGuarantor1().getFirstName() : "");
				dto.setPartnerName(bm.getPartnerId() != null ? bm.getPartnerId().getFirstName() : "");

				dto.setStartDate(bm.getStartDate() != null ? bm.getStartDate().format(fmt) : "");
				dto.setEndDate(bm.getEndDate() != null ? bm.getEndDate().format(fmt) : "");

				dto.setAmount(bm.getAmount());
				dto.setTotalNoOfInstallments(bm.getDuration());
				dto.setInstallmentAmount(bm.getInstallment());

				List<EMI> allEMIs = emiRepo.findByBusinessMember(bm);
				List<EMI> completedEMIs = allEMIs.stream().filter(emi -> emi.getStatus().equalsIgnoreCase("PAID"))
						.collect(Collectors.toList());

				dto.setNoOfInstallmentsPaid(completedEMIs.size());
				dto.setNoOfInstallmentsPending(bm.getDuration() - completedEMIs.size());

				BigDecimal totalPaid = BigDecimal.ZERO;

				if (bm.getBusinessMemberId().startsWith("MF")) {

					List<CashBook> payments = cashBookRepo.findByBusinessMember(bm);
					totalPaid = payments.stream()
							.filter(cb -> "MF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())
									|| "MF INTEREST".equalsIgnoreCase(cb.getAccountMasterCode()))
							.map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
							.reduce(BigDecimal.ZERO, BigDecimal::add);

					dto.setAmountPaid(totalPaid);

				} else if (bm.getBusinessMemberId().startsWith("DF")) {

					List<CashBook> payments = cashBookRepo.findByBusinessMember(bm);
					totalPaid = payments.stream()
							.filter(cb -> "DF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())
									|| "DF INTEREST".equalsIgnoreCase(cb.getAccountMasterCode()))
							.map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
							.reduce(BigDecimal.ZERO, BigDecimal::add);

					dto.setAmountPaid(totalPaid);

				}

				// Installment due
				BigDecimal installmentAmount = bm.getInstallment();
				int totalInstallments = bm.getDuration() != null ? bm.getDuration() : 0;

				BigDecimal totalToBePaid = bm.getAmount().add(bm.getInterest());

				dto.setInstallmentDue(totalToBePaid.subtract(totalPaid));
				dto.setRemarks(""); // fill if you have any remarks

				returnList.add(dto);
			}
		}

		return returnList;
	}
}