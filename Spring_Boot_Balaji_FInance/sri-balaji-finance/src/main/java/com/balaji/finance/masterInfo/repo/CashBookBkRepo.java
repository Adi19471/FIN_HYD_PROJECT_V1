package com.balaji.finance.masterInfo.repo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.masterInfo.entity.CashBook;
import com.balaji.finance.masterInfo.entity.CashBookBK;

public interface CashBookBkRepo extends JpaRepository<CashBookBK, Double> {
	
	
	@Query("SELECT c FROM CashBookBK c WHERE DATE(c.transDate) = :date")
    List<CashBookBK> findByTransactionDate(@Param("date") LocalDate date);
	

}
