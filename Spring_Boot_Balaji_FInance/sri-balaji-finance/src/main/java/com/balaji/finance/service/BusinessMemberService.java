package com.balaji.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BusinessMemberDto;
import com.balaji.finance.entity.AccountMaster;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.entity.LoanStatus;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.pojo.BusinessMemberAutoCompletePojo;
import com.balaji.finance.repo.AccountMasterRepo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;
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
	private MfNumberService mfNumberService;

	@Autowired
	private DfNumberService dfNumberService;

	public String generateId(String type, LocalDateTime startDate) {

		int year = startDate.getYear();
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
	public String saveBusinessMember(BusinessMemberDto businessMemberDto, String type) {

		BusinessMember businessMember = new BusinessMember();
		businessMember.setBusinessMemberId(generateId(type, businessMemberDto.getStartDate()));
		businessMember.setLoanType(type);

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

		businessMember.setStartDate(businessMemberDto.getStartDate());
		businessMember.setEndDate(businessMemberDto.getEndDate());

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
			dfLoanCashBook.setAccountMastercode(accountMaster.getCode());

			dfLoanCashBook.setBmRemarks("");
			dfLoanCashBook.setReceiptRemarks("");

			dfLoanCashBook.setLineNo(1);
			dfLoanCashBook.setUser(currentUser);

			dfLoanCashBook.setTransDate(businessMemberDto.getStartDate());
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
				dfProcessingFeeCashBook.setAccountMastercode(accountMasterProcessingFee.getCode());

				dfProcessingFeeCashBook.setBmRemarks("");
				dfProcessingFeeCashBook.setReceiptRemarks("");

				dfProcessingFeeCashBook.setLineNo(2);
				dfProcessingFeeCashBook.setUser(currentUser);

				dfProcessingFeeCashBook.setTransDate(businessMemberDto.getStartDate());
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
				dfIntrestCashBook.setAccountMastercode(accountMasterInterest.getCode());

				dfIntrestCashBook.setBmRemarks("");
				dfIntrestCashBook.setReceiptRemarks("");

				dfIntrestCashBook.setLineNo(3);
				dfIntrestCashBook.setUser(currentUser);

				dfIntrestCashBook.setTransDate(businessMemberDto.getStartDate());
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
			mFLoanCashBook.setAccountMastercode(accountMasterMonthlyLoan.getCode());

			mFLoanCashBook.setBmRemarks("");
			mFLoanCashBook.setReceiptRemarks("");

			mFLoanCashBook.setLineNo(1);
			mFLoanCashBook.setUser(currentUser);

			mFLoanCashBook.setTransDate(businessMemberDto.getStartDate());
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
				dfProcessingFeeCashBook.setAccountMastercode(accountMasterProcessingFee.getCode());

				dfProcessingFeeCashBook.setBmRemarks("");
				dfProcessingFeeCashBook.setReceiptRemarks("");

				dfProcessingFeeCashBook.setLineNo(2);
				dfProcessingFeeCashBook.setUser(currentUser);

				dfProcessingFeeCashBook.setTransDate(businessMemberDto.getStartDate());
				dfProcessingFeeCashBook.setSysDate(currentDate);

				cashBookRepo.save(dfProcessingFeeCashBook);

			}

			generateEMIScheduleForMonth(businessMember);

			break;

		default:
			break;
		}

		return "Sucessfully Saved ";
	}

	// update
	public String updateBusinessMember(BusinessMemberDto businessMemberDto) {

		Optional<BusinessMember> businessMemberInDb = businessMemberRepository.findById(businessMemberDto.getId());

		if (businessMemberInDb.isPresent()) {

			BusinessMember businessMember = businessMemberInDb.get();

			Optional<PersonalInfo> customerOptional = personalInfoRepository
					.findById(businessMemberDto.getCustomerId());
			if (customerOptional.isPresent()) {
				businessMember.setCustomerId(customerOptional.get());
			}

			Optional<PersonalInfo> gureantor1Optional = personalInfoRepository
					.findById(businessMemberDto.getGuarantor1());
			if (gureantor1Optional.isPresent()) {
				businessMember.setGuarantor1(gureantor1Optional.get());
			}

			Optional<PersonalInfo> gureantor2Optional = personalInfoRepository
					.findById(businessMemberDto.getGuarantor2());
			if (gureantor2Optional.isPresent()) {
				businessMember.setGuarantor2(gureantor2Optional.get());
			}

			Optional<PersonalInfo> gureantor3Optional = personalInfoRepository
					.findById(businessMemberDto.getGuarantor3());
			if (gureantor3Optional.isPresent()) {
				businessMember.setGuarantor3(gureantor3Optional.get());
			}

			Optional<PersonalInfo> partnerOptional = personalInfoRepository.findById(businessMemberDto.getPartnerId());
			if (partnerOptional.isPresent()) {
				businessMember.setPartnerId(partnerOptional.get());
			}

			businessMember.setStartDate(businessMemberDto.getStartDate());
			businessMember.setEndDate(businessMemberDto.getEndDate());

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
					businessMemberDto.getUnpaidLateFee() != null ? businessMemberDto.getUnpaidLateFee()
							: BigDecimal.ZERO);
			businessMember.setChequeReminder(businessMemberDto.isChequeReminder());
			businessMember.setBusinessId(businessMemberDto.getBusinessId());
			businessMember.setSecurity(businessMemberDto.getSecurity());

			businessMember.setProcessingFee(businessMemberDto.getProcessingFee());
			businessMember.setInterestRate(businessMemberDto.getInterestRate());

			businessMemberRepository.save(businessMember);

			if (businessMember.getProcessingFee() != null && businessMemberDto.getProcessingFee() != null
					&& businessMember.getProcessingFee().compareTo(businessMemberDto.getProcessingFee()) != 0) {

				String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
				LocalDateTime currentDate = LocalDateTime.now();

				CashBook dfProcessingFeeCashBook = null;
				Optional<CashBook> optionalCashbook = null;

				switch (businessMember.getLoanType()) {
				case "DAILY_FINANCE":

					optionalCashbook = cashBookRepo.findByBusinessMemberAndAccountMastercode(businessMember,
							"DF DOC CHARGES");

				case "MONTHLY_FINANCE":

					optionalCashbook = cashBookRepo.findByBusinessMemberAndAccountMastercode(businessMember,
							"MF DOC CHARGES");

				}

				if (optionalCashbook.isPresent()) {

					dfProcessingFeeCashBook = optionalCashbook.get();

					dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
					dfProcessingFeeCashBook.setDebit(BigDecimal.ZERO);
					dfProcessingFeeCashBook.setUser(currentUser);
					dfProcessingFeeCashBook.setSysDate(currentDate);

					cashBookRepo.save(dfProcessingFeeCashBook);

				}

			}

			return "Sucessfully Updated ";

		} else {

			return "Record Not Found ";

		}

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

			businessMemberDto.setStartDate(p.getStartDate());
			businessMemberDto.setEndDate(p.getEndDate());

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

			businessMemberDto.setStartDate(p.getStartDate());
			businessMemberDto.setEndDate(p.getEndDate());

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
			pojo.setCustomerId(bm.getCustomerId().getPersonalInfoId());
			pojo.setCustomerName(bm.getCustomerId().getFirstName());

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
	    BigDecimal emiAmount = totalPayable.divide(
	            BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

	    BigDecimal principalPerEMI = principal.divide(
	            BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

	    BigDecimal interestPerEMI = totalInterest.divide(
	            BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

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
	            emi.setTotalAmount(
	                    emi.getPrincipalAmount().add(emi.getInterestAmount())
	            );
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
			emi.setDueDate(member.getStartDate().plusMonths(i));
			emi.setStatus("PENDING");

			emiRepo.save(emi);

		}
	}
}
