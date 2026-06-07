package com.balaji.finance.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.Permission;

public interface PermissionRepository
        extends JpaRepository<Permission, Long> {

}