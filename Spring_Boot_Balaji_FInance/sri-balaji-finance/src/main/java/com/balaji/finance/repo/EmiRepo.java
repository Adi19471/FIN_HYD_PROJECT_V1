package com.balaji.finance.repo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.dto.GuarantorDuesProjection;
import com.balaji.finance.dto.InstallmentDueProjection;
import com.balaji.finance.dto.LoanDueProjection;
import com.balaji.finance.dto.LoanTypeInterestProjection;
import com.balaji.finance.dto.PartnerDueAmountProjection;
import com.balaji.finance.dto.ReceivedInstallmentDueProjection;
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
			    WHERE bm.partnerId.personalInfoId IN :personalInfoId
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
			    WHERE bm.partnerId.personalInfoId IN :personalInfoId
			""")
	BigDecimal getDueAmountOfManager(@Param("personalInfoId") List<String> personalInfoId);

	@Query("""
			      SELECT
			          bm.partnerId.personalInfoId AS personalInfoId,

			          COALESCE(
			              SUM(e.totalAmount - COALESCE(e.paidAmount, 0)),
			              0
			          ) AS dueAmount

			      FROM EMI e
			      JOIN e.businessMember bm

			      WHERE bm.partnerId.personalInfoId IN :personalInfoIds
			AND e.dueDate BETWEEN :fromDate AND :toDate
			      GROUP BY bm.partnerId.personalInfoId
			      """)
	List<PartnerDueAmountProjection> getDueAmountOfEveryPartnerDateRange(
			@Param("personalInfoIds") List<String> personalInfoIds, @Param("fromDate") LocalDateTime from,
			@Param("toDate") LocalDateTime to);

	@Query("""
			SELECT
			    bm.partnerId.personalInfoId AS personalInfoId,

			    COALESCE(
			        SUM(e.totalAmount - COALESCE(e.paidAmount, 0)),
			        0
			    ) AS dueAmount

			FROM EMI e
			JOIN e.businessMember bm

			WHERE bm.partnerId.personalInfoId IN :personalInfoIds
			AND e.dueDate <= CURRENT_DATE

			GROUP BY bm.partnerId.personalInfoId
			""")
	List<PartnerDueAmountProjection> getDueAmountOfEveryPartner(@Param("personalInfoIds") List<String> personalInfoIds);

	@Query("""
			    SELECT COALESCE(SUM(e.paidAmount), 0)
			    FROM EMI e
			    WHERE e.businessMember.businessMemberId = :businessMemberId
			""")
	BigDecimal getTotalPaidOfLoan(@Param("businessMemberId") String businessMemberId);

	/*
	 * @Query(""" SELECT bm.businessMemberId AS loanId,
	 * TRIM(CONCAT(COALESCE(bm.customerId.firstName, ''), ' ',
	 * COALESCE(bm.customerId.lastName, ''))) AS customerName, bm.customerId.mobile
	 * AS customerMobile, TRIM(CONCAT(COALESCE(bm.partnerId.firstName, ''), ' ',
	 * COALESCE(bm.partnerId.lastName, ''))) AS partnerName,
	 * TRIM(CONCAT(COALESCE(bm.guarantor1.firstName, ''), ' ',
	 * COALESCE(bm.guarantor1.lastName, ''))) AS guarantorName, bm.startDate AS
	 * startDate, bm.endDate AS endDate, bm.amount AS loanAmount, bm.installment AS
	 * installmentAmount,
	 * 
	 * MAX(e.dueDate) AS dueDate,
	 * 
	 * COALESCE( ( SELECT SUM(e3.paidAmount) FROM EMI e3 WHERE e3.businessMember =
	 * bm AND e3.status NOT IN ('PENDING') ), 0 ) AS paidAmount,
	 * 
	 * COALESCE( ( SELECT COUNT(e4.emiId) FROM EMI e4 WHERE e4.businessMember = bm
	 * AND e4.status NOT IN ('PENDING', 'PARTIAL') ), 0 ) AS paidInstallments,
	 * 
	 * 
	 * COALESCE( SUM( CASE WHEN e.status IN ('PENDING', 'PARTIAL') THEN
	 * e.totalAmount - e.paidAmount ELSE 0 END ), 0 ) AS dueAmount,
	 * 
	 * 
	 * ( SELECT COUNT(e5.emiId) FROM EMI e5 WHERE e5.businessMember = bm AND
	 * e5.status IN ('PENDING', 'PARTIAL') AND e5.dueDate <= :toDate ) AS
	 * pendingCount,
	 * 
	 * bm.duration AS totalNoOfInstallments
	 * 
	 * FROM EMI e JOIN e.businessMember bm
	 * 
	 * WHERE bm.businessMemberId LIKE CONCAT(:startsWithString, '%') AND e.dueDate
	 * <= :toDate
	 * 
	 * AND ( (:showInstReceivedRecords = true AND e.status NOT IN ('PENDING',
	 * 'PARTIAL')) OR (:showInstReceivedRecords = false AND e.status IN ('PENDING',
	 * 'PARTIAL')) )
	 * 
	 * AND ( (:activeLoans = true AND bm.loanStatus = 'ACTIVE') OR (:activeLoans =
	 * false AND bm.loanStatus <> 'ACTIVE') )
	 * 
	 * GROUP BY bm.businessMemberId, bm.customerId.firstName,
	 * bm.customerId.lastName, bm.customerId.mobile, bm.partnerId.firstName,
	 * bm.partnerId.lastName, bm.guarantor1.firstName, bm.guarantor1.lastName,
	 * bm.startDate, bm.endDate, bm.amount, bm.installment, bm.duration
	 * 
	 * ORDER BY bm.businessMemberId """) List<InstallmentDueProjection>
	 * getInstallmentDues(@Param("startsWithString") String startsWithString,
	 * 
	 * @Param("toDate") LocalDateTime toDate, @Param("activeLoans") Boolean
	 * activeLoans,
	 * 
	 * @Param("showInstReceivedRecords") Boolean showInstReceivedRecords);
	 */
	
	
	
	@Query("""
		    SELECT
		        bm.businessMemberId AS loanId,
		        TRIM(CONCAT(COALESCE(bm.customerId.firstName, ''), ' ', COALESCE(bm.customerId.lastName, ''))) AS customerName,
		        bm.customerId.mobile AS customerMobile,
		        TRIM(CONCAT(COALESCE(bm.partnerId.firstName, ''), ' ', COALESCE(bm.partnerId.lastName, ''))) AS partnerName,
		        TRIM(CONCAT(COALESCE(bm.guarantor1.firstName, ''), ' ', COALESCE(bm.guarantor1.lastName, ''))) AS guarantorName,
		        bm.startDate AS startDate,
		        bm.endDate AS endDate,
		        bm.amount AS loanAmount,
		        bm.installment AS installmentAmount,
		        MAX(e.dueDate) AS dueDate,

		        COALESCE(
		            (SELECT SUM(e3.paidAmount)
		             FROM EMI e3
		             WHERE e3.businessMember = bm
		               AND e3.status NOT IN ('PENDING')),
		            0
		        ) AS paidAmount,

		        COALESCE(
		            (SELECT COUNT(e4.emiId)
		             FROM EMI e4
		             WHERE e4.businessMember = bm
		               AND e4.status NOT IN ('PENDING', 'PARTIAL')),
		            0
		        ) AS paidInstallments,

		        COALESCE(
		            SUM(
		                CASE
		                    WHEN e.status IN ('PENDING', 'PARTIAL')
		                    THEN e.totalAmount - e.paidAmount
		                    ELSE 0
		                END
		            ), 0
		        ) AS dueAmount,

		        (SELECT COUNT(e5.emiId)
		         FROM EMI e5
		         WHERE e5.businessMember = bm
		           AND e5.status IN ('PENDING', 'PARTIAL')
		           AND e5.dueDate <= :toDate
		        ) AS pendingCount,

		        bm.duration AS totalNoOfInstallments

		    FROM EMI e
		    JOIN e.businessMember bm

		    WHERE bm.businessMemberId LIKE CONCAT(:startsWithString, '%')
		      AND e.dueDate <= :toDate
		      AND e.status IN ('PENDING', 'PARTIAL')
		      AND (
		            (:activeLoans = true AND bm.loanStatus = 'ACTIVE')
		            OR
		            (:activeLoans = false AND bm.loanStatus <> 'ACTIVE')
		          )

		    GROUP BY
		        bm.businessMemberId,
		        bm.customerId.firstName,
		        bm.customerId.lastName,
		        bm.customerId.mobile,
		        bm.partnerId.firstName,
		        bm.partnerId.lastName,
		        bm.guarantor1.firstName,
		        bm.guarantor1.lastName,
		        bm.startDate,
		        bm.endDate,
		        bm.amount,
		        bm.installment,
		        bm.duration

		    ORDER BY bm.businessMemberId
		    """)
		List<InstallmentDueProjection> getInstallmentDues(
		        @Param("startsWithString") String startsWithString,
		        @Param("toDate") LocalDateTime toDate,
		        @Param("activeLoans") Boolean activeLoans);
	
	
		@Query("""
				SELECT
				    bm.businessMemberId AS loanId,

				    TRIM(CONCAT(
				        COALESCE(bm.customerId.firstName, ''),
				        ' ',
				        COALESCE(bm.customerId.lastName, '')
				    )) AS customerName,

				    bm.customerId.mobile AS customerMobile,

				    TRIM(CONCAT(
				        COALESCE(bm.partnerId.firstName, ''),
				        ' ',
				        COALESCE(bm.partnerId.lastName, '')
				    )) AS partnerName,

				    TRIM(CONCAT(
				        COALESCE(bm.guarantor1.firstName, ''),
				        ' ',
				        COALESCE(bm.guarantor1.lastName, '')
				    )) AS guarantorName,

				    bm.startDate AS startDate,
				    bm.endDate AS endDate,
				    bm.amount AS loanAmount,
				    bm.installment AS installmentAmount,

				    MAX(e.dueDate) AS dueDate,

				    COALESCE(
				        (
				            SELECT SUM(e3.paidAmount)
				            FROM EMI e3
				            WHERE e3.businessMember = bm
				              AND e3.status NOT IN ('PENDING')
				        ), 0
				    ) AS paidAmount,

				    COALESCE(
				        (
				            SELECT COUNT(e4.emiId)
				            FROM EMI e4
				            WHERE e4.businessMember = bm
				              AND e4.status NOT IN ('PENDING', 'PARTIAL')
				        ), 0
				    ) AS paidInstallments,

				    COALESCE(
				        SUM(
				            CASE
				                WHEN e.status IN ('PENDING', 'PARTIAL')
				                THEN e.totalAmount - e.paidAmount
				                ELSE 0
				            END
				        ), 0
				    ) AS dueAmount,

				    (
				        SELECT COUNT(e5.emiId)
				        FROM EMI e5
				        WHERE e5.businessMember = bm
				          AND e5.status IN ('PENDING', 'PARTIAL')
				          AND e5.dueDate <= :toDate
				    ) AS pendingCount,

				    bm.duration AS totalNoOfInstallments,

				    COALESCE(
				        (
				            SELECT SUM(e6.paidAmount)
				            FROM EMI e6
				            WHERE e6.businessMember = bm
				              AND e6.status NOT IN ('PENDING')
				              AND e6.paymentDate >= :fromDate
				              AND e6.paymentDate <= :toDate
				        ), 0
				    ) AS currentMonthPaidAmount

				FROM EMI e
				JOIN e.businessMember bm

				WHERE bm.businessMemberId LIKE CONCAT(:startsWithString, '%')

				  AND e.dueDate <= :toDate

				  AND e.status NOT IN ('PENDING', 'PARTIAL')

				  AND (
				        (:activeLoans = true AND bm.loanStatus = 'ACTIVE')
				        OR
				        (:activeLoans = false AND bm.loanStatus <> 'ACTIVE')
				      )

				GROUP BY
				    bm.businessMemberId,
				    bm.customerId.firstName,
				    bm.customerId.lastName,
				    bm.customerId.mobile,
				    bm.partnerId.firstName,
				    bm.partnerId.lastName,
				    bm.guarantor1.firstName,
				    bm.guarantor1.lastName,
				    bm.startDate,
				    bm.endDate,
				    bm.amount,
				    bm.installment,
				    bm.duration

				ORDER BY bm.businessMemberId
				""")
		List<ReceivedInstallmentDueProjection> getReceivedInstallmentDues(
				@Param("startsWithString") String startsWithString, @Param("fromDate") LocalDateTime fromDate,
				@Param("toDate") LocalDateTime toDate, @Param("activeLoans") Boolean activeLoans);

	@Query("""
			SELECT COUNT(e)
			FROM EMI e
			WHERE e.businessMember.businessMemberId = :businessMemberId
			AND e.status <> 'PAID'
			""")
	Long getPendingInstallmentsCount(@Param("businessMemberId") String string);

	@Query("""
			    SELECT
			        bm.loanType AS loanType,
			        COALESCE(SUM(e.interestAmount), 0) AS interestAmount
			    FROM EMI e
			    JOIN e.businessMember bm
			    WHERE e.dueDate >= :fromDate
			      AND e.dueDate < :toDate
			    GROUP BY bm.loanType
			""")
	List<LoanTypeInterestProjection> getExpectedInterest(@Param("fromDate") LocalDateTime fromDate,
			@Param("toDate") LocalDateTime toDate);

	@Query("""
			SELECT
			    bm.businessMemberId AS loanId,
			    TRIM(CONCAT(COALESCE(customer.firstName, ''), ' ', COALESCE(customer.lastName, ''))) AS customerName,
			    TRIM(CONCAT(COALESCE(guarantor.firstName, ''), ' ', COALESCE(guarantor.lastName, ''))) AS guarantorName,
			    bm.startDate AS startDate,
			    bm.endDate AS endDate,
			    bm.amount AS loanAmount,
			    bm.duration AS duration,
			    bm.installment AS installmentAmount,

			    (
			        SELECT COUNT(e4.emiId)
			        FROM EMI e4
			        WHERE e4.businessMember = bm
			          AND e4.status NOT IN ('PENDING', 'PARTIAL')
			    ) AS noOfInstallmentsPaid,

			    COALESCE(
			        (
			            SELECT SUM(e3.paidAmount)
			            FROM EMI e3
			            WHERE e3.businessMember = bm
			              AND e3.status <> 'PENDING'
			        ),
			        0
			    ) AS totalAmountPaid,

			    (
			        SELECT COUNT(e5.emiId)
			        FROM EMI e5
			        WHERE e5.businessMember = bm
			          AND e5.status IN ('PENDING', 'PARTIAL')
			    ) AS noOfInstallmentsPending,

			    COALESCE(
			        SUM(
			            CASE
			                WHEN e.status IN ('PENDING', 'PARTIAL')
			                THEN e.totalAmount - COALESCE(e.paidAmount, 0)
			                ELSE 0
			            END
			        ),
			        0
			    ) AS balanceAmount,

			    COALESCE(
			        (
			            SELECT SUM(
			                e6.totalAmount - COALESCE(e6.paidAmount, 0)
			            )
			            FROM EMI e6
			            WHERE e6.businessMember = bm
			              AND e6.status IN ('PENDING', 'PARTIAL')
			              AND e6.dueDate <= CURRENT_DATE
			        ),
			        0
			    ) AS dueAmount,


			   customer.mobile AS customerMobile,
			   TRIM(CONCAT(COALESCE(partner.firstName, ''), ' ', COALESCE(partner.lastName, ''))) AS partnerName,

			    MIN(
			        CASE
			            WHEN e.status IN ('PENDING', 'PARTIAL')
			            THEN e.dueDate
			            ELSE NULL
			        END
			    ) AS dueDate,

			    bm.loanType AS loanType

			FROM EMI e
			JOIN e.businessMember bm
			LEFT JOIN bm.guarantor1 guarantor
			LEFT JOIN bm.customerId customer
			LEFT JOIN bm.partnerId partner


			WHERE guarantor.personalInfoId = :personInfoId
			  AND (:activeLoans = false OR bm.loanStatus = 'ACTIVE')

			GROUP BY
			    bm.businessMemberId,
			    bm.customerId.firstName,
			    bm.customerId.lastName,
			    bm.customerId.mobile,
			    bm.partnerId.firstName,
			    bm.partnerId.lastName,
			    bm.guarantor1.firstName,
			    bm.guarantor1.lastName,
			    bm.startDate,
			    bm.endDate,
			    bm.amount,
			    bm.installment,
			    bm.duration,
			    bm.loanType

			ORDER BY bm.sequence
			""")
	List<GuarantorDuesProjection> getInstallmentDuesByGuranter(@Param("activeLoans") Boolean activeLoans,
			@Param("personInfoId") String personInfoId);

	@Query("""
			SELECT
			    bm.businessMemberId AS loanId,

			    TRIM(CONCAT(
			        COALESCE(customer.firstName, ''),
			        ' ',
			        COALESCE(customer.lastName, '')
			    )) AS customerName,

			    TRIM(CONCAT(
			        COALESCE(guarantor.firstName, ''),
			        ' ',
			        COALESCE(guarantor.lastName, '')
			    )) AS guarantorName,

			    bm.startDate AS startDate,
			    bm.endDate AS endDate,
			    bm.amount AS loanAmount,
			    bm.duration AS duration,
			    bm.installment AS installmentAmount,

			    (
			        SELECT COUNT(e4.emiId)
			        FROM EMI e4
			        WHERE e4.businessMember = bm
			          AND e4.status NOT IN ('PENDING', 'PARTIAL')
			    ) AS noOfInstallmentsPaid,

			    COALESCE(
			        (
			            SELECT SUM(e3.paidAmount)
			            FROM EMI e3
			            WHERE e3.businessMember = bm
			              AND e3.status <> 'PENDING'
			        ),
			        0
			    ) AS totalAmountPaid,

			    (
			        SELECT COUNT(e5.emiId)
			        FROM EMI e5
			        WHERE e5.businessMember = bm
			          AND e5.status IN ('PENDING', 'PARTIAL')
			    ) AS noOfInstallmentsPending,

			    COALESCE(
			        SUM(
			            CASE
			                WHEN e.status IN ('PENDING', 'PARTIAL')
			                THEN e.totalAmount - COALESCE(e.paidAmount, 0)
			                ELSE 0
			            END
			        ),
			        0
			    ) AS balanceAmount,

			    COALESCE(
			        (
			            SELECT SUM(
			                e6.totalAmount - COALESCE(e6.paidAmount, 0)
			            )
			            FROM EMI e6
			            WHERE e6.businessMember = bm
			              AND e6.status IN ('PENDING', 'PARTIAL')
			              AND e6.dueDate <= CURRENT_DATE
			        ),
			        0
			    ) AS dueAmount,

			    customer.mobile AS customerMobile,

			    TRIM(CONCAT(
			        COALESCE(partner.firstName, ''),
			        ' ',
			        COALESCE(partner.lastName, '')
			    )) AS partnerName,

			    MIN(
			        CASE
			            WHEN e.status IN ('PENDING', 'PARTIAL')
			            THEN e.dueDate
			            ELSE NULL
			        END
			    ) AS dueDate,

			    bm.loanType AS loanType

			FROM EMI e

			JOIN e.businessMember bm

			LEFT JOIN bm.guarantor1 guarantor
			LEFT JOIN bm.customerId customer
			LEFT JOIN bm.partnerId partner

			WHERE (
			    :activeLoans = false
			    OR bm.loanStatus = 'ACTIVE'
			)

			GROUP BY
			    bm.businessMemberId,
			    customer.firstName,
			    customer.lastName,
			    customer.mobile,
			    partner.firstName,
			    partner.lastName,
			    guarantor.firstName,
			    guarantor.lastName,
			    bm.startDate,
			    bm.endDate,
			    bm.amount,
			    bm.installment,
			    bm.duration,
			    bm.loanType,
			    bm.sequence

			ORDER BY bm.sequence ASC
						""")
	List<GuarantorDuesProjection> getInstallmentDuesAllGuarenter(@Param("activeLoans") Boolean activeLoans);


	// Business collections report: total EMI amount due per loan before :toDate
	@Query("""
			SELECT
			    bm.businessMemberId AS businessMemberId,
			    bm.loanType AS loanType,
			    bm.endDate AS endDate,
			    SUM(e.totalAmount) AS dueAmount
			FROM EMI e
			JOIN e.businessMember bm
			WHERE e.dueDate < :toDate
			GROUP BY bm.businessMemberId, bm.loanType, bm.endDate
			""")
	List<LoanDueProjection> getLoanDuesBefore(@Param("toDate") LocalDateTime toDate);

}
