// The navigation tree. Icons are not chosen here — every entry points at
// src/lib/icons.js, which owns the app's icon language and guarantees no two
// menu entries share a mark. Sidebar, top-bar breadcrumbs and command search
// all render from this one list.
import { navIcons } from "src/lib/icons";

// Dashboard sits outside the groups (the sidebar pins it above them) but still
// takes its icon from the same map.
export const dashboardIcon = navIcons.dashboard;

export const sidebarGroups = [
  {
    key: "master",
    label: "Master Information",
    icon: navIcons.master,
    match: ["/main_personal_file", "/loan", "/customer", "/employee", "/partner", "/vendor"],
    items: [
      { label: "Personal Information", path: "/Main_personal_file", icon: navIcons.personalInformation },
      { label: "Loans", path: "/Loan", icon: navIcons.masterLoans },
    ],
  },
  {
    key: "transactions",
    label: "Transactions",
    icon: navIcons.transactions,
    match: ["/bussinesscashbook_main", "/transactions/"],
    items: [
      { label: "Business Cash Book", path: "/BussinessCashBook_Main", icon: navIcons.businessCashBook },
      { label: "Quick Cash Book", path: "/Transactions/Quick_Cash_Book", icon: navIcons.quickCashBook },
      { label: "Cashbook", path: "/Transactions/Cashbook", icon: navIcons.cashbook },
      { label: "Delete Transaction", path: "/Transactions/Deleete_Transaction", icon: navIcons.deleteTransaction, danger: true },
    ],
  },
  {
    key: "accounts",
    label: "Accounts",
    icon: navIcons.accounts,
    match: ["/accountsmodules/"],
    items: [
      { label: "Loans Main", path: "/AccountsModules/LoansMainpage", icon: navIcons.loansMain },
      { label: "Daily Book", path: "/AccountsModules/DailyBook", icon: navIcons.dailyBook },
      { label: "CB Ledger", path: "/AccountsModules/Cbledger", icon: navIcons.cbLedger },
      { label: "Account Ledger", path: "/AccountsModules/AccountLedger", icon: navIcons.accountLedger },
      { label: "Account Master Ledger", path: "/AccountsModules/AccountMasterLedger", icon: navIcons.accountMasterLedger },
      { label: "User Collection Ledger", path: "/AccountsModules/Usercollectionledger", icon: navIcons.userCollectionLedger },
      { label: "Receipt Ledger", path: "/AccountsModules/ReciptLedger", icon: navIcons.receiptLedger },
    ],
  },
  {
    key: "loan",
    label: "Loans",
    icon: navIcons.loan,
    match: ["/loans/"],
    items: [
      { label: "Distributed Loans", path: "/Loans/Distubuted", icon: navIcons.distributedLoans },
      { label: "Instalment Dues", path: "/Loans/InstalmentDues", icon: navIcons.instalmentDues },
      { label: "Maturity", path: "/Loans/Maturity", icon: navIcons.maturity },
    ],
  },
  {
    key: "accountMaster",
    label: "Account Master",
    icon: navIcons.accountMaster,
    match: ["/accountmastersetup/"],
    items: [
      { label: "Account Setup", path: "/AccountMasterSetup/Account_Master_Setup", icon: navIcons.accountSetup },
      { label: "User Registration", path: "/AccountMasterSetup/Registraion_creation", icon: navIcons.userRegistration },
    ],
  },
  {
    key: "business",
    label: "Business",
    icon: navIcons.business,
    match: ["/bussiness/"],
    items: [
      { label: "Revenue Expense Statement", path: "/Bussiness/RevenueExpenseStatment", icon: navIcons.revenueExpenseStatement },
      { label: "Balance Sheet", path: "/Bussiness/BalanceSheetimport", icon: navIcons.balanceSheet },
      { label: "Business Overview", path: "/Bussiness/BussinessOverviewimport", icon: navIcons.businessOverview },
      { label: "Collection Reports", path: "/Bussiness/BussinessCollectionReportsimport", icon: navIcons.collectionReports },
      { label: "Business Share", path: "/Bussiness/BussinessShare", icon: navIcons.businessShare },
    ],
  },
  {
    key: "customer",
    label: "Customer Reports",
    icon: navIcons.customer,
    match: ["/customer/"],
    items: [
      { label: "Customer Dues", path: "/Customer/Customer_Dues", icon: navIcons.customerDues },
      { label: "Outstanding", path: "/Customer/Customer_Outstanding", icon: navIcons.customerOutstanding },
      { label: "Customer Report", path: "/Customer/Customer_Report", icon: navIcons.customerReport },
      { label: "Transactions", path: "/Customer/Customer_Transactions", icon: navIcons.customerTransactions },
    ],
  },
  {
    key: "partners",
    label: "Partners",
    icon: navIcons.partners,
    match: ["/partners/"],
    items: [
      { label: "Business Reports", path: "/Partners/Bussiness_Reports", icon: navIcons.partnerBusinessReports },
      { label: "Group Business Details", path: "/Partners/Group_Bussiness_Details", icon: navIcons.groupBusinessDetails },
      { label: "Group Business", path: "/Partners/Group_Bussiness", icon: navIcons.groupBusiness },
      { label: "Installment Dues", path: "/Partners/Installment_Dues", icon: navIcons.partnerInstallmentDues },
      { label: "Partner Loan Limit", path: "/Partners/Partner_Loan_Limit", icon: navIcons.partnerLoanLimit },
      { label: "Partner Settlement", path: "/Partners/Partner_Settelment", icon: navIcons.partnerSettlement },
      { label: "Partner Information", path: "/Partners/Partner_Infoamtion", icon: navIcons.partnerInformation },
      { label: "Performance", path: "/Partners/Performance", icon: navIcons.partnerPerformance },
    ],
  },
  {
    key: "auth",
    label: "Authentication",
    icon: navIcons.auth,
    match: ["/login"],
    items: [{ label: "Sign In", path: "/login", icon: navIcons.signIn }],
  },
];
