package com.balaji.finance.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.Branch;

public interface BranchRepo extends JpaRepository<Branch, String> {

	List<Branch> findAllByOrderBySortOrderAscNameAsc();

	List<Branch> findByActiveTrueOrderBySortOrderAscNameAsc();
}
