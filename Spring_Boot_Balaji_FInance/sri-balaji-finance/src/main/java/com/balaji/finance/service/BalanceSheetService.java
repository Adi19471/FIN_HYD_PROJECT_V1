package com.balaji.finance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BalanceSheetProjection;
import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class BalanceSheetService {

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<BalanceSheetProjection> getBalanceSheetByTrasncDate(LocalDate fromDate, LocalDate toDate) {

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		return cashBookRepo.getBalanceSheetByTrasncDate(from, to, Arrays.asList("ASSETS", "LIABILITIES"));
	}

	public List<BalanceSheetProjection> getBalanceSheet() {
		return cashBookRepo.getBalanceSheet(Arrays.asList("ASSETS", "LIABILITIES"));
	}
}