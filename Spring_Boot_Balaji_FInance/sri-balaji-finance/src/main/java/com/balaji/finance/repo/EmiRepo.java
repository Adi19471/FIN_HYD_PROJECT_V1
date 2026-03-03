package com.balaji.finance.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.EMI;


public interface EmiRepo extends JpaRepository<EMI, Integer> {
	
	List<EMI> findByBusinessMember(BusinessMember businessMember);

}
