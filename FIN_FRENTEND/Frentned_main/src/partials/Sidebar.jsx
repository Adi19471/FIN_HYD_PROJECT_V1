import React, { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { actionIcons } from "src/lib/icons";

import ThemeToggle from "../components/ThemeToggle";
import { useBranding, useThemeProvider } from "src/utils/ThemeContext";
import { BREAKPOINTS } from "src/utils/breakpoints";
import { dashboardIcon as DashboardIcon } from "./SidebarConfig";
import useNavGroups from "./useNavGroups";

// Chrome for the sidebar itself comes from the shared action set, so the
// close / expand / collapse marks match every other screen.
const CloseIcon = actionIcons.close;
const ExpandIcon = actionIcons.expand;
const CollapseToggleIcon = actionIcons.scrollRight;
import "./Sidebar.css";

const tabletQuery = () => `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 0.02}px)`;

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { pathname, visibleGroups, activeGroup, canViewDashboard } = useNavGroups();
  const { settings, updateThemeSetting } = useThemeProvider();
  const { appName, tagline, logo } = useBranding();
  const trigger = useRef(null);
  const sidebar = useRef(null);

  // Settings > Layout. Overlay and Horizontal take the sidebar off the page:
  // it is then a drawer over the content (style rules in Sidebar.css), always
  // drawn in full. Static and Mini are the sidebar expanded and collapsed.
  const navLayout = settings.navLayout;
  const offCanvas = navLayout === "overlay" || navLayout === "horizontal";

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const hasStoredPreference = storedSidebarExpanded !== null;
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (navLayout === "mini") return false;
    return hasStoredPreference
      ? storedSidebarExpanded === "true"
      : typeof window === "undefined" || !window.matchMedia(tabletQuery()).matches;
  });
  // Tracks whether the current value came from an explicit user click, so
  // viewport-driven auto-collapse (tablets) never gets mistaken for - or
  // permanently overwrites - a real preference in localStorage. Mini chosen
  // in Settings is such a preference too.
  const userOverrideRef = useRef(hasStoredPreference || navLayout === "mini");
  const [openGroup, setOpenGroup] = useState(null);

  // Expanding or collapsing by hand is the same choice as Static / Mini in
  // Settings, so the two are kept as one: the panel shows what is on screen.
  const setExpandedByUser = useCallback(
    (expanded) => {
      userOverrideRef.current = true;
      setSidebarExpanded(expanded);
      if (!offCanvas) updateThemeSetting("navLayout", expanded ? "static" : "mini");
    },
    [offCanvas, updateThemeSetting]
  );

  // ...and picking Static or Mini in Settings moves the sidebar.
  const lastLayoutRef = useRef(navLayout);
  useEffect(() => {
    if (lastLayoutRef.current === navLayout) return;
    lastLayoutRef.current = navLayout;
    if (navLayout !== "static" && navLayout !== "mini") return;
    userOverrideRef.current = true;
    setSidebarExpanded(navLayout === "static");
  }, [navLayout]);

  // The drawer has done its job once a page is chosen.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

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
      if (!sidebarExpanded && !offCanvas) setExpandedByUser(true);
    },
    [sidebarExpanded, offCanvas, setExpandedByUser]
  );

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  const handleSidebarExpand = useCallback(() => {
    setExpandedByUser(!sidebarExpanded);
  }, [sidebarExpanded, setExpandedByUser]);

  return (
    <div className="admin-sidebar-wrap">
      <div className={`admin-sidebar-backdrop ${sidebarOpen ? "is-open" : ""}`} aria-hidden="true" />

      <aside
        id="sidebar"
        ref={sidebar}
        className={`admin-sidebar ${sidebarOpen ? "is-open" : ""} ${offCanvas || sidebarExpanded ? "is-expanded" : "is-collapsed"}`}
      >
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">
            <img src={logo} alt="" aria-hidden="true" />
          </div>
          <div className="admin-sidebar-brand-text">
            <strong>{appName}</strong>
            <span>{tagline}</span>
          </div>
          <button ref={trigger} type="button" className="admin-sidebar-close" onClick={handleSidebarToggle} aria-label="Close navigation">
            <CloseIcon />
          </button>
        </div>

        <div className="admin-sidebar-section-label">Main Menu</div>

        <nav className="admin-sidebar-nav">
          {canViewDashboard && (
            <NavLink
              to="/"
              className={({ isActive }) => `admin-sidebar-link ${isActive ? "is-active" : ""}`}
              title="Dashboard"
            >
              <DashboardIcon className="admin-sidebar-icon" />
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
                  <ExpandIcon className="admin-sidebar-chevron" />
                </button>

                {isOpen && (
                  <div className="admin-sidebar-subnav">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
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
            <CollapseToggleIcon className={sidebarExpanded ? "is-expanded" : ""} />
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
