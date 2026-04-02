package com.balaji.finance.util;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.balaji.finance.repo.BusinessMemberMonthlyFinanceSequenceRepository;

@Service
public class MfNumberService {

	private final BusinessMemberMonthlyFinanceSequenceRepository repo;

	public MfNumberService(BusinessMemberMonthlyFinanceSequenceRepository repo) {
		this.repo = repo;
	}

	@Transactional
	public String generateMfNumber(int year) {
	
		// Step 1: Atomic increment
		repo.incrementOrInsert(year);

		// Step 2: Get generated sequence
		int sequence = repo.getLastInsertedId();

		// Step 3: Format
		return String.format("MF%d-%02d", year, sequence);
	}
}