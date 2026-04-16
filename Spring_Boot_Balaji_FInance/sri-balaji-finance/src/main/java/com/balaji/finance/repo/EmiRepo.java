package com.balaji.finance.repo;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.EMI;


public interface EmiRepo extends JpaRepository<EMI, Integer> {
	
	List<EMI> findByBusinessMember(BusinessMember businessMember);
	
    boolean existsByBusinessMember_BusinessMemberIdAndPaidAmountGreaterThan(
            String businessMemberId,
            BigDecimal amount
    );

    void deleteByBusinessMember_BusinessMemberId(String businessMemberId);
}
