package com.balaji.finance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class RevenueExpenseService {

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<RevenueExpenseProjection> getRevenueExpenseStatementByTrasncDate(LocalDate fromDate, LocalDate toDate) {

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		return cashBookRepo.getRevenueExpenseStatementByTrasncDate(from, to);
	}

	public List<RevenueExpenseProjection> getRevenueExpenseStatement() {
		return cashBookRepo.getRevenueExpenseStatement();
	}
}