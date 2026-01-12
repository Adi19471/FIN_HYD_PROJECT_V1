package com.balaji.finance.masterInfo.repo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.masterInfo.entity.CashBook;

public interface CashBookRepo extends JpaRepository<CashBook, Double> {

	public List<CashBook> findByAccountNo(String accountNo);

	@Query("SELECT COALESCE(SUM(cb.credit), 0) FROM CashBook cb "
			+ "WHERE cb.accountNo = :accountNo AND cb.transType = 'MF LOAN'")
	double sumPrincipal(@Param("accountNo") String accountNo);

	@Query("SELECT COALESCE(SUM(cb.credit), 0) FROM CashBook cb "
			+ "WHERE cb.accountNo = :accountNo AND cb.transType = 'MF INTEREST'")
	double sumInterest(@Param("accountNo") String accountNo);
	
	
	
	
	@Query("SELECT c FROM CashBook c WHERE DATE(c.transDate) = :date")
    List<CashBook> findByTransactionDate(@Param("date") LocalDate date);
	
	
	@Query(value = """
			SELECT COALESCE(SUM(DEBIT),0) - COALESCE(SUM(CREDIT),0)
			FROM cashbook
			WHERE DATE(TRANSDate) < :todayDate
			""", nativeQuery = true)
	Double findOpeningBalanceForToday(@Param("todayDate") LocalDate todayDate);

}
