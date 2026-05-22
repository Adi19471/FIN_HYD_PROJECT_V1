package com.balaji.finance.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.pojo.QuickCashBookRow;
import com.balaji.finance.pojo.QuickCashBookSaveRequest;
import com.balaji.finance.repo.BusinessMemberRepository;

import jakarta.transaction.Transactional;

@Service
public class QuickCashBookService {
	
	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private DailyLoanInstallmentPaymentService dailyLoanInstallmentPaymentService;

	@Autowired
	private MonthlyLoanInstallmentPaymentService monthlyLoanInstallmentPaymentService;

	@Transactional
	public QuickCashBookRow retriveQuickCashBookRecord(String loanId) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);
		if (!opt.isPresent()) {
			return null;
		}

		BusinessMember bm = opt.get();
		if (bm.getCustomerId() == null || bm.getCustomerId().getFirstName() == null) {
			return null;
		}

		if (bm.getStartDate() == null || bm.getEndDate() == null) {
			return null;
		}

		QuickCashBookRow quickCashBookRow = new QuickCashBookRow();
		quickCashBookRow.setAccountNo(bm.getBusinessMemberId());
		quickCashBookRow.setName(bm.getCustomerId().getPersonalInfoId() + "-" + bm.getCustomerId().getFirstName());
		quickCashBookRow.setInstallment(bm.getInstallment());

		quickCashBookRow.setDueAmount(null);
		quickCashBookRow.setLateFee(null);

		quickCashBookRow.setPaidAmount(null);
		quickCashBookRow.setPaidLateFee(null);

		return quickCashBookRow;

	}

	@Transactional
	public void saveQuickCashBookRecords(QuickCashBookSaveRequest quickCashBookSaveRequest) {

		LocalDateTime currentInstallmentDate = quickCashBookSaveRequest.getTransactionDate().atTime(LocalTime.now());
		List<QuickCashBookRow> quickCashBookRows = quickCashBookSaveRequest.getQuickCashBookRows();

		for (QuickCashBookRow quickCashBookRow : quickCashBookRows) {

			if (quickCashBookRow.getAccountNo().startsWith("MF")) {
				
				monthlyLoanInstallmentPaymentService.saveMFLoanInstallmentFromQuickCashBook(
						quickCashBookRow.getAccountNo(), quickCashBookRow, currentInstallmentDate);
			
			} else if (quickCashBookRow.getAccountNo().startsWith("DF")) {
				
				dailyLoanInstallmentPaymentService.saveDFLoanInstallmentFromQuickCashBook(
						quickCashBookRow.getAccountNo(), quickCashBookRow, currentInstallmentDate);

			}

		}

	}

}
