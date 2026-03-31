package com.balaji.finance.util;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.balaji.finance.repo.BusinessMemberDailyFinanceSequenceRepository;

@Service
public class DfNumberService {

	private final BusinessMemberDailyFinanceSequenceRepository repo;

	public DfNumberService(BusinessMemberDailyFinanceSequenceRepository repo) {
		this.repo = repo;
	}

	@Transactional
	public String generateDfNumber(int year) {

		// Step 1: Atomic increment
		repo.incrementOrInsert(year);

		// Step 2: Get generated sequence
		int sequence = repo.getLastInsertedId();

		// Step 3: Format
		return String.format("DF-%d-%02d", year, sequence);
	}
}