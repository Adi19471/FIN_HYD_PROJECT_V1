package com.balaji.finance.repo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.entity.CashBook;

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
			WHERE DATE(TRANSDate) < :givenDate
			""", nativeQuery = true)
	Double findOpeningBalanceForDate(@Param("givenDate") LocalDate givenDate);

	@Query(value = """
			SELECT
			    DATE(TRANSDATE) AS txn_date,
			    IFNULL(SUM(CREDIT), 0) AS credit,
			    IFNULL(SUM(DEBIT), 0) AS debit,
			    IFNULL(SUM(CREDIT), 0) - IFNULL(SUM(DEBIT), 0) AS balance
			FROM cashbook
			WHERE TRANSDATE BETWEEN :fromDate AND :toDate
			GROUP BY DATE(TRANSDATE)
			ORDER BY DATE(TRANSDATE)
			""", nativeQuery = true)
	List<Object[]> getDateWiseCashBook(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			       SELECT
			             DATE(TRANSDATE) AS txn_date,
			             SUM(CASE WHEN PARTICULARS IN ('DF LOAN INSTALLMENT','DF LATE FEE','DF DOC CHARGES','DF INTEREST') THEN CREDIT ELSE 0 END) AS daily_total,
			             SUM(CASE WHEN PARTICULARS = ('MF LOAN INSTALLMENT','MF INTEREST','MF LATE FEE','MF DOC CHARGES') THEN CREDIT ELSE 0 END) AS monthly_total
			         FROM cashbook
			         WHERE TRANSDATE BETWEEN :fromDate AND :toDate
			         GROUP BY DATE(TRANSDATE)
			         ORDER BY DATE(TRANSDATE)
			""", nativeQuery = true)
	List<Object[]> getDateWiseCashBookCollectionsOnly(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    DATE(TRANSDATE) AS txn_date,
			    IFNULL(SUM(CREDIT), 0) AS credit,
			    IFNULL(SUM(DEBIT), 0) AS debit,
			    IFNULL(SUM(CREDIT), 0) - IFNULL(SUM(DEBIT), 0) AS balance
			FROM cashbook
			WHERE TRANSDATE BETWEEN :fromDate AND :toDate
			GROUP BY DATE(PARTICULARS)
			ORDER BY DATE(PARTICULARS)
			""", nativeQuery = true)
	List<Object[]> getSummaryByParticulars(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    DATE(TRANSDATE) AS txn_date,
			    IFNULL(SUM(CREDIT), 0) AS credit,
			    IFNULL(SUM(DEBIT), 0) AS debit,
			    IFNULL(SUM(CREDIT), 0) - IFNULL(SUM(DEBIT), 0) AS balance
			FROM cashbook
			GROUP BY DATE(PARTICULARS)
			ORDER BY DATE(PARTICULARS)
			""", nativeQuery = true)
	List<Object[]> getSummaryByParticulars();

}
