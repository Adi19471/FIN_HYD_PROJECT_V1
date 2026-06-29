import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import { CalendarMonthRounded, TodayRounded } from "@mui/icons-material";
import LoadingSpinner from "src/LoadingSpinner";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess } from "src/utils/permissions";

const MonthlyFinance = lazy(() => import("./MonthlyFinance/MonthlyFinance"));
const DailyFinance = lazy(() => import("./DailyFinance/DailyFinace"));

const FinanceTabs = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(
    () =>
      [
        { label: "Daily", icon: <TodayRounded fontSize="small" />, component: DailyFinance, permissionCodes: ["LOAN_MAIN_VIEW", "DAILY_FINANCE_VIEW"] },
        { label: "Monthly", icon: <CalendarMonthRounded fontSize="small" />, component: MonthlyFinance, permissionCodes: ["LOAN_MAIN_VIEW", "MONTHLY_FINANCE_VIEW"] },
      ].filter((tab) => hasPermissionAccess(user, tab.permissionCodes)),
    [user]
  );

  useEffect(() => {
    if (activeTab >= tabs.length) setActiveTab(0);
  }, [activeTab, tabs.length]);

  const SelectedComponent = tabs[activeTab]?.component;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f1f5f9",
        p: { xs: 0, md: 0 },
      }}
    >
      {/* Main Card */}
      <Paper
        elevation={0}
        className="enterprise-card"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: { xs: 2, md: 2.5 },
            py: 1.5,
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Loans
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleChange}
            sx={{
              minHeight: 40,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 2,
                background: theme.palette.primary.main,
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                icon={tab.icon}
                iconPosition="start"
                label={
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 850,
                      textTransform: "capitalize",
                    }}
                  >
                    {tab.label}
                  </Typography>
                }
                sx={{
                  minHeight: 40,
                  px: 3,
                  borderRadius: 2,
                  transition: "0.25s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            minHeight: "60vh",
          }}
        >
<Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                <LoadingSpinner />
              </Box>
            }
          >
            <AnimatePresence mode="wait">
              {SelectedComponent && (
                <motion.div
                  key={tabs[activeTab]?.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SelectedComponent />
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>
        </Box>
      </Paper>
    </Box>
  );
};

export default FinanceTabs;
