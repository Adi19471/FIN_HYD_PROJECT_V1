package com.balaji.finance.repo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.dto.InstallmentDueProjection;
import com.balaji.finance.dto.PartnerDueAmountProjection;
import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.EMI;

public interface EmiRepo extends JpaRepository<EMI, Integer> {

	List<EMI> findByBusinessMember(BusinessMember businessMember);

	List<EMI> findByBusinessMemberOrderByInstallmentNumberAsc(BusinessMember businessMember);

	boolean existsByBusinessMember_BusinessMemberIdAndPaidAmountGreaterThan(String businessMemberId, BigDecimal amount);

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
	List<PartnerDueAmountProjection> getDueAmountOfEveryPartner(@Param("personalInfoIds") List<String> personalInfoIds);

	@Query("""
			    SELECT COALESCE(SUM(e.paidAmount), 0)
			    FROM EMI e
			    WHERE e.businessMember.businessMemberId = :businessMemberId
			""")
	BigDecimal getTotalPaidOfLoan(@Param("businessMemberId") String businessMemberId);

	@Query("""
		    SELECT
		        bm.businessMemberId AS loanId,
		        bm.customerId.firstName AS customerName,
		        bm.partnerId.firstName AS partnerName,
		        bm.startDate AS startDate,
		        bm.endDate AS endDate,
		        bm.amount AS loanAmount,
		        bm.installment AS installmentAmount,

		        MIN(e.dueDate) AS dueDate,

		        COALESCE(SUM(e.paidAmount), 0) AS paidAmount,

		        COALESCE(
		            SUM(
		                CASE
		                    WHEN e.status IN ('PENDING','PARTIAL')
		                    THEN (e.totalAmount - e.paidAmount)
		                    ELSE 0
		                END
		            ),
		            0
		        ) AS dueAmount,

		        COALESCE(
		            SUM(
		                CASE
		                    WHEN e.status IN ('PENDING','PARTIAL')
		                    THEN 1
		                    ELSE 0
		                END
		            ),
		            0
		        ) AS pendingCount

		    FROM EMI e
		    JOIN e.businessMember bm

		    WHERE bm.businessMemberId LIKE CONCAT(:startsWithString, '%')
		      AND e.dueDate <= :toDate

		    GROUP BY
		        bm.businessMemberId,
		        bm.customerId.firstName,
		        bm.partnerId.firstName,
		        bm.startDate,
		        bm.endDate,
		        bm.amount,
		        bm.installment

		    ORDER BY bm.businessMemberId
		    """)
		List<InstallmentDueProjection> getInstallmentDues(
		        @Param("startsWithString") String startsWithString,
		        @Param("toDate") LocalDateTime toDate);

	
	

	@Query("""
			SELECT COUNT(e)
			FROM EMI e
			WHERE e.businessMember.businessMemberId = :businessMemberId
			AND e.status <> 'PAID'
			""")
	Long getPendingInstallmentsCount(@Param("businessMemberId") String string);
}
