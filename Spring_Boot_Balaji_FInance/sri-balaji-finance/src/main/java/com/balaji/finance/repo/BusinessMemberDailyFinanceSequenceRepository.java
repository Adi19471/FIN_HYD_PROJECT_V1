package com.balaji.finance.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.balaji.finance.entity.BusinessMemberDailyFinanceSequence;
import com.balaji.finance.entity.BusinessMemberMonthlyFinanceSequence;

public interface BusinessMemberDailyFinanceSequenceRepository extends JpaRepository<BusinessMemberDailyFinanceSequence, Integer> {

	@Modifying
	@Query(value = """
			INSERT INTO business_member_daily_finance_sequence (year, last_number)
			  VALUES (?1, 1)
			ON DUPLICATE KEY UPDATE last_number = LAST_INSERT_ID(last_number + 1)
			""", nativeQuery = true)
	void incrementOrInsert(int year);

	@Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
	int getLastInsertedId();
}