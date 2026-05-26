import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AccountBalance,
  AccountBalanceWallet,
  AccountCircle,
  AccountTree,
  Assessment,
  AssignmentInd,
  Badge,
  Business,
  BusinessCenter,
  Calculate,
  CheckCircle,
  ChevronRight,
  Close,
  Construction,
  CreditScore,
  DashboardCustomize,
  DeleteForever,
  Description,
  ExpandMore,
  FlashOn,
  FolderSpecial,
  Home,
  Info,
  Insights,
  Inventory,
  Login,
  ManageAccounts,
  MonetizationOn,
  Paid,
  Payment,
  People,
  Person,
  PointOfSale,
  ReceiptLong,
  Savings,
  Send,
  SettingsApplications,
  Summarize,
  SwapHoriz,
  Today,
  TrendingUp,
  Wallet,
} from "@mui/icons-material";

import ThemeToggle from "../components/ThemeToggle";
import { COMPANY_ADDRESS, COMPANY_APP_NAME, COMPANY_LOGO } from "src/lib/company";
import "./Sidebar.css";

export const sidebarGroups = [
  {
    key: "master",
    label: "Master Info",
    icon: ManageAccounts,
    match: ["/main_personal_file", "/loan", "/customer", "/employee", "/partner", "/vendor"],
    items: [
      { label: "Personal Info", path: "/Main_personal_file", icon: Badge },
      { label: "Loans", path: "/Loan", icon: CreditScore },
    ],
  },
  {
    key: "transactions",
    label: "Transactions",
    icon: PointOfSale,
    match: ["/bussinesscashbook_main", "/transactions"],
    items: [
      { label: "Business Cash Book", path: "/BussinessCashBook_Main", icon: Wallet },
      { label: "Quick Cash Book", path: "/Transactions/Quick_Cash_Book", icon: Paid },
      { label: "Cashbook", path: "/Transactions/Cashbook", icon: ReceiptLong },
      { label: "Delete Transaction", path: "/Transactions/Deleete_Transaction", icon: DeleteForever, danger: true },
    ],
  },
  {
    key: "accounts",
    label: "Accounts",
    icon: AccountBalance,
    match: ["/accountsmodules", "/loans/"],
    items: [
      { label: "Loans Main", path: "/AccountsModules/LoansMainpage", icon: Savings },
      { label: "Daily Book", path: "/AccountsModules/DailyBook", icon: Today },
      { label: "CB Ledger", path: "/AccountsModules/Cbledger", icon: Calculate },
      { label: "Account Ledger", path: "/AccountsModules/AccountLedger", icon: ReceiptLong },
      { label: "Account Master Ledger", path: "/AccountsModules/AccountMasterLedger", icon: FolderSpecial },
      { label: "User Collection Ledger", path: "/AccountsModules/Usercollectionledger", icon: People },
      { label: "Receipt Ledger", path: "/AccountsModules/ReciptLedger", icon: Description },
      { label: "Distributed Loans", path: "/Loans/Distubuted", icon: Send },
      { label: "Instalment Dues", path: "/Loans/InstalmentDues", icon: Payment },
      { label: "Maturity", path: "/Loans/Maturity", icon: CheckCircle },
    ],
  },
  {
    key: "accountMaster",
    label: "Account Master",
    icon: SettingsApplications,
    match: ["/accountmastersetup"],
    items: [
      { label: "Account Setup", path: "/AccountMasterSetup/Account_Master_Setup", icon: SettingsApplications },
      { label: "User Registration", path: "/AccountMasterSetup/Registraion_creation", icon: AssignmentInd },
    ],
  },
  {
    key: "business",
    label: "Business",
    icon: BusinessCenter,
    match: ["/bussiness/"],
    items: [
      { label: "Revenue Expense Statement", path: "/Bussiness/RevenueExpenseStatment", icon: Insights },
      { label: "Balance Sheet", path: "/Bussiness/BalanceSheetimport", icon: AccountBalance },
      { label: "Business Overview", path: "/Bussiness/BussinessOverviewimport", icon: DashboardCustomize },
      { label: "Collection Reports", path: "/Bussiness/BussinessCollectionReportsimport", icon: Assessment },
    ],
  },
  {
    key: "customer",
    label: "Customer Reports",
    icon: Person,
    match: ["/customer/"],
    items: [
      { label: "Customer Dues", path: "/Customer/Customer_Dues", icon: Payment },
      { label: "Outstanding", path: "/Customer/Customer_Outstanding", icon: AccountBalanceWallet },
      { label: "Customer Report", path: "/Customer/Customer_Report", icon: Summarize },
      { label: "Transactions", path: "/Customer/Customer_Transactions", icon: ReceiptLong },
    ],
  },
  {
    key: "partners",
    label: "Partners",
    icon: Business,
    match: ["/partners/"],
    items: [
      { label: "Business Reports", path: "/Partners/Bussiness_Reports", icon: Assessment },
      { label: "Group Business Details", path: "/Partners/Group_Bussiness_Details", icon: Inventory },
      { label: "Group Business", path: "/Partners/Group_Bussiness", icon: AccountTree },
      { label: "Installment Dues", path: "/Partners/Installment_Dues", icon: Payment },
      { label: "Partner Loan Limit", path: "/Partners/Partner_Loan_Limit", icon: Savings },
      { label: "Partner Settlement", path: "/Partners/Partner_Settelment", icon: CheckCircle },
      { label: "Partner Information", path: "/Partners/Partner_Infoamtion", icon: People },
      { label: "Performance", path: "/Partners/Performance", icon: TrendingUp },
    ],
  },
  {
    key: "auth",
    label: "Authentication",
    icon: AccountCircle,
    match: ["/login"],
    items: [{ label: "Sign In", path: "/login", icon: Login }],
  },
];

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { pathname } = useLocation();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === "true"
  );
  const [openGroup, setOpenGroup] = useState(null);

  const pathnameLower = pathname.toLowerCase();

  const activeGroup = useMemo(
    () => sidebarGroups.find((group) => group.match.some((path) => pathnameLower.startsWith(path))),
    [pathnameLower]
  );

  useEffect(() => {
    if (pathname === "/") {
      setOpenGroup(null);
    } else if (activeGroup) {
      setOpenGroup(activeGroup.key);
    }
  }, [activeGroup, pathname]);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  const handleGroupToggle = useCallback(
    (groupName) => {
      setOpenGroup((prev) => (prev === groupName ? null : groupName));
      if (!sidebarExpanded) setSidebarExpanded(true);
    },
    [sidebarExpanded]
  );

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  const handleSidebarExpand = useCallback(() => {
    setSidebarExpanded(!sidebarExpanded);
  }, [sidebarExpanded]);

  const announceWorkspaceOpen = useCallback((tab) => {
    window.dispatchEvent(new CustomEvent("workspace-open-path", { detail: tab }));
  }, []);

  return (
    <div className="admin-sidebar-wrap">
      <div className={`admin-sidebar-backdrop ${sidebarOpen ? "is-open" : ""}`} aria-hidden="true" />

      <aside
        id="sidebar"
        ref={sidebar}
        className={`admin-sidebar ${sidebarOpen ? "is-open" : ""} ${sidebarExpanded ? "is-expanded" : "is-collapsed"}`}
      >
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">
            <img src={COMPANY_LOGO} alt="" aria-hidden="true" />
          </div>
          <div className="admin-sidebar-brand-text">
            <strong>{COMPANY_APP_NAME}</strong>
            <span>{COMPANY_ADDRESS}</span>
          </div>
          <button ref={trigger} type="button" className="admin-sidebar-close" onClick={handleSidebarToggle} aria-label="Close navigation">
            <Close />
          </button>
        </div>

        <div className="admin-sidebar-section-label">Main Menu</div>

        <nav className="admin-sidebar-nav">
          <NavLink
            to="/"
            onClick={() => announceWorkspaceOpen({ label: "Dashboard", path: "/" })}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? "is-active" : ""}`}
            title="Dashboard"
          >
            <Home className="admin-sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>

          {sidebarGroups.map((group) => {
            const Icon = group.icon;
            const isOpen = openGroup === group.key;
            const isGroupActive = activeGroup?.key === group.key;

            return (
              <div className="admin-sidebar-group" key={group.key}>
                <button
                  type="button"
                  className={`admin-sidebar-group-button ${isOpen ? "is-open" : ""} ${isGroupActive ? "is-active" : ""}`}
                  onClick={() => handleGroupToggle(group.key)}
                  title={group.label}
                >
                  <Icon className="admin-sidebar-icon" />
                  <span>{group.label}</span>
                  <ExpandMore className="admin-sidebar-chevron" />
                </button>

                {isOpen && (
                  <div className="admin-sidebar-subnav">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => announceWorkspaceOpen({ label: item.label, path: item.path })}
                          title={item.label}
                          className={({ isActive }) =>
                            `admin-sidebar-sublink ${isActive ? "is-active" : ""} ${item.danger ? "is-danger" : ""}`
                          }
                        >
                          <ItemIcon className="admin-sidebar-subicon" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleSidebarExpand}
            className="admin-sidebar-collapse"
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronRight className={sidebarExpanded ? "is-expanded" : ""} />
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
