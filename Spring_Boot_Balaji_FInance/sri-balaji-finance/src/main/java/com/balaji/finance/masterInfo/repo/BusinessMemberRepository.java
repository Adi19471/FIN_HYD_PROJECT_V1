package com.balaji.finance.masterInfo.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.masterInfo.entity.BusinessMember;

public interface BusinessMemberRepository extends JpaRepository<BusinessMember, String> {
	
	@Query("""
			    SELECT u FROM BusinessMember u
			    WHERE
			             u.id LIKE CONCAT(:starWithString, '%')
			        AND 
			            (u.id LIKE CONCAT('%', :keyword, '%')
			            OR u.customerId.firstname LIKE CONCAT('%', :keyword, '%')
			            OR u.customerId.lastname  LIKE CONCAT('%', :keyword, '%'))
			""")
	List<BusinessMember> businessMemberAutoComplete(@Param("starWithString") String starWithString,
			@Param("keyword") String keyword);
	
	@Query("SELECT u FROM BusinessMember u " 
			 + "         WHERE "
			 + "              u.id LIKE :starWithString")
		List<BusinessMember> findAllByLoanType(@Param("starWithString") String starWithString);


}

