package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
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
import com.balaji.finance.entity.PaymentAllocation;
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
import com.balaji.finance.repo.PaymentAllocationRepo;

import jakarta.transaction.Transactional;

@Service
public class CashBookService {

	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private CashBookBackUpRepo cashBookBkRepo;

	@Autowired
	private EmiRepo emiRepo;

	@Autowired
	private PaymentAllocationRepo paymentAllocationRepo;

	public List<CashBookViewPojo> loadAllCashBookDetailsByTransactionDate(LocalDate transactionDate) {

		LocalDateTime start = transactionDate.atStartOfDay();
		LocalDateTime end = transactionDate.plusDays(1).atStartOfDay();

		List<CashBook> byTransDate = cashBookRepo.findByTransactionDateExcludedSomeAccountCodes(start, end);

		List<CashBookViewPojo> cashBookViewPojoList = new ArrayList<CashBookViewPojo>();

		for (CashBook cashBook : byTransDate) {

			CashBookViewPojo cashBookViewPojo = new CashBookViewPojo();
			cashBookViewPojo.setTransactionId(cashBook.getCashBookId());
			cashBookViewPojo.setAccountNumber(
					cashBook.getBusinessMember() != null ? cashBook.getBusinessMember().getBusinessMemberId() : null);
			cashBookViewPojo.setName(cashBook.getPersonalInfo() != null
					? cashBook.getPersonalInfo().getPersonalInfoId() + " - " + cashBook.getPersonalInfo().getFirstName()
					: "");
			cashBookViewPojo.setParticulars(cashBook.getAccountMasterCode());
			cashBookViewPojo.setTransactionType(cashBook.getAccountMasterMasterCode());
			cashBookViewPojo.setCredit(cashBook.getCredit());
			cashBookViewPojo.setDebit(cashBook.getDebit());
			cashBookViewPojo.setPaymentRefId(cashBook.getPaymentRefId());
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
			cashBookDeletedViewPojo.setAccountNumber(
					cashBook.getBusinessMember() != null ? cashBook.getBusinessMember().getBusinessMemberId() : null);
			cashBookDeletedViewPojo.setName(cashBook.getPersonalInfo() != null
					? cashBook.getPersonalInfo().getPersonalInfoId() + " - " + cashBook.getPersonalInfo().getFirstName()
					: "");
			cashBookDeletedViewPojo.setParticulars(cashBook.getAccountMasterCode());
			cashBookDeletedViewPojo.setTransactionType(cashBook.getAccountMasterMasterCode());
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

		List<Long> errorIds = new ArrayList<>();
		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

		// 🔹 Fetch all records at once (optimization)
		List<CashBook> cashBooks = cashBookRepo.findAllById(transactionIdList);

		// Map for quick lookup
		Map<Long, CashBook> cashBookMap = cashBooks.stream()
				.collect(Collectors.toMap(CashBook::getCashBookId, cb -> cb));

		Set<String> processedRefIds = new HashSet<>();

		for (Long transactionId : transactionIdList) {

			CashBook cashBook = cashBookMap.get(transactionId);

			if (cashBook == null) {
				errorIds.add(transactionId);
				continue;
			}

			String refId = cashBook.getPaymentRefId();

			if (refId == null) {

				// =====================================================
				// CASE 1: No paymentRefId → delete single record
				// =====================================================

				CashBookBackUp backup = createBackup(cashBook, currentUser, comments);
				cashBookBkRepo.save(backup);

				cashBookRepo.delete(cashBook);
			} else {

				// =====================================================
				// CASE 2: paymentRefId exists → group delete
				// =====================================================

				// avoid duplicate processing
				if (processedRefIds.contains(refId)) {
					continue;
				}

				processedRefIds.add(refId);

				// 🔹 Fetch all related cashbook entries
				List<CashBook> groupedCashBooks = cashBookRepo.findByPaymentRefId(refId);

				// 🔹 Backup all
				for (CashBook cb : groupedCashBooks) {
					CashBookBackUp backup = createBackup(cb, currentUser, comments);
					cashBookBkRepo.save(backup);
				}

				// 🔹 Reverse EMI allocations
				List<PaymentAllocation> allocations = paymentAllocationRepo.findByPaymentRefId(refId);

				for (PaymentAllocation pa : allocations) {

					EMI emi = pa.getEmi();

					BigDecimal newPaid = emi.getPaidAmount().subtract(pa.getAllocatedAmount());

					if (newPaid.compareTo(BigDecimal.ZERO) < 0) {
						newPaid = BigDecimal.ZERO;
					}

					emi.setPaidAmount(newPaid);

					// 🔹 Update EMI status
					if (newPaid.compareTo(BigDecimal.ZERO) == 0) {
						emi.setStatus("PENDING");
					} else if (newPaid.compareTo(emi.getTotalAmount()) < 0) {
						emi.setStatus("PARTIAL");
					} else {
						emi.setStatus("PAID");
					}

					emiRepo.save(emi);
				}

				// Delete allocations first (FK safety)
				paymentAllocationRepo.deleteByPaymentRefId(refId);

				// Delete cashbook entries
				cashBookRepo.deleteByPaymentRefId(refId);
			}
		}

		if (errorIds.isEmpty()) {
			return "Successfully deleted";
		} else {
			return "Already Deleted Ids " + errorIds;
		}
	}

	private CashBookBackUp createBackup(CashBook cb, String currentUser, String comments) {

		CashBookBackUp backup = new CashBookBackUp();

		// ===== Basic fields =====
		backup.setCashBookOldId(cb.getCashBookId());
		backup.setLineNo(cb.getLineNo());
		backup.setTransDate(cb.getTransDate());
		backup.setSysDate(cb.getSysDate());

		backup.setCredit(cb.getCredit());
		backup.setDebit(cb.getDebit());

		backup.setEntryUser(cb.getUser());
		backup.setReceiptRemarks(cb.getReceiptRemarks());
		backup.setBmRemarks(cb.getBmRemarks());

		backup.setAccountMastertype(cb.getAccountMastertype());
		backup.setAccountMasterMasterCode(cb.getAccountMasterMasterCode());
		backup.setAccountMasterCode(cb.getAccountMasterCode());

		backup.setPaymentRefId(cb.getPaymentRefId());

		// ===== Relationships =====
		backup.setPersonalInfo(cb.getPersonalInfo());
		backup.setBusinessMember(cb.getBusinessMember());

		// ===== Audit =====
		backup.setDeletedBy(currentUser);
		backup.setDeletedDate(LocalDateTime.now());
		backup.setComments(comments);

		return backup;
	}

	public DayWiseTransactionsSummary loadAllDayWiseTransactionsSummary(LocalDate transactionDate) {

		LocalDateTime start = transactionDate.atStartOfDay();
		LocalDateTime end = transactionDate.plusDays(1).atStartOfDay();

		List<CashBook> byTransDate = cashBookRepo.findByTransactionDate(start, end);

		List<CashBookSumaryViewPojo> cashBookViewPojoList = new ArrayList<CashBookSumaryViewPojo>();

		BigDecimal sumOfCredits = BigDecimal.ZERO;
		BigDecimal sumOfDebits = BigDecimal.ZERO;

		Map<Boolean, List<CashBook>> partionMap = byTransDate.stream()
				.collect(Collectors.partitioningBy(p -> p.getPaymentRefId() == null));

		List<CashBook> otherTransactions = partionMap.get(true);
		for (CashBook cashBook : otherTransactions) {

			CashBookSumaryViewPojo cashBookViewPojo = new CashBookSumaryViewPojo();
			cashBookViewPojo.setTransactionId(cashBook.getCashBookId());
			cashBookViewPojo.setAccountNumber(
					cashBook.getBusinessMember() != null ? cashBook.getBusinessMember().getBusinessMemberId() : "");
			cashBookViewPojo.setName(cashBook.getPersonalInfo() != null ? cashBook.getPersonalInfo().getPersonalInfoId()
					+ " - " + cashBook.getPersonalInfo().getFirstName() + " - "
					+ (cashBook.getPersonalInfo().getMobile() != null ? cashBook.getPersonalInfo().getMobile() : "")
					: "");
			cashBookViewPojo.setParticulars(cashBook.getBmRemarks());
			cashBookViewPojo.setTransactionType(cashBook.getAccountMasterMasterCode());
			cashBookViewPojo.setCredit(cashBook.getCredit());
			cashBookViewPojo.setDebit(cashBook.getDebit());
			cashBookViewPojo.setUser(cashBook.getUser());
			cashBookViewPojo.setAccountMastercode(cashBook.getAccountMasterCode());
			cashBookViewPojoList.add(cashBookViewPojo);

			if (cashBook.getCredit() != null) {
				sumOfCredits = sumOfCredits.add(cashBook.getCredit());
			}

			if (cashBook.getDebit() != null) {
				sumOfDebits = sumOfDebits.add(cashBook.getDebit());
			}

		}

		List<CashBook> loanTransactions = partionMap.get(false);
		Map<String, List<CashBook>> paymentref_cashbookList = loanTransactions.stream()
				.collect(Collectors.groupingBy(p -> p.getPaymentRefId()));

		for (Entry<String, List<CashBook>> entrySet : paymentref_cashbookList.entrySet()) {

			List<CashBook> cashBookList = entrySet.getValue();

			if (!cashBookList.isEmpty()) {

				CashBook sampleRecord = cashBookList.get(0);

				CashBookSumaryViewPojo cashBookViewPojo = new CashBookSumaryViewPojo();
				cashBookViewPojo.setTransactionId(sampleRecord.getCashBookId());
				cashBookViewPojo.setAccountNumber(sampleRecord.getBusinessMember() != null
						? sampleRecord.getBusinessMember().getBusinessMemberId()
						: "");
				cashBookViewPojo.setName(
						sampleRecord.getPersonalInfo() != null ? sampleRecord.getPersonalInfo().getPersonalInfoId()
								+ " - " + sampleRecord.getPersonalInfo().getFirstName() + " - "
								+ (sampleRecord.getPersonalInfo().getMobile() != null
										? sampleRecord.getPersonalInfo().getMobile()
										: "")
								: "");
				cashBookViewPojo.setParticulars(sampleRecord.getBmRemarks());
				cashBookViewPojo.setTransactionType(sampleRecord.getAccountMasterMasterCode());

				cashBookViewPojo.setUser(sampleRecord.getUser());
				cashBookViewPojo.setAccountMastercode(sampleRecord.getAccountMasterCode());
				
				BigDecimal sumOfSingleReferenceCredit = BigDecimal.ZERO;
				BigDecimal sumOfSingleReferenceDebit = BigDecimal.ZERO;

				for (CashBook cashBook : cashBookList) {

					sumOfSingleReferenceCredit = sumOfSingleReferenceCredit.add(cashBook.getCredit());
					sumOfSingleReferenceDebit = sumOfSingleReferenceDebit.add(cashBook.getDebit());

				}
				
				
				
				cashBookViewPojo.setCredit(sumOfSingleReferenceCredit);
				cashBookViewPojo.setDebit(sumOfSingleReferenceDebit);
				
				cashBookViewPojoList.add(cashBookViewPojo);


				if (sumOfSingleReferenceCredit != null) {
					sumOfCredits = sumOfCredits.add(sumOfSingleReferenceCredit);
				}

				if (sumOfSingleReferenceDebit != null) {
					sumOfDebits = sumOfDebits.add(sumOfSingleReferenceDebit);
				}

			}

		}

		BigDecimal openingBalanceForToday = Optional.ofNullable(cashBookRepo.findOpeningBalanceForDate(transactionDate))
				.orElse(BigDecimal.ZERO);

		DayWiseTransactionsSummary dayWiseTransactionsSummary = new DayWiseTransactionsSummary();
		dayWiseTransactionsSummary.setCashBookSumaryViewPojoList(cashBookViewPojoList);
		dayWiseTransactionsSummary.setOpeningBalance(openingBalanceForToday);
		dayWiseTransactionsSummary.setCredits(sumOfCredits);
		dayWiseTransactionsSummary.setDebits(sumOfDebits);

		// Closing Balance = Opening + Credits - Debits
		BigDecimal closingBalance = openingBalanceForToday.add(sumOfCredits).subtract(sumOfDebits);

		dayWiseTransactionsSummary.setClosingBalance(closingBalance);

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

			rows = cashBookRepo.findByAccountMasterCode(transacType);

		} else {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			rows = cashBookRepo.findByAccountMasterCodeAndTransDateBetween(transacType, from, to);

		}

		List<AccountsMasterLedgerPojo> result = new ArrayList<>();
		long i = 0;

		for (CashBook r : rows) {

			AccountsMasterLedgerPojo accountsMasterLedgerPojo = new AccountsMasterLedgerPojo();
			accountsMasterLedgerPojo.setSno(++i);
			accountsMasterLedgerPojo.setName(r.getPersonalInfo() != null
					? r.getPersonalInfo().getPersonalInfoId() + " - " + r.getPersonalInfo().getFirstName()
					: "");
			accountsMasterLedgerPojo.setParticulars(r.getAccountMasterCode());
			accountsMasterLedgerPojo.setTransCode(r.getAccountMasterMasterCode());
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

	public List<ReceiptsLedgerPojo> getReceiptsLedger(LocalDate fromDate, LocalDate toDate) {

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

			Map<Boolean, List<EMI>> collect = allEMIs.stream().collect(Collectors.partitioningBy(
					emi -> emi.getPaymentDate() == null || emi.getPaymentDate().isBefore(r.getTransDate())));

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

			cashBookLedger.setParticulars(r.getAccountMasterCode());

			result.add(cashBookLedger);
		}

		return result;
	}

}
