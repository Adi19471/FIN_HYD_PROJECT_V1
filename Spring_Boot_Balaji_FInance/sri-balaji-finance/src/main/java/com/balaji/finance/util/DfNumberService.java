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
		return String.format("DF%d-%02d", year, sequence);
	}

	/**
	 * Read-only preview of the number the next saved loan will most likely get.
	 * Does not consume the sequence, so opening and cancelling a "New Loan" form
	 * leaves no gap and no empty row. The real number is assigned on save.
	 */
	@Transactional(readOnly = true)
	public String peekNextDfNumber(int year) {
		int next = repo.findById(year).map(s -> s.getLastNumber() == null ? 0 : s.getLastNumber()).orElse(0) + 1;
		return String.format("DF%d-%02d", year, next);
	}
}
