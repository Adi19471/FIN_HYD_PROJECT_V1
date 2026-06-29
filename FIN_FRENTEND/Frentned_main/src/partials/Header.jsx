import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FullscreenRounded,
  MenuRounded,
  SearchRounded,
  SettingsRounded,
} from "@mui/icons-material";
import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownNotifications.jsx";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import EnterpriseThemePanel from "../components/EnterpriseThemePanel";
import ThemeToggle from "../components/ThemeToggle";
import { useThemeProvider } from "../utils/ThemeContext";
import { COMPANY_ADDRESS, COMPANY_APP_NAME, COMPANY_LOGO } from "src/lib/company";

const routeLabels = {
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

function Header({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { settings } = useThemeProvider();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length) return ["Dashboard"];
    return parts.map((part) => routeLabels[part] || part.replaceAll("_", " ").replaceAll("-", " "));
  }, [location.pathname]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <>
      <header
        className={`enterprise-header ${
          settings.navbarStyle === "solid" ? "enterprise-header-solid" : ""
        }`}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="enterprise-header-icon"
            sx={{ display: { lg: "none" } }}
            aria-label="Open navigation"
          >
            <MenuRounded />
          </IconButton>

          <Link
            to="/"
            className="enterprise-brand enterprise-header-brand"
            aria-label="Sri Balaji Finance dashboard"
          >
            <Box className="enterprise-brand-mark">
              <img src={COMPANY_LOGO} alt="" aria-hidden="true" />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ lineHeight: 1, fontWeight: 850 }}>
                {COMPANY_APP_NAME}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {COMPANY_ADDRESS}
              </Typography>
            </Box>
          </Link>

          <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb}-${index}`}>
                  {index > 0 && <Typography color="text.disabled">/</Typography>}
                  <Typography
                    variant="body2"
                    color={index === breadcrumbs.length - 1 ? "text.primary" : "text.secondary"}
                    sx={{ textTransform: "capitalize", fontWeight: index === breadcrumbs.length - 1 ? 700 : 500 }}
                  >
                    {crumb}
                  </Typography>
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Stack>

        <TextField
          className="enterprise-global-search"
          size="small"
          placeholder="Search pages, ledgers, customers..."
          onClick={() => setSearchModalOpen(true)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip size="small" label="Ctrl K" />
              </InputAdornment>
            ),
          }}
          sx={{ display: { xs: "none", lg: "block" } }}
        />

        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ ml: "auto" }}>
          <Tooltip title="Search">
            <IconButton onClick={() => setSearchModalOpen(true)} aria-label="Open command search">
              <SearchRounded />
            </IconButton>
          </Tooltip>
          <Notifications />
          <Help />
          <Tooltip title="Full screen">
            <IconButton onClick={toggleFullscreen} aria-label="Toggle full screen">
              <FullscreenRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Theme settings">
            <IconButton onClick={() => setSettingsOpen(true)} aria-label="Open theme settings">
              <SettingsRounded />
            </IconButton>
          </Tooltip>
          <ThemeToggle />
          <UserMenu align="right" />
        </Stack>
      </header>

      <SearchModal id="search-modal" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
      <EnterpriseThemePanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

export default Header;
