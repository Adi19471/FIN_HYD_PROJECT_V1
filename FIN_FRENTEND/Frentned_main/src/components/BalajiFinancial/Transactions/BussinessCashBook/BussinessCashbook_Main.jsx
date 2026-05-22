import React, { useState } from "react";
import { Box, Chip, CircularProgress, Fade, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ReceiptLongRounded } from "@mui/icons-material";
import { MdCalendarMonth, MdCalendarToday } from "react-icons/md";

import BussinessDailyFinance from "./Bussiness_DailyFinance/BussinessDailyFinance";
import BussinessMonthlyFinance from "./Bussiness_MonthlyFinance/Bussiness_MonthlyFinance";

const tabs = [
  { label: "Daily", icon: <MdCalendarToday /> },
  { label: "Monthly", icon: <MdCalendarMonth /> },
];

const BussinessCashbook_Main = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setLoading(true);
    setValue(newValue);
    setTimeout(() => setLoading(false), 250);
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
      <Paper
        className="enterprise-card"
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap">
          <ReceiptLongRounded color="primary" />
          <Box>
            <Typography variant="h5">Transactions</Typography>
            <Typography variant="body2" color="text.secondary">
              Daily and monthly finance collections use one consistent format.
            </Typography>
          </Box>
          <Chip size="small" label={tabs[value].label} color="primary" variant="outlined" />
        </Stack>

        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 44,
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{
                minHeight: 42,
                minWidth: 126,
                borderRadius: 1,
                mx: 0.5,
                textTransform: "none",
                fontWeight: 800,
                color: value === index ? "primary.contrastText" : "text.primary",
                bgcolor: value === index ? "primary.main" : "background.paper",
                border: "1px solid",
                borderColor: value === index ? "primary.main" : "divider",
                "&:hover": {
                  bgcolor: value === index ? "primary.dark" : "action.hover",
                },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2.5, minHeight: 400, position: "relative" }}>
        <Fade in={loading}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: 2,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255,255,255,0.62)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <CircularProgress size={46} thickness={4} />
          </Box>
        </Fade>

        {value === 0 && <BussinessDailyFinance />}
        {value === 1 && <BussinessMonthlyFinance />}
      </Box>
    </Box>
  );
};

export default BussinessCashbook_Main;
