package com.balaji.finance.repo;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.BusinessMember;
import com.balaji.finance.entity.PaymentAllocation;

public interface PaymentAllocationRepo extends JpaRepository<PaymentAllocation, Long>{

	List<PaymentAllocation> findByPaymentRefId(String paymentRefId);

	void deleteByPaymentRefId(String paymentRefId);
	
	
	void deleteByEmi_BusinessMember(BusinessMember businessMember);

	List<PaymentAllocation> findByPaymentRefIdIn(Collection<String> paymentRefIds);
}
