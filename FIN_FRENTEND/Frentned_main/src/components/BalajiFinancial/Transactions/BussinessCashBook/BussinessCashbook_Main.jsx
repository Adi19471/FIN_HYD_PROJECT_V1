import React, { useState } from "react";
import { Paper, Tabs, Tab, Box, Typography } from "@mui/material";
import { MdCalendarToday, MdCalendarMonth } from "react-icons/md";

import BussinessDailyFinance from "./Bussiness_DailyFinance/BussinessDailyFinance";
import BussinessMonthlyFinance from "./Bussiness_MonthlyFinance/Bussiness_MonthlyFinance";

const BussinessCashbook_Main = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      {/* MAIN BAR */}
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          bgcolor: "#0d1528",
        
        
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
      <Box sx={{ mt: 3 }}>
        {value === 0 && <BussinessDailyFinance />}
        {value === 1 && <BussinessMonthlyFinance />}
      </Box>
    </Box>
  );
};

export default BussinessCashbook_Main;
