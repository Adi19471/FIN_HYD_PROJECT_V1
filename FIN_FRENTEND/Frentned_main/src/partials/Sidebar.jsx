import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Close,
  Dashboard,
  FolderShared,
  AccountCircle,
  Login,
  HowToReg,
  RestartAlt,
  ChevronRight,
  ExpandMore,
  Person,
  MonetizationOn,
  Handshake,
  Business,
  AccountBalanceWallet, // Better icon for transactions
} from "@mui/icons-material";

import SidebarLinkGroup from "./SidebarLinkGroup";
import logoSrc from "../images/shri-balaji-finance.png";

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

  // Close on click outside
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
  }, [sidebarOpen]);

  // Close if the Esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);
  return (
    <div className="min-w-fit">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-50 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:w-64 2xl:!w-64 shrink-0 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out sidebar-foam ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            {/* Uncomment when logo is ready */}
            {/* <img src={logoSrc} alt="Logo" width={40} height={40} className="rounded-full" /> */}
            <span className="hidden lg:sidebar-expanded:block 2xl:block text-xl font-bold text-black dark:text-white">
              {/* SHRI BALAJI FINANCE  */} BALAJI FINANCE
            </span>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <ThemeToggle />
          </div>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Close sidebar"
            className="lg:hidden text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <Close className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white dark:from-gray-700 dark:to-gray-900 dark:text-white font-semibold shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`
            }
          >
            <Dashboard className="w-5 h-5" />
            <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              Dashboard
            </span>
          </NavLink>

          {/* Master Info */}
          <SidebarLinkGroup
            activeCondition={
              pathname.includes("/master") ||
              ["/Main_personal_file", "/Loan", "/guarantor", "/branch"].some(
                (p) => pathname.startsWith(p)
              )
            }
          >
            {(handleClick, open) => (
              <>
                <a
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded || setSidebarExpanded(true);
                    handleClick();
                  }}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all ${
                    open
                      ? "bg-gray-100 dark:bg-gray-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FolderShared className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Master Info
                    </span>
                  </div>
                  <ExpandMore
                    className={`w-4 h-4 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </a>

                <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul className={`pl-10 mt-1 space-y-1 ${!open && "hidden"}`}>
                    {[
                      {
                        to: "/Main_personal_file",
                        icon: Person,
                        label: "Personal Info",
                      },
                      { to: "/Loan", icon: MonetizationOn, label: "Loans" },
                      { to: "/guarantor", icon: Handshake, label: "Guarantor" },
                      { to: "/branch", icon: Business, label: "Branch" },
                    ].map(({ to, icon: Icon, label }) => (
                      <li key={to}>
                        <NavLink
                          to={to}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white dark:from-gray-700 dark:to-gray-900 dark:text-white font-medium shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`
                          }
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          {/* Business Transactions */}
          <SidebarLinkGroup
            activeCondition={
              pathname.includes("/transaction") ||
              pathname.startsWith("/BussinessCashBook_Main")
            }
          >
            {(handleClick, open) => (
              <>
                <a
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded || setSidebarExpanded(true);
                    handleClick();
                  }}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all ${
                    open
                      ? "bg-gray-100 dark:bg-gray-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <AccountBalanceWallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Transactions
                    </span>
                  </div>
                  <ExpandMore
                    className={`w-4 h-4 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </a>

                <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul className={`pl-10 mt-1 space-y-1 ${!open && "hidden"}`}>
                    <li>
                      <NavLink
                        to="/BussinessCashBook_Main"
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all ${
                            isActive
                              ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white dark:from-gray-700 dark:to-gray-900 dark:text-white font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`
                        }
                      >
                        <AccountBalanceWallet className="w-4 h-4" />
                        <span>Business Cash Book</span>
                      </NavLink>
                    </li>
                    {/* Add more transaction links here later */}
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>

          {/* Authentication (only show if not logged in?) - optional */}
          {/* You may want to hide this when user is authenticated */}
          <SidebarLinkGroup
            activeCondition={
              pathname.includes("/auth") ||
              ["/login", "/signup", "/reset-password"].some((p) =>
                pathname.startsWith(p)
              )
            }
          >
            {(handleClick, open) => (
              <>
                <a
                  href="#0"
                  onClick={(e) => {
                    e.preventDefault();
                    sidebarExpanded || setSidebarExpanded(true);
                    handleClick();
                  }}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all ${
                    open
                      ? "bg-gray-100 dark:bg-gray-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <AccountCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Authentication
                    </span>
                  </div>
                  <ExpandMore
                    className={`w-4 h-4 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </a>

                <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  <ul className={`pl-10 mt-1 space-y-1 ${!open && "hidden"}`}>
                    <li>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                            isActive
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                      >
                        <Login className="w-4 h-4" />
                        <span>Sign In</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/signup"
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                            isActive
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                      >
                        <HowToReg className="w-4 h-4" />
                        <span>Sign Up</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/reset-password"
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${
                            isActive
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                      >
                        <RestartAlt className="w-4 h-4" />
                        <span>Reset Password</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </SidebarLinkGroup>
        </nav>

        {/* Expand / Collapse Button */}
        <div className="hidden lg:flex items-center justify-center py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronRight
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
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
