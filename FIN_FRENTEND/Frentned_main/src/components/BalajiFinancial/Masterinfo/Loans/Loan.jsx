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
import { motion } from "framer-motion";

// Icons
import { MdCalendarToday, MdCalendarMonth } from "react-icons/md";

// Lazy-loaded views
const MonthlyFinance = lazy(() => import("./MonthlyFinance/MonthlyFinance"));
const DailyFinance = lazy(() => import("./DailyFinance/DailyFinace")); // ← typo? DailyFinance

const FinanceTabs = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "DAILY", icon: <MdCalendarToday size={20} /> },
    { label: "MONTHLY", icon: <MdCalendarMonth size={20} /> },
  ];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", p: { xs: 1, md: 2 } }}>
      {/* Modern Dark Tab Bar */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "#0b1324", // deep navy
          border: `1px solid ${alpha("#ffffff", 0.06)}`,
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        }}
      >
        {/* Header + Tabs Container */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
            py: 1.5,
            borderBottom: `1px solid ${alpha("#ffffff", 0.08)}`,
          }}
        >
          {/* Heading (clickable if needed) */}
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
              fontWeight: 700,
              color: "warning.main",
              letterSpacing: 1.1,
              textTransform: "uppercase",
              cursor: "pointer",
              userSelect: "none",
              "&:hover": { color: "warning.light" },
            }}
            onClick={() => console.log("Personal Accounts clicked")}
          >
            Personal Accounts
          </Typography>

          {/* Tabs – using MUI Tabs with custom indicator */}
          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="standard"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 48,
              "& .MuiTabs-indicator": { display: "none" }, // hide default indicator
              "& .MuiTabs-flexContainer": {
                gap: { xs: 1, sm: 2 },
              },
            }}
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;

              return (
                <Tab
                  key={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        color: isActive ? "#2ee6bb" : "#93a4b8",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {tab.label}
                    </Typography>
                  }
                  sx={{
                    minHeight: 48,
                    px: { xs: 2, sm: 3 },
                    py: 1,
                    borderRadius: 1.5,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: alpha("#2ee6bb", 0.08),
                      color: "#2ee6bb !important",
                    },
                    position: "relative",
                    overflow: "hidden",
                  }}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Animated Underline – shared layout across tabs */}
        <Box sx={{ position: "relative", height: 4 }}>
          <motion.div
            layoutId="active-underline"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            style={{
              position: "absolute",
              bottom: 0,
              height: "100%",
              background: "linear-gradient(90deg, #4da3ff, #60a5fa)",
              borderRadius: "4px 4px 0 0",
              zIndex: 1,
            }}
          />
        </Box>
      </Paper>

      {/* Content Area */}
      <Box sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Suspense
          fallback={
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography color="text.secondary">Loading finance data...</Typography>
            </Box>
          }
        >
          {activeTab === 0 && <DailyFinance />}
          {activeTab === 1 && <MonthlyFinance />}
        </Suspense>
      </Box>
    </Box>
  );
};

export default FinanceTabs;