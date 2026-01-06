package com.balaji.finance.transaction.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.masterInfo.entity.CashBook;

public interface CashBookRepo extends JpaRepository<CashBook, Double> {

	public List<CashBook> findByAccountNo(String accountNo);

	@Query("SELECT COALESCE(SUM(cb.credit), 0) FROM CashBook cb "
			+ "WHERE cb.accountNo = :accountNo AND cb.transType = 'MF LOAN'")
	double sumPrincipal(@Param("accountNo") String accountNo);

	@Query("SELECT COALESCE(SUM(cb.credit), 0) FROM CashBook cb "
			+ "WHERE cb.accountNo = :accountNo AND cb.transType = 'MF INTEREST'")
	double sumInterest(@Param("accountNo") String accountNo);
	
	
	
	public List<CashBook> findByTransDate(LocalDateTime transDate);

}
