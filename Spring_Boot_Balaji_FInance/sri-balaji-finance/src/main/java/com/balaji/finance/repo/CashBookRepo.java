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
import com.balaji.finance.dto.CashBookProjection;
import com.balaji.finance.dto.CustomerReportProjection;
import com.balaji.finance.dto.CustomerTransactionsProjection;
import com.balaji.finance.dto.DateWiseCashBookProjection;
import com.balaji.finance.dto.DateWiseCollectionsProjection;
import com.balaji.finance.dto.LoanCollectionProjection;
import com.balaji.finance.dto.PaidInstallmentProjection;
import com.balaji.finance.dto.PartnerCreditSummaryProjection;
import com.balaji.finance.dto.PartnerPerformanceReport;
import com.balaji.finance.dto.RevenueExpenseProjection;
import com.balaji.finance.dto.SumOfCreditsAndDebitsProjection;
import com.balaji.finance.dto.SummaryByParticularsProjection;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;

public interface CashBookRepo extends JpaRepository<CashBook, Long> {

	@Query("SELECT u FROM CashBook u WHERE u.cashBookId =:cashBookId")
	public Optional<CashBook> findById(@Param("cashBookId") String cashBookId);

	List<CashBook> findByBusinessMember(BusinessMember businessMember);

	Optional<CashBook> findByBusinessMemberAndAccountMasterCode(BusinessMember businessMember, String masterCode);

	List<CashBook> findByAccountMasterCode(String accountMasterCode);

	List<CashBook> findByAccountMasterCodeAndTransDateBetween(String accountMasterCode, LocalDateTime fromDate,
			LocalDateTime toDate);

	@Query("""
			SELECT COALESCE(SUM(cb.credit), 0)
			FROM CashBook cb
			WHERE cb.businessMember.businessMemberId = :accountNo
			AND cb.accountMasterCode = 'MF LOAN'
			""")
	BigDecimal sumPrincipal(@Param("accountNo") String accountNo);

	@Query("""
			SELECT COALESCE(SUM(cb.credit), 0)
			FROM CashBook cb
			WHERE cb.businessMember.businessMemberId = :accountNo
			AND cb.accountMasterCode = 'MF INTEREST'
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

	@Query("""
			SELECT c
			FROM CashBook c
			WHERE c.transDate >= :startDate
			AND c.transDate < :endDate
			AND c.accountMasterCode NOT IN ('MF LOAN','MF DOC CHARGES','DF LOAN','DF INTEREST','DF DOC CHARGES')
			""")
	List<CashBook> findByTransactionDateExcludedSomeAccountCodes(@Param("startDate") LocalDateTime startDate,
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
			        ('DF LOAN INSTALLMENT','DF LATE FEE','DF INTEREST')
			        THEN CREDIT ELSE 0 END) AS dailyTotal,
			    SUM(CASE WHEN ACCOUNT_MASTER_CODE IN
			        ('MF LOAN INSTALLMENT','MF INTEREST','MF LATE FEE')
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
			AND c.accountMasterCode IN ('MF LOAN','MF INTEREST')
			""")
	BigDecimal getTotalPaidForMember(@Param("memberId") String memberId);

	@Query(value = """
			SELECT
			    cb.ACCOUNT_MASTER_TYPE AS type,
			    cb.ACCOUNT_MASTER_CODE AS code,
			     ABS(
			             COALESCE(SUM(cb.CREDIT), 0) -
			             COALESCE(SUM(cb.DEBIT), 0)
			         ) AS amount
			FROM cash_book cb
			WHERE cb.TRANS_DATE BETWEEN :fromDate AND :toDate
			  AND cb.ACCOUNT_MASTER_TYPE IN :accountType
			GROUP BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			ORDER BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<RevenueExpenseProjection> getRevenueExpenseStatementByTrasncDate(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate, @Param("accountType") List<String> accountType);

	@Query(value = """
			SELECT
			    cb.ACCOUNT_MASTER_TYPE AS type,
			    cb.ACCOUNT_MASTER_CODE AS code,
			     ABS(
			             COALESCE(SUM(cb.CREDIT), 0) -
			             COALESCE(SUM(cb.DEBIT), 0)
			         ) AS amount
			FROM cash_book cb
			  Where cb.ACCOUNT_MASTER_TYPE IN :accountType
			GROUP BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			ORDER BY cb.ACCOUNT_MASTER_TYPE, cb.ACCOUNT_MASTER_CODE
			""", nativeQuery = true)
	List<RevenueExpenseProjection> getRevenueExpenseStatement(@Param("accountType") List<String> accountType);

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
			)
						""", nativeQuery = true)
	LoanCollectionProjection getLoanCollectionDataByDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	/**
	 * The same four collection figures taken from the start of the books up to a
	 * day, for working out what is still outstanding on it. The principal and
	 * the interest sit under codes of their own, which is what lets the
	 * outstanding be split into principal and interest at all.
	 */
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
			WHERE TRANS_DATE <= :toDate
			AND ACCOUNT_MASTER_CODE IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST',
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST'
			)
						""", nativeQuery = true)
	LoanCollectionProjection getLoanCollectionDataUpTo(@Param("toDate") LocalDateTime toDate);

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
			 WHERE
			  ACCOUNT_MASTER_CODE IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST',
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST'
			)
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
			@Param("toDate") LocalDateTime toDate, @Param("typeList") List<String> typeList);

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
			    WHERE cb.accountMasterCode = :accountMasterCode
			    GROUP BY customer.personalInfoId, customer.firstName
			    ORDER BY customer.firstName
			""")
	List<CustomerReportProjection> getCustomerReportOnAccountCode(@Param("accountMasterCode") String accountMasterCode);

	@Query("""
			    SELECT
			         cb.cashBookId AS cashBookId,
			         cb.transDate AS transDate,
			         businessMember.businessMemberId  as businessMemberId,
			         cb.accountMasterCode as accountMasterCode,
			         cb.bmRemarks as bmRemarks,
			         COALESCE(cb.credit, 0) AS credit,
			         COALESCE(cb.debit, 0) AS debit
			    FROM CashBook cb
			    LEFT JOIN cb.personalInfo customer
			    LEFT JOIN cb.businessMember businessMember
			    WHERE cb.accountMasterCode = :accountMasterCode
			      and customer.personalInfoId= :customerId
			    ORDER BY cb.cashBookId desc
			""")
	List<CustomerTransactionsProjection> getCustomerTransactionsOnAccountMasterCode(
			@Param("accountMasterCode") String accountMasterCode, @Param("customerId") String customerId);

	@Query("""
			    SELECT
			         cb.cashBookId AS cashBookId,
			         cb.transDate AS transDate,
			         businessMember.businessMemberId  as businessMemberId,
			         cb.accountMasterCode as accountMasterCode,
			         cb.bmRemarks as bmRemarks,
			         COALESCE(cb.credit, 0) AS credit,
			         COALESCE(cb.debit, 0) AS debit
			    FROM CashBook cb
			    LEFT JOIN cb.personalInfo customer
			    LEFT JOIN cb.businessMember businessMember
			    WHERE cb.accountMasterCode = :accountMasterCode
			      and customer.personalInfoId= :customerId
			      and cb.transDate BETWEEN :fromDate AND :toDate
			    ORDER BY cb.cashBookId desc
			""")
	List<CustomerTransactionsProjection> getCustomerTransactionsOnAccountMasterCodeAndDateRange(
			@Param("accountMasterCode") String accountMasterCode, @Param("customerId") String customerId,
			@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

	List<CashBook> findByPaymentRefId(String paymentRefId);

	void deleteByPaymentRefId(String paymentRefId);

	@Query("""
			FROM CashBook c
			WHERE c.businessMember.businessMemberId =:businessMemberId
			AND c.accountMasterCode NOT IN ('MF LOAN','MF DOC CHARGES','DF LOAN','DF INTEREST','DF DOC CHARGES')
			""")
	List<CashBook> findCollectionsOnAccount(String businessMemberId);

	@Query("""
			    SELECT
			        cb.accountMasterCode AS accountMasterCode,
			        COALESCE(SUM(cb.credit), 0) AS credit
			    FROM CashBook cb
			        LEFT JOIN cb.businessMember businessMember
			    WHERE cb.accountMasterCode IN :accountMasterCode
			      AND cb.transDate BETWEEN :fromDate AND :toDate
			      And businessMember.loanStatus=:loanStatus
			    GROUP BY cb.accountMasterCode
			""")
	List<CashBookProjection> getCreditSummary(@Param("accountMasterCode") List<String> accountMasterCode,
			@Param("fromDate") LocalDateTime from, @Param("toDate") LocalDateTime to,
			@Param("loanStatus") String loanStatus);

	@Query("""
			    SELECT
			        COALESCE(SUM(cb.credit), 0)
			    FROM CashBook cb
			         JOIN cb.personalInfo personalInfo
			    WHERE cb.accountMasterCode IN :accountMasterCode
			      AND cb.transDate BETWEEN :fromDate AND :toDate
			      AND personalInfo.personalInfoId IN :personalInfoId
			""")
	BigDecimal getCreditOfAccountCodeDateRange(@Param("accountMasterCode") List<String> accountMasterCode,
			@Param("personalInfoId") List<String> personalInfoId, @Param("fromDate") LocalDateTime from,
			@Param("toDate") LocalDateTime to);

	@Query("""
			    SELECT
			        COALESCE(SUM(cb.credit), 0)
			    FROM CashBook cb
			         JOIN cb.personalInfo personalInfo
			    WHERE cb.accountMasterCode IN :accountMasterCode
			      AND personalInfo.personalInfoId IN :personalInfoId
			""")
	BigDecimal getCreditOfAccountCode(@Param("accountMasterCode") List<String> accountMasterCode,
			@Param("personalInfoId") List<String> personalInfoId);

	@Query("""
			      SELECT
			          personalInfo.personalInfoId AS personalInfoId,

			          COALESCE(SUM(cb.credit), 0) AS totalCredit

			      FROM CashBook cb
			           JOIN cb.personalInfo personalInfo

			      WHERE cb.accountMasterCode IN :accountMasterCodes
			        AND cb.transDate BETWEEN :fromDate AND :toDate
			        AND personalInfo.personalInfoId IN :personalInfoIds

			      GROUP BY personalInfo.personalInfoId
			""")
	List<PartnerCreditSummaryProjection> getCreditOfAccountCodeForEveryPartnerDaterange(
			@Param("accountMasterCodes") List<String> accountMasterCodes,
			@Param("personalInfoIds") List<String> personalInfoIds, @Param("fromDate") LocalDateTime from,
			@Param("toDate") LocalDateTime to);

	@Query("""
			SELECT
			    personalInfo.personalInfoId AS personalInfoId,

			    COALESCE(SUM(cb.credit), 0) AS totalCredit

			FROM CashBook cb
			     JOIN cb.personalInfo personalInfo

			WHERE cb.accountMasterCode IN :accountMasterCodes
			  AND personalInfo.personalInfoId IN :personalInfoIds

			GROUP BY personalInfo.personalInfoId
			""")
	List<PartnerCreditSummaryProjection> getCreditOfAccountCodeForEveryPartner(
			@Param("accountMasterCodes") List<String> accountMasterCodes,
			@Param("personalInfoIds") List<String> personalInfoIds);

	@Query(value = """
			SELECT
			    partner.PERSONAL_INFO_ID AS id,
			    partner.FIRST_NAME AS firstName,
			    partner.LAST_NAME AS lastName,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF LOAN','MF LOAN')
			        THEN cb.CREDIT ELSE 0 END) AS disbursedAmount,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF LOAN INSTALLMENT','MF LOAN INSTALLMENT')
			        THEN cb.CREDIT ELSE 0 END) AS loanInstallmentsReceived,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF INTEREST','MF INTEREST')
			        THEN cb.CREDIT ELSE 0 END) AS interestReceived,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF DOC CHARGES','MF DOC CHARGES')
			        THEN cb.CREDIT ELSE 0 END) AS documentCharges

			FROM cash_book cb
			LEFT JOIN business_member bm
			    ON cb.BUSINESS_MEMBER_ID = bm.BUSINESS_MEMBER_ID
			LEFT JOIN personal_info partner
			    ON bm.PARTNER_ID = partner.PERSONAL_INFO_ID

			WHERE cb.TRANS_DATE BETWEEN :fromDate AND :toDate
			AND cb.ACCOUNT_MASTER_CODE IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST',
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST',
			    'DF DOC CHARGES',
			    'MF DOC CHARGES',
			    'DF LOAN',
			    'MF LOAN'
			) AND bm.PARTNER_ID IS NOT NULL

			GROUP BY
			    partner.PERSONAL_INFO_ID,
			    partner.FIRST_NAME,
			    partner.LAST_NAME
			""", nativeQuery = true)
	List<PartnerPerformanceReport> getLoanSummaryOfPartnersOfDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query(value = """
			SELECT
			    partner.PERSONAL_INFO_ID AS id,
			    partner.FIRST_NAME AS firstName,
			    partner.LAST_NAME AS lastName,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF LOAN','MF LOAN')
			        THEN cb.CREDIT ELSE 0 END) AS disbursedAmount,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF LOAN INSTALLMENT','MF LOAN INSTALLMENT')
			        THEN cb.CREDIT ELSE 0 END) AS loanInstallmentsReceived,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF INTEREST','MF INTEREST')
			        THEN cb.CREDIT ELSE 0 END) AS interestReceived,

			    SUM(CASE
			        WHEN cb.ACCOUNT_MASTER_CODE IN ('DF DOC CHARGES','MF DOC CHARGES')
			        THEN cb.CREDIT ELSE 0 END) AS documentCharges

			FROM cash_book cb
			LEFT JOIN business_member bm
			    ON cb.BUSINESS_MEMBER_ID = bm.BUSINESS_MEMBER_ID
			LEFT JOIN personal_info partner
			    ON bm.PARTNER_ID = partner.PERSONAL_INFO_ID

			WHERE cb.ACCOUNT_MASTER_CODE IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST',
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST',
			    'DF DOC CHARGES',
			    'MF DOC CHARGES',
			    'DF LOAN',
			    'MF LOAN'
			)
			AND bm.PARTNER_ID IS NOT NULL

			GROUP BY
			    partner.PERSONAL_INFO_ID,
			    partner.FIRST_NAME,
			    partner.LAST_NAME
			""", nativeQuery = true)
	List<PartnerPerformanceReport> getLoanSummaryOfPartners();

	@Query(value = """
			SELECT
			    COALESCE(SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'DF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END), 0) AS loanInstallmentsPaid,

			    COALESCE(SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'DF INTEREST'
			        THEN CREDIT ELSE 0 END), 0) AS loanInterestPaid

			FROM cash_book
			WHERE ACCOUNT_MASTER_CODE IN (
			    'DF LOAN INSTALLMENT',
			    'DF INTEREST'
			)
			AND BUSINESS_MEMBER_ID = :businessMemberId
			""", nativeQuery = true)
	PaidInstallmentProjection getCollectionsPaidForDailyLoan(@Param("businessMemberId") String businessMemberId);

	@Query(value = """
			SELECT
			    COALESCE(SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'MF LOAN INSTALLMENT'
			        THEN CREDIT ELSE 0 END), 0) AS loanInstallmentsPaid,

			    COALESCE(SUM(CASE
			        WHEN ACCOUNT_MASTER_CODE = 'MF INTEREST'
			        THEN CREDIT ELSE 0 END), 0) AS loanInterestPaid

			FROM cash_book
			WHERE ACCOUNT_MASTER_CODE IN (
			    'MF LOAN INSTALLMENT',
			    'MF INTEREST'
			)
			AND BUSINESS_MEMBER_ID = :businessMemberId
			""", nativeQuery = true)
	PaidInstallmentProjection getCollectionsPaidForMonthlyLoan(@Param("businessMemberId") String businessMemberId);
	
	
	@Query("""
			FROM CashBook c
			WHERE c.businessMember.businessMemberId = :memberId
			AND c.accountMasterCode IN ('MF LOAN INSTALLMENT','MF INTEREST')
			ORDER BY c.transDate asc
			""")
	List<CashBook> getAllMonthlyCollectionsByBusniesMember(@Param("memberId") String memberId);
	
	
	@Query("""
			FROM CashBook c
			WHERE c.businessMember.businessMemberId = :memberId
			AND c.accountMasterCode IN ('DF LOAN INSTALLMENT')
			ORDER BY c.transDate asc
			""")
	List<CashBook> getAllDailyCollectionsByBusniesMember(@Param("memberId") String memberId);
	
	
	
}