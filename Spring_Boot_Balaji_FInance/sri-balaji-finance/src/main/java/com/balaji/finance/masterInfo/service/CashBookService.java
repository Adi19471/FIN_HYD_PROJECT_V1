package com.balaji.finance.masterInfo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.masterInfo.entity.CashBook;
import com.balaji.finance.masterInfo.entity.CashBookBK;
import com.balaji.finance.masterInfo.entity.PersonalInfo;
import com.balaji.finance.masterInfo.repo.PersonalInfoRepository;
import com.balaji.finance.pojo.CashBookDeletedViewPojo;
import com.balaji.finance.pojo.CashBookSumaryViewPojo;
import com.balaji.finance.pojo.CashBookViewPojo;
import com.balaji.finance.pojo.DayWiseTransactionsSummary;
import com.balaji.finance.transaction.entity.CashBookBkRepo;
import com.balaji.finance.transaction.entity.CashBookRepo;

@Service
public class CashBookService {
	
	@Autowired
	private CashBookRepo cashBookRepo;
	
	@Autowired
	private CashBookBkRepo cashBookBkRepo;
	
	

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

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
	
	
	public List<CashBookDeletedViewPojo> loadAllDayWiseDeletedTransactions(LocalDateTime transactionDate) {

		List<CashBookBK> byTransDate = cashBookBkRepo.findByTransDate(transactionDate);

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
				cashBookRepo.delete(cashBook);
				
				
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
		
		Double openingBalanceForToday = cashBookRepo.findOpeningBalanceForToday(transactionDate);
		
		DayWiseTransactionsSummary dayWiseTransactionsSummary = new DayWiseTransactionsSummary();
		dayWiseTransactionsSummary.setCashBookSumaryViewPojoList(cashBookViewPojoList);
		dayWiseTransactionsSummary.setOpeningBalance(openingBalanceForToday);

		return dayWiseTransactionsSummary;

	}

}
