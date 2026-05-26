import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { motion } from "framer-motion";
import { AccountBalanceWalletRounded, Close, DashboardRounded } from "@mui/icons-material";
import { sidebarGroups } from "../partials/Sidebar";

const dashboardTab = { label: "Dashboard", path: "/" };
const workspaceTabsKey = "workspace-tabs";
const workspaceClosedKey = "workspace-tabs-closed";

const findTabForPath = (pathname) => {
  const normalizedPath = pathname.toLowerCase();
  const menuItem = sidebarGroups
    .flatMap((group) => group.items)
    .find((item) => item.path.toLowerCase() === normalizedPath);

  if (menuItem) return { label: menuItem.label, path: menuItem.path };
  if (pathname === "/") return dashboardTab;

  return {
    label: pathname
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/[-_]+/g, " ") || "Page",
    path: pathname,
  };
};

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = useMemo(() => findTabForPath(location.pathname), [location.pathname]);
  const [workspaceClosed, setWorkspaceClosed] = useState(() => localStorage.getItem(workspaceClosedKey) === "true");
  const [tabs, setTabs] = useState(() => {
    try {
      const savedTabs = JSON.parse(localStorage.getItem(workspaceTabsKey) || "[]");
      const closed = localStorage.getItem(workspaceClosedKey) === "true";
      return closed ? savedTabs : savedTabs.length ? savedTabs : [dashboardTab];
    } catch {
      return [dashboardTab];
    }
  });

  const openWorkspaceTab = (tab) => {
    setWorkspaceClosed(false);
    setTabs((currentTabs) => {
      if (currentTabs.some((item) => item.path === tab.path)) return currentTabs;
      return [...currentTabs, tab];
    });
  };

  useEffect(() => {
    if (workspaceClosed) return;
    setTabs((currentTabs) => {
      if (currentTabs.some((tab) => tab.path === activeTab.path)) return currentTabs;
      return [...currentTabs, activeTab];
    });
  }, [activeTab, workspaceClosed]);

  useEffect(() => {
    const handleWorkspaceOpen = (event) => {
      const tab = event.detail || findTabForPath(window.location.pathname);
      openWorkspaceTab(tab);
    };

    window.addEventListener("workspace-open-path", handleWorkspaceOpen);
    return () => window.removeEventListener("workspace-open-path", handleWorkspaceOpen);
  }, []);

  useEffect(() => {
    localStorage.setItem(workspaceTabsKey, JSON.stringify(tabs));
    localStorage.setItem(workspaceClosedKey, workspaceClosed ? "true" : "false");
  }, [tabs, workspaceClosed]);

  const handleCloseTab = (event, tabPath) => {
    event.preventDefault();
    event.stopPropagation();

    const nextTabs = tabs.filter((tab) => tab.path !== tabPath);
    setTabs(nextTabs);

    if (!nextTabs.length) {
      setWorkspaceClosed(true);
      navigate("/", { replace: true });
    } else if (tabPath === location.pathname) {
      const fallbackTab = nextTabs[nextTabs.length - 1] || dashboardTab;
      navigate(fallbackTab.path);
    }
  };

  const handleOpenDashboard = () => {
    openWorkspaceTab(dashboardTab);
    navigate(dashboardTab.path);
  };

  return (
    <div className="enterprise-shell flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow enterprise-main">
          <div className="w-full max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
            <div className="workspace-tabs" aria-label="Open pages">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) => `workspace-tab ${isActive ? "is-active" : ""}`}
                >
                  <span>{tab.label}</span>
                  <button
                    type="button"
                    className="workspace-tab-close"
                    aria-label={`Close ${tab.label}`}
                    onClick={(event) => handleCloseTab(event, tab.path)}
                  >
                    <Close fontSize="inherit" />
                  </button>
                </NavLink>
              ))}
            </div>
            {workspaceClosed ? (
              <motion.div
                className="workspace-empty-state"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="workspace-empty-icon">
                  <AccountBalanceWalletRounded />
                </div>
                <h2>No screen open</h2>
                <p>Open a module from the sidebar or start again from the dashboard.</p>
                <button type="button" className="workspace-empty-action" onClick={handleOpenDashboard}>
                  <DashboardRounded />
                  <span>Open Dashboard</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
