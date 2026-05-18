package com.balaji.finance.repo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.dto.PartnerDueAmountProjection;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.EMI;


public interface EmiRepo extends JpaRepository<EMI, Integer> {
	
	List<EMI> findByBusinessMember(BusinessMember businessMember);
	
    boolean existsByBusinessMember_BusinessMemberIdAndPaidAmountGreaterThan(
            String businessMemberId,
            BigDecimal amount
    );

    void deleteByBusinessMember_BusinessMemberId(String businessMemberId);
    
	@Query("""
			    SELECT
			        COALESCE(
			            SUM(e.totalAmount - COALESCE(e.paidAmount, 0)),
			            0
			        ) AS dueAmount
			    FROM EMI e
			    JOIN e.businessMember bm
			    WHERE bm.customerId.personalInfoId IN :personalInfoId
			      AND e.dueDate BETWEEN :fromDate AND :toDate
			""")
	BigDecimal getDueAmountOfManagerDateRange(@Param("personalInfoId") List<String> personalInfoId,
			@Param("fromDate") LocalDateTime from, @Param("toDate") LocalDateTime to);

	@Query("""
			    SELECT
			        COALESCE(
			            SUM(e.totalAmount - COALESCE(e.paidAmount, 0)),
			            0
			        ) AS dueAmount
			    FROM EMI e
			    JOIN e.businessMember bm
			    WHERE bm.customerId.personalInfoId IN :personalInfoId
			""")
	BigDecimal getDueAmountOfManager(@Param("personalInfoId") List<String> personalInfoId);
	
	
	
	@Query("""
	        SELECT
	            bm.customerId.personalInfoId AS personalInfoId,

	            COALESCE(
	                SUM(e.totalAmount - COALESCE(e.paidAmount, 0)),
	                0
	            ) AS dueAmount

	        FROM EMI e
	        JOIN e.businessMember bm

	        WHERE bm.customerId.personalInfoId IN :personalInfoIds
			AND e.dueDate BETWEEN :fromDate AND :toDate
	        GROUP BY bm.customerId.personalInfoId
			      """)
	List<PartnerDueAmountProjection> getDueAmountOfEveryPartnerDateRange(
			@Param("personalInfoIds") List<String> personalInfoIds, @Param("fromDate") LocalDateTime from,
			@Param("toDate") LocalDateTime to);

	@Query("""
	        SELECT
	            bm.customerId.personalInfoId AS personalInfoId,

	            COALESCE(
	                SUM(e.totalAmount - COALESCE(e.paidAmount, 0)),
	                0
	            ) AS dueAmount

	        FROM EMI e
	        JOIN e.businessMember bm

	        WHERE bm.customerId.personalInfoId IN :personalInfoIds

	        GROUP BY bm.customerId.personalInfoId
	        """)
	List<PartnerDueAmountProjection> getDueAmountOfEveryPartner(
	        @Param("personalInfoIds") List<String> personalInfoIds);
	
	
}
