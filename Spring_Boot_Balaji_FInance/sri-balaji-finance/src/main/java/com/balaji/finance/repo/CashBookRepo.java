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
import com.balaji.finance.dto.BusinessOverviewProjection;
import com.balaji.finance.dto.CustomerReportProjection;
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

	Optional<CashBook> findByBusinessMemberAndAccountMastercode(BusinessMember businessMember, String masterCode);

	List<CashBook> findByAccountMastercode(String accountMastercode);

	List<CashBook> findByAccountMastercodeAndTransDateBetween(String accountMastercode, LocalDateTime fromDate, LocalDateTime toDate);

	@Query("""
			SELECT COALESCE(SUM(cb.credit), 0)
			FROM CashBook cb
			WHERE cb.businessMember.businessMemberId = :accountNo
			AND cb.accountMastercode = 'MF LOAN'
			""")
	BigDecimal sumPrincipal(@Param("accountNo") String accountNo);

	@Query("""
			SELECT COALESCE(SUM(cb.credit), 0)
			FROM CashBook cb
			WHERE cb.businessMember.businessMemberId = :accountNo
			AND cb.accountMastercode = 'MF INTEREST'
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
			 COALESCE(SUM(c.CREDIT),0) as credits,
			 COALESCE(SUM(c.DEBIT),0) as debits
			FROM cash_book c
			WHERE c.TRANS_DATE < :endDate
			""", nativeQuery = true)
	SumOfCreditsAndDebitsProjection findAllSumOfCreditsAndDebitsTransactionDate(
			@Param("endDate") LocalDateTime endDate);

	@Query(value = """
			SELECT COALESCE(SUM(CREDIT),0) - COALESCE(SUM(DEBIT),0)
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
			    SUM(CASE WHEN ACCOUNT_MASTER_CODE IN
			        ('DF LOAN INSTALLMENT','DF LATE FEE','DF DOC CHARGES','DF INTEREST')
			        THEN CREDIT ELSE 0 END) AS dailyTotal,
			    SUM(CASE WHEN ACCOUNT_MASTER_CODE IN
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
			    SUM(CASE WHEN ACCOUNT_MASTER_CODE IN
			        ('DF LOAN INSTALLMENT','DF LATE FEE','DF DOC CHARGES','DF INTEREST')
			        THEN CREDIT ELSE 0 END) AS dailyTotal,
			    SUM(CASE WHEN ACCOUNT_MASTER_CODE IN
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
			    SUM(CASE WHEN ACCOUNT_MASTER_CODE IN
			        ('DF LOAN INSTALLMENT')
			        THEN CREDIT ELSE 0 END) AS dailyTotal,
			    SUM(CASE WHEN ACCOUNT_MASTER_CODE IN
			        ('MF LOAN INSTALLMENT')
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
			    ACCOUNT_MASTER_CODE AS particulars
			FROM cash_book
			WHERE TRANS_DATE BETWEEN :fromDate AND :toDate
			GROUP BY ACCOUNT_MASTER_CODE
			ORDER BY ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<SummaryByParticularsProjection> getSummaryByParticulars(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    COALESCE(SUM(CREDIT), 0) AS credit,
			    COALESCE(SUM(DEBIT), 0) AS debit,
			    COALESCE(SUM(CREDIT), 0) - COALESCE(SUM(DEBIT), 0) AS balance,
			    ACCOUNT_MASTER_CODE AS particulars
			FROM cash_book
			GROUP BY ACCOUNT_MASTER_CODE
			ORDER BY ACCOUNT_MASTER_CODE
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
			AND c.accountMastercode IN ('MF LOAN','MF INTEREST')
			""")
	BigDecimal getTotalPaidForMember(@Param("memberId") String memberId);

	@Query(value = """
			SELECT
			    cb.ACCOUNT_MASTER_TYPE AS type,
			    cb.ACCOUNT_MASTER_CODE AS code,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			WHERE cb.TRANS_DATE BETWEEN :fromDate AND :toDate
			GROUP BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			ORDER BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<RevenueExpenseProjection> getRevenueExpenseStatementByTrasncDate(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    cb.ACCOUNT_MASTER_TYPE AS type,
			    cb.ACCOUNT_MASTER_CODE AS code,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			GROUP BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			ORDER BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<RevenueExpenseProjection> getRevenueExpenseStatement();
	
	
	
	
	
	
	
	

	@Query(value = """
			SELECT
			    cb.ACCOUNT_MASTER_TYPE AS type,
			    cb.ACCOUNT_MASTER_MASTER_CODE as masterCode,
			    cb.ACCOUNT_MASTER_CODE AS code,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			WHERE cb.TRANS_DATE < :toDate
			  and cb.ACCOUNT_MASTER_TYPE IN (:typeList)
			GROUP BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_MASTER_CODE , cb.ACCOUNT_MASTER_CODE
			ORDER BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<BalanceSheetProjection> getBalanceSheetByTrasncDate(@Param("toDate") LocalDateTime toDate,
			@Param("typeList") List<String> typeList);

	@Query(value = """
			SELECT
			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'DF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END) AS dailyLoanInstallmentsReceived,

			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'DF INTEREST'
			        THEN CREDIT ELSE 0 END) AS dailyLoanInterestReceived,

			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'MF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END) AS monthlyLoanInstallmentsReceived,

			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'MF INTEREST'
			        THEN CREDIT ELSE 0 END) AS monthlyLoanInterestReceived

			FROM cash_book
			WHERE TRANS_DATE BETWEEN :fromDate AND :toDate
			AND ACCOUNT_MASTER_CODE IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST',
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST'
			);
						""", nativeQuery = true)
	LoanCollectionProjection getLoanCollectionDataByDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);
	
	
	@Query(value = """
			SELECT
			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'DF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END) AS dailyLoanInstallmentsReceived,

			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'DF INTEREST'
			        THEN CREDIT ELSE 0 END) AS dailyLoanInterestReceived,

			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'MF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END) AS monthlyLoanInstallmentsReceived,

			    SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'MF INTEREST'
			        THEN CREDIT ELSE 0 END) AS monthlyLoanInterestReceived

			FROM cash_book
			AND ACCOUNT_MASTER_CODE IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST',
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST'
			);
						""", nativeQuery = true)
	LoanCollectionProjection getLoanCollectionData();
	
	
	
	@Query(value = """
			SELECT
			    cb.ACCOUNT_MASTER_TYPE AS type,
			    cb.ACCOUNT_MASTER_CODE AS code,
			    cb.ACCOUNT_MASTER_MASTER_CODE as masterCode,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			WHERE cb.TRANS_DATE BETWEEN :fromDate AND :toDate
			  and cb.ACCOUNT_MASTER_TYPE IN (:typeList)
			GROUP BY cb.ACCOUNT_MASTER_TYPE,cb.ACCOUNT_MASTER_MASTER_CODE, cb.ACCOUNT_MASTER_CODE
			ORDER BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<BusinessOverviewProjection> getBusinessOverviewTrasncDate(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate,@Param("typeList") List<String> typeList);

	@Query(value = """
			SELECT
			    cb.ACCOUNT_MASTER_TYPE AS type,
			    cb.ACCOUNT_MASTER_CODE AS code,
			    cb.ACCOUNT_MASTER_MASTER_CODE as masterCode,
			    COALESCE(SUM(cb.CREDIT),0) - COALESCE(SUM(cb.DEBIT),0) AS amount
			FROM cash_book cb
			 Where cb.ACCOUNT_MASTER_TYPE IN (:typeList)
			GROUP BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_MASTER_CODE, cb.ACCOUNT_MASTER_CODE
			ORDER BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<BusinessOverviewProjection> getBusinessOverviewStatement(@Param("typeList") List<String> typeList);

	
	@Query("""
		    SELECT
		         customer.personalInfoId AS personalInfoId,
		         customer.firstName AS customerName,
		         COALESCE(SUM(cb.credit), 0) AS credits,
		         COALESCE(SUM(cb.debit), 0) AS debits
		    FROM CashBook cb
		    LEFT JOIN cb.personalInfo customer
		    WHERE cb.accountMastercode = :accountMastercode
		    GROUP BY customer.personalInfoId, customer.firstName
		    ORDER BY customer.firstName
		""")
		List<CustomerReportProjection> getCustomerReportOnAccountCode(
		        @Param("accountMastercode") String accountMastercode);
}