package com.balaji.finance.repo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.dto.LoanSummaryProjection;
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
			          ORDER BY u.year, u.sequence asc
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

}
