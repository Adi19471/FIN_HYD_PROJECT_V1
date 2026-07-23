package com.balaji.finance.config.util;

import java.security.Key;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final Key key;

	@Value("${app.jwt.access-token-expiration-ms}")
	private long expiration;

	public JwtUtil(@Value("${app.jwt.secret}") String secret) {
		// Signing key is persisted via config rather than regenerated per boot,
		// so a restart/redeploy doesn't invalidate every outstanding access token at once.
		this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
	}

	public String generateToken(String username, List<String> roles) {

		return Jwts.builder()
		        .setSubject(username)
		        .claim("roles", roles)
		        .setIssuedAt(new Date())
		        .setExpiration(new Date(System.currentTimeMillis() + expiration))
		        .signWith(key)
		        .compact();
	}

	public boolean validateToken(String token) {
		try {
			extractAllClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
	}
}
