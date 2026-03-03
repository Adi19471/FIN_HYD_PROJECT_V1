package com.balaji.finance.repo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.CashBookBackUp;

public interface CashBookBackUpRepo extends JpaRepository<CashBookBackUp, Long> {


	@Query("SELECT u FROM CashBookBackUp u WHERE u.cashBookBackUpId =:cashBookBackUpId")
	public Optional<CashBookBackUp> findById(@Param("cashBookBackUpId") String cashBookBackUpId);

	
	
    List<CashBookBackUp> findByTransDateBetween(
            LocalDateTime startDate,
            LocalDateTime endDate
    );
}