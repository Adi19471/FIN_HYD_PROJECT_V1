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
import com.balaji.finance.pojo.LoanReportDTO;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

@Service
public class LoanReportService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private CashBookRepo cashBookRepo;
	
	
	@Autowired
	private EmiRepo emiRepo;

	private static final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	public List<LoanReportDTO> getLoanReport(LocalDate fromDate, LocalDate toDate) {

	    List<BusinessMember> loansList;

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

	        // ---------------- PAYMENTS ----------------
	        BigDecimal totalPrinciplePaid = BigDecimal.ZERO;
	        BigDecimal totalIntrestPaid = BigDecimal.ZERO;

	        List<CashBook> payments = cashBookRepo.findByBusinessMember(bm);

	        if (bm.getBusinessMemberId().startsWith("MF")) {

	            totalPrinciplePaid = payments.stream()
	                    .filter(cb -> "MF LOAN INSTALLMENT"
	                            .equalsIgnoreCase(cb.getAccountMasterCode()))
	                    .map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
	                    .reduce(BigDecimal.ZERO, BigDecimal::add);

	            totalIntrestPaid = payments.stream()
	                    .filter(cb -> "MF INTEREST"
	                            .equalsIgnoreCase(cb.getAccountMasterCode()))
	                    .map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
	                    .reduce(BigDecimal.ZERO, BigDecimal::add);

	        } else if (bm.getBusinessMemberId().startsWith("DF")) {

	            totalPrinciplePaid = payments.stream()
	                    .filter(cb -> "DF LOAN INSTALLMENT"
								.equalsIgnoreCase(cb.getAccountMasterCode()))
						.map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
						.reduce(BigDecimal.ZERO, BigDecimal::add);

				totalIntrestPaid = payments.stream()
						.filter(cb -> "DF INTEREST".equalsIgnoreCase(cb.getAccountMasterCode()))
						.map(cb -> cb.getCredit() != null ? cb.getCredit() : BigDecimal.ZERO)
						.reduce(BigDecimal.ZERO, BigDecimal::add);
			}

			dto.setPrincipleAmountPaid(totalPrinciplePaid);
			dto.setInterestAmountPaid(totalIntrestPaid);
			// ---------------- EMI COUNT ----------------
			List<EMI> allEMIs = emiRepo.findByBusinessMember(bm);

			long paidEMICount = allEMIs.stream().filter(emi -> "PAID".equalsIgnoreCase(emi.getStatus())).count();

			dto.setNoofInstallmentsPaid((int) paidEMICount);

			// ---------------- EMI-BASED INSTALLMENT DUE ----------------

			BigDecimal installmentAmount = bm.getInstallment() != null ? bm.getInstallment() : BigDecimal.ZERO;

	        int totalInstallments = bm.getDuration() != null
	                ? bm.getDuration()
	                : 0;

	        BigDecimal expectedTotal = installmentAmount.multiply(
	                new BigDecimal(totalInstallments)
	        );

	        // Actually paid till now
	        //BigDecimal totalPaid = totalPrinciplePaid.add(totalIntrestPaid);

	        // EMI-based due calculation
	        BigDecimal installmentDue = expectedTotal.subtract(totalPrinciplePaid);

	        dto.setInstallmentDue(installmentDue.max(BigDecimal.ZERO));

	        // ---------------- OTHER FIELDS ----------------
	        dto.setStatus(bm.getLoanStatus() != null ? bm.getLoanStatus() : "UNKNOWN");
	        dto.setInterestAmount(bm.getInterest());
	        dto.setRemarks("");

	        returnList.add(dto);
	    }

	    return returnList;
	}
}