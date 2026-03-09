import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, CircularProgress, Grid, Typography, Card, CardContent } from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import BarChart01 from "../../../charts/BarChart01";
import DoughnutChart from "../../../charts/DoughnutChart";

const Loans = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setLoading(true);
    navigate(newValue);
    // Simulate loading delay for tab switch
    setTimeout(() => setLoading(false), 300);
  };

  // Dummy data for charts - showing when on the main Loans page
  const showCharts = location.pathname === "/AccountsModules/LoansMainpage" || location.pathname === "/AccountsModules/Loans";

  // Bar chart dummy data - Monthly Loans
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Finance',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Daily Finance',
        data: [8, 12, 10, 18, 15, 22],
        backgroundColor: '#10b981',
      },
    ],
  };

  // Doughnut chart dummy data - Loan Distribution
  const doughnutChartData = {
    labels: ['Monthly Finance', 'Daily Finance', 'Personal Loans', 'Business Loans'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      },
    ],
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
          <Tab label="Loans Main" value="/AccountsModules/LoansMainpage" />

          <Tab label="Daily Book" value="/AccountsModules/DailyBook" />
          <Tab label="CB Ledger" value="/AccountsModules/Cbledger" />
          <Tab label="Account Ledger" value="/AccountsModules/AccountLedger" />
          <Tab
            label="Account Master Ledger"
            value="/AccountsModules/AccountMasterLedger"
          />

          <Tab
            label="User Collection Ledger"
            value="/AccountsModules/Usercollectionledger"
          />

          <Tab label="Receipt Ledger" value="/AccountsModules/ReciptLedger" />
        </Tabs>
      </Paper>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 100,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            px: 4,
            py: 2,
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={24} />
          <Box>Loading...</Box>
        </Box>
      )}

      {/* Dashboard Charts - Only show on main Loans page */}
      {showCharts && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Loans Dashboard Overview
          </Typography>
          
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#3b82f6', color: 'white' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Loans</Typography>
                  <Typography variant="h4" fontWeight="bold">156</Typography>
                  <Typography variant="caption">Active Loans</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#10b981', color: 'white' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Monthly Finance</Typography>
                  <Typography variant="h4" fontWeight="bold">89</Typography>
                  <Typography variant="caption">Accounts</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#f59e0b', color: 'white' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Daily Finance</Typography>
                  <Typography variant="h4" fontWeight="bold">67</Typography>
                  <Typography variant="caption">Accounts</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#ef4444', color: 'white' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Amount</Typography>
                  <Typography variant="h4" fontWeight="bold">₹45.2L</Typography>
                  <Typography variant="caption">Disbursed</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Monthly Loans Trend</Typography>
                <Box sx={{ height: 300 }}>
                  <BarChart01 data={barChartData} width="100%" height="100%" />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Loan Distribution</Typography>
                <Box sx={{ height: 300 }}>
                  <DoughnutChart data={doughnutChartData} width="100%" height="100%" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 👇 THIS IS THE KEY */}
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Loans;
