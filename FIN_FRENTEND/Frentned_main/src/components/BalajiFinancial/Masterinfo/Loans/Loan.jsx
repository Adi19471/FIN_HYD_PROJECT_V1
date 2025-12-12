import React, { useState, lazy, Suspense } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

// Icons
import { MdCalendarToday, MdCalendarMonth } from "react-icons/md";

// Lazy-loaded pages
const MonthlyFinance = lazy(() => import("./MonthlyFinance/MonthlyFinance"));
const DailyFinance = lazy(() => import("./DailyFinance/DailyFinace"));

const Loan = () => {
  const [activeTab, setActiveTab] = useState("daily");

  const tabs = [
    { id: "daily", label: "DAILY", icon: <MdCalendarToday size={18} /> },
    { id: "monthly", label: "MONTHLY", icon: <MdCalendarMonth size={18} /> },
  ];

  return (
    <Box sx={{ p: 0 }}>
      {/* FULL-WIDTH DARK TAB BAR */}
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          bgcolor: "#0b1324",
          borderRadius: "8px",
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT — HEADING BUTTON */}
        <Box
          component="button"
          onClick={() => console.log("Heading clicked")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "14px",
              color: "warning.main",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Personal Accounts
          </Typography>
        </Box>

        {/* RIGHT — TABS */}
        <Box sx={{ display: "flex",  }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  color: isActive ? "#2ee6bb" : "#8ea2b8",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "15px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {/* Icon + Label */}
                {tab.icon}
                <Typography variant="body1">{tab.label}</Typography>

                {/* Animated Underline */}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    style={{
                      position: "absolute",
                      bottom: -6,
                      left: 0,
                      right: 0,
                      height: "3px",
                      backgroundColor: "#4da3ff",
                      borderRadius: "2px",
                    }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* CONTENT */}
      <Suspense fallback={<Typography sx={{ mt: 1 }}>Loading...</Typography>}>
        {activeTab === "daily" && <DailyFinance />}
        {activeTab === "monthly" && <MonthlyFinance />}
      </Suspense>
    </Box>
  );
};

export default Loan;
