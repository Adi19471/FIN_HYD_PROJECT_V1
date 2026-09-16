// Where the app's breadcrumb trail comes from.
//
// The header shows it on screen and every exported/printed report repeats it
// under the app name, so the two must agree. Both read this module rather than
// keeping their own copy of the label table.

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

/** "/Customer/Customer_Dues" -> ["Customer Reports", "Customer Dues"] */
export const breadcrumbsFor = (pathname = "") => {
  const parts = String(pathname).split("/").filter(Boolean);
  if (!parts.length) return ["Dashboard"];
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
