import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Close,
  ExpandMore,
  Home,
} from "@mui/icons-material";

import ThemeToggle from "../components/ThemeToggle";
import { COMPANY_ADDRESS, COMPANY_APP_NAME, COMPANY_LOGO } from "src/lib/company";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess, PATH_PERMISSION_CODES } from "src/utils/permissions";
import { BREAKPOINTS } from "src/utils/breakpoints";
import { sidebarGroups } from "./SidebarConfig";
import "./Sidebar.css";

const tabletQuery = () => `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 0.02}px)`;

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const hasStoredPreference = storedSidebarExpanded !== null;
  const [sidebarExpanded, setSidebarExpanded] = useState(() =>
    hasStoredPreference
      ? storedSidebarExpanded === "true"
      : typeof window === "undefined" || !window.matchMedia(tabletQuery()).matches
  );
  // Tracks whether the current value came from an explicit user click, so
  // viewport-driven auto-collapse (tablets) never gets mistaken for - or
  // permanently overwrites - a real preference in localStorage.
  const userOverrideRef = useRef(hasStoredPreference);
  const [openGroup, setOpenGroup] = useState(null);

  const pathnameLower = pathname.toLowerCase();

  const visibleGroups = useMemo(
    () =>
      sidebarGroups
        .filter((group) => group.key !== "auth")
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => hasPermissionAccess(user, PATH_PERMISSION_CODES[item.path])),
        }))
        .filter((group) => group.items.length > 0),
    [user]
  );

  const canViewDashboard = hasPermissionAccess(user, PATH_PERMISSION_CODES["/"]);

  const activeGroup = useMemo(
    () => visibleGroups.find((group) => group.match.some((path) => pathnameLower.startsWith(path))),
    [pathnameLower, visibleGroups]
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
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Persist ONLY explicit user choices - never a viewport-driven auto-collapse.
  useEffect(() => {
    if (!userOverrideRef.current) return;
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Live tablet-viewport default (collapsed) while the user hasn't overridden it yet.
  useEffect(() => {
    if (userOverrideRef.current) return;
    const mql = window.matchMedia(tabletQuery());
    const applyDefault = () => setSidebarExpanded(!mql.matches);
    applyDefault();
    mql.addEventListener("change", applyDefault);
    return () => mql.removeEventListener("change", applyDefault);
  }, []);

  const handleGroupToggle = useCallback(
    (groupName) => {
      setOpenGroup((prev) => (prev === groupName ? null : groupName));
      if (!sidebarExpanded) {
        userOverrideRef.current = true;
        setSidebarExpanded(true);
      }
    },
    [sidebarExpanded]
  );

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  const handleSidebarExpand = useCallback(() => {
    userOverrideRef.current = true;
    setSidebarExpanded(!sidebarExpanded);
  }, [sidebarExpanded]);

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
          {canViewDashboard && (
            <NavLink
              to="/"
              target="_blank"
              className={({ isActive }) => `admin-sidebar-link ${isActive ? "is-active" : ""}`}
              title="Dashboard"
            >
              <Home className="admin-sidebar-icon" />
              <span>Dashboard</span>
            </NavLink>
          )}

          {visibleGroups.map((group) => {
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
                          target="_blank"
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
