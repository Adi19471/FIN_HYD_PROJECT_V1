package com.balaji.finance.repo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBook;
import com.balaji.finance.entity.PersonalInfo;

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
			  """)
	List<BusinessMember> findAllByLoanType(@Param("starWithString") String starWithString);

	
	
	@Query("""
			    SELECT u FROM BusinessMember u
			    WHERE
			          (u.customerId.personalInfoId LIKE CONCAT('%', :keyword, '%')
			            OR u.customerId.firstName LIKE CONCAT('%', :keyword, '%')
			            OR u.customerId.lastName  LIKE CONCAT('%', :keyword, '%'))
			""")
	List<BusinessMember> allbusinessMemberAutoComplete(@Param("keyword") String keyword);
	
	
	
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

}
