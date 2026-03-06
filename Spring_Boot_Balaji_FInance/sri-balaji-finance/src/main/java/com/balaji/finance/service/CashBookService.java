package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.DateWiseCashBookProjection;
import com.balaji.finance.dto.DateWiseCollectionsProjection;
import com.balaji.finance.dto.SummaryByParticularsProjection;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.CashBookBackUp;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.pojo.AccountsLedgerPojo;
import com.balaji.finance.pojo.AccountsMasterLedgerPojo;
import com.balaji.finance.pojo.CashBookDeletedViewPojo;
import com.balaji.finance.pojo.CashBookLedgerCollectionsPojo;
import com.balaji.finance.pojo.CashBookLedgerPojo;
import com.balaji.finance.pojo.CashBookSumaryViewPojo;
import com.balaji.finance.pojo.CashBookViewPojo;
import com.balaji.finance.pojo.DayWiseTransactionsSummary;
import com.balaji.finance.pojo.ReceiptsLedgerPojo;
import com.balaji.finance.pojo.UserCollectionsLedgerPojo;
import com.balaji.finance.repo.CashBookBackUpRepo;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;

import jakarta.transaction.Transactional;

@Service
public class CashBookService {


	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private CashBookBackUpRepo cashBookBkRepo;


	@Autowired
	private EmiRepo emiRepo;


	public List<CashBookViewPojo> loadAllCashBookDetailsByTransactionDate(LocalDate transactionDate) {
		
		LocalDateTime start = transactionDate.atStartOfDay();
		LocalDateTime end = transactionDate.plusDays(1).atStartOfDay();

		List<CashBook> byTransDate = cashBookRepo.findByTransactionDate(start,end);

		List<CashBookViewPojo> cashBookViewPojoList = new ArrayList<CashBookViewPojo>();

		for (CashBook cashBook : byTransDate) {

			CashBookViewPojo cashBookViewPojo = new CashBookViewPojo();
			cashBookViewPojo.setTransactionId(cashBook.getCashBookId());
			cashBookViewPojo.setAccountNumber(cashBook.getBusinessMember().getBusinessMemberId());
			cashBookViewPojo.setName(cashBook.getPersonalInfo() != null
					? cashBook.getPersonalInfo().getPersonalInfoId() + " - " + cashBook.getPersonalInfo().getFirstName()
					: "");
			cashBookViewPojo.setParticulars(cashBook.getParticulars());
			cashBookViewPojo.setTransactionType(cashBook.getTransType());
			cashBookViewPojo.setCredit(cashBook.getCredit());
			cashBookViewPojo.setDebit(cashBook.getDebit());

			cashBookViewPojoList.add(cashBookViewPojo);

		}

		return cashBookViewPojoList;

	}

	public List<CashBookDeletedViewPojo> loadAllDayWiseDeletedTransactions(LocalDate transactionDate) {

		LocalDateTime start = transactionDate.atStartOfDay();
		LocalDateTime end = transactionDate.plusDays(1).atStartOfDay();

		List<CashBookBackUp> byTransDate = cashBookBkRepo.findByTransDateBetween(start, end);

		List<CashBookDeletedViewPojo> cashBookDeleteViewPojoList = new ArrayList<CashBookDeletedViewPojo>();
		DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		
		for (CashBookBackUp cashBook : byTransDate) {

			CashBookDeletedViewPojo cashBookDeletedViewPojo = new CashBookDeletedViewPojo();
			cashBookDeletedViewPojo.setTransactionId(cashBook.getCashBookBackUpId());
			cashBookDeletedViewPojo.setAccountNumber(cashBook.getBusinessMember().getBusinessMemberId());
			cashBookDeletedViewPojo.setName(cashBook.getPersonalInfo() != null
					? cashBook.getPersonalInfo().getPersonalInfoId() + " - " + cashBook.getPersonalInfo().getFirstName()
					: "");
			cashBookDeletedViewPojo.setParticulars(cashBook.getParticulars());
			cashBookDeletedViewPojo.setTransactionType(cashBook.getTransType());
			cashBookDeletedViewPojo.setCredit(cashBook.getCredit());
			cashBookDeletedViewPojo.setDebit(cashBook.getDebit());
			cashBookDeletedViewPojo.setDeletedByUser(cashBook.getDeletedBy());
			cashBookDeletedViewPojo.setDeletedDate(cashBook.getDeletedDate().format(fmt));

			cashBookDeleteViewPojoList.add(cashBookDeletedViewPojo);

		}

		return cashBookDeleteViewPojoList;

	}

	@Transactional
	public String deleteCashBook(List<Long> transactionIdList, String comments) {

		List<Long> errorIds = new ArrayList<Long>();

		for (Long transactionId : transactionIdList) {

			Optional<CashBook> byId = cashBookRepo.findById(transactionId);

			if (byId.isPresent()) {
				
				CashBook cashBook = byId.get();
				
				String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

				CashBookBackUp cashBookBk = new CashBookBackUp();
				cashBookBk.setBusinessMember(cashBook.getBusinessMember());
				cashBookBk.setBmRemarks(cashBook.getBmRemarks());
				cashBookBk.setComments(comments);
				cashBookBk.setCredit(cashBook.getCredit());
				cashBookBk.setPersonalInfo(cashBook.getPersonalInfo());
				cashBookBk.setDebit(cashBook.getDebit());

				cashBookBk.setCashBookOldId(cashBook.getCashBookId());
				cashBookBk.setLineNo(cashBook.getLineNo());
				cashBookBk.setParticulars(cashBook.getParticulars());
				cashBookBk.setReceiptRemarks(cashBook.getReceiptRemarks());
				cashBookBk.setSysDate(cashBook.getSysDate());
				cashBookBk.setTransDate(cashBook.getTransDate());
				cashBookBk.setEntryUser(cashBook.getUser());
				cashBookBk.setTransType(cashBook.getTransType());

				cashBookBk.setDeletedBy(currentUser);
				cashBookBk.setDeletedDate(LocalDateTime.now());

				cashBookBkRepo.save(cashBookBk);
				
				
				
				cashBookRepo.deleteById(transactionId);
				
			} else {
				errorIds.add(transactionId);
			}

		}

		if (errorIds.isEmpty()) {
			return "Successfully deleted";
		} else {
			return "Already Deleted Ids " + errorIds;
		}

	}
	
	
	public DayWiseTransactionsSummary loadAllDayWiseTransactionsSummary(LocalDate transactionDate) {

		LocalDateTime start = transactionDate.atStartOfDay();
		LocalDateTime end = transactionDate.plusDays(1).atStartOfDay();

		List<CashBook> byTransDate = cashBookRepo.findByTransactionDate(start, end);
		

		List<CashBookSumaryViewPojo> cashBookViewPojoList = new ArrayList<CashBookSumaryViewPojo>();

		for (CashBook cashBook : byTransDate) {

			CashBookSumaryViewPojo cashBookViewPojo = new CashBookSumaryViewPojo();
			cashBookViewPojo.setTransactionId(cashBook.getCashBookId());
			cashBookViewPojo.setAccountNumber(cashBook.getBusinessMember() != null  ? cashBook.getBusinessMember().getBusinessId() : "");
			cashBookViewPojo.setName(cashBook.getPersonalInfo() != null
					? cashBook.getPersonalInfo().getPersonalInfoId() + " - " + cashBook.getPersonalInfo().getFirstName()
					: "");
			cashBookViewPojo.setParticulars(cashBook.getParticulars());
			cashBookViewPojo.setTransactionType(cashBook.getTransType());
			cashBookViewPojo.setCredit(cashBook.getCredit());
			cashBookViewPojo.setDebit(cashBook.getDebit());
			cashBookViewPojo.setUser(cashBook.getUser());

			cashBookViewPojoList.add(cashBookViewPojo);

		}
		
		BigDecimal openingBalanceForToday =
		        Optional.ofNullable(cashBookRepo.findOpeningBalanceForDate(transactionDate))
		                .orElse(BigDecimal.ZERO);
		
		DayWiseTransactionsSummary dayWiseTransactionsSummary = new DayWiseTransactionsSummary();
		dayWiseTransactionsSummary.setCashBookSumaryViewPojoList(cashBookViewPojoList);
		dayWiseTransactionsSummary.setOpeningBalance(openingBalanceForToday);

		return dayWiseTransactionsSummary;

	}
	
	public List<CashBookLedgerPojo> getCashBookLedger(LocalDate fromDate, LocalDate toDate) {
		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<DateWiseCashBookProjection> rows = cashBookRepo.getDateWiseCashBook(from, to);

		List<CashBookLedgerPojo> result = new ArrayList<>();

		long i = 0;

		BigDecimal runningBalance = Optional.ofNullable(cashBookRepo.findOpeningBalanceForDate(fromDate))
				.orElse(BigDecimal.ZERO);

		for (DateWiseCashBookProjection r : rows) {

			CashBookLedgerPojo cashBookLedger = new CashBookLedgerPojo();

			cashBookLedger.setSno(++i);

			cashBookLedger.setDate(r.getTxnDate());

			cashBookLedger.setCredit(r.getCredit());
			cashBookLedger.setDebit(r.getDebit());
			cashBookLedger.setBalance(r.getBalance());

			runningBalance = runningBalance.add(r.getBalance());

			cashBookLedger.setClosingBalance(runningBalance);

			result.add(cashBookLedger);
		}

		return result;
	}

	public List<CashBookLedgerCollectionsPojo> getCollectionsOnlyCBLedgerData(LocalDate fromDate, LocalDate toDate) {

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<DateWiseCollectionsProjection> rows = cashBookRepo.getDateWiseCashBookCollectionsOnly(from, to);

		List<CashBookLedgerCollectionsPojo> result = new ArrayList<>();

		long i = 0;

		for (DateWiseCollectionsProjection r : rows) {

			CashBookLedgerCollectionsPojo cashBookLedger = new CashBookLedgerCollectionsPojo();
			cashBookLedger.setSno(++i);
			cashBookLedger.setDate(r.getTxnDate());
			cashBookLedger.setMonthlyFinanceCollections(r.getMonthlyTotal());
			cashBookLedger.setDailyFinanceCollections(r.getDailyTotal());
			
			
			
			BigDecimal monthly = Optional.ofNullable(r.getMonthlyTotal()).orElse(BigDecimal.ZERO);
			BigDecimal daily = Optional.ofNullable(r.getDailyTotal()).orElse(BigDecimal.ZERO);

			cashBookLedger.setMonthlyFinanceCollections(monthly);
			cashBookLedger.setDailyFinanceCollections(daily);
			cashBookLedger.setTotal(monthly.add(daily));
			

			result.add(cashBookLedger);
		}

		return result;
	}
	
	
	public List<AccountsLedgerPojo> getAccountsLedgerData(LocalDate fromDate, LocalDate toDate) {

		List<SummaryByParticularsProjection> rows = new ArrayList<SummaryByParticularsProjection>();

		if (fromDate == null && toDate == null) {

			rows = cashBookRepo.getSummaryByParticulars();

		} else {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			rows = cashBookRepo.getSummaryByParticulars(from, to);

		}

		List<AccountsLedgerPojo> result = new ArrayList<>();

		long i = 0;

		for (SummaryByParticularsProjection r : rows) {

			AccountsLedgerPojo accountsLedger = new AccountsLedgerPojo();
			accountsLedger.setSno(++i);
			accountsLedger.setCredit(r.getCredit());
			accountsLedger.setDebit(r.getDebit());
			accountsLedger.setBalance(r.getBalance());
			accountsLedger.setAccountMaster(r.getParticulars());
			
			result.add(accountsLedger);
		}

		return result;
	}
	
	public List<AccountsMasterLedgerPojo> getRecordsByAccountMasterCode(String transacType, LocalDate fromDate,
			LocalDate toDate) {

		List<CashBook> rows = new ArrayList<CashBook>();

		if (fromDate == null && toDate == null) {

			rows = cashBookRepo.findByTransType(transacType);

		} else {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			rows = cashBookRepo.findByTransTypeAndTransDateBetween(transacType, from, to);

		}

		List<AccountsMasterLedgerPojo> result = new ArrayList<>();
		long i = 0;

		for (CashBook r : rows) {

			AccountsMasterLedgerPojo accountsMasterLedgerPojo = new AccountsMasterLedgerPojo();
			accountsMasterLedgerPojo.setSno(++i);
			accountsMasterLedgerPojo.setName(r.getPersonalInfo() != null
					? r.getPersonalInfo().getPersonalInfoId() + " - " + r.getPersonalInfo().getFirstName()
					: "");
			accountsMasterLedgerPojo.setParticulars(r.getParticulars());
			accountsMasterLedgerPojo.setTransCode(r.getTransType());
			accountsMasterLedgerPojo.setCredit(r.getCredit());
			accountsMasterLedgerPojo.setDebit(r.getDebit());
			accountsMasterLedgerPojo.setDate(r.getTransDate().toLocalDate());

			result.add(accountsMasterLedgerPojo);
		}

		return result;
	}

	public List<UserCollectionsLedgerPojo> getUsersCollectionsLedger(String userName, LocalDate fromDate,
			LocalDate toDate) {

		List<DateWiseCollectionsProjection> rows = new ArrayList<DateWiseCollectionsProjection>();

		if (fromDate == null && toDate == null) {

			rows = cashBookRepo.getAllCashBookCollectionsOnlyByUser(userName);

		} else {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			rows = cashBookRepo.getDateWiseCashBookCollectionsOnlyByUser(from, to, userName);

		}

		List<UserCollectionsLedgerPojo> result = new ArrayList<>();

		long i = 0;

		for (DateWiseCollectionsProjection r : rows) {

			UserCollectionsLedgerPojo cashBookLedger = new UserCollectionsLedgerPojo();
			cashBookLedger.setSno(++i);
			cashBookLedger.setDate(r.getTxnDate());
			cashBookLedger.setMonthlyFinanceCollections(r.getMonthlyTotal());
			cashBookLedger.setDailyFinanceCollections(r.getDailyTotal());
			
			BigDecimal monthly = Optional.ofNullable(r.getMonthlyTotal()).orElse(BigDecimal.ZERO);
			BigDecimal daily = Optional.ofNullable(r.getDailyTotal()).orElse(BigDecimal.ZERO);

			cashBookLedger.setTotal(monthly.add(daily));
			

			result.add(cashBookLedger);
		}

		return result;
	}
	
	
	
	
	public List<ReceiptsLedgerPojo> getReceiptsLedger(LocalDate fromDate,
			LocalDate toDate) {

		List<CashBook> rows = new ArrayList<CashBook>();

		if (fromDate == null && toDate == null) {

			rows = cashBookRepo.findByDateRangeAndBusinessNotNull();

		} else {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			rows = cashBookRepo.findByDateRangeAndBusinessNotNull(from, to);

		}

		List<ReceiptsLedgerPojo> result = new ArrayList<>();

		int i = 0;

		for (CashBook r : rows) {

			ReceiptsLedgerPojo cashBookLedger = new ReceiptsLedgerPojo();
			cashBookLedger.setSno(++i);
			cashBookLedger.setDate(r.getTransDate().toLocalDate());
			cashBookLedger.setTransId(r.getCashBookId());
			cashBookLedger.setLoanId(r.getBusinessMember().getBusinessMemberId());
			cashBookLedger.setLoanDate(r.getBusinessMember().getStartDate().toLocalDate());
			cashBookLedger.setCustomerName(r.getPersonalInfo() != null ? r.getPersonalInfo().getFirstName() : null);
			cashBookLedger.setAmountPaid(r.getCredit());
			cashBookLedger.setLateFee(BigDecimal.ZERO);
			cashBookLedger.setTotal(r.getCredit());

			List<EMI> allEMIs = emiRepo.findByBusinessMember(r.getBusinessMember());

			Map<Boolean, List<EMI>> collect = allEMIs.stream()
					.collect(Collectors.partitioningBy(emi ->  emi.getPaymentDate() == null ||  emi.getPaymentDate().isBefore(r.getTransDate())));

			List<EMI> currentCashBook_beforeEMis = collect.get(true);
			List<EMI> currentCashBook_afterEMis = collect.get(false);

			BigDecimal totalAmountPaidUpToThisCashBookTrasac = currentCashBook_beforeEMis.stream()
					.map(EMI::getPaidAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

			BigDecimal totalAmountpendingAfterToThisCashBookTrasac = currentCashBook_afterEMis.stream()
					.map(EMI::getRemainingAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

			cashBookLedger.setTotalPaid(totalAmountPaidUpToThisCashBookTrasac);
			cashBookLedger.setBalance(totalAmountpendingAfterToThisCashBookTrasac);

			cashBookLedger.setCurrentInstallmentNumber(currentCashBook_beforeEMis.size());
			cashBookLedger.setBalanceInstallmentNumber(currentCashBook_afterEMis.size());

			cashBookLedger.setParticulars(r.getParticulars());

			result.add(cashBookLedger);
		}

		return result;
	}
	
	
	
	
	
	
	
	
	
	
	
	
}
