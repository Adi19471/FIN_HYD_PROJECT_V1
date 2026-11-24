package com.balaji.finance.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.balaji.finance.config.util.BranchContext;
import com.balaji.finance.config.util.CustomUserDetails;
import com.balaji.finance.config.util.JwtUtil;
import com.balaji.finance.config.util.MyOwnUserDetails;
import com.balaji.finance.exception.ApiException;
import com.balaji.finance.service.BranchService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private MyOwnUserDetails userDetailsService;

	@Autowired
	private BranchService branchService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String header = request.getHeader("Authorization");
		try {
			if (header != null && header.startsWith("Bearer ")) {

				String token = header.substring(7);
				String username = jwtUtil.extractUsername(token);

				if (username != null && jwtUtil.validateToken(token)
						&& SecurityContextHolder.getContext().getAuthentication() == null) {

					UserDetails userDetails = userDetailsService.loadUserByUsername(username);

					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails,
							null, userDetails.getAuthorities());

					SecurityContextHolder.getContext().setAuthentication(auth);

					// The branch this request works in. X-Branch is what the
					// app sends; a branch that is not on the user's list is
					// refused here, before any controller runs.
					if (userDetails instanceof CustomUserDetails custom) {
						BranchContext.set(branchService.resolve(custom.getUser(), request.getHeader("X-Branch")));
					}
				}
			}

		} catch (ExpiredJwtException ex) {
			
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"Token expired\", \"code\": \"TOKEN_EXPIRED\"}");
			return;

		} catch (ApiException ex) {
			BranchContext.clear();
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"" + ex.getMessage().replace("\"", "'")
					+ "\", \"code\": \"BRANCH_FORBIDDEN\"}");
			return;
		} catch (JwtException ex) {
			
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"Invalid token\", \"code\": \"INVALID_TOKEN\"}");
			return;
		}

		try {
			filterChain.doFilter(request, response);
		} finally {
			// Threads are pooled: never let one request's branch leak into the next.
			BranchContext.clear();
		}
	}
}
