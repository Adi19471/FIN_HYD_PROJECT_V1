package com.balaji.finance.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.balaji.finance.entity.UserPermission;
import com.balaji.finance.entity.Users;

public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {

	List<UserPermission> findByUser(Users user);

	void deleteByUser(Users user);
	
	@Query("SELECT up FROM UserPermission up WHERE up.user.id IN :userIds")
	List<UserPermission> findAllByUserIds(@Param("userIds") List<Integer> userIds);
}