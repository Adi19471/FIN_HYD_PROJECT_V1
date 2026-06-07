package com.balaji.finance.config.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.balaji.finance.entity.Permission;
import com.balaji.finance.repo.PermissionRepository;

@Component
public class PermissionDataLoader implements CommandLineRunner {

	private final PermissionRepository repository;

	public PermissionDataLoader(PermissionRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... args) {

		if (repository.count() > 0) {
			return;
		}

		/*
		 * ========================== MASTER DATA ==========================
		 */

		save("MasterData", "Customer", "Customer Master");
		save("MasterData", "Customer", "Customer Details");

		save("MasterData", "Partner", "Partner Master");

		save("MasterData", "Employee", "Employee Master");

		save("MasterData", "Village", "Village Master");

		save("MasterData", "Area", "Area Master");

		save("MasterData", "Bank", "Bank Master");

		save("MasterData", "Branch", "Branch Master");

		/*
		 * ========================== TRANSACTIONS ==========================
		 */

		save("Transactions", "Loans", "Loan Entry");

		save("Transactions", "Loans", "Loan Closure");

		save("Transactions", "Collections", "Collection Entry");

		save("Transactions", "Collections", "Bulk Collection");

		save("Transactions", "Payments", "Payment Entry");

		save("Transactions", "Receipts", "Receipt Entry");

		save("Transactions", "Delete Transactions", "Delete Transaction");

		/*
		 * ========================== REPORTS -> ACCOUNTS ==========================
		 */

		save("Reports", "Accounts", "Daily Book");

		save("Reports", "Accounts", "Cash Book");

		save("Reports", "Accounts", "CB Ledger");

		save("Reports", "Accounts", "Day Book");

		save("Reports", "Accounts", "Trial Balance");

		save("Reports", "Accounts", "Profit And Loss");

		save("Reports", "Accounts", "Balance Sheet");

		/*
		 * ========================== REPORTS -> LOANS ==========================
		 */

		save("Reports", "Loans", "Installment Dues");

		save("Reports", "Loans", "Loan Outstanding");

		save("Reports", "Loans", "Loan Ledger");

		save("Reports", "Loans", "Loan Register");

		save("Reports", "Loans", "Closed Loans");

		save("Reports", "Loans", "Loan Collection Report");

		/*
		 * ========================== REPORTS -> CUSTOMER ==========================
		 */

		save("Reports", "Customer", "Customer Dues");

		save("Reports", "Customer", "Customer Ledger");

		save("Reports", "Customer", "Customer Statement");

		save("Reports", "Customer", "Customer Collection Report");

		/*
		 * ========================== CONFIGS ==========================
		 */

		save("Configs", "Partner Config", "Partner Config");

		save("Configs", "User Management", "Users");

		save("Configs", "Role Management", "Roles");

		save("Configs", "Permission Management", "Permissions");

		save("Configs", "Menu Permissions", "Menu Permissions");

		save("Configs", "System", "Settings");
	}

	private void save(String menu, String subMenu, String screenName) {

		Permission permission = new Permission();

		permission.setMenu(menu);
		permission.setSubMenu(subMenu);
		permission.setScreenName(screenName);

		repository.save(permission);
	}
}