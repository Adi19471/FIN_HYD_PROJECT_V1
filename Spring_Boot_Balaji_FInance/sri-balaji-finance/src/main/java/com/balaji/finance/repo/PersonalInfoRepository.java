package com.balaji.finance.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.entity.PersonalInfo;

public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, String> {
	
	
	@Query("SELECT u FROM PersonalInfo u WHERE u.personalInfoId =:personalInfoId")
	public Optional<PersonalInfo> findById(@Param("personalInfoId") String personalInfoId);
	
	@Query("SELECT u FROM PersonalInfo u WHERE u.personalInfoId IN :personalInfoIds order by u.sequence")
	public List<PersonalInfo> findByIds(@Param("personalInfoIds") List<String> personalInfoIds);
	

	@Query("SELECT u FROM PersonalInfo u WHERE u.disable =:status order by u.sequence")
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
}
