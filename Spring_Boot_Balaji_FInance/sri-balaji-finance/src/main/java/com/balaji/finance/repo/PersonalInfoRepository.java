package com.balaji.finance.repo;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.dto.ManagerDetailsProjection;
import com.balaji.finance.dto.PartnerInformationProjection;
import com.balaji.finance.dto.PersonsUnderManagerProjection;
import com.balaji.finance.entity.PersonalInfo;

public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, String> {

	@Query("SELECT u FROM PersonalInfo u WHERE u.personalInfoId =:personalInfoId")
	public Optional<PersonalInfo> findById(@Param("personalInfoId") String personalInfoId);

	@Query("SELECT u FROM PersonalInfo u WHERE u.personalInfoId IN :personalInfoIds order by u.sequence")
	public List<PersonalInfo> findByIds(@Param("personalInfoIds") List<String> personalInfoIds);

	@Query("SELECT u FROM PersonalInfo u LEFT JOIN FETCH u.personalInfoManager WHERE u.disable =:status order by u.sequence")
	public List<PersonalInfo> findAllActiveRecords(@Param("status") boolean status);

	@Query("""
			    SELECT u FROM PersonalInfo u
			    WHERE u.disable = :status
			      AND (
			            u.personalInfoId LIKE CONCAT('%', :keyword, '%')
			         OR u.firstName LIKE CONCAT('%', :keyword, '%')
			         OR u.lastName LIKE CONCAT('%', :keyword, '%')
			         OR u.mobile LIKE CONCAT('%', :keyword, '%')
			         OR u.phone LIKE CONCAT('%', :keyword, '%')
			      )
			      AND u.category IN (:categoryList)
			""")
	public List<PersonalInfo> personalInfoAutoComplete(@Param("status") boolean status,
			@Param("keyword") String keyWord, @Param("categoryList") List<String> categoryList);

	@Query(value = """
			    SELECT
			        m.PERSONAL_INFO_ID AS managerId,
			        m.FIRST_NAME AS managerName,
			        m.LAST_NAME AS managerLastName,
			        COALESCE(SUM(p.SHARES), 0) AS noOfSharesUnderManager,
			        GROUP_CONCAT(p.PERSONAL_INFO_ID ORDER BY p.PERSONAL_INFO_ID SEPARATOR ',') AS partnerIds
			    FROM personal_info p
			    JOIN personal_info m
			        ON p.PERSONAL_INFO_MANAGER_ID = m.PERSONAL_INFO_ID
			    GROUP BY
			        m.PERSONAL_INFO_ID,
			        m.FIRST_NAME,
			        m.LAST_NAME
			""", nativeQuery = true)
	List<ManagerDetailsProjection> findManagerDetails();

	@Query(value = """
			SELECT
			    m.personal_info_id AS id,
			    m.first_name AS firstName,
			    m.last_name AS lastName,
			    NULL AS shares
			FROM personal_info m
			WHERE m.personal_info_id = :personalInfoId

			UNION ALL

			SELECT
			    p.personal_info_id AS id,
			    p.first_name AS firstName,
			    p.last_name AS lastName,
			    p.shares AS shares
			FROM personal_info p
			WHERE p.personal_info_manager_id = :personalInfoId

			ORDER BY id
			""", nativeQuery = true)
	List<PersonsUnderManagerProjection> findPersonsUnderManager(@Param("personalInfoId") String personalInfoId);

	@Query("""
			SELECT
			     p as partner,
			     COALESCE(SUM(cb.credit), 0) AS investments

			FROM PersonalInfo p

			LEFT JOIN CashBook cb
			     ON cb.personalInfo.personalInfoId = p.personalInfoId
			     AND cb.accountMasterCode = 'CAPITAL'

			WHERE p.category = 'PARTNER'

			GROUP BY p

			ORDER BY p.sequence
			""")
	List<PartnerInformationProjection> findAllPartnersAndInvestments();

	@Query("""
			FROM PersonalInfo p
			WHERE p.category = 'PARTNER'
			ORDER BY p.personalInfoId
			""")
	List<PersonalInfo> findAllPartners();
	
	@Query("""
			    SELECT u FROM PersonalInfo u
			    WHERE u.disable = false
			      AND (
			            u.personalInfoId LIKE CONCAT('%', :keyword, '%')
			         OR u.firstName LIKE CONCAT('%', :keyword, '%')
			         OR u.lastName LIKE CONCAT('%', :keyword, '%')
			         OR u.mobile LIKE CONCAT('%', :keyword, '%')
			         OR u.phone LIKE CONCAT('%', :keyword, '%')
			      )
			      AND u.groupManager = true
			""")
	public List<PersonalInfo> findAllGroupManagers(@Param("keyword") String keyWord);

	
	@Query("""
			SELECT COALESCE(SUM(p.shares), 0)
			FROM PersonalInfo p
			WHERE p.category =  'PARTNER'
			  AND p.bussinessExemption = false
			""")
	BigDecimal findTotalShares();

}