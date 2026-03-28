package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BalanceSheetProjection;
import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.dto.SumOfCreditsAndDebitsProjection;
import com.balaji.finance.repo.CashBookRepo;

@Service
public class BalanceSheetService {

	@Autowired
	private CashBookRepo cashBookRepo;

	public List<BalanceSheetProjection> getBalanceSheetByTrasncDate(LocalDate toDate) {

		LocalDateTime to = toDate.atTime(23, 59, 59);

		BigDecimal openingBalanceForToDatePlusOneDay = Optional.ofNullable(cashBookRepo.findOpeningBalanceForDate(toDate.plusDays(1)))
				.orElse(BigDecimal.ZERO);
		
		List<BalanceSheetProjection> balanceSheetByTrasncDate = cashBookRepo.getBalanceSheetByTrasncDate(to,
				Arrays.asList("ASSETS", "LIABILITIES"));

		BalanceSheetProjection cashOnHandProjection = new BalanceSheetProjection() {

			@Override
			public String getType() {
				return "ASSETS";
			}

			@Override
			public String getMasterCode() {
				return "CASH ON HAND";
			}

			@Override
			public String getCode() {
				return "CASH ON HAND";
			}

			@Override
			public BigDecimal getAmount() {
				return openingBalanceForToDatePlusOneDay;
			}
		};

		balanceSheetByTrasncDate.add(cashOnHandProjection);

		return balanceSheetByTrasncDate;
	}

}