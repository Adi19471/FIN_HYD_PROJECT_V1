package com.balaji.finance.transaction.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.masterInfo.entity.CashBookBK;

public interface CashBookBkRepo extends JpaRepository<CashBookBK, Double> {
	
	public List<CashBookBK> findByTransDate(LocalDateTime transDate);

}
