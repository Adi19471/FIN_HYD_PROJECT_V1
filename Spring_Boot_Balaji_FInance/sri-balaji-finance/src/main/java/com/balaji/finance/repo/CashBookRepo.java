package com.balaji.finance.repo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.dto.BalanceSheetProjection;
import com.balaji.finance.dto.DateWiseCashBookProjection;
import com.balaji.finance.dto.DateWiseCollectionsProjection;
import com.balaji.finance.dto.LoanCollectionProjection;
import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.dto.SumOfCreditsAndDebitsProjection;
import com.balaji.finance.dto.SummaryByParticularsProjection;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;

public interface CashBookRepo extends JpaRepository<CashBook, Long> {

	@Query("SELECT u FROM CashBook u WHERE u.cashBookId =:cashBookId")
	public Optional<CashBook> findById(@Param("cashBookId") String cashBookId);

	List<CashBook> findByBusinessMember(BusinessMember businessMember);

	List<CashBook> findByTransType(String transType);

	List<CashBook> findByTransTypeAndTransDateBetween(String transType, LocalDateTime fromDate, LocalDateTime toDate);

	@Query("""
			SELECT COALESCE(SUM(cb.credit), 0)
			FROM CashBook cb
			WHERE cb.businessMember.businessMemberId = :accountNo
			AND cb.transType = 'MF LOAN'
			""")
	BigDecimal sumPrincipal(@Param("accountNo") String accountNo);

	@Query("""
			SELECT COALESCE(SUM(cb.credit), 0)
			FROM CashBook cb
			WHERE cb.businessMember.businessMemberId = :accountNo
			AND cb.transType = 'MF INTEREST'
			""")
	BigDecimal sumInterest(@Param("accountNo") String accountNo);

	@Query("""
			SELECT c
			FROM CashBook c
			WHERE c.transDate >= :startDate
			AND c.transDate < :endDate
			""")
	List<CashBook> findByTransactionDate(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	@Query(value = """
			SELECT
			 COALESCE(SUM(c.DEBIT),0) as credits,
			 COALESCE(SUM(c.CREDIT),0) as debits
			FROM cash_book c
			WHERE c.TRANS_DATE < :endDate
			""", nativeQuery = true)
	SumOfCreditsAndDebitsProjection findAllSumOfCreditsAndDebitsTransactionDate(
			@Param("endDate") LocalDateTime endDate);

	@Query(value = """
			SELECT COALESCE(SUM(DEBIT),0) - COALESCE(SUM(CREDIT),0)
			FROM cash_book
			WHERE TRANS_DATE < :givenDate
			""", nativeQuery = true)
	BigDecimal findOpeningBalanceForDate(@Param("givenDate") LocalDate givenDate);

	@Query(value = """
			SELECT
			    DATE(TRANS_DATE) AS txnDate,
			    COALESCE(SUM(CREDIT), 0) AS credit,
			    COALESCE(SUM(DEBIT), 0) AS debit,
			    COALESCE(SUM(CREDIT), 0) - COALESCE(SUM(DEBIT), 0) AS balance
			FROM cash_book
			WHERE TRANS_DATE BETWEEN :fromDate AND :toDate
			GROUP BY DATE(TRANS_DATE)
			ORDER BY DATE(TRANS_DATE)
			""", nativeQuery = true)
	List<DateWiseCashBookProjection> getDateWiseCashBook(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    DATE(TRANS_DATE) AS txnDate,
			    SUM(CASE WHEN PARTICULARS IN
			        ('DF LOAN INSTALLMENT','DF LATE FEE','DF DOC CHARGES','DF INTEREST')
			        THEN CREDIT ELSE 0 END) AS dailyTotal,
			    SUM(CASE WHEN PARTICULARS IN
			        ('MF LOAN INSTALLMENT','MF INTEREST','MF LATE FEE','MF DOC CHARGES')
			        THEN CREDIT ELSE 0 END) AS monthlyTotal
			FROM cash_book
			WHERE TRANS_DATE BETWEEN :fromDate AND :toDate
			GROUP BY DATE(TRANS_DATE)
			ORDER BY DATE(TRANS_DATE)
			""", nativeQuery = true)
	List<DateWiseCollectionsProjection> getDateWiseCashBookCollectionsOnly(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    DATE(TRANS_DATE) AS txnDate,
			    SUM(CASE WHEN PARTICULARS IN
			        ('DF LOAN INSTALLMENT','DF LATE FEE','DF DOC CHARGES','DF INTEREST')
			        THEN CREDIT ELSE 0 END) AS dailyTotal,
			    SUM(CASE WHEN PARTICULARS IN
			        ('MF LOAN INSTALLMENT','MF INTEREST','MF LATE FEE','MF DOC CHARGES')
			        THEN CREDIT ELSE 0 END) AS monthlyTotal
			FROM cash_book
			WHERE TRANS_DATE BETWEEN :fromDate AND :toDate
			AND ENTRY_USER = :user
			GROUP BY DATE(TRANS_DATE)
			ORDER BY DATE(TRANS_DATE)
			""", nativeQuery = true)
	List<DateWiseCollectionsProjection> getDateWiseCashBookCollectionsOnlyByUser(
			@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate,
			@Param("user") String user);

	@Query(value = """
			SELECT
			    DATE(TRANS_DATE) AS txnDate,
			    SUM(CASE WHEN PARTICULARS IN
			        ('DF LOAN INSTALLMENT','DF LATE FEE','DF DOC CHARGES','DF INTEREST')
			        THEN CREDIT ELSE 0 END) AS dailyTotal,
			    SUM(CASE WHEN PARTICULARS IN
			        ('MF LOAN INSTALLMENT','MF INTEREST','MF LATE FEE','MF DOC CHARGES')
			        THEN CREDIT ELSE 0 END) AS monthlyTotal
			FROM cash_book
			WHERE ENTRY_USER = :user
			GROUP BY DATE(TRANS_DATE)
			ORDER BY DATE(TRANS_DATE)
			""", nativeQuery = true)
	List<DateWiseCollectionsProjection> getAllCashBookCollectionsOnlyByUser(@Param("user") String user);

	@Query(value = """
			SELECT
			    COALESCE(SUM(CREDIT), 0) AS credit,
			    COALESCE(SUM(DEBIT), 0) AS debit,
			    COALESCE(SUM(CREDIT), 0) - COALESCE(SUM(DEBIT), 0) AS balance,
			    PARTICULARS AS particulars
			FROM cash_book
			WHERE TRANS_DATE BETWEEN :fromDate AND :toDate
			GROUP BY PARTICULARS
			ORDER BY PARTICULARS
			""", nativeQuery = true)
	List<SummaryByParticularsProjection> getSummaryByParticulars(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    COALESCE(SUM(CREDIT), 0) AS credit,
			    COALESCE(SUM(DEBIT), 0) AS debit,
			    COALESCE(SUM(CREDIT), 0) - COALESCE(SUM(DEBIT), 0) AS balance,
			    PARTICULARS AS particulars
			FROM cash_book
			GROUP BY PARTICULARS
			ORDER BY PARTICULARS
			""", nativeQuery = true)
	List<SummaryByParticularsProjection> getSummaryByParticulars();

	@Query("""
			SELECT c
			FROM CashBook c
			WHERE c.transDate BETWEEN :fromDate AND :toDate
			AND c.businessMember.businessMemberId IS NOT NULL
			""")
	List<CashBook> findByDateRangeAndBusinessNotNull(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query("""
			SELECT c
			FROM CashBook c
			WHERE c.businessMember.businessMemberId IS NOT NULL
			""")
	List<CashBook> findByDateRangeAndBusinessNotNull();

	@Query("""
			SELECT COALESCE(SUM(c.credit),0) FROM CashBook c
			WHERE c.businessMember.businessMemberId = :memberId
			AND c.transType IN ('MF LOAN','MF INTEREST')
			""")
	BigDecimal getTotalPaidForMember(@Param("memberId") String memberId);

	@Query(value = """
			SELECT
			    am.type AS type,
			    am.code AS code,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			JOIN accountmaster am
			    ON am.code = cb.particulars
			WHERE cb.TRANS_DATE BETWEEN :fromDate AND :toDate
			GROUP BY am.type, am.code
			ORDER BY am.type, am.code
			""", nativeQuery = true)
	List<RevenueExpenseProjection> getRevenueExpenseStatementByTrasncDate(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    am.type AS type,
			    am.code AS code,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			JOIN accountmaster am
			    ON am.code = cb.particulars
			GROUP BY am.type, am.code
			ORDER BY am.type, am.code
			""", nativeQuery = true)
	List<RevenueExpenseProjection> getRevenueExpenseStatement();

	@Query(value = """
			SELECT
			    am.type AS type,
			    am.master_code as masterCode,
			    am.code AS code,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			JOIN accountmaster am
			    ON am.code = cb.particulars
			WHERE cb.TRANS_DATE < :toDate
			  and am.type IN (:typeList)
			GROUP BY am.type, am.code , am.master_code
			ORDER BY am.type, am.code
			""", nativeQuery = true)
	List<BalanceSheetProjection> getBalanceSheetByTrasncDate(@Param("toDate") LocalDateTime toDate,
			@Param("typeList") List<String> typeList);

	@Query(value = """
			SELECT
			    SUM(CASE
			        WHEN PARTICULARS = 'DF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END) AS dailyLoanInstallmentsReceived,

			    SUM(CASE
			        WHEN PARTICULARS = 'DF INTEREST'
			        THEN CREDIT ELSE 0 END) AS dailyLoanInterestReceived,

			    SUM(CASE
			        WHEN PARTICULARS = 'MF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END) AS monthlyLoanInstallmentsReceived,

			    SUM(CASE
			        WHEN PARTICULARS = 'MF INTEREST'
			        THEN CREDIT ELSE 0 END) AS monthlyLoanInterestReceived

			FROM cash_book
			WHERE TRANS_DATE BETWEEN :fromDate AND :toDate
			AND PARTICULARS IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST',
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST'
			);
						""", nativeQuery = true)
	LoanCollectionProjection getLoanCollectionData(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

}