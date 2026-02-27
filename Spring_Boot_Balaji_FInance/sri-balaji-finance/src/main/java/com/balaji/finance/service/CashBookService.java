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

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.CashBookBK;
import com.balaji.finance.entity.PersonalInfo;
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
import com.balaji.finance.repo.BusinessMemberRepository;
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
	private BusinessMemberRepository businessMemberRepository;

	
	

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
			cashBookLedger.setCredit((Double) r[1]);
			cashBookLedger.setDebit((Double) r[2]);
			cashBookLedger.setBalance((Double) r[3]);
			cashBookLedger.setClosingBalance(((Double) r[3]) + (openingBalanceForToday));

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
			cashBookLedger.setMonthlyFinanceCollections((Double) r[1]);
			cashBookLedger.setDailyFinanceCollections((Double) r[2]);
			cashBookLedger.setTotal(((Double) r[1])+((Double) r[2]));

			result.add(cashBookLedger);
		}

		return result;
	}
	
	
	public List<AccountsLedgerPojo> getAccountsLedgerData(LocalDate fromDate, LocalDate toDate) {

		List<Object[]> rows = new ArrayList<Object[]>();

		if (fromDate == null && toDate == null) {

			rows = cashBookRepo.getSummaryByParticulars();

		} else {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			rows = cashBookRepo.getSummaryByParticulars(from, to);

		}

		List<AccountsLedgerPojo> result = new ArrayList<>();

		long i = 0;

		for (Object[] r : rows) {

			AccountsLedgerPojo accountsLedger = new AccountsLedgerPojo();
			accountsLedger.setSno(++i);
			accountsLedger.setCredit((Double) r[1]);
			accountsLedger.setDebit((Double) r[2]);
			accountsLedger.setBalance((Double) r[3]);
			accountsLedger.setAccountMaster((String)r[4]);
			
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

			PersonalInfo customer = null;
			if (r.getCustomerId() != null) {
				Optional<PersonalInfo> byId = personalInfoRepository.findById(r.getCustomerId());
				customer = byId.get();
			}

			AccountsMasterLedgerPojo accountsMasterLedgerPojo = new AccountsMasterLedgerPojo();
			accountsMasterLedgerPojo.setSno(++i);
			accountsMasterLedgerPojo
					.setName(customer != null ? customer.getId() + " - " + customer.getFirstname() : "");
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

		List<Object[]> rows = new ArrayList<Object[]>();

		if (fromDate == null && toDate == null) {

			rows = cashBookRepo.getAllCashBookCollectionsOnlyByUser(userName);

		} else {

			LocalDateTime from = fromDate.atStartOfDay();
			LocalDateTime to = toDate.atTime(23, 59, 59);

			rows = cashBookRepo.getDateWiseCashBookCollectionsOnlyByUser(from, to, userName);

		}

		List<UserCollectionsLedgerPojo> result = new ArrayList<>();

		long i = 0;

		for (Object[] r : rows) {

			UserCollectionsLedgerPojo cashBookLedger = new UserCollectionsLedgerPojo();
			cashBookLedger.setSno(++i);
			cashBookLedger.setDate(((java.sql.Date) r[0]).toLocalDate());
			cashBookLedger.setMonthlyFinanceCollections((Double) r[1]);
			cashBookLedger.setDailyFinanceCollections((Double) r[2]);
			cashBookLedger.setTotal(((Double) r[1]) + ((Double) r[2]));

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

			PersonalInfo customer = null;
			if (r.getCustomerId() != null) {
				Optional<PersonalInfo> byId = personalInfoRepository.findById(r.getCustomerId());
				customer = byId.get();
			}

			BusinessMember businessMember = null;
			if (r.getAccountNo() != null) {
				Optional<BusinessMember> opt = businessMemberRepository.findById(r.getAccountNo());
				businessMember = opt.get();
			}

			ReceiptsLedgerPojo cashBookLedger = new ReceiptsLedgerPojo();
			cashBookLedger.setSno(++i);
			cashBookLedger.setDate(r.getTransDate().toLocalDate());
			cashBookLedger.setTransId(r.getId());
			cashBookLedger.setLoanId(r.getAccountNo());
			cashBookLedger.setLoanDate(businessMember.getStartDate().toLocalDate());
			cashBookLedger.setCustomerName(customer !=  null ? customer.getFirstname() : null);
			cashBookLedger.setAmountPaid(r.getCredit());
			cashBookLedger.setLateFee(0d);
			cashBookLedger.setTotal(r.getCredit());
			
			
			cashBookLedger.setTotalPaid(businessMember.getAmount()-r.getPendingBalance());
			cashBookLedger.setBalance(r.getPendingBalance());
			
			
			cashBookLedger.setCurrentInstallmentNumber(r.getCurrentInstallmentNumber());
			cashBookLedger.setBalanceInstallmentNumber(businessMember.getDuration()-r.getCurrentInstallmentNumber());
			cashBookLedger.setParticulars(r.getParticulars());
			
			result.add(cashBookLedger);
		}

		return result;
	}
	
	
	
	
}
