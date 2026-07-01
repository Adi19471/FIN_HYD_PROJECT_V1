import React, { useState } from "react";
import { alpha, Box, CircularProgress, Fade, Paper, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { CalendarMonthRounded, PointOfSaleRounded, TodayRounded } from "@mui/icons-material";

import BussinessDailyFinance from "./Bussiness_DailyFinance/BussinessDailyFinance";
import BussinessMonthlyFinance from "./Bussiness_MonthlyFinance/Bussiness_MonthlyFinance";

const tabs = [
  { label: "Daily", icon: <TodayRounded fontSize="small" /> },
  { label: "Monthly", icon: <CalendarMonthRounded fontSize="small" /> },
];

const BussinessCashbook_Main = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setLoading(true);
    setValue(newValue);
    setTimeout(() => setLoading(false), 250);
  };

  return (
    <Box >
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
          <PointOfSaleRounded color="primary" />
          <Box>
            <Typography variant="h5">Transactions</Typography>
          </Box>
        </Stack>

        <Tabs
          value={value}
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
      </Paper>

      <Box sx={{  minHeight: 400, position: "relative" }}>
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
