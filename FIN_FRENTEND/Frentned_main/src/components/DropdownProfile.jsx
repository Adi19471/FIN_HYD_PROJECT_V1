import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDownRounded,
  LogoutRounded,
  ManageAccountsRounded,
  PersonRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { useAuth } from "../utils/authStore";

function DropdownProfile({ align }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const open = Boolean(anchorEl);
  const userName = user?.name || "admin";
  const userRole = user?.role || "User";
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const closeMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    closeMenu();
    try {
      logout();
    } catch (error) {
      console.log(error);
    }
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Tooltip title="Account">
        <Box
          component="button"
          type="button"
          className="enterprise-profile-trigger"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar className="enterprise-profile-avatar">{initials || <PersonRounded fontSize="small" />}</Avatar>
          <KeyboardArrowDownRounded className={`enterprise-profile-chevron ${open ? "is-open" : ""}`} />
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: align === "right" ? "right" : "left" }}
        transformOrigin={{ vertical: "top", horizontal: align === "right" ? "right" : "left" }}
        slotProps={{
          paper: {
            className: "enterprise-profile-menu",
          },
        }}
      >
        <Box className="enterprise-profile-menu-head">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar className="enterprise-profile-avatar large">{initials || <PersonRounded />}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {userRole}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <MenuItem onClick={() => { closeMenu(); navigate("/settings"); }}>
          <ListItemIcon>
            <SettingsRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings"  />
        </MenuItem>

        <MenuItem onClick={() => { closeMenu(); navigate("/AccountMasterSetup/Registraion_creation"); }}>
          <ListItemIcon>
            <ManageAccountsRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="User Management" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} className="enterprise-profile-signout">
          <ListItemIcon>
            <LogoutRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default DropdownProfile;
