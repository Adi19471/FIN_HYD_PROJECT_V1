package com.balaji.finance.masterInfo.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.masterInfo.entity.BusinessMember;
import com.balaji.finance.masterInfo.repo.BusinessMemberRepository;
import com.balaji.finance.pojo.QuickCashBookRow;
import com.balaji.finance.pojo.QuickCashBookSaveRequest;

@Service
public class QuickCashBookService {
	
	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private DailyLoanInstallmentPaymentService dailyLoanInstallmentPaymentService;

	@Autowired
	private MonthlyLoanInstallmentPaymentService monthlyLoanInstallmentPaymentService;

	public QuickCashBookRow retriveQuickCashBookRecord(String loanId) {

		Optional<BusinessMember> opt = businessMemberRepository.findById(loanId);
		if (!opt.isPresent()) {
			return null;
		}

		BusinessMember bm = opt.get();
		if (bm.getCustomerId() == null || bm.getCustomerId().getFirstname() == null) {
			return null;
		}

		if (bm.getStartDate() == null || bm.getEndDate() == null) {
			return null;
		}

		QuickCashBookRow quickCashBookRow = new QuickCashBookRow();
		quickCashBookRow.setAccountNo(bm.getId());
		quickCashBookRow.setName(bm.getCustomerId().getId() + "-" + bm.getCustomerId().getFirstname());
		quickCashBookRow.setInstallment(bm.getInstallment());

		quickCashBookRow.setDueAmount(null);
		quickCashBookRow.setLateFee(null);

		quickCashBookRow.setPaidAmount(null);
		quickCashBookRow.setPaidLateFee(null);

		return quickCashBookRow;

	}

	public void saveQuickCashBookRecords(QuickCashBookSaveRequest quickCashBookSaveRequest) {

		String transactionDate = quickCashBookSaveRequest.getTransactionDate();

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime currentInstallmentDate = LocalDateTime.parse(transactionDate, formatter);

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
