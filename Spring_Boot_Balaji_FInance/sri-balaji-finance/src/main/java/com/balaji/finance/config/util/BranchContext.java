package com.balaji.finance.config.util;

/**
 * The branch the current request works in. JwtFilter sets it for every
 * authenticated request (from the X-Branch header, checked against the
 * user's assigned branches) and clears it when the request ends.
 *
 * Kept in a ThreadLocal so repositories and the entity listener can read it
 * without every method taking a branch parameter.
 */
public final class BranchContext {

	/** Matches no branch: a request without a branch sees no branch data. */
	public static final String NO_BRANCH = "__NO_BRANCH__";

	private static final ThreadLocal<String> BRANCH = new ThreadLocal<>();

	private BranchContext() {
	}

	public static void set(String branchCode) {
		BRANCH.set(branchCode);
	}

	public static String getBranchCode() {
		return BRANCH.get();
	}

	/**
	 * The value repository queries filter on, through SpEL:
	 *
	 *   bm.branchCode = :#{T(com.balaji.finance.config.util.BranchContext).filter()}
	 *
	 * Always one branch. With no branch set it returns NO_BRANCH, so a query
	 * run outside a branch returns nothing rather than every branch's data.
	 */
	public static String filter() {
		String code = BRANCH.get();
		return code == null || code.isBlank() ? NO_BRANCH : code;
	}

	public static void clear() {
		BRANCH.remove();
	}
}
