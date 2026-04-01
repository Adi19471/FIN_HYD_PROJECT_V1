import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  AccountBalance,
  CurrencyRupee,
  Today,
} from "@mui/icons-material";
import BarChart01 from "../../../charts/BarChart01";
import DoughnutChart from "../../../charts/DoughnutChart";

const Loans = () => {

  const stats = [
    { title: "Total Loans", value: "156", icon: <AccountBalance /> },
    { title: "Monthly Loans", value: "89", icon: <TrendingUp /> },
    { title: "Daily Loans", value: "67", icon: <Today /> },
    { title: "Total Amount", value: "₹45.2L", icon: <CurrencyRupee /> },
  ];

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ label: "Loans", data: [12, 19, 15, 25, 22, 30] }],
  };

  const doughnutChartData = {
    labels: ["Monthly", "Daily", "Personal", "Business"],
    datasets: [{ data: [45, 30, 15, 10] }],
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fb", minHeight: "100vh" }}>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Loans Management
        </Typography>
        <Button variant="contained">+ New Loan</Button>
      </Box>

      {/* FILTERS */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="From Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="To Date" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField select fullWidth label="Loan Type">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="contained" sx={{ height: "100%" }}>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* STATS CARDS */}
      <Grid container spacing={3} mb={3}>
        {stats.map((item, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>
                  <Box>{item.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="subtitle1">Loan Trends</Typography>
            <Divider sx={{ my: 1 }} />
            <BarChart01 data={barChartData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="subtitle1">Distribution</Typography>
            <Divider sx={{ my: 1 }} />
            <DoughnutChart data={doughnutChartData} />
          </Paper>
        </Grid>
      </Grid>

      {/* TABLE (IMPORTANT FOR REAL APP) */}
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="subtitle1" mb={2}>
          Recent Loans
        </Typography>

        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ravi Kumar</td>
                <td>Monthly</td>
                <td>₹50,000</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>Suresh</td>
                <td>Daily</td>
                <td>₹20,000</td>
                <td>Closed</td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Paper>

    </Box>
  );
};

export default Loans;