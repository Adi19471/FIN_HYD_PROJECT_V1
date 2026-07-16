package com.balaji.finance.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.PaymentAllocation;

public interface PaymentAllocationRepo extends JpaRepository<PaymentAllocation, Long>{

	List<PaymentAllocation> findByPaymentRefId(String paymentRefId);

	void deleteByPaymentRefId(String paymentRefId);
	
	
	void deleteByEMI_BusinessMember(BusinessMember businessMember);
}
