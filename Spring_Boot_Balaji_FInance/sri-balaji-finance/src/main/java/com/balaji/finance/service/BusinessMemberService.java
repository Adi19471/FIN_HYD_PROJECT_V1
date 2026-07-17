package com.balaji.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BusinessMemberDto;
import com.balaji.finance.dto.PaidInstallmentProjection;
import com.balaji.finance.entity.AccountMaster;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.entity.LoanStatus;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.exception.ApiException;
import com.balaji.finance.pojo.BusinessMemberAutoCompletePojo;
import com.balaji.finance.repo.AccountMasterRepo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;
import com.balaji.finance.repo.PaymentAllocationRepo;
import com.balaji.finance.repo.PersonalInfoRepository;
import com.balaji.finance.util.DfNumberService;
import com.balaji.finance.util.MfNumberService;

import jakarta.transaction.Transactional;

@Service
public class BusinessMemberService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private AccountMasterRepo accountMasterRepo;

	@Autowired
	private EmiRepo emiRepo;

	@Autowired
	private PaymentAllocationRepo paymentAllocationRepo;

	@Autowired
	private MfNumberService mfNumberService;

	@Autowired
	private DfNumberService dfNumberService;

	public String generateId(String type, int year) {

		String generatedId = null;

		switch (type) {
		case "DAILY_FINANCE":
			generatedId = dfNumberService.generateDfNumber(year);
			break;

		case "MONTHLY_FINANCE":
			generatedId = mfNumberService.generateMfNumber(year);
			break;

		default:
			throw new IllegalArgumentException("Unknown type: " + type);
		}

		return generatedId;
	}

	// Creating Loan Account
	public BusinessMemberDto createLoanObject(String type) {

		int year = LocalDate.now().getYear();

		BusinessMember businessMember = new BusinessMember();
		businessMember.setBusinessMemberId(generateId(type, year));
		businessMember.setLoanType(type);
		String[] split = businessMember.getBusinessMemberId().split("-");
		businessMember.setSequence(Integer.valueOf(split[1]));
		businessMember.setYear(year);

		businessMemberRepository.save(businessMember);

		BusinessMemberDto businessMemberDto = new BusinessMemberDto();
		businessMemberDto.setId(businessMember.getBusinessMemberId());

		return businessMemberDto;
	}

	@Transactional
	public String updateInformation(BusinessMemberDto businessMemberDto, String type) {

		Optional<BusinessMember> businessMemberInDb = businessMemberRepository.findById(businessMemberDto.getId());

		if (businessMemberInDb.isPresent()) {

			BusinessMember businessMember = businessMemberInDb.get();

			if (businessMember.getAmount() == null) {
				return saveBusinessMember(businessMemberDto, businessMember, type);
			} else {
				return updateBusinessMember(businessMemberDto, businessMember, type);
			}

		} else {

			throw new ApiException("Loan not found", HttpStatus.NOT_FOUND);

		}

	}

	// Saving Loan for First Time
	public String saveBusinessMember(BusinessMemberDto businessMemberDto, BusinessMember businessMember, String type) {

		if (businessMemberDto.getCustomerId() != null && !businessMemberDto.getCustomerId().isBlank()) {
			Optional<PersonalInfo> customerOptional = personalInfoRepository
					.findById(businessMemberDto.getCustomerId());
			if (customerOptional.isPresent()) {
				businessMember.setCustomerId(customerOptional.get());
			}
		}

		if (businessMemberDto.getGuarantor1() != null && !businessMemberDto.getGuarantor1().isBlank()) {
			Optional<PersonalInfo> gureantor1Optional = personalInfoRepository
					.findById(businessMemberDto.getGuarantor1());
			if (gureantor1Optional.isPresent()) {
				businessMember.setGuarantor1(gureantor1Optional.get());
			}
		}
		if (businessMemberDto.getGuarantor2() != null && !businessMemberDto.getGuarantor2().isBlank()) {
			Optional<PersonalInfo> gureantor2Optional = personalInfoRepository
					.findById(businessMemberDto.getGuarantor2());
			if (gureantor2Optional.isPresent()) {
				businessMember.setGuarantor2(gureantor2Optional.get());
			}
		}
		if (businessMemberDto.getGuarantor3() != null && !businessMemberDto.getGuarantor3().isBlank()) {
			Optional<PersonalInfo> gureantor3Optional = personalInfoRepository
					.findById(businessMemberDto.getGuarantor3());
			if (gureantor3Optional.isPresent()) {
				businessMember.setGuarantor3(gureantor3Optional.get());
			}
		}
		if (businessMemberDto.getPartnerId() != null && !businessMemberDto.getPartnerId().isBlank()) {
			Optional<PersonalInfo> partnerOptional = personalInfoRepository.findById(businessMemberDto.getPartnerId());
			if (partnerOptional.isPresent()) {
				businessMember.setPartnerId(partnerOptional.get());
			}
		}

		businessMember.setStartDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));
		businessMember.setEndDate(businessMemberDto.getEndDate().atTime(LocalTime.now()));

		businessMember
				.setAmount(businessMemberDto.getAmount() != null ? businessMemberDto.getAmount() : BigDecimal.ZERO);
		businessMember.setDuration(businessMemberDto.getDuration() != null ? businessMemberDto.getDuration() : 0);
		businessMember.setInterest(
				businessMemberDto.getInterest() != null ? businessMemberDto.getInterest() : BigDecimal.ZERO);

		businessMember.setInstallment(
				businessMemberDto.getInstallment() != null ? businessMemberDto.getInstallment() : BigDecimal.ZERO);
		businessMember.setStatus(businessMemberDto.isStatus());

		businessMember.setPartPrincipal(
				businessMemberDto.getPartPrincipal() != null ? businessMemberDto.getPartPrincipal() : 0);
		businessMember
				.setPartInterest(businessMemberDto.getPartInterest() != null ? businessMemberDto.getPartInterest() : 0);

		businessMember.setChequeReminder(businessMemberDto.isChequeReminder());
		businessMember.setBusinessId(businessMemberDto.getBusinessId());
		businessMember.setSecurity(businessMemberDto.getSecurity());

		businessMember.setPaidInstallments(0);
		businessMember.setUnpaidLateFee(BigDecimal.ZERO);

		businessMember.setLoanStatus(LoanStatus.ACTIVE.toString());

		businessMember.setProcessingFee(businessMemberDto.getProcessingFee());
		businessMember.setInterestRate(businessMemberDto.getInterestRate());

		businessMemberRepository.save(businessMember);

		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
		LocalDateTime currentDate = LocalDateTime.now();

		switch (type) {
		case "DAILY_FINANCE":

			AccountMaster accountMaster = accountMasterRepo.findAccountMasterByMasterCodeAndCode("LOANS", "DF LOAN");

			CashBook dfLoanCashBook = new CashBook();
			dfLoanCashBook.setBusinessMember(businessMember);
			dfLoanCashBook.setPersonalInfo(businessMember.getCustomerId());
			dfLoanCashBook.setCredit(BigDecimal.ZERO);
			dfLoanCashBook.setDebit(businessMember.getAmount());

			dfLoanCashBook.setAccountMastertype(accountMaster.getType());
			dfLoanCashBook.setAccountMasterMasterCode(accountMaster.getMasterCode());
			dfLoanCashBook.setAccountMasterCode(accountMaster.getCode());

			dfLoanCashBook.setBmRemarks("");
			dfLoanCashBook.setReceiptRemarks("");

			dfLoanCashBook.setLineNo(1);
			dfLoanCashBook.setUser(currentUser);

			dfLoanCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));
			dfLoanCashBook.setSysDate(currentDate);

			cashBookRepo.save(dfLoanCashBook);

			if (businessMemberDto.getProcessingFee() != null && businessMemberDto.getProcessingFee() != null
					&& businessMemberDto.getProcessingFee().compareTo(BigDecimal.ZERO) > 0) {
				AccountMaster accountMasterProcessingFee = accountMasterRepo
						.findAccountMasterByMasterCodeAndCode("DOCUMENT CHARGES", "DF DOC CHARGES");

				CashBook dfProcessingFeeCashBook = new CashBook();
				dfProcessingFeeCashBook.setBusinessMember(businessMember);
				dfProcessingFeeCashBook.setPersonalInfo(businessMember.getCustomerId());
				dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
				dfProcessingFeeCashBook.setDebit(BigDecimal.ZERO);

				dfProcessingFeeCashBook.setAccountMastertype(accountMasterProcessingFee.getType());
				dfProcessingFeeCashBook.setAccountMasterMasterCode(accountMasterProcessingFee.getMasterCode());
				dfProcessingFeeCashBook.setAccountMasterCode(accountMasterProcessingFee.getCode());

				dfProcessingFeeCashBook.setBmRemarks("");
				dfProcessingFeeCashBook.setReceiptRemarks("");

				dfProcessingFeeCashBook.setLineNo(2);
				dfProcessingFeeCashBook.setUser(currentUser);

				dfProcessingFeeCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));
				dfProcessingFeeCashBook.setSysDate(currentDate);

				cashBookRepo.save(dfProcessingFeeCashBook);

			}

			if (businessMember.getInterest().compareTo(BigDecimal.ZERO) > 0) {

				AccountMaster accountMasterInterest = accountMasterRepo.findAccountMasterByMasterCodeAndCode("INTEREST",
						"DF INTEREST");

				CashBook dfIntrestCashBook = new CashBook();
				dfIntrestCashBook.setBusinessMember(businessMember);
				dfIntrestCashBook.setPersonalInfo(businessMember.getCustomerId());
				dfIntrestCashBook.setCredit(businessMember.getInterest());
				dfIntrestCashBook.setDebit(BigDecimal.ZERO);

				dfIntrestCashBook.setAccountMastertype(accountMasterInterest.getType());
				dfIntrestCashBook.setAccountMasterMasterCode(accountMasterInterest.getMasterCode());
				dfIntrestCashBook.setAccountMasterCode(accountMasterInterest.getCode());

				dfIntrestCashBook.setBmRemarks("");
				dfIntrestCashBook.setReceiptRemarks("");

				dfIntrestCashBook.setLineNo(3);
				dfIntrestCashBook.setUser(currentUser);

				dfIntrestCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));
				dfIntrestCashBook.setSysDate(currentDate);

				cashBookRepo.save(dfIntrestCashBook);
			}

			generateEMIScheduleForDays(businessMember);

			break;

		case "MONTHLY_FINANCE":

			AccountMaster accountMasterMonthlyLoan = accountMasterRepo.findAccountMasterByMasterCodeAndCode("LOANS",
					"MF LOAN");

			CashBook mFLoanCashBook = new CashBook();
			mFLoanCashBook.setBusinessMember(businessMember);
			mFLoanCashBook.setPersonalInfo(businessMember.getCustomerId());
			mFLoanCashBook.setCredit(BigDecimal.ZERO);
			mFLoanCashBook.setDebit(businessMember.getAmount());

			mFLoanCashBook.setAccountMastertype(accountMasterMonthlyLoan.getType());
			mFLoanCashBook.setAccountMasterMasterCode(accountMasterMonthlyLoan.getMasterCode());
			mFLoanCashBook.setAccountMasterCode(accountMasterMonthlyLoan.getCode());

			mFLoanCashBook.setBmRemarks("");
			mFLoanCashBook.setReceiptRemarks("");

			mFLoanCashBook.setLineNo(1);
			mFLoanCashBook.setUser(currentUser);

			mFLoanCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));
			mFLoanCashBook.setSysDate(currentDate);

			cashBookRepo.save(mFLoanCashBook);

			if (businessMemberDto.getProcessingFee() != null && businessMemberDto.getProcessingFee() != null
					&& businessMemberDto.getProcessingFee().compareTo(BigDecimal.ZERO) > 0) {

				AccountMaster accountMasterProcessingFee = accountMasterRepo
						.findAccountMasterByMasterCodeAndCode("DOCUMENT CHARGES", "MF DOC CHARGES");

				CashBook dfProcessingFeeCashBook = new CashBook();
				dfProcessingFeeCashBook.setBusinessMember(businessMember);
				dfProcessingFeeCashBook.setPersonalInfo(businessMember.getCustomerId());
				dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
				dfProcessingFeeCashBook.setDebit(BigDecimal.ZERO);

				dfProcessingFeeCashBook.setAccountMastertype(accountMasterProcessingFee.getType());
				dfProcessingFeeCashBook.setAccountMasterMasterCode(accountMasterProcessingFee.getMasterCode());
				dfProcessingFeeCashBook.setAccountMasterCode(accountMasterProcessingFee.getCode());

				dfProcessingFeeCashBook.setBmRemarks("");
				dfProcessingFeeCashBook.setReceiptRemarks("");

				dfProcessingFeeCashBook.setLineNo(2);
				dfProcessingFeeCashBook.setUser(currentUser);

				dfProcessingFeeCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));
				dfProcessingFeeCashBook.setSysDate(currentDate);

				cashBookRepo.save(dfProcessingFeeCashBook);

			}

			generateEMIScheduleForMonth(businessMember);

			break;

		default:
			break;
		}

		return "New loan created successfully!";
	}

	// update
	public String updateBusinessMember(BusinessMemberDto businessMemberDto, BusinessMember businessMember,
			String type) {
		
		BigDecimal totalPaidOfLoan = emiRepo.getTotalPaidOfLoan(businessMember.getBusinessMemberId());

		BigDecimal loanAmount = businessMemberDto.getAmount();

		if (loanAmount.compareTo(totalPaidOfLoan) < 0) {
			throw new ApiException(
					String.format("Loan amount (%s) cannot be less than the total amount already paid (%s).",
							loanAmount, totalPaidOfLoan),
					HttpStatus.BAD_REQUEST);
		}

		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
		LocalDateTime currentDate = LocalDateTime.now();

		Optional<PersonalInfo> customerOptional = personalInfoRepository.findById(businessMemberDto.getCustomerId());

		switch (businessMember.getLoanType()) {
		case "DAILY_FINANCE":

			// Updating Loan Record
			if ((businessMember.getAmount() != null && businessMemberDto.getAmount() != null
					&& businessMember.getAmount().compareTo(businessMemberDto.getAmount()) != 0)
					|| (businessMember.getStartDate() != null && businessMemberDto.getStartDate() != null
							&& businessMember.getStartDate().toLocalDate()
									.compareTo(businessMemberDto.getStartDate()) != 0)) {

				CashBook loanCashBook = null;
				Optional<CashBook> optionalCashbook = null;
				optionalCashbook = cashBookRepo.findByBusinessMemberAndAccountMasterCode(businessMember, "DF LOAN");

				if (optionalCashbook.isPresent()) {

					loanCashBook = optionalCashbook.get();

					if (customerOptional.isPresent()) {
						loanCashBook.setPersonalInfo(customerOptional.get());
					}

					loanCashBook.setCredit(BigDecimal.ZERO);
					loanCashBook.setDebit(businessMemberDto.getAmount());
					loanCashBook.setUser(currentUser);
					loanCashBook.setSysDate(currentDate);
					loanCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));

					cashBookRepo.save(loanCashBook);

				}

			}

			// Updating DocCharges Record
			if ((businessMember.getProcessingFee() != null && businessMemberDto.getProcessingFee() != null
					&& businessMember.getProcessingFee().compareTo(businessMemberDto.getProcessingFee()) != 0)
					|| (businessMember.getStartDate() != null && businessMemberDto.getStartDate() != null
							&& businessMember.getStartDate().toLocalDate()
									.compareTo(businessMemberDto.getStartDate()) != 0)) {

				CashBook dfProcessingFeeCashBook = null;
				Optional<CashBook> optionalCashbook = null;

				optionalCashbook = cashBookRepo.findByBusinessMemberAndAccountMasterCode(businessMember,
						"DF DOC CHARGES");

				if (optionalCashbook.isPresent()) {

					dfProcessingFeeCashBook = optionalCashbook.get();

					if (customerOptional.isPresent()) {
						dfProcessingFeeCashBook.setPersonalInfo(customerOptional.get());
					}

					dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
					dfProcessingFeeCashBook.setDebit(BigDecimal.ZERO);
					dfProcessingFeeCashBook.setUser(currentUser);
					dfProcessingFeeCashBook.setSysDate(currentDate);
					dfProcessingFeeCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));

					cashBookRepo.save(dfProcessingFeeCashBook);

				}

			}

			// Updating Interest Record
			if ((businessMember.getInterest() != null && businessMemberDto.getInterest() != null
					&& businessMember.getInterest().compareTo(businessMemberDto.getInterest()) != 0)
					|| (businessMember.getStartDate() != null && businessMemberDto.getStartDate() != null
							&& businessMember.getStartDate().toLocalDate()
									.compareTo(businessMemberDto.getStartDate()) != 0)) {

				CashBook dfIntrestCashBook = null;
				Optional<CashBook> optionalCashbook = null;

				optionalCashbook = cashBookRepo.findByBusinessMemberAndAccountMasterCode(businessMember, "DF INTEREST");

				dfIntrestCashBook = optionalCashbook.get();

				if (customerOptional.isPresent()) {
					dfIntrestCashBook.setPersonalInfo(customerOptional.get());
				}

				dfIntrestCashBook.setCredit(businessMemberDto.getInterest());
				dfIntrestCashBook.setDebit(BigDecimal.ZERO);
				dfIntrestCashBook.setUser(currentUser);
				dfIntrestCashBook.setSysDate(currentDate);
				dfIntrestCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));

				cashBookRepo.save(dfIntrestCashBook);

			}

			break;
		case "MONTHLY_FINANCE":

			// Updating Loan Record
			if ((businessMember.getAmount() != null && businessMemberDto.getAmount() != null
					&& businessMember.getAmount().compareTo(businessMemberDto.getAmount()) != 0)
					|| (businessMember.getStartDate() != null && businessMemberDto.getStartDate() != null
							&& businessMember.getStartDate().toLocalDate()
									.compareTo(businessMemberDto.getStartDate()) != 0)) {

				CashBook mFLoanCashBook = null;
				Optional<CashBook> optionalCashbook = null;
				optionalCashbook = cashBookRepo.findByBusinessMemberAndAccountMasterCode(businessMember, "MF LOAN");

				if (optionalCashbook.isPresent()) {

					mFLoanCashBook = optionalCashbook.get();

					if (customerOptional.isPresent()) {
						mFLoanCashBook.setPersonalInfo(customerOptional.get());
					}

					mFLoanCashBook.setCredit(BigDecimal.ZERO);
					mFLoanCashBook.setDebit(businessMemberDto.getAmount());
					mFLoanCashBook.setUser(currentUser);
					mFLoanCashBook.setSysDate(currentDate);
					mFLoanCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));

					cashBookRepo.save(mFLoanCashBook);

				}

			}

			// Updating DocCharges Record
			if ((businessMember.getProcessingFee() != null && businessMemberDto.getProcessingFee() != null
					&& businessMember.getProcessingFee().compareTo(businessMemberDto.getProcessingFee()) != 0)
					|| (businessMember.getStartDate() != null && businessMemberDto.getStartDate() != null
							&& businessMember.getStartDate().toLocalDate()
									.compareTo(businessMemberDto.getStartDate()) != 0)) {

				CashBook mfProcessingFeeCashBook = null;
				Optional<CashBook> optionalCashbook = null;

				optionalCashbook = cashBookRepo.findByBusinessMemberAndAccountMasterCode(businessMember,
						"MF DOC CHARGES");

				if (optionalCashbook.isPresent()) {

					mfProcessingFeeCashBook = optionalCashbook.get();
					if (customerOptional.isPresent()) {
						mfProcessingFeeCashBook.setPersonalInfo(customerOptional.get());
					}

					mfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
					mfProcessingFeeCashBook.setDebit(BigDecimal.ZERO);
					mfProcessingFeeCashBook.setUser(currentUser);
					mfProcessingFeeCashBook.setSysDate(currentDate);
					mfProcessingFeeCashBook.setTransDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));

					cashBookRepo.save(mfProcessingFeeCashBook);

				}

			}

			break;

		default:
			break;
		}

		// Updating Emis Record
		boolean updateEMIs = !Objects.equals(businessMember.getDuration(), businessMemberDto.getDuration())
				|| !Objects.equals(businessMember.getAmount(), businessMemberDto.getAmount())
				|| !Objects.equals(businessMember.getInterest(), businessMemberDto.getInterest());

		if (customerOptional.isPresent()) {
			businessMember.setCustomerId(customerOptional.get());
		}

		Optional<PersonalInfo> gureantor1Optional = personalInfoRepository.findById(businessMemberDto.getGuarantor1());
		if (gureantor1Optional.isPresent()) {
			businessMember.setGuarantor1(gureantor1Optional.get());
		}

		Optional<PersonalInfo> gureantor2Optional = personalInfoRepository.findById(businessMemberDto.getGuarantor2());
		if (gureantor2Optional.isPresent()) {
			businessMember.setGuarantor2(gureantor2Optional.get());
		}

		Optional<PersonalInfo> gureantor3Optional = personalInfoRepository.findById(businessMemberDto.getGuarantor3());
		if (gureantor3Optional.isPresent()) {
			businessMember.setGuarantor3(gureantor3Optional.get());
		}

		Optional<PersonalInfo> partnerOptional = personalInfoRepository.findById(businessMemberDto.getPartnerId());
		if (partnerOptional.isPresent()) {
			businessMember.setPartnerId(partnerOptional.get());
		}

		businessMember.setStartDate(businessMemberDto.getStartDate().atTime(LocalTime.now()));
		businessMember.setEndDate(businessMemberDto.getEndDate().atTime(LocalTime.now()));

		businessMember
				.setAmount(businessMemberDto.getAmount() != null ? businessMemberDto.getAmount() : BigDecimal.ZERO);

		businessMember.setDuration(businessMemberDto.getDuration() != null ? businessMemberDto.getDuration() : 0);

		businessMember.setInterest(
				businessMemberDto.getInterest() != null ? businessMemberDto.getInterest() : BigDecimal.ZERO);
		businessMember.setInstallment(
				businessMemberDto.getInstallment() != null ? businessMemberDto.getInstallment() : BigDecimal.ZERO);

		businessMember.setStatus(businessMemberDto.isStatus());
		businessMember.setPartPrincipal(
				businessMemberDto.getPartPrincipal() != null ? businessMemberDto.getPartPrincipal() : 0);
		businessMember.setUnpaidLateFee(
				businessMemberDto.getUnpaidLateFee() != null ? businessMemberDto.getUnpaidLateFee() : BigDecimal.ZERO);
		businessMember.setChequeReminder(businessMemberDto.isChequeReminder());
		businessMember.setBusinessId(businessMemberDto.getBusinessId());
		businessMember.setSecurity(businessMemberDto.getSecurity());

		businessMember.setProcessingFee(businessMemberDto.getProcessingFee());
		businessMember.setInterestRate(businessMemberDto.getInterestRate());

		businessMemberRepository.save(businessMember);

	
		
		Long hasCashEntries = cashBookRepo.findCollectionsCountOnAccount(businessMember.getBusinessMemberId());

		System.err.println(hasCashEntries + " ::hasCashEntries");

		if (hasCashEntries > 0) {
			
			updateEmisOnceAfterCollectionsPaid(businessMember);
		
		} else if (updateEMIs) {

			paymentAllocationRepo.deleteByEmi_BusinessMember(businessMember);
			emiRepo.deleteByBusinessMember_BusinessMemberId(businessMember.getBusinessMemberId());

			// regenerate EMI
			if ("MONTHLY_FINANCE".equals(type)) {
				generateEMIScheduleForMonth(businessMember);
			} else {
				generateEMIScheduleForDays(businessMember);
			}

		}

		return "Loan updated successfully!";

	}

	// delete
	public String deleteBusinessMember(String id) {

		Optional<BusinessMember> businessMemberInDb = businessMemberRepository.findById(id);

		if (businessMemberInDb.isPresent()) {

			BusinessMember businessMember = businessMemberInDb.get();

			businessMemberRepository.delete(businessMember);

			return "Sucessfully Deleted " + businessMember.getBusinessMemberId();

		} else {

			return "Record Not Found " + id;

		}

	}

	// findAll
	public List<BusinessMemberDto> findAll(String loanType) {

		String starWithString = null;
		switch (loanType) {
		case "DAILY_FINANCE":
			starWithString = "DF";
			break;

		case "MONTHLY_FINANCE":
			starWithString = "MF";
			break;

		default:

			break;
		}

		List<BusinessMember> allBusinessMemberList = businessMemberRepository.findAllByLoanType(starWithString);

		List<BusinessMemberDto> toBeReturnedDtoList = new ArrayList<BusinessMemberDto>();

		allBusinessMemberList.stream().forEach(p -> {

			BusinessMemberDto businessMemberDto = new BusinessMemberDto();
			businessMemberDto.setId(p.getBusinessMemberId());
			businessMemberDto.setCustomerId(p.getCustomerId() != null ? p.getCustomerId().getPersonalInfoId() : null);
			businessMemberDto.setGuarantor1(p.getGuarantor1() != null ? p.getGuarantor1().getPersonalInfoId() : null);
			businessMemberDto.setGuarantor2(p.getGuarantor2() != null ? p.getGuarantor2().getPersonalInfoId() : null);
			businessMemberDto.setGuarantor3(p.getGuarantor3() != null ? p.getGuarantor3().getPersonalInfoId() : null);

			businessMemberDto.setPartnerId(p.getPartnerId() != null ? p.getPartnerId().getPersonalInfoId() : null);

			businessMemberDto.setStartDate(p.getStartDate() != null ? p.getStartDate().toLocalDate() : null);
			businessMemberDto.setEndDate(p.getEndDate() != null ? p.getEndDate().toLocalDate() : null);

			businessMemberDto.setAmount(p.getAmount());
			businessMemberDto.setDuration(p.getDuration());
			businessMemberDto.setInterest(p.getInterest());
			businessMemberDto.setInstallment(p.getInstallment());
			businessMemberDto.setSecurity(p.getSecurity());
			businessMemberDto.setStatus(p.isStatus());
			businessMemberDto.setPaidInstallments(p.getPaidInstallments());
			businessMemberDto.setPartPrincipal(p.getPartPrincipal());
			businessMemberDto.setPartInterest(p.getPartInterest());
			businessMemberDto.setUnpaidLateFee(p.getUnpaidLateFee());
			businessMemberDto.setChequeReminder(p.isChequeReminder());
			businessMemberDto.setBusinessId(p.getBusinessId());

			businessMemberDto.setInterestRate(p.getInterestRate());
			businessMemberDto.setProcessingFee(p.getProcessingFee());

			toBeReturnedDtoList.add(businessMemberDto);

		});

		return toBeReturnedDtoList;
	}

	// findAll
	public BusinessMemberDto findById(String id) {

		Optional<BusinessMember> businessMember = businessMemberRepository.findById(id);

		if (businessMember.isPresent()) {

			BusinessMember p = businessMember.get();

			BusinessMemberDto businessMemberDto = new BusinessMemberDto();
			businessMemberDto.setId(p.getBusinessMemberId());
			businessMemberDto.setCustomerId(p.getCustomerId() != null ? p.getCustomerId().getPersonalInfoId() : null);
			businessMemberDto.setGuarantor1(p.getGuarantor1() != null ? p.getGuarantor1().getPersonalInfoId() : null);
			businessMemberDto.setGuarantor2(p.getGuarantor2() != null ? p.getGuarantor2().getPersonalInfoId() : null);
			businessMemberDto.setGuarantor3(p.getGuarantor3() != null ? p.getGuarantor3().getPersonalInfoId() : null);

			businessMemberDto.setPartnerId(p.getPartnerId() != null ? p.getPartnerId().getPersonalInfoId() : null);

			businessMemberDto.setStartDate(p.getStartDate() != null ? p.getStartDate().toLocalDate() : null);
			businessMemberDto.setEndDate(p.getEndDate() != null ? p.getEndDate().toLocalDate() : null);

			businessMemberDto.setAmount(p.getAmount());
			businessMemberDto.setDuration(p.getDuration());
			businessMemberDto.setInterest(p.getInterest());
			businessMemberDto.setInstallment(p.getInstallment());
			businessMemberDto.setSecurity(p.getSecurity());
			businessMemberDto.setStatus(p.isStatus());
			businessMemberDto.setPaidInstallments(p.getPaidInstallments());
			businessMemberDto.setPartPrincipal(p.getPartPrincipal());
			businessMemberDto.setPartInterest(p.getPartInterest());
			businessMemberDto.setUnpaidLateFee(p.getUnpaidLateFee());
			businessMemberDto.setChequeReminder(p.isChequeReminder());
			businessMemberDto.setBusinessId(p.getBusinessId());

			businessMemberDto.setInterestRate(p.getInterestRate());
			businessMemberDto.setProcessingFee(p.getProcessingFee());

			return businessMemberDto;

		} else {

			return null;

		}

	}

	public List<BusinessMemberAutoCompletePojo> businessMemberAutoCompletebyLoanType(String keyWord, String loanType) {

		String starWithString = null;
		switch (loanType) {
		case "DAILY_FINANCE":
			starWithString = "DF";
			break;

		case "MONTHLY_FINANCE":
			starWithString = "MF";
			break;

		default:

			break;
		}

		List<BusinessMember> loanList = businessMemberRepository.businessMemberAutoCompletebyLoanType(starWithString,
				keyWord);

		List<BusinessMemberAutoCompletePojo> pojoList = new ArrayList<BusinessMemberAutoCompletePojo>();
		System.err.println(loanList);

		for (BusinessMember bm : loanList) {

			BusinessMemberAutoCompletePojo pojo = new BusinessMemberAutoCompletePojo();
			pojo.setLoanId(bm.getBusinessMemberId());
			pojo.setCustomerId(bm.getCustomerId().getPersonalInfoId());
			pojo.setCustomerName(bm.getCustomerId().getFirstName());

			pojoList.add(pojo);
		}

		return pojoList;
	}

	public List<BusinessMemberAutoCompletePojo> allbusinessMemberAutoComplete(String keyWord) {

		List<BusinessMember> loanList = businessMemberRepository.allbusinessMemberAutoComplete(keyWord);

		List<BusinessMemberAutoCompletePojo> pojoList = new ArrayList<BusinessMemberAutoCompletePojo>();

		for (BusinessMember bm : loanList) {

			BusinessMemberAutoCompletePojo pojo = new BusinessMemberAutoCompletePojo();
			pojo.setLoanId(bm.getBusinessMemberId());
			pojo.setCustomerId(bm.getCustomerId() != null ? bm.getCustomerId().getPersonalInfoId() : null);
			pojo.setCustomerName(bm.getCustomerId() != null ? bm.getCustomerId().getFirstName() : null);

			pojoList.add(pojo);
		}

		return pojoList;
	}

	public List<String> allLoanIdsAutoComplete(String keyWord) {

		List<String> loanList = businessMemberRepository.allLoanIdsAutoComplete(keyWord);

		return loanList;
	}

	@Transactional
	public void generateEMIScheduleForMonth(BusinessMember member) {

		int months = member.getDuration();

		BigDecimal principal = member.getAmount();
		BigDecimal totalInterest = member.getInterest();

		BigDecimal totalPayable = principal.add(totalInterest);

		// EMI calculation
		BigDecimal emiAmount = totalPayable.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		BigDecimal principalPerEMI = principal.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		BigDecimal interestPerEMI = totalInterest.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		List<EMI> emiList = new ArrayList<>(months);

		BigDecimal totalPrincipalAssigned = BigDecimal.ZERO;
		BigDecimal totalInterestAssigned = BigDecimal.ZERO;

		for (int i = 1; i <= months; i++) {

			EMI emi = new EMI();
			emi.setBusinessMember(member);
			emi.setInstallmentNumber(i);

			// Adjust last EMI for rounding difference
			if (i == months) {

				emi.setPrincipalAmount(principal.subtract(totalPrincipalAssigned));
				emi.setInterestAmount(totalInterest.subtract(totalInterestAssigned));
				emi.setTotalAmount(emi.getPrincipalAmount().add(emi.getInterestAmount()));

			} else {

				emi.setPrincipalAmount(principalPerEMI);
				emi.setInterestAmount(interestPerEMI);
				emi.setTotalAmount(emiAmount);

				totalPrincipalAssigned = totalPrincipalAssigned.add(principalPerEMI);
				totalInterestAssigned = totalInterestAssigned.add(interestPerEMI);

			}

			emi.setPaidAmount(BigDecimal.ZERO);
			emi.setDueDate(member.getStartDate().plusMonths(i));
			emi.setStatus("PENDING");

			emiList.add(emi);
		}

		emiRepo.saveAll(emiList);
	}

	public void generateEMIScheduleForDays(BusinessMember member) {

		int days = member.getDuration(); // Loan duration in months

		BigDecimal principalPerEMI = member.getAmount().divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);

		// Step 5: Generate EMI schedule
		for (int i = 1; i <= days; i++) {
			EMI emi = new EMI();
			emi.setBusinessMember(member);
			emi.setInstallmentNumber(i);
			emi.setPrincipalAmount(principalPerEMI);
			emi.setInterestAmount(BigDecimal.ZERO);

			emi.setTotalAmount(principalPerEMI);
			emi.setPaidAmount(BigDecimal.ZERO);
			emi.setDueDate(member.getStartDate().plusDays(i));
			emi.setStatus("PENDING");

			emiRepo.save(emi);

		}
	}

	@Transactional
	public void updateEmisOnceAfterCollectionsPaid(BusinessMember member) {

	    List<EMI> allEMIs = emiRepo.findByBusinessMemberOrderByInstallmentNumberAsc(member);

	    PaidInstallmentProjection projection;

	    switch (member.getLoanType()) {

	    case "DAILY_FINANCE":
	        projection = cashBookRepo.getCollectionsPaidForDailyLoan(member.getBusinessMemberId());
	        break;

	    case "MONTHLY_FINANCE":
	        projection = cashBookRepo.getCollectionsPaidForMonthlyLoan(member.getBusinessMemberId());
	        break;

	    default:
	        throw new IllegalArgumentException("Unknown loan type: " + member.getLoanType());
	    }

	    
	    
	    BigDecimal paidPrincipal = projection != null && projection.getLoanInstallmentsPaid() != null
	            ? projection.getLoanInstallmentsPaid()
	            : BigDecimal.ZERO;

	    BigDecimal paidInterest = projection != null && projection.getLoanInterestPaid() != null
	            ? projection.getLoanInterestPaid()
	            : BigDecimal.ZERO;

	    BigDecimal remainingPrincipal = member.getAmount().subtract(paidPrincipal);
	    BigDecimal remainingInterest = member.getInterest().subtract(paidInterest);

	    if (remainingPrincipal.compareTo(BigDecimal.ZERO) < 0) {
	        remainingPrincipal = BigDecimal.ZERO;
	    }

	    if (remainingInterest.compareTo(BigDecimal.ZERO) < 0) {
	        remainingInterest = BigDecimal.ZERO;
	    }

	    List<EMI> paidEMIs = allEMIs.stream()
	            .filter(e -> "PAID".equalsIgnoreCase(e.getStatus()))
	            .toList();

	    List<EMI> unpaidEMIs = allEMIs.stream()
	            .filter(e -> !"PAID".equalsIgnoreCase(e.getStatus()))
	            .sorted(Comparator.comparing(EMI::getInstallmentNumber))
	            .collect(Collectors.toList());

	    int targetUnpaidCount = member.getDuration() - paidEMIs.size();

	    if (targetUnpaidCount <= 0) {
	        emiRepo.deleteAll(unpaidEMIs);
	        return;
	    }

	    /*
	     * Duration Reduced
	     */
	    if (unpaidEMIs.size() > targetUnpaidCount) {

	        List<EMI> toDelete = unpaidEMIs.subList(targetUnpaidCount, unpaidEMIs.size());

	        emiRepo.deleteAll(toDelete);

	        unpaidEMIs = new ArrayList<>(unpaidEMIs.subList(0, targetUnpaidCount));
	    }

	    /*
	     * Duration Increased
	     */
	    while (unpaidEMIs.size() < targetUnpaidCount) {

	        EMI emi = new EMI();

	        emi.setBusinessMember(member);

	        unpaidEMIs.add(emi);
	    }

	    BigDecimal principalPerEMI = remainingPrincipal.divide(
	            BigDecimal.valueOf(targetUnpaidCount),
	            2,
	            RoundingMode.HALF_UP);

	    BigDecimal interestPerEMI = remainingInterest.divide(
	            BigDecimal.valueOf(targetUnpaidCount),
	            2,
	            RoundingMode.HALF_UP);

	    BigDecimal assignedPrincipal = BigDecimal.ZERO;
	    BigDecimal assignedInterest = BigDecimal.ZERO;

	    int nextInstallmentNo = paidEMIs.size();

	    for (int i = 0; i < unpaidEMIs.size(); i++) {

	        EMI emi = unpaidEMIs.get(i);

	        BigDecimal principalAmount;
	        BigDecimal interestAmount;

	        boolean isLast = i == unpaidEMIs.size() - 1;

	        if (isLast) {

	            principalAmount = remainingPrincipal.subtract(assignedPrincipal);
	            interestAmount = remainingInterest.subtract(assignedInterest);

	        } else {

	            principalAmount = principalPerEMI;
	            interestAmount = interestPerEMI;

	            assignedPrincipal = assignedPrincipal.add(principalAmount);
	            assignedInterest = assignedInterest.add(interestAmount);
	        }

	        emi.setBusinessMember(member);
	        emi.setInstallmentNumber(++nextInstallmentNo);

	        emi.setPrincipalAmount(principalAmount);
	        emi.setInterestAmount(interestAmount);
	        emi.setTotalAmount(principalAmount.add(interestAmount));

	        if (emi.getPaidAmount() == null) {
	            emi.setPaidAmount(BigDecimal.ZERO);
	        }

	        /*
	         * Preserve PARTIAL payment
	         */
	        if (emi.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
	            emi.setStatus("PARTIAL");
	        } else {
	            emi.setStatus("PENDING");
	        }

	        if ("MONTHLY_FINANCE".equals(member.getLoanType())) {
	            emi.setDueDate(member.getStartDate().plusMonths(emi.getInstallmentNumber()));
	        } else {
	            emi.setDueDate(member.getStartDate().plusDays(emi.getInstallmentNumber()));
	        }
	    }

	    emiRepo.saveAll(unpaidEMIs);
	}

}
