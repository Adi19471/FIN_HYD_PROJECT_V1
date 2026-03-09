import React, { useState } from "react";
import { Paper, Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import { MdCalendarToday, MdCalendarMonth } from "react-icons/md";

import BussinessDailyFinance from "./Bussiness_DailyFinance/BussinessDailyFinance";
import BussinessMonthlyFinance from "./Bussiness_MonthlyFinance/Bussiness_MonthlyFinance";

const BussinessCashbook_Main = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setLoading(true);
    setValue(newValue);
    // Simulate loading delay for tab switch
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <Box position="relative">
      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            borderRadius: 1,
          }}
        >
          <CircularProgress size={50} thickness={4} />
        </Box>
      )}

      {/* MAIN BAR */}
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          bgcolor: "#0d1528",
          borderRadius: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          p: 1,
          gap: 1,
        }}
      >

        {/* ⭐ LEFT SIDE: TITLE ⭐ */}
        <Typography
          sx={{
            fontSize: "15px",
            color: "white",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Transactions
        </Typography>

        {/* ⭐ RIGHT SIDE: TABS ⭐ */}
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#4da3ff",
              height: 2,
              borderRadius: "2px",
            },
          }}
        >
          <Tab
            icon={<MdCalendarToday size={20} />}
            iconPosition="start"
            label="DAILY"
            sx={{
              color: value === 0 ? "#2ee6bb" : "#8fa1b7",
              fontWeight: value === 0 ? 700 : 500,
              fontSize: "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              minWidth: "120px",
            }}
          />

          <Tab
            icon={<MdCalendarMonth size={20} />}
            iconPosition="start"
            label="MONTHLY"
            sx={{
              color: value === 1 ? "#2ee6bb" : "#8fa1b7",
              fontWeight: value === 1 ? 700 : 500,
              fontSize: "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              minWidth: "120px",
            }}
          />
        </Tabs>

      </Paper>

      {/* CONTENT */}
      <Box sx={{ mt: 1 }}>
        {value === 0 && <BussinessDailyFinance />}
        {value === 1 && <BussinessMonthlyFinance />}
      </Box>
    </Box>
  );
};

export default BussinessCashbook_Main;
