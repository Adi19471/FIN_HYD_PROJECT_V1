package com.balaji.finance.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.config.util.BranchContext;
import com.balaji.finance.config.util.CustomUserDetails;
import com.balaji.finance.entity.Users;
import com.balaji.finance.exception.ApiException;
import com.balaji.finance.pojo.BranchDto;
import com.balaji.finance.service.BranchService;

/**
 *   GET  /branches        every branch (Branch Master, user screen's list)
 *   GET  /branches/mine   the signed-in user's branches and the current one
 *   POST /branches        create a branch      } need the Branch Master
 *   PUT  /branches        edit / close a branch } screen permission
 */
@RestController
@RequestMapping("/branches")
public class BranchController {

	/** The Branch Master screen's permission; role ADMIN has every permission. */
	public static final String BRANCH_MASTER = "BRANCH_MASTER_VIEW";

	@Autowired
	private BranchService branchService;

	@GetMapping
	public ResponseEntity<List<BranchDto>> findAll() {
		return ResponseEntity.ok(branchService.findAll());
	}

	@GetMapping("/mine")
	public ResponseEntity<Map<String, Object>> mine() {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("branches", branchService.accessibleBranches(currentUser()));
		body.put("currentBranch", BranchContext.getBranchCode());
		return ResponseEntity.ok(body);
	}

	@PostMapping
	public ResponseEntity<BranchDto> create(@RequestBody BranchDto dto) {
		requireBranchMaster();
		return ResponseEntity.status(HttpStatus.CREATED).body(branchService.create(dto));
	}

	@PutMapping
	public ResponseEntity<BranchDto> update(@RequestBody BranchDto dto) {
		requireBranchMaster();
		return ResponseEntity.ok(branchService.update(dto));
	}

	private void requireBranchMaster() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		boolean allowed = auth != null
				&& auth.getAuthorities().stream().anyMatch(a -> BRANCH_MASTER.equals(a.getAuthority()));
		if (!allowed) {
			throw new ApiException("You do not have the Branch Master permission", HttpStatus.FORBIDDEN);
		}
	}

	private Users currentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof CustomUserDetails details) {
			return details.getUser();
		}
		throw new ApiException("Not signed in", HttpStatus.UNAUTHORIZED);
	}
}
