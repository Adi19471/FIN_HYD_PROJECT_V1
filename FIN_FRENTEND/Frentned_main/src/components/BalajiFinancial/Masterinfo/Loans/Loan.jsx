import React, { useState, lazy, Suspense } from "react";
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

import { MdCalendarToday, MdCalendarMonth } from "react-icons/md";
import LoadingSpinner from "src/LoadingSpinner";

const MonthlyFinance = lazy(() => import("./MonthlyFinance/MonthlyFinance"));
const DailyFinance = lazy(() => import("./DailyFinance/DailyFinace"));

const FinanceTabs = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Daily", icon: <MdCalendarToday size={18} /> },
    { label: "Monthly", icon: <MdCalendarMonth size={18} /> },
  ];

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
        elevation={6}
        sx={{
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.6,
            }}
          >
            Personal Accounts
          </Typography>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleChange}
            sx={{
              minHeight: 40,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 2,
                background:
                  "linear-gradient(90deg,#3b82f6,#06b6d4)",
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
                      fontWeight: 600,
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
            p: { xs: 2, md: 3 },
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
              {activeTab === 0 && (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DailyFinance />
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div
                  key="monthly"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MonthlyFinance />
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