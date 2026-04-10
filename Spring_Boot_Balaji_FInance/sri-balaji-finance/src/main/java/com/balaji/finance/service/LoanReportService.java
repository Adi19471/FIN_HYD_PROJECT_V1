package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.pojo.LoanReportDTO;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class LoanReportService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	private static final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	public List<LoanReportDTO> getLoanReport(LocalDate fromDate, LocalDate toDate) {

		List<BusinessMember> loansList = null;
		if (fromDate != null && toDate != null) {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			loansList = businessMemberRepository.findByDateRange(from, to);
		} else {
			loansList = businessMemberRepository.findAll();
		}

		List<LoanReportDTO> returnList = new ArrayList<>();
		int i = 0;
		for (BusinessMember bm : loansList) {

			LoanReportDTO dto = new LoanReportDTO();
			dto.setSno(++i);
			dto.setLoanId(bm.getBusinessMemberId());
			dto.setCustomerName(bm.getCustomerId() != null ? bm.getCustomerId().getFirstName() : "");
			dto.setGuarentorName(bm.getGuarantor1() != null ? bm.getGuarantor1().getFirstName() : "");
			dto.setPartnerName(bm.getPartnerId() != null ? bm.getPartnerId().getFirstName() : "");

			dto.setStartDate(bm.getStartDate() != null ? bm.getStartDate().format(fmt) : "");
			dto.setEndDate(bm.getEndDate() != null ? bm.getEndDate().format(fmt) : "");

			dto.setAmount(bm.getAmount());
			BigDecimal totalPaid = BigDecimal.ZERO;

			if (bm.getBusinessMemberId().startsWith("MF")) {

				List<CashBook> payments = cashBookRepo.findByBusinessMember(bm);
				totalPaid = payments.stream()
						.filter(cb -> "MF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())
								|| "MF INTEREST".equalsIgnoreCase(cb.getAccountMasterCode()))
						.map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
						.reduce(BigDecimal.ZERO, BigDecimal::add);

				dto.setAmountPaid(totalPaid);

				int installmentsPaid = (int) payments.stream()
						.filter(cb -> "MF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())).count();

				dto.setNoofInstallmentsPaid(installmentsPaid);

			} else if (bm.getBusinessMemberId().startsWith("DF")) {

				List<CashBook> payments = cashBookRepo.findByBusinessMember(bm);
				totalPaid = payments.stream()
						.filter(cb -> "DF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())
								|| "DF INTEREST".equalsIgnoreCase(cb.getAccountMasterCode()))
						.map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
						.reduce(BigDecimal.ZERO, BigDecimal::add);

				dto.setAmountPaid(totalPaid);

				int installmentsPaid = (int) payments.stream()
						.filter(cb -> "MF LOAN INSTALLMENT".equalsIgnoreCase(cb.getAccountMasterCode())).count();

				dto.setNoofInstallmentsPaid(installmentsPaid);

			}

			// Installment due
			BigDecimal installmentAmount = bm.getInstallment();
			int totalInstallments = bm.getDuration() != null ? bm.getDuration() : 0;
			BigDecimal totalExpected = installmentAmount.multiply(new BigDecimal(totalInstallments));
			dto.setInstallmentDue(totalExpected.subtract(totalPaid));

			// Status
			dto.setStatus(bm.getLoanStatus() != null ? bm.getLoanStatus() : "UNKNOWN");

			dto.setRemarks(""); // fill if you have any remarks

			returnList.add(dto);
		}

		return returnList;
	}
}