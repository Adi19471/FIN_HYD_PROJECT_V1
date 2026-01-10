import { lazy } from "react";

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



const Daily_Book = lazy(() =>
  import(
    "./components/BalajiFinancial/Loans/DailBook/Daily_Book"
  )
);



const routes = [



  { path: "/customer", element: Custmer, exact: true },
  { path: "/", element: Dashboard,  exact: true },
  { path: "/login", element: Login, public: true, exact: true },
  { path: "/unauthorized", element: Unauthorized, public: true, exact: true },

  { path: "/Main_personal_file", element: Main_personal_file, exact: true },
  { path: "/customer", element: Custmer, exact: true },
  { path: "/employee", element: Employe, exact: true },
  { path: "/partner", element: Partner, exact: true },
  { path: "/vendor", element: Vender, exact: true },

  // ⭐ Added Path Param Here
  { path: "/Loan", element: LoanMainPage },

  { path: "/Monthly-Finance", element: MonthlyFinance },
  { path: "/Daily-Finace", element: DailyFinance },

  // BussinessCashBook
  { path: "/BussinessCashBook_Main", element: BussinessCashBook },
  { path: "/Transactions/Quick_Cash_Book", element: Quick_Cash_Book },
  { path: "/Transactions/Deleete_Transaction", element: Deleete_Transaction },
  { path: "/Transactions/Deleete_Transaction", element: Deleete_Transaction },
  { path: "/Transactions/Cashbook", element: Cashbook },


  // Daily Book
  { path: "/Loans/Daily_Book", element: Daily_Book },
];

export default routes;
