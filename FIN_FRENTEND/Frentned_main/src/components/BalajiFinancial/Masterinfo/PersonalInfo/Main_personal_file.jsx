import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { BadgeRounded, ContactsRounded, HandshakeRounded, StoreRounded } from "@mui/icons-material";

import LoadingSpinner from "../../../../LoadingSpinner";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess } from "src/utils/permissions";


// Lazy load each tab's component for faster initial page load
const Customer = lazy(() => import("./Custmer/Custmer"));
const PartnerComponent = lazy(() => import("./Partner/Partner"));
const Employee = lazy(() => import("./Employe/Employe"));
const Vendor = lazy(() => import("./Vender/Vender"));

const MainPersonalFile = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const colors = useMemo(
    () => ({
      active: "#2563eb",
      inactive: "#64748b",
      indicator: "#2563eb",
      hover: alpha("#2563eb", 0.08),
    }),
    []
  );

  const tabs = useMemo(
    () =>
      [
        { label: "CUSTOMER", icon: <ContactsRounded />, component: Customer, type: "CUSTOMER", permissionCodes: ["CUSTOMER_VIEW"] },
        { label: "EMPLOYEE", icon: <BadgeRounded />, component: Employee, type: "EMPLOYEE", permissionCodes: ["EMPLOYEE_VIEW"] },
        { label: "PARTNER", icon: <HandshakeRounded />, component: PartnerComponent, type: "PARTNER", permissionCodes: ["PARTNER_VIEW"] },
        { label: "VENDOR", icon: <StoreRounded />, component: Vendor, type: "VENDOR", permissionCodes: ["VENDOR_VIEW"] },
      ].filter((tab) => hasPermissionAccess(user, tab.permissionCodes)),
    [user]
  );

  useEffect(() => {
    if (value >= tabs.length) setValue(0);
  }, [tabs.length, value]);

  const SelectedComponent = tabs[value]?.component || (() => null);

  return (
    <Box
      sx={{
        p: { xs: 0, md: 1 },
        bgcolor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >

  
      {/* Paper Card */}
      <Paper
        elevation={6}
        sx={{
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <Box >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                backgroundColor: colors.indicator,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.label}
                icon={tab.icon}
                iconPosition="start"
                label={
                  <Typography fontWeight={600} fontSize="0.95rem">
                    {tab.label}
                  </Typography>
                }
                sx={{
                  py: 2,
                  color: value === index ? colors.active : colors.inactive,
                  "&.Mui-selected": {
                    color: colors.active,
                  },
                  "&:hover": {
                    bgcolor: colors.hover,
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            minHeight: "55vh",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <LoadingSpinner />
            </Box>
          ) : (
            tabs[value] && <SelectedComponent personType={tabs[value].type} />
          )}
        
        </Box>
      </Paper>
    </Box>
  );
};

export default MainPersonalFile;
