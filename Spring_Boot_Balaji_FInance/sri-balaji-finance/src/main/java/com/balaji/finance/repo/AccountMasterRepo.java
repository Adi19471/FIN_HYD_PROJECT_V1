package com.balaji.finance.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.entity.AccountMaster;

public interface AccountMasterRepo extends JpaRepository<AccountMaster, Long> {

	@Query("SELECT DISTINCT a.masterCode FROM AccountMaster a where a.visibility=:visibility")
	List<String> findAllMasterCodes(@Param("visibility") boolean visibility);

	@Query("""
			SELECT DISTINCT a.code FROM AccountMaster a where a.masterCode=:masterCode
			""")
	List<String> findAllCodesByMasterCode(@Param("masterCode") String masterCode);

	@Query("""
			SELECT DISTINCT a.transType
			FROM AccountMaster a
			WHERE a.masterCode = :masterCode
			  AND a.code = :code
			""")
	String findTransactionTypeByMasterCodeAndCode(@Param("masterCode") String masterCode, @Param("code") String code);

	@Query("""
			SELECT DISTINCT a.personType FROM AccountMaster a where a.masterCode=:masterCode and a.code=:code
			""")
	String findPersonTypeByMasterCodeAndCode(@Param("masterCode") String masterCode, @Param("code") String code);

}
