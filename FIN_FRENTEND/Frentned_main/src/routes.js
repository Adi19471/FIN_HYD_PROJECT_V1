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

  { path: "/", element: Dashboard,  exact: true },
  { path: "/login", element: Login, public: true, exact: true },
  { path: "/unauthorized", element: Unauthorized, public: true, exact: true },

  { path: "/Main_personal_file", element: Main_personal_file, exact: true },
  { path: "/customer", element: Custmer, exact: true },
  { path: "/employee", element: Employe, exact: true },
  { path: "/partner", element: Partner, exact: true },
  { path: "/vendor", element: Vender, exact: true },

  // â­ Added Path Param Here
  { path: "/Loan", element: LoanMainPage },

  { path: "/Monthly-Finance", element: MonthlyFinance },
  { path: "/Daily-Finace", element: DailyFinance },

  // BussinessCashBook
  { path: "/BussinessCashBook_Main", element: BussinessCashBook },
  { path: "/Transactions/Quick_Cash_Book", element: Quick_Cash_Book },
  { path: "/Transactions/Deleete_Transaction", element: Deleete_Transaction },
  { path: "/Transactions/Deleete_Transaction", element: Deleete_Transaction },
  { path: "/Transactions/Cashbook", element: Cashbook },


  // Accounts 
  { path: "/AccountsModules/LoansMainpage", element: LoansMainpage },
  { path: "/AccountsModules/AccountLedger", element: AccountLedger },
  { path: "/AccountsModules/AccountMasterLedger", element: AccountMasterLedger },
  { path: "/AccountsModules/Cbledger", element: Cbledger },
  { path: "/AccountsModules/ReciptLedger", element: ReciptLedger },
  { path: "/AccountsModules/DailyBook", element: Daily_Book },
  { path: "/AccountsModules/Loansdetailes", element: Loansdetailes },
  { path: "/AccountsModules/Usercollectionledger", element: Usercollectionledger },



// Loans
{ path: "/Loans/Distubuted", element: Distubuted },
{ path: "/Loans/InstalmentDues", element: InstalmentDues },
{ path: "/Loans/Maturity", element: Maturity},
 


  // Account Master Setup
  { path: "/AccountMasterSetup/Account_Master_Setup", element: Account_Master_Setup },
  { path: "/AccountMasterSetup/Registraion_creation", element: Registraion_creation },


  // Bussiness views
   { path: "/Bussiness/RevenueExpenseStatment", element: RevenueExpenseStatment },
   { path: "/Bussiness/BalanceSheetimport", element: BalanceSheetimport },
   { path: "/Bussiness/BussinessOverviewimport", element: BussinessOverviewimport },
   { path: "/Bussiness/BussinessCollectionReportsimport", element: BussinessCollectionReportsimport },


  //  Customer Reports

  {path: "/Customer/Customer_Dues", element: Customer_Dues },
 {path: "/Customer/Customer_Outstanding", element: Customer_Outstanding },
  {path: "/Customer/Customer_Report", element: Customer_Report },
   {path: "/Customer/Customer_Transactions", element: Customer_Transactions },

// parttners

{path: "/Partners/Bussiness_Reports", element: Bussiness_Reports },
{path: "/Partners/Group_Bussiness_Details", element: Group_Bussiness_Details },
{path: "/Partners/Group_Bussiness", element: Group_Bussiness },
{path: "/Partners/Installment_Dues", element: Installment_Dues },
{path: "/Partners/Partner_Loan_Limit", element: Partner_Loan_Limit },
{path: "/Partners/Partner_Settelment", element: Partner_Settelment },
{path: "/Partners/Partner_Infoamtion", element: Partner_Infoamtion },
{path: "/Partners/Performance", element: Performance },




].map(withPermissions);

export default routes;
