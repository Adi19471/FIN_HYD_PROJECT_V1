import { lazy } from "react";
import { PATH_PERMISSION_CODES } from "./utils/permissions";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const Main_personal_file = lazy(() =>
  import(
    "./components/BalajiFinancial/Masterinfo/PersonalInfo/Main_personal_file"
  )
);
const Custmer = lazy(() =>
  import("./components/BalajiFinancial/Masterinfo/PersonalInfo/Custmer/Custmer")
);
const Employe = lazy(() =>
  import("./components/BalajiFinancial/Masterinfo/PersonalInfo/Employe/Employe")
);
const Partner = lazy(() =>
  import("./components/BalajiFinancial/Masterinfo/PersonalInfo/Partner/Partner")
);
const Vender = lazy(() =>
  import("./components/BalajiFinancial/Masterinfo/PersonalInfo/Vender/Vender")
);
const Login = lazy(() => import("./components/Authentication/Login"));
const Unauthorized = lazy(() => import("./components/Unauthorized"));

const LoanMainPage = lazy(() =>
  import("./components/BalajiFinancial/Masterinfo/Loans/Loan")
);

const MonthlyFinance = lazy(() =>
  import(
    "./components/BalajiFinancial/Masterinfo/Loans/MonthlyFinance/MonthlyFinance"
  )
);

const DailyFinance = lazy(() =>
  import(
    "./components/BalajiFinancial/Masterinfo/Loans/DailyFinance/DailyFinace"
  )
);

const BussinessCashBook = lazy(() =>
  import(
    "./components/BalajiFinancial/Transactions/BussinessCashBook/BussinessCashbook_Main"
  )
);



const Quick_Cash_Book = lazy(() =>
  import(
    "./components/BalajiFinancial/Transactions/Quick_Cash_Book/Quick_Cash_Book"
  )
);



const Deleete_Transaction = lazy(() =>  import(
  "./components/BalajiFinancial/Transactions/Delete_transaction/Deleete_Transaction"
));


const Cashbook = lazy(() =>
  import(
    "./components/BalajiFinancial/Transactions/Cashbook/Cashbook"
  )
);




const Account_Master_Setup = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountMasterSetup/Account_Master_Setup"
  )
);

const Registraion_creation = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountMasterSetup/Registraion_creation"
  )
);

const LoansMainpage = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountsModules/Loans"
  )
);

const AccountLedger = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountsModules/AccountLedger/AccountLedger"
  )
);
const AccountMasterLedger = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountsModules/AccountMasterLedger/AccountMasterLedger"
  )
);

const Cbledger = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountsModules/CBLedger/Cbledger"
  )
);


const ReciptLedger = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountsModules/ReciptLedger/ReciptLedger"
  )
);


const Daily_Book = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountsModules/DailBook/Daily_Book"
  )
);


const Loansdetailes = lazy(() =>
  import(
    "./components/BalajiFinancial/AccountsModules/LoansDetailes/Loansdetailes"
  )
);

const Usercollectionledger = lazy(() =>

 import("./components/BalajiFinancial/AccountsModules/UserCollectionLedger/Usercollectionledger")


);


// Loans section


const Distubuted = lazy (()  => import("./components/BalajiFinancial/Loans/Distrubuted/Distubuted"))

const InstalmentDues = lazy (()  => import("./components/BalajiFinancial/Loans/InstalmentDues/InstalmentDues"))

const Maturity = lazy (()  => import("./components/BalajiFinancial/Loans/Maturity/Maturity"))
;


// Bussines Code data

const RevenueExpenseStatment  = lazy(() =>import("./components/BalajiFinancial/Business/RevenueExpenseStatment"))
const BalanceSheetimport  = lazy(() =>import("./components/BalajiFinancial/Business/BalanceSheet"))
const BussinessOverviewimport =lazy(() =>import("./components/BalajiFinancial/Business/BussinessOverview"))
const BussinessCollectionReportsimport =lazy(() =>import('./components/BalajiFinancial/Business/BussinessCollectionReports'))
const BussinessShareimport =lazy(() =>import('./components/BalajiFinancial/Business/BussinessShare'))



// Customer Reports collections

const Customer_Dues =lazy(() =>import('./components/BalajiFinancial/Customer/Customer_Dues'))
const Customer_Outstanding =lazy(() =>import('./components/BalajiFinancial/Customer/Customer_Outstanding'))
const Customer_Report =lazy(() =>import('./components/BalajiFinancial/Customer/Customer_Report'))
const Customer_Transactions =lazy(() =>import('./components/BalajiFinancial/Customer/Customer_Transactions'))


// Partner Reports
const Bussiness_Reports = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Bussiness_Reports"))
const Group_Bussiness_Details = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Group_Bussiness_Details"))
const Group_Bussiness = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Group_Bussiness"))
const Installment_Dues = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Installment_Dues"))
const Partner_Infoamtion = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Partner_Infoamtion"))
const Partner_Loan_Limit = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Partner_Loan_Limit"))
const Partner_Settelment = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Partner_Settelment"))
const Performance = lazy(()=> import("./components/BalajiFinancial/PartnerReports/Performance"))

const withPermissions = (route) => ({
  ...route,
  permissionCodes: route.permissionCodes ?? PATH_PERMISSION_CODES[route.path] ?? [],
});

const routes = [

  { path: "/", element: Dashboard, title: "Dashboard", exact: true },
  { path: "/login", element: Login, title: "Login", public: true, exact: true },
  { path: "/unauthorized", element: Unauthorized, title: "Unauthorized", public: true, exact: true },

  { path: "/Main_personal_file", element: Main_personal_file, title: "Personal Info", exact: true },
  { path: "/customer", element: Custmer, title: "Customer Master", exact: true },
  { path: "/employee", element: Employe, title: "Employee Master", exact: true },
  { path: "/partner", element: Partner, title: "Partner Master", exact: true },
  { path: "/vendor", element: Vender, title: "Vendor Master", exact: true },

  // Added Path Param Here
  { path: "/Loan", element: LoanMainPage, title: "Loans" },

  { path: "/Monthly-Finance", element: MonthlyFinance, title: "Monthly Finance" },
  { path: "/Daily-Finace", element: DailyFinance, title: "Daily Finance" },

  // BussinessCashBook
  { path: "/BussinessCashBook_Main", element: BussinessCashBook, title: "Business Cash Book" },
  { path: "/Transactions/Quick_Cash_Book", element: Quick_Cash_Book, title: "Quick Cash Book" },
  { path: "/Transactions/Deleete_Transaction", element: Deleete_Transaction, title: "Delete Transaction" },
  { path: "/Transactions/Cashbook", element: Cashbook, title: "Cashbook" },


  // Accounts
  { path: "/AccountsModules/LoansMainpage", element: LoansMainpage, title: "Loans" },
  { path: "/AccountsModules/AccountLedger", element: AccountLedger, title: "Account Ledger" },
  { path: "/AccountsModules/AccountMasterLedger", element: AccountMasterLedger, title: "Account Master Ledger" },
  { path: "/AccountsModules/Cbledger", element: Cbledger, title: "CB Ledger" },
  { path: "/AccountsModules/ReciptLedger", element: ReciptLedger, title: "Receipt Ledger" },
  { path: "/AccountsModules/DailyBook", element: Daily_Book, title: "Daily Book" },
  { path: "/AccountsModules/Loansdetailes", element: Loansdetailes, title: "Loan Details" },
  { path: "/AccountsModules/Usercollectionledger", element: Usercollectionledger, title: "User Collection Ledger" },



// Loans
{ path: "/Loans/Distubuted", element: Distubuted, title: "Distributed Loans" },
{ path: "/Loans/InstalmentDues", element: InstalmentDues, title: "Installment Dues" },
{ path: "/Loans/Maturity", element: Maturity, title: "Maturity" },



  // Account Master Setup
  { path: "/AccountMasterSetup/Account_Master_Setup", element: Account_Master_Setup, title: "Account Master Setup" },
  { path: "/AccountMasterSetup/Registraion_creation", element: Registraion_creation, title: "Registration Creation" },


  // Bussiness views
   { path: "/Bussiness/RevenueExpenseStatment", element: RevenueExpenseStatment, title: "Revenue & Expense Statement" },
   { path: "/Bussiness/BalanceSheetimport", element: BalanceSheetimport, title: "Balance Sheet" },
   { path: "/Bussiness/BussinessOverviewimport", element: BussinessOverviewimport, title: "Business Overview" },
   { path: "/Bussiness/BussinessCollectionReportsimport", element: BussinessCollectionReportsimport, title: "Business Collection Reports" },
   { path: "/Bussiness/BussinessShare", element: BussinessShareimport, title: "Business Share" },


  //  Customer Reports

  {path: "/Customer/Customer_Dues", element: Customer_Dues, title: "Customer Dues" },
 {path: "/Customer/Customer_Outstanding", element: Customer_Outstanding, title: "Customer Outstanding" },
  {path: "/Customer/Customer_Report", element: Customer_Report, title: "Customer Report" },
   {path: "/Customer/Customer_Transactions", element: Customer_Transactions, title: "Customer Transactions" },

// parttners

{path: "/Partners/Bussiness_Reports", element: Bussiness_Reports, title: "Business Reports" },
{path: "/Partners/Group_Bussiness_Details", element: Group_Bussiness_Details, title: "Group Business Details" },
{path: "/Partners/Group_Bussiness", element: Group_Bussiness, title: "Group Business" },
{path: "/Partners/Installment_Dues", element: Installment_Dues, title: "Installment Dues" },
{path: "/Partners/Partner_Loan_Limit", element: Partner_Loan_Limit, title: "Partner Loan Limit" },
{path: "/Partners/Partner_Settelment", element: Partner_Settelment, title: "Partner Settlement" },
{path: "/Partners/Partner_Infoamtion", element: Partner_Infoamtion, title: "Partner Information" },
{path: "/Partners/Performance", element: Performance, title: "Performance" },




].map(withPermissions);

export default routes;
