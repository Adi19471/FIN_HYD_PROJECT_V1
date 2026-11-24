package com.balaji.finance.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.balaji.finance.entity.Branch;
import com.balaji.finance.entity.Users;
import com.balaji.finance.exception.ApiException;
import com.balaji.finance.pojo.BranchDto;
import com.balaji.finance.repo.BranchRepo;

/**
 * Which branches a user may work in.
 *
 * Every user has a list of branches (User Registration screen) and works in
 * exactly one of them at a time. All branches are equal: no main branch, no
 * view of several branches together. Asking for a branch that is not on the
 * user's list, or is closed, is refused.
 *
 * Which screens a user may open stays with the existing menu permissions;
 * this decides only whose data those screens show.
 */
@Service
public class BranchService {

	@Autowired
	private BranchRepo branchRepo;

	/** The user's branches that are open, in list order. */
	public List<BranchDto> accessibleBranches(Users user) {
		Set<String> assigned = user.getBranchCodes();
		return branchRepo.findByActiveTrueOrderBySortOrderAscNameAsc().stream()
				.filter(branch -> assigned != null && assigned.contains(branch.getCode()))
				.map(BranchDto::of)
				.toList();
	}

	/**
	 * The branch for one request, from the X-Branch header the app sends. With
	 * no header (or before one was chosen) the user's first branch is used.
	 * Throws 403 when the branch is not one of the user's, or is closed, or
	 * the user has no open branch at all.
	 */
	public String resolve(Users user, String requested) {
		String wanted = requested == null ? "" : requested.trim();
		List<BranchDto> allowed = accessibleBranches(user);
		if (allowed.isEmpty()) {
			throw new ApiException("No branch is assigned to this user", HttpStatus.FORBIDDEN);
		}
		if (wanted.isEmpty()) {
			return allowed.get(0).getCode();
		}
		return allowed.stream()
				.map(BranchDto::getCode)
				.filter(wanted::equals)
				.findFirst()
				.orElseThrow(() -> new ApiException("You do not have access to this branch", HttpStatus.FORBIDDEN));
	}

	public List<BranchDto> findAll() {
		return branchRepo.findAllByOrderBySortOrderAscNameAsc().stream().map(BranchDto::of).toList();
	}

	/**
	 * New branch. The code is the permanent key stamped on its records:
	 * capitals, digits and _ only (e.g. KUKATPALLY), and never reused.
	 */
	public BranchDto create(BranchDto dto) {
		if (dto == null || !StringUtils.hasText(dto.getName())) {
			throw new ApiException("Branch name is required", HttpStatus.BAD_REQUEST);
		}
		String code = StringUtils.hasText(dto.getCode()) ? dto.getCode() : dto.getName();
		code = code.trim().toUpperCase().replaceAll("[^A-Z0-9]+", "_").replaceAll("^_+|_+$", "");
		if (code.isEmpty() || code.length() > 30) {
			throw new ApiException("Branch code must be 1-30 letters or digits", HttpStatus.BAD_REQUEST);
		}
		if (branchRepo.existsById(code)) {
			throw new ApiException("Branch code already in use: " + code, HttpStatus.CONFLICT);
		}
		Branch branch = new Branch(code, dto.getName().trim(),
				dto.getLocation() == null ? null : dto.getLocation().trim(),
				dto.getSortOrder() != null ? dto.getSortOrder() : (int) branchRepo.count());
		branch.setActive(true);
		return BranchDto.of(branchRepo.save(branch));
	}

	/** Rename / relocate / reorder / open / close a branch. The code never changes. */
	public BranchDto update(BranchDto dto) {
		if (dto == null || !StringUtils.hasText(dto.getCode())) {
			throw new ApiException("Branch code is required", HttpStatus.BAD_REQUEST);
		}
		Branch branch = branchRepo.findById(dto.getCode())
				.orElseThrow(() -> new ApiException("Branch not found: " + dto.getCode(), HttpStatus.NOT_FOUND));
		if (StringUtils.hasText(dto.getName())) {
			branch.setName(dto.getName().trim());
		}
		branch.setLocation(dto.getLocation() == null ? null : dto.getLocation().trim());
		if (dto.getSortOrder() != null) {
			branch.setSortOrder(dto.getSortOrder());
		}
		// A closed branch keeps its records; its users simply cannot open it.
		branch.setActive(dto.isActive());
		return BranchDto.of(branchRepo.save(branch));
	}

	public void requireBranch(String code) {
		if (!StringUtils.hasText(code) || !branchRepo.existsById(code)) {
			throw new IllegalArgumentException("Branch not found: " + code);
		}
	}
}
