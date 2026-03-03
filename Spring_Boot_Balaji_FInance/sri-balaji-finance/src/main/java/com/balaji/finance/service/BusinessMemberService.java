package com.balaji.finance.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BusinessMemberDto;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.EMI;
import com.balaji.finance.entity.LoanStatus;
import com.balaji.finance.entity.PersonalInfo;
import com.balaji.finance.pojo.BusinessMemberAutoCompletePojo;
import com.balaji.finance.repo.BusinessMemberRepository;
import com.balaji.finance.repo.CashBookRepo;
import com.balaji.finance.repo.EmiRepo;
import com.balaji.finance.repo.PersonalInfoRepository;
import com.balaji.finance.util.BusinessMemersSequenceService;

@Service
public class BusinessMemberService {

	@Autowired
	private BusinessMemberRepository businessMemberRepository;

	@Autowired
	private BusinessMemersSequenceService businessMemersSequenceService;

	@Autowired
	private PersonalInfoRepository personalInfoRepository;

	@Autowired
	private CashBookRepo cashBookRepo;

	@Autowired
	private EmiRepo emiRepo;

	public String generateId(String type) {

		String prefix;
		long seq = 0;
		switch (type) {
		case "DAILY_FINANCE":
			prefix = "DF";
			seq = businessMemersSequenceService.getNextBusinessMemberDailyFinanceSequenceSeqId();
			break;

		case "MONTHLY_FINANCE":
			prefix = "MF";
			seq = businessMemersSequenceService.getNextBusinessMemberMonthlyFinanceSequenceSeqId();
			break;

		default:
			throw new IllegalArgumentException("Unknown type: " + type);
		}

		int year = LocalDate.now().getYear();

		return prefix + year + "-" + seq;
	}

	// Creating Loan Account
	public String saveBusinessMember(BusinessMemberDto businessMemberDto, String type) {

		BusinessMember businessMember = new BusinessMember();
		businessMember.setBusinessMemberId(generateId(type));

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

		businessMember.setAmount(businessMemberDto.getAmount() != null ? businessMemberDto.getAmount() : BigDecimal.ZERO);
		businessMember.setDuration(businessMemberDto.getDuration() != null ? businessMemberDto.getDuration() : 0);
		businessMember.setInterest(businessMemberDto.getInterest() != null ? businessMemberDto.getInterest() : BigDecimal.ZERO);

		businessMember.setInstallment(businessMemberDto.getInstallment() != null ? businessMemberDto.getInstallment() : BigDecimal.ZERO);
		businessMember.setStatus(businessMemberDto.isStatus());

		businessMember.setPartPrincipal(businessMemberDto.getPartPrincipal() != null ? businessMemberDto.getPartPrincipal() : 0);
		businessMember.setPartInterest(businessMemberDto.getPartInterest() != null ? businessMemberDto.getPartInterest() : 0);

		businessMember.setChequeReminder(businessMemberDto.isChequeReminder());
		businessMember.setBusinessId(businessMemberDto.getBusinessId());
		businessMember.setSecurity(businessMemberDto.getSecurity());

		businessMember.setPaidInstallments(0);
		businessMember.setUnpaidLateFee(BigDecimal.ZERO);
		
		businessMember.setLoanStatus(LoanStatus.ACTIVE.toString());

		businessMemberRepository.save(businessMember);

		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
		LocalDateTime currentDate = LocalDateTime.now();

		switch (type) {
		case "DAILY_FINANCE":

			CashBook dfLoanCashBook = new CashBook();
			dfLoanCashBook.setBusinessMember(businessMember);
			dfLoanCashBook.setPersonalInfo(businessMember.getCustomerId());
			dfLoanCashBook.setCredit(BigDecimal.ZERO);
			dfLoanCashBook.setDebit(businessMember.getAmount());
			dfLoanCashBook.setTransType("DF LOAN");
			dfLoanCashBook.setParticulars("DF LOAN");
			dfLoanCashBook.setBmRemarks("");
			dfLoanCashBook.setReceiptRemarks("");

			dfLoanCashBook.setLineNo(1);
			dfLoanCashBook.setUser(currentUser);

			dfLoanCashBook.setTransDate(currentDate);
			dfLoanCashBook.setSysDate(currentDate);

			cashBookRepo.save(dfLoanCashBook);

			if (businessMemberDto.getProcessingFee() != null && businessMemberDto.getProcessingFee() != null
					&& businessMemberDto.getProcessingFee().compareTo(BigDecimal.ZERO) > 0) {

				CashBook dfProcessingFeeCashBook = new CashBook();
				dfProcessingFeeCashBook.setBusinessMember(businessMember);
				dfProcessingFeeCashBook.setPersonalInfo(businessMember.getCustomerId());
				dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
				dfProcessingFeeCashBook.setDebit(BigDecimal.ZERO);
				dfProcessingFeeCashBook.setTransType("DF DOC CHARGES");
				dfProcessingFeeCashBook.setParticulars("DF DOC CHARGES");
				dfProcessingFeeCashBook.setBmRemarks("");
				dfProcessingFeeCashBook.setReceiptRemarks("");

				dfProcessingFeeCashBook.setLineNo(2);
				dfProcessingFeeCashBook.setUser(currentUser);

				dfProcessingFeeCashBook.setTransDate(currentDate);
				dfProcessingFeeCashBook.setSysDate(currentDate);

				cashBookRepo.save(dfProcessingFeeCashBook);

			}

			BigDecimal principal = businessMember.getAmount();

			BigDecimal ratePerMonth = businessMember.getInterest().divide(BigDecimal.valueOf(100), 10,
					RoundingMode.HALF_UP);

			BigDecimal days = BigDecimal.valueOf(businessMember.getDuration());

			BigDecimal timeInMonths = days.divide(BigDecimal.valueOf(30), 10, RoundingMode.HALF_UP);

			BigDecimal interestAmount = principal.multiply(ratePerMonth).multiply(timeInMonths).setScale(2,
					RoundingMode.HALF_UP);

			if (interestAmount.compareTo(BigDecimal.ZERO) > 0) {

				CashBook dfIntrestCashBook = new CashBook();
				dfIntrestCashBook.setBusinessMember(businessMember);
				dfIntrestCashBook.setPersonalInfo(businessMember.getCustomerId());
				dfIntrestCashBook.setCredit(interestAmount);
				dfIntrestCashBook.setDebit(BigDecimal.ZERO);
				dfIntrestCashBook.setTransType("DF INTEREST");
				dfIntrestCashBook.setParticulars("DF INTEREST");
				dfIntrestCashBook.setBmRemarks("");
				dfIntrestCashBook.setReceiptRemarks("");

				dfIntrestCashBook.setLineNo(3);
				dfIntrestCashBook.setUser(currentUser);

				dfIntrestCashBook.setTransDate(currentDate);
				dfIntrestCashBook.setSysDate(currentDate);

				cashBookRepo.save(dfIntrestCashBook);
			}

			generateEMIScheduleForDays(businessMember);
			
			break;

		case "MONTHLY_FINANCE":

			CashBook mFLoanCashBook = new CashBook();
			mFLoanCashBook.setBusinessMember(businessMember);
			mFLoanCashBook.setPersonalInfo(businessMember.getCustomerId());
			mFLoanCashBook.setCredit(BigDecimal.ZERO);
			mFLoanCashBook.setDebit(businessMember.getAmount());
			mFLoanCashBook.setTransType("MF LOAN");
			mFLoanCashBook.setParticulars("MF LOAN");
			mFLoanCashBook.setBmRemarks("");
			mFLoanCashBook.setReceiptRemarks("");

			mFLoanCashBook.setLineNo(1);
			mFLoanCashBook.setUser(currentUser);

			mFLoanCashBook.setTransDate(currentDate);
			mFLoanCashBook.setSysDate(currentDate);

			cashBookRepo.save(mFLoanCashBook);

			if (businessMemberDto.getProcessingFee() != null && businessMemberDto.getProcessingFee() != null
					&& businessMemberDto.getProcessingFee().compareTo(BigDecimal.ZERO) > 0) {

				CashBook dfProcessingFeeCashBook = new CashBook();
				dfProcessingFeeCashBook.setBusinessMember(businessMember);
				dfProcessingFeeCashBook.setPersonalInfo(businessMember.getCustomerId());
				dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
				dfProcessingFeeCashBook.setDebit(BigDecimal.ZERO);
				dfProcessingFeeCashBook.setTransType("MF DOC CHARGES");
				dfProcessingFeeCashBook.setParticulars("MF DOC CHARGES");
				dfProcessingFeeCashBook.setBmRemarks("");
				dfProcessingFeeCashBook.setReceiptRemarks("");

				dfProcessingFeeCashBook.setLineNo(2);
				dfProcessingFeeCashBook.setUser(currentUser);

				dfProcessingFeeCashBook.setTransDate(currentDate);
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
		
			businessMemberRepository.save(businessMember);

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

	public void generateEMIScheduleForMonth(BusinessMember member) {

		int months = member.getDuration(); // Loan duration in months

		// Step 1: Calculate total interest for the loan
		BigDecimal totalInterest = member.getInterest();

		// Step 2: Calculate total payable amount = principal + total interest
		BigDecimal totalPayable = member.getAmount().add(totalInterest);

		// Step 3: Calculate equal monthly EMI
		BigDecimal emiAmount = totalPayable.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		// Step 4: Calculate monthly principal and interest
		BigDecimal principalPerEMI = member.getAmount().divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);
		BigDecimal interestPerEMI = totalInterest.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP);

		// Step 5: Generate EMI schedule
		for (int i = 1; i <= months; i++) {
			EMI emi = new EMI();
			emi.setBusinessMember(member);
			emi.setInstallmentNumber(i);
			emi.setPrincipalAmount(principalPerEMI);
			emi.setInterestAmount(interestPerEMI);

			emi.setTotalAmount(emiAmount);
			emi.setPaidAmount(BigDecimal.ZERO);
			emi.setDueDate(member.getStartDate().plusMonths(i));
			emi.setStatus("PENDING");
			
			
			emiRepo.save(emi);

		}
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
