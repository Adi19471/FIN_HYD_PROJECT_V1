package com.balaji.finance.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.balaji.finance.entity.BusinessMemberMonthlyFinanceSequence;

public interface BusinessMemberMonthlyFinanceSequenceRepository
		extends JpaRepository<BusinessMemberMonthlyFinanceSequence, Integer> {

	@Modifying
	@Query(value = """
	    INSERT INTO business_member_monthly_finance_sequence (year, last_number)
	    VALUES (?1, LAST_INSERT_ID(1))
	    ON DUPLICATE KEY UPDATE last_number = LAST_INSERT_ID(last_number + 1)
	    """, nativeQuery = true)
	void incrementOrInsert(int year);

	@Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
	int getLastInsertedId();
}