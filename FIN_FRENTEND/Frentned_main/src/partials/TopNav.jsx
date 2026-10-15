import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { actionIcons } from "src/lib/icons";
import { dashboardIcon as DashboardIcon } from "./SidebarConfig";
import useNavGroups from "./useNavGroups";

const ExpandIcon = actionIcons.expand;

/**
 * The menu laid across the top, under the top bar - the Horizontal layout in
 * Settings > Layout. Same groups, same permission filter and same colours as
 * the sidebar (useNavGroups, --sidebar-* tokens); each group opens a drop-down
 * of its pages. Desktop only: on a phone the menu is the drawer, as always.
 */
function TopNav() {
  const { pathname, visibleGroups, activeGroup, canViewDashboard } = useNavGroups();
  const [anchorEl, setAnchorEl] = useState(null);
  // Kept after the menu closes, so its entries are still there while it fades out.
  const [openKey, setOpenKey] = useState(null);

  const menuOpen = Boolean(anchorEl);
  const openGroup = visibleGroups.find((group) => group.key === openKey);
  const closeMenu = () => setAnchorEl(null);

  return (
    <nav className="enterprise-topnav" aria-label="Main menu">
      {canViewDashboard && (
        <NavLink to="/" end className={({ isActive }) => `enterprise-topnav-item ${isActive ? "is-active" : ""}`}>
          <DashboardIcon className="enterprise-topnav-icon" />
          <span>Dashboard</span>
        </NavLink>
      )}

      {visibleGroups.map((group) => {
        const Icon = group.icon;
        const isOpen = menuOpen && openKey === group.key;
        return (
          <button
            key={group.key}
            type="button"
            className={`enterprise-topnav-item ${activeGroup?.key === group.key ? "is-active" : ""} ${isOpen ? "is-open" : ""}`}
            onClick={(event) => {
              setOpenKey(group.key);
              setAnchorEl(event.currentTarget);
            }}
            aria-haspopup="menu"
            aria-expanded={isOpen ? "true" : undefined}
          >
            <Icon className="enterprise-topnav-icon" />
            <span>{group.label}</span>
            <ExpandIcon className="enterprise-topnav-chevron" />
          </button>
        );
      })}

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { className: "enterprise-topnav-menu" } }}
      >
        {(openGroup?.items || []).map((item) => {
          const ItemIcon = item.icon;
          return (
            <MenuItem
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={closeMenu}
              selected={pathname === item.path}
              className={item.danger ? "is-danger" : ""}
            >
              <ListItemIcon>
                <ItemIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          );
        })}
      </Menu>
    </nav>
  );
}

export default TopNav;
