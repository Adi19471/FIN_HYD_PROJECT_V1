export const ROLE_PREFIX = "ROLE_";

export const PATH_PERMISSION_CODES = {
  "/": ["DASHBOARD_VIEW"],
  "/Main_personal_file": ["CUSTOMER_VIEW", "EMPLOYEE_VIEW", "PARTNER_VIEW", "VENDOR_VIEW"],
  "/customer": ["CUSTOMER_VIEW"],
  "/employee": ["EMPLOYEE_VIEW"],
  "/partner": ["PARTNER_VIEW"],
  "/vendor": ["VENDOR_VIEW"],
  "/Loan": ["LOAN_MAIN_VIEW", "MONTHLY_FINANCE_VIEW", "DAILY_FINANCE_VIEW"],
  "/Monthly-Finance": ["MONTHLY_FINANCE_VIEW"],
  "/Daily-Finace": ["DAILY_FINANCE_VIEW"],
  "/BussinessCashBook_Main": ["BUSINESS_CASHBOOK_VIEW"],
  "/Transactions/Quick_Cash_Book": ["QUICK_CASHBOOK_VIEW"],
  "/Transactions/Deleete_Transaction": ["DELETE_TRANSACTION_VIEW"],
  "/Transactions/Cashbook": ["CASHBOOK_VIEW"],
  "/AccountsModules/LoansMainpage": ["ACCOUNTS_LOANS_VIEW"],
  "/AccountsModules/AccountLedger": ["ACCOUNT_LEDGER_VIEW"],
  "/AccountsModules/AccountMasterLedger": ["ACCOUNT_MASTER_LEDGER_VIEW"],
  "/AccountsModules/Cbledger": ["CB_LEDGER_VIEW"],
  "/AccountsModules/ReciptLedger": ["RECEIPT_LEDGER_VIEW"],
  "/AccountsModules/DailyBook": ["DAILY_BOOK_VIEW"],
  "/AccountsModules/Loansdetailes": ["LOAN_DETAILS_VIEW"],
  "/AccountsModules/Usercollectionledger": ["USER_COLLECTION_LEDGER_VIEW"],
  "/Loans/Distubuted": ["DISTRIBUTED_VIEW"],
  "/Loans/InstalmentDues": ["INSTALMENT_DUES_VIEW"],
  "/Loans/Maturity": ["MATURITY_VIEW"],
  "/AccountMasterSetup/Account_Master_Setup": ["ACCOUNT_MASTER_SETUP_VIEW"],
  "/AccountMasterSetup/Registraion_creation": ["REGISTRATION_CREATION_VIEW"],
  "/Bussiness/RevenueExpenseStatment": ["REVENUE_EXPENSE_VIEW"],
  "/Bussiness/BalanceSheetimport": ["BALANCE_SHEET_VIEW"],
  "/Bussiness/BussinessOverviewimport": ["BUSINESS_OVERVIEW_VIEW"],
  "/Bussiness/BussinessCollectionReportsimport": ["BUSINESS_COLLECTION_REPORTS_VIEW"],
  "/Customer/Customer_Dues": ["CUSTOMER_DUES_VIEW"],
  "/Customer/Customer_Outstanding": ["CUSTOMER_OUTSTANDING_VIEW"],
  "/Customer/Customer_Report": ["CUSTOMER_REPORT_VIEW"],
  "/Customer/Customer_Transactions": ["CUSTOMER_TRANSACTIONS_VIEW"],
  "/Partners/Bussiness_Reports": ["PARTNER_BUSINESS_REPORTS_VIEW"],
  "/Partners/Group_Bussiness_Details": ["GROUP_BUSINESS_DETAILS_VIEW"],
  "/Partners/Group_Bussiness": ["GROUP_BUSINESS_VIEW"],
  "/Partners/Installment_Dues": ["PARTNER_INSTALLMENT_DUES_VIEW"],
  "/Partners/Partner_Loan_Limit": ["PARTNER_LOAN_LIMIT_VIEW"],
  "/Partners/Partner_Settelment": ["PARTNER_SETTLEMENT_VIEW"],
  "/Partners/Partner_Infoamtion": ["PARTNER_INFORMATION_VIEW"],
  "/Partners/Performance": ["PERFORMANCE_VIEW"],
};

const firstValue = (value, keys) => {
  if (!value || typeof value !== "object") return undefined;
  const key = keys.find((candidate) => value[candidate] !== undefined);
  return key ? value[key] : undefined;
};

export const normalizePermissionCodes = (value) => {
  const source = firstValue(value, ["permissions", "permissionCodes", "roles", "authorities"]) ?? value;
  if (!Array.isArray(source)) return [];

  return Array.from(
    new Set(
      source
        .map((item) => {
          if (typeof item === "string") return item;
          return firstValue(item, ["authority", "permissionCode", "code", "name"]);
        })
        .filter(Boolean)
        .map((code) => String(code).trim().toUpperCase())
        .filter((code) => code && !code.startsWith(ROLE_PREFIX))
    )
  );
};

export const normalizeRoles = (value) => {
  const source = firstValue(value, ["roles", "authorities"]) ?? value;
  if (!Array.isArray(source)) return [];

  return Array.from(
    new Set(
      source
        .map((item) => (typeof item === "string" ? item : firstValue(item, ["authority", "role", "name"])))
        .filter(Boolean)
        .map((role) => String(role).trim().toUpperCase())
        .filter((role) => role.startsWith(ROLE_PREFIX))
    )
  );
};

export const hasPermissionAccess = (user, requiredPermissions = []) => {
  const required = Array.isArray(requiredPermissions) ? requiredPermissions.filter(Boolean) : [requiredPermissions].filter(Boolean);
  if (!required.length) return true;

  const userPermissions = new Set(normalizePermissionCodes(user));
  return required.some((permission) => userPermissions.has(String(permission).trim().toUpperCase()));
};

export const getDefaultAuthorizedPath = (user, fallback = "/unauthorized") => {
  const entry = Object.entries(PATH_PERMISSION_CODES).find(([, permissions]) => hasPermissionAccess(user, permissions));
  return entry?.[0] || fallback;
};
