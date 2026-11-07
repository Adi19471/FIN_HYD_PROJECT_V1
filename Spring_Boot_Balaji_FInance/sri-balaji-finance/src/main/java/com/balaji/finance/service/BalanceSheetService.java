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
import com.balaji.finance.dto.LoanCollectionWithOutInterestProjection;
import com.balaji.finance.dto.RevenueExpenseProfitProjection;
import com.balaji.finance.pojo.BalanceSheetDTO;
import com.balaji.finance.pojo.BalanceSheetResponsePojo;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class BalanceSheetService {

	@Autowired
	private CashBookRepo cashBookRepo;
	
	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	public BalanceSheetResponsePojo getBalanceSheetByTrasncDate(LocalDate toDate) {

		LocalDateTime to = toDate.atTime(23, 59, 59);

		BigDecimal openingBalanceForToDatePlusOneDay = Optional.ofNullable(cashBookRepo.findOpeningBalanceForDate(toDate.plusDays(1)))
				.orElse(BigDecimal.ZERO);
		
		List<RevenueExpenseProfitProjection> revenueExpenseProfitProjectionList = cashBookRepo.getProfitByTranscDate(to);

		BigDecimal revenues = BigDecimal.ZERO;
		BigDecimal expenses = BigDecimal.ZERO;

		for (RevenueExpenseProfitProjection rep : revenueExpenseProfitProjectionList) {

		    BigDecimal amount = rep.getAmount() != null
		            ? rep.getAmount()
		            : BigDecimal.ZERO;

		    String type = rep.getType();

		    if ("REVENUES".equalsIgnoreCase(type)) {
		        revenues = revenues.add(amount);
		    } else if ("EXPENSES".equalsIgnoreCase(type)) {
		        expenses = expenses.add(amount);
		    }
		}

		BigDecimal profitByTranscDate = revenues.subtract(expenses);
		
		
		List<BalanceSheetProjection> balanceSheetByTrasncDate = cashBookRepo.getBalanceSheetByTrasncDate(to,
				Arrays.asList("ASSETS", "LIABILITIES"));
		
		LoanCollectionWithOutInterestProjection loanCollectionWithOutInterestProjection = cashBookRepo.getLoanCollectionDataUptoDate(to);
		
		
		for (int i = 0; i < balanceSheetByTrasncDate.size(); i++) {

		    BalanceSheetProjection bsp = balanceSheetByTrasncDate.get(i);

		    BigDecimal amount = Optional.ofNullable(bsp.getAmount())
		            .orElse(BigDecimal.ZERO);

		    if ("DF LOAN".equalsIgnoreCase(bsp.getCode())) {

		        BigDecimal dailyInstallments = Optional.ofNullable(
		                loanCollectionWithOutInterestProjection
		                        .getDailyLoanInstallmentsReceived())
		                .orElse(BigDecimal.ZERO);

		        amount = amount.subtract(dailyInstallments);

		    } else if ("MF LOAN".equalsIgnoreCase(bsp.getCode())) {

		        BigDecimal monthlyInstallments = Optional.ofNullable(
		                loanCollectionWithOutInterestProjection
		                        .getMonthlyLoanInstallmentsReceived())
		                .orElse(BigDecimal.ZERO);

		        amount = amount.subtract(monthlyInstallments);
		    }

		    balanceSheetByTrasncDate.set(i,
		            new BalanceSheetDTO(
		                    bsp.getType(),
		                    bsp.getMasterCode(),
		                    bsp.getCode(),
		                    amount
		            ));
		}

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
		
		
		BalanceSheetProjection profit = new BalanceSheetProjection() {

			@Override
			public String getType() {
				return "LIABILITIES";
			}

			@Override
			public String getMasterCode() {
				return "PROFIT";
			}

			@Override
			public String getCode() {
				return "PROFIT";
			}

			@Override
			public BigDecimal getAmount() {
				return profitByTranscDate;
			}
		};
		
		

		balanceSheetByTrasncDate.add(cashOnHandProjection);
		balanceSheetByTrasncDate.add(profit);

		
		BalanceSheetResponsePojo balanceSheetResponsePojo = new BalanceSheetResponsePojo();
		balanceSheetResponsePojo.setBalanceSheetProjections(balanceSheetByTrasncDate);
		balanceSheetResponsePojo.setTotalShares(personalInfoRepository.findTotalShares());
		
		return balanceSheetResponsePojo;
	}

}