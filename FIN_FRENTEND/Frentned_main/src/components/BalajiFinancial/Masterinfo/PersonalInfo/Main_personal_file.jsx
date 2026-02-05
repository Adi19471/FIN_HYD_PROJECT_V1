import React, { useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Person, Work, Groups, Storefront } from "@mui/icons-material";

import Customer from "./Custmer/Custmer"; // ← fix typo if needed: Customer
import Partner from "./Partner/Partner";
import Employee from "./Employe/Employe"; // ← typo: Employee
import Vendor from "./Vender/Vender";     // ← typo: Vendor

import LoadingSpinner from "../../../../LoadingSpinner";

const MainPersonalFile = () => {
  const theme = useTheme();

  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setLoading(true);
    // You can remove timeout in production if content is fast
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  };

  // Modern color palette (you can move to theme)
  const colors = useMemo(
    () => ({
      bgDark: "#0f172a",           // slate-950
      bgPaper: "#1e293b",          // slate-800
      active: "#2dd4bf",           // teal-400
      inactive: "#94a3b8",         // slate-400
      indicator: "#60a5fa",        // blue-400
      hover: alpha("#2dd4bf", 0.12),
      border: alpha("#e2e8f0", 0.08),
    }),
    []
  );

  const tabs = [
    { label: "CUSTOMER", icon: <Person fontSize="medium" />, component: Customer, type: "CUSTOMER" },
    { label: "EMPLOYEE", icon: <Work fontSize="medium" />,  component: Employee, type: "EMPLOYEE" },
    { label: "PARTNER",  icon: <Groups fontSize="medium" />,component: Partner,  type: "PARTNER" },
    { label: "VENDOR",   icon: <Storefront fontSize="medium" />, component: Vendor, type: "VENDOR" },
  ];

  const SelectedComponent = tabs[value]?.component || (() => null);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100", // #f1f5f9 or use theme.palette.grey[100]
      
       
      }}
    >
      {/* Main Card Container */}
      <Paper
        elevation={4}
        sx={{
        
          overflow: "hidden",
          bgcolor: colors.bgDark,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          border: `1px solid ${colors.border}`,
          backdropFilter: "blur(6px)", // light glass effect
        }}
      >
        

        {/* Tabs – modern look */}
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            bgcolor: colors.bgPaper,
            minHeight: 72,
            "& .MuiTabs-indicator": {
              height: 4,
              backgroundColor: colors.indicator,
              
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              iconPosition="start"
              label={
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  fontSize={{ xs: "0.9rem", sm: "1rem" }}
                  letterSpacing={0.8}
                  sx={{ textTransform: "uppercase" }}
                >
                  {tab.label}
                </Typography>
              }
              sx={{
                minHeight: 72,
                color: value === index ? colors.active : colors.inactive,
                transition: "all 0.25s ease",
                "&:hover": {
                  color: colors.active,
                  bgcolor: colors.hover,
                },
                "&.Mui-selected": {
                  color: colors.active,
                  bgcolor: alpha(colors.active, 0.08),
                },
                gap: 1.2,
                px: { xs: 1.5, sm: 3, md: 5 },
              }}
            />
          ))}
        </Tabs>

        {/* Content Area */}
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: "background.paper", // white / light for contrast
            minHeight: "50vh",
          
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <LoadingSpinner />
            </Box>
          ) : (
            <SelectedComponent personType={tabs[value].type} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MainPersonalFile;