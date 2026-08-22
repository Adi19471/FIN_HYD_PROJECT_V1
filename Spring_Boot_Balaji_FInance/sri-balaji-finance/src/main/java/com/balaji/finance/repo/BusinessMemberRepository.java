package com.balaji.finance.repo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.dto.CustomerDuesProjection;
import com.balaji.finance.dto.CustomerOutstandingProjection;
import com.balaji.finance.dto.GuarantorDuesProjection;
import com.balaji.finance.dto.LoanSummaryOfManagerProjection;
import com.balaji.finance.dto.LoanSummaryOfPartnerProjection;
import com.balaji.finance.dto.LoanSummaryProjection;
import com.balaji.finance.dto.LoansGranted;
import com.balaji.finance.dto.PartnerBusniessProjection;
import com.balaji.finance.dto.PartnerLoanDetailsProjection;
import com.balaji.finance.entity.BusinessMember;

public interface BusinessMemberRepository extends JpaRepository<BusinessMember, String> {

	@Query("SELECT u FROM BusinessMember u WHERE u.businessMemberId =:businessMemberId")
	public Optional<BusinessMember> findById(@Param("businessMemberId") String businessMemberId);

	@Query("""
			    SELECT u FROM BusinessMember u
			    WHERE
			             u.businessMemberId LIKE CONCAT(:starWithString, '%')
			        AND
			            (u.businessMemberId LIKE CONCAT('%', :keyword, '%')
			            OR u.customerId.firstName LIKE CONCAT('%', :keyword, '%')
			            OR u.customerId.lastName  LIKE CONCAT('%', :keyword, '%'))
			""")
	List<BusinessMember> businessMemberAutoCompletebyLoanType(@Param("starWithString") String starWithString,
			@Param("keyword") String keyword);

	@Query("""
			SELECT u FROM BusinessMember u
			          WHERE
			              u.businessMemberId LIKE CONCAT(:starWithString, '%')
			          ORDER BY u.year desc , u.sequence desc
			  """)
	List<BusinessMember> findAllByLoanType(@Param("starWithString") String starWithString);

	@Query("""
			        SELECT u FROM BusinessMember u
			    WHERE
			        u.businessMemberId LIKE CONCAT('%', :keyword, '%')
			""")
	List<BusinessMember> allbusinessMemberAutoComplete(@Param("keyword") String keyword);

	@Query("""
			        SELECT u.businessMemberId FROM BusinessMember u
			    WHERE
			        u.businessMemberId LIKE CONCAT('%', :keyword, '%')
			""")
	List<String> allLoanIdsAutoComplete(@Param("keyword") String keyword);

	@Query("""
			SELECT c
			FROM BusinessMember c
			WHERE c.startDate BETWEEN :fromDate AND :toDate
			""")
	List<BusinessMember> findByDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	
	
	@Query("""
			SELECT u FROM BusinessMember u
			          WHERE
			              u.businessMemberId LIKE CONCAT(:starWithString, '%')
			              and u.startDate BETWEEN :fromDate AND :toDate
			  """)
	List<BusinessMember> findAllByLoanTypeAndDateRange(@Param("starWithString") String starWithString,
			@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
	
	
	
	
	
	
	
	

	@Query("""
			SELECT u FROM BusinessMember u
			          WHERE
			              u.businessMemberId LIKE CONCAT(:starWithString, '%')
			              and u.endDate BETWEEN :fromDate AND :toDate
			              and u.loanStatus=:loanStatus
			  """)
	List<BusinessMember> findAllByLoanTypeAndEndDateRange(@Param("starWithString") String starWithString,
			@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate,@Param("loanStatus")String loanStatus);

	@Query("""
			  SELECT
			    loanType as loanType,
			    SUM(amount) AS loansDisbursed,
			    SUM(interest) AS interestReceivable
			FROM BusinessMember
			WHERE startDate BETWEEN :fromDate AND :toDate
			GROUP BY loanType
						  """)
	List<LoanSummaryProjection> findAllLoansDisbursedByDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	/**
	 * Everything lent up to a day, whichever range the report was run for. What
	 * is still outstanding is a position on a date, so it cannot be worked out
	 * from the loans that happen to start inside the range.
	 */
	@Query("""
			  SELECT
			    loanType as loanType,
			    SUM(amount) AS loansDisbursed,
			    SUM(interest) AS interestReceivable
			FROM BusinessMember
			WHERE startDate <= :toDate
			GROUP BY loanType
						  """)
	List<LoanSummaryProjection> findAllLoansDisbursedUpTo(@Param("toDate") LocalDateTime toDate);

	@Query("""
			  SELECT
			    loanType as loanType,
			    SUM(amount) AS loansDisbursed,
			    SUM(interest) AS interestReceivable
			FROM BusinessMember
			GROUP BY loanType
						  """)
	List<LoanSummaryProjection> findAllLoansDisbursed();

	@Query("""
			    SELECT
			        customer.personalInfoId AS personInfoId,
			        customer.firstName AS personName,
			        COUNT(bm.businessMemberId) AS noOfLoans,
			        SUM(bm.amount) AS totalLoansAmount,
			        COALESCE((
			            SELECT SUM(e.paidAmount)
			            FROM EMI e
			            WHERE e.businessMember.customerId = customer
			        ), 0) AS totalPaidAmount

			    FROM BusinessMember as bm
			    LEFT JOIN bm.customerId customer
			    WHERE bm.loanType IN :loanType
			      AND bm.sysDate <= :selectedDate
			    GROUP BY customer.personalInfoId, customer.firstName
			""")
	List<CustomerOutstandingProjection> customerLoansOverview(@Param("loanType") List<String> loanTypes,
			@Param("selectedDate") LocalDateTime selectedDate);

	@Query("""
			   SELECT
			    bm.businessMemberId as businessMemberId,
			    customer.personalInfoId AS customerId,
			    customer.firstName as customerFirstName,
			    customer.phone as customerPhoneNumber,
			    guarentor.personalInfoId AS guarentorId,
			    guarentor.firstName as guarentorFirstName,
			    guarentor.phone as guarentorPhoneNumber,
			    partner.personalInfoId AS partnerId,
			    partner.firstName as partnerFirstName,
			    partner.phone as partnerPhoneNumber,
			    bm.startDate as startDate,
			    bm.endDate as endDate,
			    bm.amount as amount,
			    bm.duration as duration,
			    bm.installment as installmentPerMonth,

			    COALESCE((
			        SELECT SUM(e.paidAmount)
			        FROM EMI e
			        WHERE e.businessMember = bm
			    ), 0) AS totalInstallmentAmountPaid,

			    bm.paidInstallments as noOfEmisPaid,
			    bm.loanType as loanType

			   FROM BusinessMember as bm
			   LEFT JOIN bm.customerId customer
			   LEFT JOIN bm.guarantor1 guarentor
			   LEFT JOIN bm.partnerId partner

			   WHERE customer.personalInfoId=:personInfoId
			   ORDER BY bm.sequence asc
			""")
	List<CustomerDuesProjection> getAllLoansOnCustomer(@Param("personInfoId") String personInfoId);

	@Query("""
			  SELECT
			    loanType as loanType,
			    SUM(amount) AS loansDisbursed
			FROM BusinessMember
			WHERE startDate BETWEEN :fromDate AND :toDate
			AND loanStatus='ACTIVE'
			GROUP BY loanType
						  """)
	List<LoansGranted> findSumOfActiveLoansInDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query("""
			  SELECT
			    loanType as loanType,
			    SUM(amount) AS loansDisbursed
			FROM BusinessMember
			WHERE endDate BETWEEN :fromDate AND :toDate
			AND loanStatus='COMPLETED'
			GROUP BY loanType
						  """)
	List<LoansGranted> findSumOfMatureLoansInDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);
	
	@Query("""
			   SELECT
			    bm.businessMemberId as businessMemberId,
			    customer.personalInfoId AS customerId,
			    customer.firstName as customerFirstName,
			    customer.phone as customerPhoneNumber,
			    guarentor.personalInfoId AS guarentorId,
			    guarentor.firstName as guarentorFirstName,
			    guarentor.phone as guarentorPhoneNumber,
			    partner.personalInfoId AS partnerId,
			    partner.firstName as partnerFirstName,
			    partner.phone as partnerPhoneNumber,
			    bm.startDate as startDate,
			    bm.endDate as endDate,
			    bm.amount as amount,
			    bm.duration as duration,
			    bm.installment as installmentPerMonth,

			    COALESCE((
			        SELECT SUM(e.paidAmount)
			        FROM EMI e
			        WHERE e.businessMember = bm
			    ), 0) AS totalInstallmentAmountPaid,

			    bm.paidInstallments as noOfEmisPaid,
			    bm.loanType as loanType

			   FROM BusinessMember as bm
			   LEFT JOIN bm.customerId customer
			   LEFT JOIN bm.guarantor1 guarentor
			   LEFT JOIN bm.partnerId partner

			   WHERE guarentor.personalInfoId=:personInfoId
			   AND loanStatus=:loanStatus
			   ORDER BY bm.sequence asc
			""")
	List<GuarantorDuesProjection> getAllLoansOnGuarantor(@Param("personInfoId") String personInfoId,@Param("loanStatus") String loanStatus);

	@Query("""
			   SELECT
			    bm.businessMemberId as businessMemberId,
			    customer.personalInfoId AS customerId,
			    customer.firstName as customerFirstName,
			    customer.phone as customerPhoneNumber,
			    guarentor.personalInfoId AS guarentorId,
			    guarentor.firstName as guarentorFirstName,
			    guarentor.phone as guarentorPhoneNumber,
			    partner.personalInfoId AS partnerId,
			    partner.firstName as partnerFirstName,
			    partner.phone as partnerPhoneNumber,
			    bm.startDate as startDate,
			    bm.endDate as endDate,
			    bm.amount as amount,
			    bm.duration as duration,
			    bm.installment as installmentPerMonth,

			    COALESCE((
			        SELECT SUM(e.paidAmount)
			        FROM EMI e
			        WHERE e.businessMember = bm
			    ), 0) AS totalInstallmentAmountPaid,

			    bm.paidInstallments as noOfEmisPaid,
			    bm.loanType as loanType

			   FROM BusinessMember as bm
			   LEFT JOIN bm.customerId customer
			   LEFT JOIN bm.guarantor1 guarentor
			   LEFT JOIN bm.partnerId partner
			   WHERE loanStatus=:loanStatus
			   ORDER BY bm.sequence asc
			""")
	List<GuarantorDuesProjection> getAllLoansOnGuarantor(@Param("loanStatus") String loanStatus);
	
	@Query("""
		    SELECT
		        COUNT(bm.businessMemberId) AS noOfLoans,

		        COALESCE(SUM(bm.amount), 0) AS disbursedAmount,

		        COALESCE(SUM(bm.amount + bm.interest), 0)
		            AS disbursedAmountWithInterest

		    FROM BusinessMember bm
		    WHERE bm.partnerId.personalInfoId IN :personalInfoId
		      AND bm.startDate BETWEEN :fromDate AND :toDate
		""")
		LoanSummaryOfManagerProjection getLoanSummaryOfManagerDaterange(
		        @Param("personalInfoId") List<String> personalInfoId,
		        @Param("fromDate") LocalDateTime from,
		        @Param("toDate") LocalDateTime to);

	@Query("""
		    SELECT
		        COUNT(bm.businessMemberId) AS noOfLoans,

		        COALESCE(SUM(bm.amount), 0) AS disbursedAmount,

		        COALESCE(SUM(bm.amount + bm.interest), 0)
		            AS disbursedAmountWithInterest

		    FROM BusinessMember bm
		    WHERE bm.partnerId.personalInfoId IN :personalInfoId
		""")
		LoanSummaryOfManagerProjection getLoanSummaryOfManager(
		        @Param("personalInfoId") List<String> personalInfoId);
	
	

	@Query("""
	        SELECT
	            bm.partnerId.personalInfoId AS personalInfoId,

	            COUNT(bm.businessMemberId) AS noOfLoans,

	            COALESCE(SUM(bm.amount), 0) AS disbursedAmount,

	            COALESCE(SUM(bm.amount + bm.interest), 0)
	                AS disbursedAmountWithInterest

	        FROM BusinessMember bm

	        WHERE bm.partnerId.personalInfoId IN :personalInfoIds
              AND bm.startDate BETWEEN :fromDate AND :toDate
	        GROUP BY
	            bm.partnerId.personalInfoId
			""")
	List<LoanSummaryOfPartnerProjection> getLoanSummaryOfPartnerDateRange(
			@Param("personalInfoIds") List<String> personalInfoIds, @Param("fromDate") LocalDateTime from,
			@Param("toDate") LocalDateTime to);

	@Query("""
	        SELECT
	            bm.partnerId.personalInfoId AS personalInfoId,

	            COUNT(bm.businessMemberId) AS noOfLoans,

	            COALESCE(SUM(bm.amount), 0) AS disbursedAmount,

	            COALESCE(SUM(bm.amount + bm.interest), 0)
	                AS disbursedAmountWithInterest

	        FROM BusinessMember bm

	        WHERE bm.partnerId.personalInfoId IN :personalInfoIds

	        GROUP BY
	            bm.partnerId.personalInfoId
	        """)
	List<LoanSummaryOfPartnerProjection> getLoanSummaryOfPartner(
	        @Param("personalInfoIds") List<String> personalInfoIds);
	
	
	
	@Query("""
		       SELECT
		       
		        partner.personalInfoId AS partnerId,
		        partner.firstName as partnerFirstName,
		        partner.phone as partnerPhoneNumber,
		        
		        bm.loanType as loanType,
		        bm.businessMemberId as businessMemberId,
		        
		        customer.personalInfoId AS customerId,
		        customer.firstName as customerFirstName,
		        customer.phone as customerPhoneNumber,
		        
		        guarentor.personalInfoId AS guarentorId,
		        guarentor.firstName as guarentorFirstName,
		        guarentor.phone as guarentorPhoneNumber,
		      
		        bm.startDate as startDate,
		        bm.endDate as endDate,
		       
		        bm.amount as amount,
		        bm.duration as duration,
		      
		        bm.installment as installmentPerMonth,

		        COALESCE((
		            SELECT SUM(e.paidAmount)
		            FROM EMI e
		            WHERE e.businessMember = bm
		            AND e.paymentDate <= :toDate
		        ), 0) AS totalInstallmentAmountPaid,

		        COALESCE((
		            SELECT COUNT(e)
		            FROM EMI e
		            WHERE e.businessMember = bm
		            AND e.paymentDate <= :toDate
		        ), 0) AS noOfEmisPaid

		       FROM BusinessMember as bm
		       LEFT JOIN bm.customerId customer
		       LEFT JOIN bm.guarantor1 guarentor
		       LEFT JOIN bm.partnerId partner

		       WHERE partner.personalInfoId = :partnerInfoId
		       ORDER BY bm.sequence asc
		    """)
		List<PartnerLoanDetailsProjection> getAllLoanDetailsByPartner(
		        @Param("partnerInfoId") String partnerInfoId,
		        @Param("toDate") LocalDateTime toDate
		);
	
	
	
	@Query("""
		    SELECT
		        bm.partnerId.personalInfoId AS personalInfoId,

		        SUM(CASE
		                WHEN bm.loanType = 'DAILY_FINANCE'
		                THEN 1
		                ELSE 0
		            END) AS dailyLoanCount,

		        COALESCE(
		            SUM(CASE
		                    WHEN bm.loanType = 'DAILY_FINANCE'
		                    THEN bm.amount
		                    ELSE 0
		                END),
		            0
		        ) AS dailyLoanAmount,

		        SUM(CASE
		                WHEN bm.loanType = 'MONTHLY_FINANCE'
		                THEN 1
		                ELSE 0
		            END) AS monthlyLoanCount,

		        COALESCE(
		            SUM(CASE
		                    WHEN bm.loanType = 'MONTHLY_FINANCE'
		                    THEN bm.amount
		                    ELSE 0
		                END),
		            0
		        ) AS monthlyLoanAmount

		    FROM BusinessMember bm

		    WHERE bm.partnerId.personalInfoId IN :personalInfoIds
		      AND bm.startDate BETWEEN :fromDate AND :toDate

		    GROUP BY bm.partnerId.personalInfoId
		""")
		List<PartnerBusniessProjection> getBusinessReportOfPartners(
		        @Param("personalInfoIds") List<String> personalInfoIds,
		        @Param("fromDate") LocalDateTime from,
		        @Param("toDate") LocalDateTime to);
}
