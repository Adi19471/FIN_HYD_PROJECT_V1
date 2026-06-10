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

		// Dashboard
		save("Dashboard", null, "Dashboard", "/");

		// Master Info
		save("Master Info", "Personal Info", "Customer", "/customer");
		save("Master Info", "Personal Info", "Employee", "/employee");
		save("Master Info", "Personal Info", "Partner", "/partner");
		save("Master Info", "Personal Info", "Vendor", "/vendor");

		save("Master Info", "Loans", "Loan Main Page", "/Loan");
		save("Master Info", "Loans", "Monthly Finance", "/Monthly-Finance");
		save("Master Info", "Loans", "Daily Finance", "/Daily-Finace");

		// Transactions
		save("Transactions", "Cash Book", "Business Cash Book", "/BussinessCashBook_Main");
		save("Transactions", "Cash Book", "Quick Cash Book", "/Transactions/Quick_Cash_Book");
		save("Transactions", "Cash Book", "Delete Transaction", "/Transactions/Deleete_Transaction");
		save("Transactions", "Cash Book", "Cashbook", "/Transactions/Cashbook");

		// Accounts
		save("Accounts", "Ledgers", "Loans Main Page", "/AccountsModules/LoansMainpage");
		save("Accounts", "Ledgers", "Account Ledger", "/AccountsModules/AccountLedger");
		save("Accounts", "Ledgers", "Account Master Ledger", "/AccountsModules/AccountMasterLedger");
		save("Accounts", "Ledgers", "CB Ledger", "/AccountsModules/Cbledger");
		save("Accounts", "Ledgers", "Receipt Ledger", "/AccountsModules/ReciptLedger");
		save("Accounts", "Ledgers", "Daily Book", "/AccountsModules/DailyBook");
		save("Accounts", "Ledgers", "Loans Details", "/AccountsModules/Loansdetailes");
		save("Accounts", "Ledgers", "User Collection Ledger", "/AccountsModules/Usercollectionledger");

		// Loans
		save("Loans", "Reports", "Distributed", "/Loans/Distubuted");
		save("Loans", "Reports", "Instalment Dues", "/Loans/InstalmentDues");
		save("Loans", "Reports", "Maturity", "/Loans/Maturity");

		// Account Master Setup
		save("Account Master Setup", null, "Account Master Setup", "/AccountMasterSetup/Account_Master_Setup");

		save("Account Master Setup", null, "Registration Creation", "/AccountMasterSetup/Registraion_creation");

		// Business
		save("Business", "Reports", "Revenue Expense Statement", "/Bussiness/RevenueExpenseStatment");

		save("Business", "Reports", "Balance Sheet", "/Bussiness/BalanceSheetimport");

		save("Business", "Reports", "Business Overview", "/Bussiness/BussinessOverviewimport");

		save("Business", "Reports", "Business Collection Reports", "/Bussiness/BussinessCollectionReportsimport");

		// Customer Reports
		save("Customer Reports", null, "Customer Dues", "/Customer/Customer_Dues");

		save("Customer Reports", null, "Customer Outstanding", "/Customer/Customer_Outstanding");

		save("Customer Reports", null, "Customer Report", "/Customer/Customer_Report");

		save("Customer Reports", null, "Customer Transactions", "/Customer/Customer_Transactions");

		// Partner Reports
		save("Partner Reports", null, "Business Reports", "/Partners/Bussiness_Reports");

		save("Partner Reports", null, "Group Business Details", "/Partners/Group_Bussiness_Details");

		save("Partner Reports", null, "Group Business", "/Partners/Group_Bussiness");

		save("Partner Reports", null, "Installment Dues", "/Partners/Installment_Dues");

		save("Partner Reports", null, "Partner Information", "/Partners/Partner_Infoamtion");

		save("Partner Reports", null, "Partner Loan Limit", "/Partners/Partner_Loan_Limit");

		save("Partner Reports", null, "Partner Settlement", "/Partners/Partner_Settelment");

		save("Partner Reports", null, "Performance", "/Partners/Performance");
	}

	private void save(String menu, String subMenu, String screenName, String routePath) {

		Permission permission = new Permission();

		permission.setMenu(menu);
		permission.setSubMenu(subMenu);
		permission.setScreenName(screenName);
		permission.setRoutePath(routePath);

		repository.save(permission);
	}
}