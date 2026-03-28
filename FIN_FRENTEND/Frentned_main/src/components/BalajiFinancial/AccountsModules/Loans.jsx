import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
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
    setTimeout(() => setLoading(false), 300);
  };

  // Show charts only on main Loans page
  const showCharts = location.pathname === "/AccountsModules/LoansMainpage" || 
                     location.pathname === "/AccountsModules/Loans";

  // Dummy data
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
      {/* Sticky Tabs */}
      <Paper
        elevation={3}
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 1200,
          borderRadius: 0,
        }}
      >
        <Tabs
          value={location.pathname}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              py: 2,
            },
          }}
        >
          <Tab label="Loans Main" value="/AccountsModules/LoansMainpage" />
          <Tab label="Daily Book" value="/AccountsModules/DailyBook" />
          <Tab label="CB Ledger" value="/AccountsModules/Cbledger" />
          <Tab label="Account Ledger" value="/AccountsModules/AccountLedger" />
          <Tab label="Account Master Ledger" value="/AccountsModules/AccountMasterLedger" />
          <Tab label="User Collection Ledger" value="/AccountsModules/Usercollectionledger" />
          <Tab label="Receipt Ledger" value="/AccountsModules/ReciptLedger" />
        </Tabs>
      </Paper>

      {/* Loading Indicator */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 120,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            px: 5,
            py: 1.5,
            borderRadius: 3,
            boxShadow: 4,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={22} />
          <Typography variant="body1" fontWeight={500}>Loading...</Typography>
        </Box>
      )}

      {/* Dashboard - Only on Main Loans Page */}
      {showCharts && (
        <Box sx={{ p: 3, bgcolor: "#f8fafc" }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 4, 
              fontWeight: 700, 
              color: "#1e2937",
              textAlign: "center",
            }}
          >
            Loans Dashboard Overview
          </Typography>

          {/* Summary Cards - Improved Design */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: "100%", 
                  bgcolor: '#3b82f6', 
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85, mb: 1 }}>
                    Total Active Loans
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
                    156
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Across all categories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: "100%", 
                  bgcolor: '#10b981', 
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85, mb: 1 }}>
                    Monthly Finance
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
                    89
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Accounts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: "100%", 
                  bgcolor: '#f59e0b', 
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85, mb: 1 }}>
                    Daily Finance
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
                    67
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Accounts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: "100%", 
                  bgcolor: '#ef4444', 
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85, mb: 1 }}>
                    Total Disbursed
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
                    ₹45.2L
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    This Financial Year
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  height: '100%'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Monthly Loans Trend
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 340 }}>
                  <BarChart01 
                    data={barChartData} 
                    width="100%" 
                    height="100%" 
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  height: '100%'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Loan Type Distribution
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DoughnutChart 
                    data={doughnutChartData} 
                    width="100%" 
                    height="100%" 
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Render Child Routes */}
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Loans;