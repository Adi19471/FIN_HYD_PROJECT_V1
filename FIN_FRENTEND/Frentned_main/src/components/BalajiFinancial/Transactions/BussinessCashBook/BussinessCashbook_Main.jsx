import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Fade,
} from "@mui/material";
import { MdCalendarToday, MdCalendarMonth } from "react-icons/md";

import BussinessDailyFinance from "./Bussiness_DailyFinance/BussinessDailyFinance";
import BussinessMonthlyFinance from "./Bussiness_MonthlyFinance/Bussiness_MonthlyFinance";

const BussinessCashbook_Main = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setLoading(true);
    setValue(newValue);

    setTimeout(() => setLoading(false), 400);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* 🔵 HEADER */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "rgba(13,21,40,0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: "1px",
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontSize: "16px",
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          💰 Transactions
        </Typography>

        {/* Tabs */}
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            minHeight: "40px",
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          {[ 
            { label: "Daily", icon: <MdCalendarToday /> },
            { label: "Monthly", icon: <MdCalendarMonth /> },
          ].map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{
                minHeight: "36px",
                minWidth: "110px",
                borderRadius: "1px",
                mx: 0.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "13px",
                color: value === index ? "#fff" : "#fff",
                bgcolor: value === index ? "#fff" : "transparent",
                transition: "0.3s",
                "&:hover": {
                  bgcolor: value === index ? "#1565c0" : "rgba(255,255,255,0.05)",
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* 🔵 CONTENT CARD */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: "1px",
          bgcolor: "#0f1b32",
          minHeight: "400px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 🔄 Loading Overlay */}
        <Fade in={loading}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress size={50} thickness={4} />
          </Box>
        </Fade>

        {/* 📊 Content */}
        {value === 0 && <BussinessDailyFinance />}
        {value === 1 && <BussinessMonthlyFinance />}
      </Box>
    </Box>
  );
};

export default BussinessCashbook_Main;