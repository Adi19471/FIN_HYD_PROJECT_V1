package com.balaji.finance.masterInfo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.balaji.finance.dto.BusinessMemberDto;
import com.balaji.finance.masterInfo.entity.BusinessMember;
import com.balaji.finance.masterInfo.entity.PersonalInfo;
import com.balaji.finance.masterInfo.repo.BusinessMemberRepository;
import com.balaji.finance.masterInfo.repo.PersonalInfoRepository;
import com.balaji.finance.pojo.BusinessMemberAutoCompletePojo;
import com.balaji.finance.transaction.entity.CashBook;
import com.balaji.finance.transaction.entity.CashBookRepo;
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
		businessMember.setId(generateId(type));

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

		businessMember.setAmount(businessMemberDto.getAmount());
		businessMember.setDuration(businessMemberDto.getDuration());
		businessMember.setInterest(businessMemberDto.getInterest());

		businessMember.setInstallment(businessMemberDto.getInstallment());
		businessMember.setStatus(businessMemberDto.isStatus());

		businessMember.setPartPrincipal(businessMemberDto.getPartPrincipal());
		businessMember.setPartInterest(businessMemberDto.getPartInterest());

		businessMember.setChequeReminder(businessMemberDto.isChequeReminder());
		businessMember.setBusinessId(businessMemberDto.getBusinessId());
		businessMember.setSecurity(businessMemberDto.getSecurity());

		businessMember.setPaidInstallments(0);
		businessMember.setUnpaidLateFee(0.0);

		businessMemberRepository.save(businessMember);

		String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
		LocalDateTime currentDate = LocalDateTime.now();

		switch (type) {
		case "DAILY_FINANCE":

			CashBook dfLoanCashBook = new CashBook();
			dfLoanCashBook.setAccountNo(businessMember.getId());
			dfLoanCashBook.setCredit(0.0);
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

			if (businessMemberDto.getProcessingFee() != null && businessMemberDto.getProcessingFee() > 0) {

				CashBook dfProcessingFeeCashBook = new CashBook();
				dfProcessingFeeCashBook.setAccountNo(businessMember.getId());
				dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
				dfProcessingFeeCashBook.setDebit(0.0);
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

			double principal = businessMember.getAmount();
			double ratePerMonth = businessMember.getInterest() / 100.0;
			double days = businessMember.getDuration();

			double timeInMonths = days / 30.0;
			double interestAmount = principal * ratePerMonth * timeInMonths;

			if (interestAmount > 0) {

				CashBook dfIntrestCashBook = new CashBook();
				dfIntrestCashBook.setAccountNo(businessMember.getId());
				dfIntrestCashBook.setCredit(interestAmount);
				dfIntrestCashBook.setDebit(0.0);
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

			break;

		case "MONTHLY_FINANCE":

			CashBook mFLoanCashBook = new CashBook();
			mFLoanCashBook.setAccountNo(businessMember.getId());
			mFLoanCashBook.setCredit(0.0);
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

			if (businessMemberDto.getProcessingFee() != null && businessMemberDto.getProcessingFee() > 0) {

				CashBook dfProcessingFeeCashBook = new CashBook();
				dfProcessingFeeCashBook.setAccountNo(businessMember.getId());
				dfProcessingFeeCashBook.setCredit(businessMemberDto.getProcessingFee());
				dfProcessingFeeCashBook.setDebit(0.0);
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

			businessMember.setAmount(businessMemberDto.getAmount());
			businessMember.setDuration(businessMemberDto.getDuration());

			businessMember.setInterest(businessMemberDto.getInterest());
			businessMember.setInstallment(businessMemberDto.getInstallment());

			businessMember.setStatus(businessMemberDto.isStatus());
			businessMember.setPartPrincipal(businessMemberDto.getPartPrincipal());
			businessMember.setUnpaidLateFee(businessMemberDto.getUnpaidLateFee());
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

			return "Sucessfully Deleted " + businessMember.getId();

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
			businessMemberDto.setId(p.getId());
			businessMemberDto.setCustomerId(p.getCustomerId() != null ? p.getCustomerId().getId() : null);
			businessMemberDto.setGuarantor1(p.getGuarantor1() != null ? p.getGuarantor1().getId() : null);
			businessMemberDto.setGuarantor2(p.getGuarantor2() != null ? p.getGuarantor2().getId() : null);
			businessMemberDto.setPartnerId(p.getPartnerId() != null ? p.getPartnerId().getId() : null);

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
			businessMemberDto.setId(p.getId());
			businessMemberDto.setCustomerId(p.getCustomerId() != null ? p.getCustomerId().getId() : null);
			businessMemberDto.setGuarantor1(p.getGuarantor1() != null ? p.getGuarantor1().getId() : null);
			businessMemberDto.setGuarantor2(p.getGuarantor2() != null ? p.getGuarantor2().getId() : null);
			businessMemberDto.setPartnerId(p.getPartnerId() != null ? p.getPartnerId().getId() : null);

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

	public List<BusinessMemberAutoCompletePojo> businessMemberAutoComplete(String keyWord, String loanType) {

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

		List<BusinessMember> loanList = businessMemberRepository.businessMemberAutoComplete(starWithString, keyWord);

		List<BusinessMemberAutoCompletePojo> pojoList = new ArrayList<BusinessMemberAutoCompletePojo>();
		System.err.println(loanList);

		for (BusinessMember bm : loanList) {

			BusinessMemberAutoCompletePojo pojo = new BusinessMemberAutoCompletePojo();
			pojo.setLoanId(bm.getId());
			pojo.setCustomerId(bm.getCustomerId().getId());
			pojo.setCustomerName(bm.getCustomerId().getFirstname());

			pojoList.add(pojo);
		}

		return pojoList;
	}

}
