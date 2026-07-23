package com.balaji.finance.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.RefreshToken;
import com.balaji.finance.entity.Users;
import com.balaji.finance.repo.RefreshTokenRepo;

@Service
public class RefreshTokenService {

	@Autowired
	private RefreshTokenRepo refreshTokenRepo;

	@Value("${app.jwt.refresh-token-expiration-ms}")
	private long refreshTokenExpirationMs;

	public RefreshToken create(Users user) {

		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUser(user);
		refreshToken.setToken(UUID.randomUUID().toString());
		refreshToken.setExpiryDate(LocalDateTime.now().plus(refreshTokenExpirationMs, ChronoUnit.MILLIS));

		return refreshTokenRepo.save(refreshToken);
	}

	public RefreshToken rotate(RefreshToken oldToken) {

		Users user = oldToken.getUser();
		refreshTokenRepo.delete(oldToken);

		return create(user);
	}

	public boolean isExpired(RefreshToken refreshToken) {
		return refreshToken.getExpiryDate().isBefore(LocalDateTime.now());
	}

}
