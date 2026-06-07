package com.balaji.finance.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.UserPermission;
import com.balaji.finance.entity.Users;

public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {

	List<UserPermission> findByUser(Users user);

	void deleteByUser(Users user);
}