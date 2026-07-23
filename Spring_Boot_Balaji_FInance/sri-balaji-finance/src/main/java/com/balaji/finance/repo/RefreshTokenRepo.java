package com.balaji.finance.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.balaji.finance.entity.RefreshToken;
import com.balaji.finance.entity.Users;

public interface RefreshTokenRepo extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByToken(String token);

	void deleteByUser(Users user);

	void deleteByToken(String token);

}
