import React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const Loans = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <>
      {/* 🔒 Sticky Tabs */}
      <Paper
        elevation={2}
        sx={{
          position: "sticky",
          top: 64, // header height
          zIndex: 1200,
        }}
      >
        <Tabs
          value={location.pathname}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Loans Main" value="/Loans/LoansMainpage" />

                  <Tab label="Daily Book" value="/Loans/DailyBook" />
          <Tab label="CB Ledger" value="/Loans/Cbledger" />
        <Tab label="Account Ledger" value="/Loans/AccountLedger" />
      <Tab label="Account Master Ledger" value="/Loans/AccountMasterLedger" />

 <Tab label="User Collection Ledger" value="/Loans/Usercollectionledger" />
  
    
          <Tab label="Receipt Ledger" value="/Loans/ReciptLedger" />



         

  
        </Tabs>
      </Paper>

      {/* 👇 THIS IS THE KEY */}
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Loans;
