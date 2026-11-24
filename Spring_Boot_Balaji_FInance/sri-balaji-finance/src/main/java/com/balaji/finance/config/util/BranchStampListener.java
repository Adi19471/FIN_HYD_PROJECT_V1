package com.balaji.finance.config.util;

import com.balaji.finance.entity.Branch;

import jakarta.persistence.PrePersist;

/**
 * Stamps a new customer, loan or cash book line with the branch it was made
 * in, taken from the request's BranchContext. A record that already carries a
 * branch keeps it; one made outside a request (start-up jobs) goes to the
 * default branch, Ameerpet.
 */
public class BranchStampListener {

	@PrePersist
	public void stamp(Object entity) {
		if (entity instanceof BranchOwned owned && (owned.getBranchCode() == null || owned.getBranchCode().isBlank())) {
			// A payment belongs to its loan's branch and a loan to its
			// customer's. Only a record with no parent takes the user's
			// current branch.
			String code = owned.parentBranchCode();
			if (code == null || code.isBlank()) {
				code = BranchContext.getBranchCode();
			}
			owned.setBranchCode(code == null || code.isBlank() ? Branch.DEFAULT_CODE : code);
		}
	}

	/** An entity that belongs to one branch. */
	public interface BranchOwned {
		String getBranchCode();

		void setBranchCode(String branchCode);

		/** Branch of the record this one belongs to (loan, customer), if any. */
		default String parentBranchCode() {
			return null;
		}
	}
}
