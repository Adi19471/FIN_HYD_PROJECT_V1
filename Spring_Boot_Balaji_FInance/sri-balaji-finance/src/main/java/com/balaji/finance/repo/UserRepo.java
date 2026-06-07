package com.balaji.finance.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.Users;

public interface UserRepo extends JpaRepository<Users, Integer> {

	Optional<Users> findByName(String name);

	boolean existsByName(String name);

}
