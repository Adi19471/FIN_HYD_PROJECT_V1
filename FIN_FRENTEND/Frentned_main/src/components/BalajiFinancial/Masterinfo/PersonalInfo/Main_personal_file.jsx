import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import { Person, Work, Groups, Storefront } from "@mui/icons-material";

import Custmer from "./Custmer/Custmer";
import Partner from "./Partner/Partner";
import Employe from "./Employe/Employe";
import Vender from "./Vender/Vender";

import LoadingSpinner from "../../../../LoadingSpinner";

const Main_personal_file = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setLoading(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [value]);

  // UI Colors
  const tabBg = "#0d1528";                  // Dark tab bar
  const activeColor = "#2ee6bb";            // Teal active text
  const inactiveColor = "#93a4b8";          // Gray inactive text
  const indicatorColor = "#4da3ff";         // Blue underline

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9", p: 1 }}>
      
      {/* --- Modern Header + Tabs Section --- */}
      <Paper
        elevation={6}
        sx={{
      
          overflow: "hidden",
          bgcolor: tabBg,
        
        }}
      >
        {/* Heading */}
    
<Tab
  component="button"
  disableRipple
  label={
    <Typography
      variant="h6"
      sx={{
        fontSize: "12px",
        color: "warning.main",      // MUI info color (blue)

      }}
    >
      Personal Accounts
    </Typography>
  }
  sx={{
    cursor: "pointer",
    borderRadius: "8px",
    px: 2,
    py: 1,
    "&:hover": {
      backgroundColor: "info.light",
      color: "white",
    },
    "&:active": {
      backgroundColor: "info.dark",
    },
  }}
/>
        {/* Modern MUI Tabs */}
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          variant="fullWidth"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: indicatorColor,
        
            },
          }}
        >
          
        

          <Tab
            icon={<Person sx={{ fontSize: 26 }} />}
            iconPosition="start"
            label={
              <Typography
                fontSize="15px"
                fontWeight={700}
                letterSpacing="1px"
              >
                CUSTOMER
              </Typography>
            }
            sx={{
              color: value === 0 ? activeColor : inactiveColor,
              textTransform: "uppercase",
            }}
          />

          <Tab
            icon={<Work sx={{ fontSize: 26 }} />}
            iconPosition="start"
            label={
              <Typography
                fontSize="15px"
                fontWeight={700}
                letterSpacing="1px"
              >
                EMPLOYEE
              </Typography>
            }
            sx={{
              color: value === 1 ? activeColor : inactiveColor,
              textTransform: "uppercase",
            }}
          />

          <Tab
            icon={<Groups sx={{ fontSize: 26 }} />}
            iconPosition="start"
            label={
              <Typography
                fontSize="15px"
                fontWeight={700}
                letterSpacing="1px"
              >
                PARTNER
              </Typography>
            }
            sx={{
              color: value === 2 ? activeColor : inactiveColor,
              textTransform: "uppercase",
            }}
          />

          <Tab
            icon={<Storefront sx={{ fontSize: 26 }} />}
            iconPosition="start"
            label={
              <Typography
                fontSize="15px"
                fontWeight={700}
                letterSpacing="1px"
              >
                VENDOR
              </Typography>
            }
            sx={{
              color: value === 3 ? activeColor : inactiveColor,
              textTransform: "uppercase",
            }}
          />
        </Tabs>
      </Paper>

      {/* --- Page Content With Loading Spinner --- */}
      <Box sx={{ mt: 3, minHeight: "350px" }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {value === 0 && <Custmer personType="CUSTOMER" />}
            {value === 1 && <Employe personType="EMPLOYEE" />}
            {value === 2 && <Partner personType="PARTNER" />}
            {value === 3 && <Vender personType="VENDOR" />}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Main_personal_file;
