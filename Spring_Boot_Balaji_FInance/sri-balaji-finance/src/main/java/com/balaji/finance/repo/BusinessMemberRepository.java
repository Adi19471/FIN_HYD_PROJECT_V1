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
			  """)
	List<BusinessMember> findAllByLoanTypeAndEndDateRange(@Param("starWithString") String starWithString,
			@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

	@Query("""
			  SELECT
			    loanType as loanType,
			    SUM(amount) AS loansDisbursed,
			    SUM(interest) AS interestReceivable
			FROM BusinessMember
			WHERE sysDate BETWEEN :fromDate AND :toDate
			GROUP BY loanType
						  """)
	List<LoanSummaryProjection> findAllLoansDisbursedByDateRange(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

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
			WHERE sysDate BETWEEN :fromDate AND :toDate
			AND loanStatus=:loanStatus
			GROUP BY loanType
						  """)
	List<LoansGranted> findAllTargetCollections(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate, @Param("loanStatus") String loanStatus);

	
	
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

}
