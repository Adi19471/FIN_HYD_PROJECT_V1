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
        save("Dashboard", null, "Dashboard", "DASHBOARD_VIEW");

        // Master Info
        save("Master Info", "Personal Info", "Customer", "CUSTOMER_VIEW");
        save("Master Info", "Personal Info", "Employee", "EMPLOYEE_VIEW");
        save("Master Info", "Personal Info", "Partner", "PARTNER_VIEW");
        save("Master Info", "Personal Info", "Vendor", "VENDOR_VIEW");

        save("Master Info", "Loans", "Loan Main Page", "LOAN_MAIN_VIEW");
        save("Master Info", "Loans", "Monthly Finance", "MONTHLY_FINANCE_VIEW");
        save("Master Info", "Loans", "Daily Finance", "DAILY_FINANCE_VIEW");

        // Transactions
        save("Transactions", "Cash Book", "Business Cash Book", "BUSINESS_CASHBOOK_VIEW");
        save("Transactions", "Cash Book", "Quick Cash Book", "QUICK_CASHBOOK_VIEW");
        save("Transactions", "Cash Book", "Delete Transaction", "DELETE_TRANSACTION_VIEW");
        save("Transactions", "Cash Book", "Cashbook", "CASHBOOK_VIEW");

        // Accounts
        save("Accounts", "Ledgers", "Loans Main Page", "ACCOUNTS_LOANS_VIEW");
        save("Accounts", "Ledgers", "Account Ledger", "ACCOUNT_LEDGER_VIEW");
        save("Accounts", "Ledgers", "Account Master Ledger", "ACCOUNT_MASTER_LEDGER_VIEW");
        save("Accounts", "Ledgers", "CB Ledger", "CB_LEDGER_VIEW");
        save("Accounts", "Ledgers", "Receipt Ledger", "RECEIPT_LEDGER_VIEW");
        save("Accounts", "Ledgers", "Daily Book", "DAILY_BOOK_VIEW");
        save("Accounts", "Ledgers", "Loans Details", "LOAN_DETAILS_VIEW");
        save("Accounts", "Ledgers", "User Collection Ledger", "USER_COLLECTION_LEDGER_VIEW");

        // Loans
        save("Loans", "Reports", "Distributed", "DISTRIBUTED_VIEW");
        save("Loans", "Reports", "Instalment Dues", "INSTALMENT_DUES_VIEW");
        save("Loans", "Reports", "Maturity", "MATURITY_VIEW");

        // Account Master Setup
        save("Account Master Setup", null, "Account Master Setup", "ACCOUNT_MASTER_SETUP_VIEW");
        save("Account Master Setup", null, "Registration Creation", "REGISTRATION_CREATION_VIEW");

        // Business
        save("Business", "Reports", "Revenue Expense Statement", "REVENUE_EXPENSE_VIEW");
        save("Business", "Reports", "Balance Sheet", "BALANCE_SHEET_VIEW");
        save("Business", "Reports", "Business Overview", "BUSINESS_OVERVIEW_VIEW");
        save("Business", "Reports", "Business Collection Reports", "BUSINESS_COLLECTION_REPORTS_VIEW");

        // Customer Reports
        save("Customer Reports", null, "Customer Dues", "CUSTOMER_DUES_VIEW");
        save("Customer Reports", null, "Customer Outstanding", "CUSTOMER_OUTSTANDING_VIEW");
        save("Customer Reports", null, "Customer Report", "CUSTOMER_REPORT_VIEW");
        save("Customer Reports", null, "Customer Transactions", "CUSTOMER_TRANSACTIONS_VIEW");

        // Partner Reports
        save("Partner Reports", null, "Business Reports", "PARTNER_BUSINESS_REPORTS_VIEW");
        save("Partner Reports", null, "Group Business Details", "GROUP_BUSINESS_DETAILS_VIEW");
        save("Partner Reports", null, "Group Business", "GROUP_BUSINESS_VIEW");
        save("Partner Reports", null, "Installment Dues", "PARTNER_INSTALLMENT_DUES_VIEW");
        save("Partner Reports", null, "Partner Information", "PARTNER_INFORMATION_VIEW");
        save("Partner Reports", null, "Partner Loan Limit", "PARTNER_LOAN_LIMIT_VIEW");
        save("Partner Reports", null, "Partner Settlement", "PARTNER_SETTLEMENT_VIEW");
        save("Partner Reports", null, "Performance", "PERFORMANCE_VIEW");
    }

    private void save(
            String menu,
            String subMenu,
            String screenName,
            String permissionCode) {

        Permission permission = new Permission();

        permission.setMenu(menu);
        permission.setSubMenu(subMenu);
        permission.setScreenName(screenName);
        permission.setPermissionCode(permissionCode);

        repository.save(permission);
    }
}