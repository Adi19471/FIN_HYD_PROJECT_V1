package com.balaji.finance.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.CashBookBK;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.pojo.CashBookDeletedViewPojo;
import com.balaji.finance.pojo.CashBookLedgerCollectionsPojo;
import com.balaji.finance.pojo.CashBookLedgerPojo;
import com.balaji.finance.pojo.CashBookSumaryViewPojo;
import com.balaji.finance.pojo.CashBookViewPojo;
import com.balaji.finance.pojo.DayWiseTransactionsSummary;
import com.balaji.finance.repo.CashBookBkRepo;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.PersonalInfoRepository;

@Service
public class CashBookService {

    private final MonthlyLoanInstallmentPaymentService monthlyLoanInstallmentPaymentService;
	
	@Autowired
	private CashBookRepo cashBookRepo;
	
	@Autowired
	private CashBookBkRepo cashBookBkRepo;
	
	

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

    CashBookService(MonthlyLoanInstallmentPaymentService monthlyLoanInstallmentPaymentService) {
        this.monthlyLoanInstallmentPaymentService = monthlyLoanInstallmentPaymentService;
    }

	public List<CashBookViewPojo> loadAllCashBookDetailsByTransactionDate(LocalDate transactionDate) {

		List<CashBook> byTransDate = cashBookRepo.findByTransactionDate(transactionDate);

		List<CashBookViewPojo> cashBookViewPojoList = new ArrayList<CashBookViewPojo>();

		for (CashBook cashBook : byTransDate) {

			PersonalInfo customer = null;
			if (cashBook.getCustomerId() != null) {
				Optional<PersonalInfo> byId = personalInfoRepository.findById(cashBook.getCustomerId());
				customer = byId.get();
			}

			CashBookViewPojo cashBookViewPojo = new CashBookViewPojo();
			cashBookViewPojo.setTransactionId(cashBook.getId());
			cashBookViewPojo.setAccountNumber(cashBook.getAccountNo());
			cashBookViewPojo.setName(customer != null ? customer.getId() + " - " + customer.getFirstname() : "");
			cashBookViewPojo.setParticulars(cashBook.getParticulars());
			cashBookViewPojo.setTransactionType(cashBook.getTransType());
			cashBookViewPojo.setCredit(cashBook.getCredit());
			cashBookViewPojo.setDebit(cashBook.getDebit());

			cashBookViewPojoList.add(cashBookViewPojo);

		}

		return cashBookViewPojoList;

	}
	
	
	public List<CashBookDeletedViewPojo> loadAllDayWiseDeletedTransactions(LocalDate transactionDate) {

		List<CashBookBK> byTransDate = cashBookBkRepo.findByTransactionDate(transactionDate);

		List<CashBookDeletedViewPojo> cashBookDeleteViewPojoList = new ArrayList<CashBookDeletedViewPojo>();
		DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		
		for (CashBookBK cashBook : byTransDate) {

			PersonalInfo customer = null;
			if (cashBook.getCustomerId() != null) {
				Optional<PersonalInfo> byId = personalInfoRepository.findById(cashBook.getCustomerId());
				customer = byId.get();
			}

			CashBookDeletedViewPojo cashBookDeletedViewPojo = new CashBookDeletedViewPojo();
			cashBookDeletedViewPojo.setTransactionId(cashBook.getId());
			cashBookDeletedViewPojo.setAccountNumber(cashBook.getAccountNo());
			cashBookDeletedViewPojo.setName(customer != null ? customer.getId() + " - " + customer.getFirstname() : "");
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

	public String deleteCashBook(List<Double> transactionIdList, String comments) {

		List<Double> errorIds = new ArrayList<Double>();

		for (Double transactionId : transactionIdList) {

			Optional<CashBook> byId = cashBookRepo.findById(transactionId);

			if (byId.isPresent()) {
				
				CashBook cashBook = byId.get();
				
				String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();

				CashBookBK cashBookBk = new CashBookBK();
				cashBookBk.setAccountNo(cashBook.getAccountNo());
				cashBookBk.setBmRemarks(cashBook.getBmRemarks());
				cashBookBk.setComments(comments);
				cashBookBk.setCredit(cashBook.getCredit());
				cashBookBk.setCustomerId(cashBook.getCustomerId());
				cashBookBk.setDebit(cashBook.getDebit());

				cashBookBk.setId(cashBook.getId());
				cashBookBk.setLineNo(cashBook.getLineNo());
				cashBookBk.setParticulars(cashBook.getParticulars());
				cashBookBk.setReceiptRemarks(cashBook.getReceiptRemarks());
				cashBookBk.setSysDate(cashBook.getSysDate());
				cashBookBk.setTransDate(cashBook.getTransDate());
				cashBookBk.setUser(cashBook.getUser());
				cashBookBk.setTransType(cashBook.getTransType());

				cashBookBk.setDeletedBy(currentUser);
				cashBookBk.setDeletedDate(LocalDateTime.now());

				cashBookBkRepo.save(cashBookBk);
				
				
				cashBookRepo.delete(cashBook);
				

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

		List<CashBook> byTransDate = cashBookRepo.findByTransactionDate(transactionDate);

		List<CashBookSumaryViewPojo> cashBookViewPojoList = new ArrayList<CashBookSumaryViewPojo>();

		for (CashBook cashBook : byTransDate) {

			PersonalInfo customer = null;
			if (cashBook.getCustomerId() != null) {
				Optional<PersonalInfo> byId = personalInfoRepository.findById(cashBook.getCustomerId());
				customer = byId.get();
			}

			CashBookSumaryViewPojo cashBookViewPojo = new CashBookSumaryViewPojo();
			cashBookViewPojo.setTransactionId(cashBook.getId());
			cashBookViewPojo.setAccountNumber(cashBook.getAccountNo());
			cashBookViewPojo.setName(customer != null ? customer.getId() + " - " + customer.getFirstname() : "");
			cashBookViewPojo.setParticulars(cashBook.getParticulars());
			cashBookViewPojo.setTransactionType(cashBook.getTransType());
			cashBookViewPojo.setCredit(cashBook.getCredit());
			cashBookViewPojo.setDebit(cashBook.getDebit());
			cashBookViewPojo.setUser(cashBook.getUser());

			cashBookViewPojoList.add(cashBookViewPojo);

		}
		
		Double openingBalanceForToday = cashBookRepo.findOpeningBalanceForDate(transactionDate);
		
		DayWiseTransactionsSummary dayWiseTransactionsSummary = new DayWiseTransactionsSummary();
		dayWiseTransactionsSummary.setCashBookSumaryViewPojoList(cashBookViewPojoList);
		dayWiseTransactionsSummary.setOpeningBalance(openingBalanceForToday);

		return dayWiseTransactionsSummary;

	}
	
	public List<CashBookLedgerPojo> getCashBookLedger(LocalDate fromDate, LocalDate toDate) {

        LocalDateTime from = fromDate.atStartOfDay();
        LocalDateTime to = toDate.atTime(23, 59, 59);

        List<Object[]> rows = cashBookRepo.getDateWiseCashBook(from, to);

        List<CashBookLedgerPojo> result = new ArrayList<>();

        long i = 0;
        
        Double openingBalanceForToday = cashBookRepo.findOpeningBalanceForDate(fromDate);

		for (Object[] r : rows) {

			CashBookLedgerPojo cashBookLedger = new CashBookLedgerPojo();
			cashBookLedger.setSno(++i);
			cashBookLedger.setDate(((java.sql.Date) r[0]).toLocalDate());
			cashBookLedger.setCredit((BigDecimal) r[1]);
			cashBookLedger.setDebit((BigDecimal) r[2]);
			cashBookLedger.setBalance((BigDecimal) r[3]);
			cashBookLedger.setClosingBalance(((BigDecimal) r[3]).add(new BigDecimal(openingBalanceForToday)));

			result.add(cashBookLedger);
		}
		
		return result;
    }
	
	public List<CashBookLedgerCollectionsPojo> getCollectionsOnlyCBLedgerData(LocalDate fromDate, LocalDate toDate) {

		LocalDateTime from = fromDate.atStartOfDay();
		LocalDateTime to = toDate.atTime(23, 59, 59);

		List<Object[]> rows = cashBookRepo.getDateWiseCashBookCollectionsOnly(from, to);

		List<CashBookLedgerCollectionsPojo> result = new ArrayList<>();

		long i = 0;

		for (Object[] r : rows) {

			CashBookLedgerCollectionsPojo cashBookLedger = new CashBookLedgerCollectionsPojo();
			cashBookLedger.setSno(++i);
			cashBookLedger.setDate(((java.sql.Date) r[0]).toLocalDate());
			cashBookLedger.setMonthlyFinanceCollections((BigDecimal) r[1]);
			cashBookLedger.setDailyFinanceCollections((BigDecimal) r[2]);
			cashBookLedger.setTotal(((BigDecimal) r[1]).add((BigDecimal) r[2]));

			result.add(cashBookLedger);
		}

		return result;
	}

}
