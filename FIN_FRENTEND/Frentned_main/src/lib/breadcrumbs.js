// Where the app's breadcrumb trail comes from.
//
// The header shows it on screen and every exported/printed report repeats it
// under the app name, so the two must agree. Both read this module rather than
// keeping their own copy of the label table.

import { sidebarGroups } from "src/partials/SidebarConfig";

// Folder segment -> the words a person expects to read.
export const routeLabels = {
  "": "Dashboard",
  AccountsModules: "Accounts",
  AccountMasterSetup: "Account Master",
  Bussiness: "Business",
  Customer: "Customer Reports",
  Loans: "Loans",
  Partners: "Partners",
  Transactions: "Transactions",
  Main_personal_file: "Personal Info",
};

// Screens reached from another screen rather than from the menu.
const pageLabels = {
  "/customer": ["Master Information", "Customers"],
  "/employee": ["Master Information", "Employees"],
  "/partner": ["Master Information", "Partners"],
  "/vendor": ["Master Information", "Vendors"],
  "/monthly-finance": ["Master Information", "Monthly Finance"],
  "/daily-finace": ["Master Information", "Daily Finance"],
  "/accountsmodules/loansdetailes": ["Accounts", "Loan Details"],
};

// Every screen in the menu, as "group / screen" in the menu's own words. A
// path alone gives "BussinessCashBook Main" or "ReciptLedger"; the menu calls
// those screens "Business Cash Book" and "Receipt Ledger", and so does this.
const menuLabels = Object.fromEntries(
  sidebarGroups.flatMap((group) => group.items.map((item) => [item.path.toLowerCase(), [group.label, item.label]]))
);

/** "/Customer/Customer_Dues" -> ["Customer Reports", "Customer Dues"] */
export const breadcrumbsFor = (pathname = "") => {
  const parts = String(pathname).split("/").filter(Boolean);
  if (!parts.length) return ["Dashboard"];

  const key = `/${parts.join("/")}`.toLowerCase();
  const known = menuLabels[key] || pageLabels[key];
  if (known) return known;

  return parts.map(
    (part) => routeLabels[part] || part.replaceAll("_", " ").replaceAll("-", " ")
  );
};

/** The trail for the page on screen, for code that has no router context. */
export const currentBreadcrumbs = () =>
  typeof window === "undefined" ? [] : breadcrumbsFor(window.location.pathname);

/** "Customer Reports / Customer Dues" */
export const breadcrumbTrail = (crumbs) => {
  const list = Array.isArray(crumbs) ? crumbs : currentBreadcrumbs();
  return list.filter(Boolean).join(" / ");
};
