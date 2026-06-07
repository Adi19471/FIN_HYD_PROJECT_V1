package com.balaji.finance.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.balaji.finance.entity.UserRole;
import com.balaji.finance.entity.Users;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

	List<UserRole> findByUser(Users user);

	void deleteByUser(Users user);
}