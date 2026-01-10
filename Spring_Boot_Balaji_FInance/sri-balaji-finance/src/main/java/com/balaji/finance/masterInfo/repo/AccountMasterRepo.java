package com.balaji.finance.masterInfo.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.masterInfo.entity.AccountMaster;

public interface AccountMasterRepo extends JpaRepository<AccountMaster, Long> {

	
	@Query("SELECT DISTINCT a.masterCode FROM AccountMaster a where a.visibility=:visibility")
	List<String> findAllMasterCodes(@Param("visibility") boolean visibility);

	
	
	@Query("""
			SELECT DISTINCT a.code FROM AccountMaster a where a.masterCode=:masterCode
			""")
	List<String> findAllCodesByMasterCode(@Param("masterCode") String masterCode);

	
	
	String findByMasterCodeAndCode(String masterCode, String code);

}
