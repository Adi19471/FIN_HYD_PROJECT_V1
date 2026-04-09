import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Close,
  Home,
  Info,
  AccountCircle,
  Login,
  PersonAdd,
  LockReset,
  ChevronRight,
  ExpandMore,
  Person,
  MonetizationOn,
  AccountBalance,
  AccountBalanceWallet,
  ReceiptLong,
  DeleteForever,
  SwapHoriz,
  AccountTree,
  Construction,
  EventNote,
  EventAvailable,
  People,
  Description,
  AttachMoney,
  Business,
  Calculate,
  CheckCircle,
  DashboardCustomize,
  FlashOn,
  FolderSpecial,
  Payment,
  Send,
  Settings,
  Summarize,
  Today,
  TrendingUp,
} from "@mui/icons-material";

import { useThemeProvider } from "../utils/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import "./Sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;
  const { currentTheme } = useThemeProvider();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
  );

  // Track which dropdown group is currently open
  const [openGroup, setOpenGroup] = useState(null);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Close on ESC key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // Persist sidebar expanded state
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Auto-open relevant group based on current route
  useEffect(() => {
    if (pathname === "/") {
      setOpenGroup(null);
      return;
    }

    if (
      pathname.toLowerCase().includes("/master") ||
      ["/main_personal_file", "/loan", "/guarantor", "/branch"].some((p) =>
        pathname.toLowerCase().startsWith(p)
      )
    ) {
      setOpenGroup("master");
    } else if (
      pathname.toLowerCase().includes("/transaction") ||
      pathname.toLowerCase().startsWith("/bussinesscashbook_main") ||
      pathname.toLowerCase().startsWith("/transactions/")
    ) {
      setOpenGroup("transactions");
    } else if (pathname.toLowerCase().startsWith("/loans/") || pathname.toLowerCase().includes("loansmainpage")) {
      setOpenGroup("accounts");
    } else if (pathname.toLowerCase().startsWith("/accountmastersetup")) {
      setOpenGroup("accountMaster");
    } else if (pathname.toLowerCase().startsWith("/customer/")) {
      setOpenGroup("customer");
    } else if (
      pathname.toLowerCase().startsWith("/bussiness/")
    ) {
      setOpenGroup("business");
    } else if (
      ["/login", "/signup", "/reset-password"].some((p) =>
        pathname.startsWith(p)
      )
    ) {
      setOpenGroup("auth");
    }
  }, [pathname]);

  // Memoized handler for group toggle
  const handleGroupToggle = useCallback((groupName) => {
    setOpenGroup((prev) => (prev === groupName ? null : groupName));
    if (!sidebarExpanded) setSidebarExpanded(true);
  }, [sidebarExpanded]);

  // Memoized click handler for sidebar toggle
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  // Memoized sidebar expand handler
  const handleSidebarExpand = useCallback(() => {
    setSidebarExpanded(!sidebarExpanded);
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-50 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 
          h-screen overflow-y-auto no-scrollbar
          w-64 lg:w-20 lg:sidebar-expanded:w-64 2xl:!w-64 
          shrink-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 
          transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <span className="hidden lg:sidebar-expanded:block 2xl:block text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              BALAJI FINANCE
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            <ThemeToggle />
          </div>

          <button
            ref={trigger}
            onClick={handleSidebarToggle}
            className="lg:hidden p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition-colors"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1.5">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
              }`
            }
          >
            <Home className="w-5 h-5 min-w-[20px]" />
            <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
              Dashboard
            </span>
          </NavLink>

          {/* Master Info */}
          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "master"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("master")}
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Master Info
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "master" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openGroup === "master" && (
            <ul className="pl-11 mt-1 space-y-1">
              <li>
                <NavLink
                  to="/Main_personal_file"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <Person className="w-4 h-4" />
                  <span>Personal Info</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Loan"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <MonetizationOn className="w-4 h-4" />
                  <span>Loans</span>
                </NavLink>
              </li>
            </ul>
          )}

          {/* Transactions */}
          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "transactions"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("transactions")}
          >
            <div className="flex items-center gap-3">
              <SwapHoriz className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Transactions
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "transactions" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openGroup === "transactions" && (
            <ul className="pl-11 mt-1 space-y-1">
              <li>
                <NavLink
                  to="/BussinessCashBook_Main"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <AccountBalanceWallet className="w-4 h-4" />
                  <span>Business Cash Book</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Transactions/Quick_Cash_Book"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <FlashOn className="w-4 h-4" />
                  <span>Quick Cash Book</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Transactions/Deleete_Transaction"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        : "text-red-600 dark:text-red-400 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/40"
                    }`
                  }
                >
                  <DeleteForever className="w-4 h-4" />
                  <span>Delete Transaction</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Transactions/cashbook"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                        : "text-gray-600 hover:text-sky-700 dark:text-gray-400 dark:hover:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40"
                    }`
                  }
                >
                  <AccountBalanceWallet className="w-4 h-4" />
                  <span>Cashbook</span>
                </NavLink>
              </li>
            </ul>
          )}

          {/* Accounts */}
          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "accounts"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("accounts")}
          >
            <div className="flex items-center gap-3">
              <AccountTree className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Accounts
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "accounts" ? "rotate-180" : ""
              }`}
            />
          </div>

{openGroup === "accounts" && (
  <ul className="pl-11 mt-1 space-y-1">

   
    <li>
      <NavLink to="/AccountsModules/LoansMainpage" className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
        }`
      }>
        <AccountBalance className="w-4 h-4" />
        <span>Loans Main</span>
      </NavLink>
    </li>




    <li>
      <NavLink to="/AccountsModules/DailyBook" className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
        }`
      }>
        <Today className="w-4 h-4" />
        <span>Daily Book</span>
      </NavLink>
    </li>

    <li>
      <NavLink to="/AccountsModules/Cbledger" className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
        }`
      }>
        <Calculate className="w-4 h-4" />
        <span>CB Ledger</span>
      </NavLink>
    </li>

    <li>
      <NavLink to="/AccountsModules/AccountLedger" className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
          isActive ? "bg-sky-100 text-sky-700" : "text-gray-600 hover:bg-sky-100"
        }`
      }>
        <ReceiptLong className="w-4 h-4" />
        <span>Account Ledger</span>
      </NavLink>
    </li>

    <li>
      <NavLink to="/AccountsModules/AccountMasterLedger" className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
        }`
      }>
        <FolderSpecial className="w-4 h-4" />
        <span>Account Master Ledger</span>
      </NavLink>
    </li>

    <li>
      <NavLink to="/AccountsModules/Usercollectionledger" className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
        }`
      }>
        <People className="w-4 h-4" />
        <span>User Collection Ledger</span>
      </NavLink>
    </li>

    <li>
      <NavLink to="/AccountsModules/ReciptLedger" className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
        }`
      }>
        <Description className="w-4 h-4" />
        <span>Receipt Ledger</span>
      </NavLink>
    </li>

  </ul>
)}

          {/* Account Master Setup */}
          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "accountMaster"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("accountMaster")}
          >
            <div className="flex items-center gap-3">
              <Construction className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Account Master
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "accountMaster" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openGroup === "accountMaster" && (
            <ul className="pl-11 mt-1 space-y-1">
              <li>
                <NavLink
                  to="/AccountMasterSetup/Account_Master_Setup"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 shadow-sm"
                        : "text-gray-600 hover:text-sky-700 dark:text-gray-400 dark:hover:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40"
                    }`
                  }
                >
                  <Settings className="w-4 h-4" />
                  <span>Account Master Setup</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/AccountMasterSetup/Registraion_creation"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 shadow-sm"
                        : "text-gray-600 hover:text-sky-700 dark:text-gray-400 dark:hover:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40"
                    }`
                  }
                >
                  <PersonAdd className="w-4 h-4" />
                  <span>User Registration</span>
                </NavLink>
              </li>
            </ul>
          )}

          {/* Loans */}
          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "loans"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("loans")}
          >
            <div className="flex items-center gap-3">
              <AttachMoney className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Loans
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "loans" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openGroup === "loans" && (
            <ul className="pl-11 mt-1 space-y-1">
              <li>
                <NavLink
                  to="/Loans/Distubuted"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <Send className="w-4 h-4" />
                  <span>Distributed Loans</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Loans/InstalmentDues"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <Payment className="w-4 h-4" />
                  <span>Instalment Dues</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Loans/Maturity"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Maturity</span>
                </NavLink>
              </li>
            </ul>
          )}

          {/* Business */}
          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "business"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("business")}
          >
            <div className="flex items-center gap-3">
              <Business className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Business
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "business" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openGroup === "business" && (
            <ul className="pl-11 mt-1 space-y-1">
              <li>
                <NavLink
                  to="/Bussiness/RevenueExpenseStatment"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Revenue Expense Statement</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Bussiness/BalanceSheetimport"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <AccountBalance className="w-4 h-4" />
                  <span>Balance Sheet</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Bussiness/BussinessOverviewimport"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <DashboardCustomize className="w-4 h-4" />
                  <span>Business Overview</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Bussiness/BussinessCollectionReportsimport"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <Summarize className="w-4 h-4" />
                  <span>Business Collection Reports</span>
                </NavLink>
              </li>
            </ul>
          )}

          {/* Customer */}
          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "customer"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("customer")}
          >
            <div className="flex items-center gap-3">
              <People className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Customer
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "customer" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openGroup === "customer" && (
            <ul className="pl-11 mt-1 space-y-1">
              <li>
                <NavLink
                  to="/Customer/Customer_Dues"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <People className="w-4 h-4" />
                  <span>Customer Dues</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Customer/Customer_Outstanding"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <Description className="w-4 h-4" />
                  <span>Customer Outstanding</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Customer/Customer_Report"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <Summarize className="w-4 h-4" />
                  <span>Customer Report</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Customer/Customer_Transactions"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <ReceiptLong className="w-4 h-4" />
                  <span>Customer Transactions</span>
                </NavLink>
              </li>
            </ul>
          )}

          {/* Authentication */}

          <div
            className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium ${
              openGroup === "auth"
                ? "bg-sky-100 dark:bg-sky-900/40"
                : "hover:bg-sky-100 dark:hover:bg-sky-900/30"
            }`}
            onClick={() => handleGroupToggle("auth")}
          >
            <div className="flex items-center gap-3">
              <AccountCircle className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span className="text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition-opacity duration-200">
                Authentication
              </span>
            </div>
            <ExpandMore
              className={`w-5 h-5 transition-transform duration-300 ${
                openGroup === "auth" ? "rotate-180" : ""
              }`}
            />
          </div>

          {openGroup === "auth" && (
            <ul className="pl-11 mt-1 space-y-1">
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900/40 dark:hover:text-sky-300"
                    }`
                  }
                >
                  <Login className="w-4 h-4" />
                  <span>Sign In</span>
                </NavLink>
              </li>
              
              
            </ul>
          )}
        </nav>

        {/* Collapse/Expand Button (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleSidebarExpand}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronRight
              className={`w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                sidebarExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
