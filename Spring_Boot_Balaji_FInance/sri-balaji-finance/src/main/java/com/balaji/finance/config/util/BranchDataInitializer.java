package com.balaji.finance.config.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.balaji.finance.entity.Branch;
import com.balaji.finance.entity.Permission;
import com.balaji.finance.repo.BranchRepo;
import com.balaji.finance.repo.PermissionRepository;

/**
 * Branch set-up, safe to run on every start:
 *
 *  1. Creates the Ameerpet branch if missing (more are added on Branch Master).
 *  2. Moves every customer, loan and cash book line with no branch yet
 *     (everything entered before branches existed) to Ameerpet.
 *  3. Once: gives existing users their branch list - from the earlier
 *     home-branch / all-branches columns if present, otherwise Ameerpet.
 *  4. Adds the Branch Master screen permission to an existing database.
 *
 * Runs before DataInitializer (which creates "admin" on an empty database).
 */
@Component
@Order(100)
public class BranchDataInitializer implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(BranchDataInitializer.class);
	private static final String MIGRATION = "user-branch-list-v1";

	private final BranchRepo branchRepo;
	private final JdbcTemplate jdbc;
	private final PermissionRepository permissionRepository;

	public BranchDataInitializer(BranchRepo branchRepo, JdbcTemplate jdbc, PermissionRepository permissionRepository) {
		this.branchRepo = branchRepo;
		this.jdbc = jdbc;
		this.permissionRepository = permissionRepository;
	}

	@Override
	public void run(String... args) {
		if (!branchRepo.existsById(Branch.DEFAULT_CODE)) {
			branchRepo.save(new Branch(Branch.DEFAULT_CODE, "Ameerpet", "Ameerpet, Hyderabad", 0));
			log.info("Branch created: Ameerpet");
		}
		backfill("PERSONAL_INFO");
		backfill("BUSINESS_MEMBER");
		backfill("CASH_BOOK");
		migrateUsersOnce();
		ensureBranchMasterPermission();
	}

	private void backfill(String table) {
		try {
			int n = jdbc.update("UPDATE " + table + " SET branch_code = ? WHERE branch_code IS NULL OR branch_code = ''",
					Branch.DEFAULT_CODE);
			if (n > 0) {
				log.info("{} rows of {} moved to Ameerpet", n, table);
			}
		} catch (Exception e) {
			log.warn("Branch backfill skipped for {}: {}", table, e.getMessage());
		}
	}

	private void migrateUsersOnce() {
		jdbc.execute("CREATE TABLE IF NOT EXISTS app_migration (name VARCHAR(100) PRIMARY KEY)");
		Integer done = jdbc.queryForObject("SELECT COUNT(*) FROM app_migration WHERE name = ?", Integer.class, MIGRATION);
		if (done != null && done > 0) {
			return;
		}
		String notYet = " AND NOT EXISTS (SELECT 1 FROM user_branch ub WHERE ub.user_id = u.id AND ub.branch_code = %s)";
		quietly("INSERT INTO user_branch (user_id, branch_code) SELECT u.id, u.branch_code FROM users u"
				+ " WHERE u.branch_code IS NOT NULL AND u.branch_code <> ''" + notYet.formatted("u.branch_code"));
		quietly("INSERT INTO user_branch (user_id, branch_code) SELECT u.id, b.code FROM users u CROSS JOIN BRANCH b"
				+ " WHERE u.all_branches = TRUE" + notYet.formatted("b.code"));
		quietly("INSERT INTO user_branch (user_id, branch_code) SELECT u.id, '" + Branch.DEFAULT_CODE + "' FROM users u"
				+ " WHERE NOT EXISTS (SELECT 1 FROM user_branch ub WHERE ub.user_id = u.id)");
		// The old head-office flag is gone; drop its NOT NULL column so new
		// branches can still be inserted.
		quietly("ALTER TABLE BRANCH DROP COLUMN head_office");
		jdbc.update("INSERT INTO app_migration (name) VALUES (?)", MIGRATION);
		log.info("Users moved to branch lists");
	}

	private void quietly(String sql) {
		try {
			jdbc.execute(sql);
		} catch (Exception e) {
			// Column not present (fresh database, or already removed).
			log.debug("Skipped: {} ({})", sql, e.getMessage());
		}
	}

	// PermissionDataLoader seeds only an empty table; an existing database gets
	// the Branch Master permission here. (Skipped on an empty table, else the
	// loader would skip its whole list.)
	private void ensureBranchMasterPermission() {
		if (permissionRepository.count() == 0) {
			return;
		}
		boolean present = permissionRepository.findAll().stream()
				.anyMatch(p -> "BRANCH_MASTER_VIEW".equalsIgnoreCase(p.getPermissionCode()));
		if (!present) {
			Permission permission = new Permission();
			permission.setMenu("Account Master Setup");
			permission.setScreenName("Branch Master");
			permission.setPermissionCode("BRANCH_MASTER_VIEW");
			permissionRepository.save(permission);
			log.info("Permission BRANCH_MASTER_VIEW added");
		}
	}
}
