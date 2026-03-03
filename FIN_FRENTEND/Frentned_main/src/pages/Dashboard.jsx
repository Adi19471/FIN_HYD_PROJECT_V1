import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  alpha,
  useTheme,
  Divider,
  Stack,
} from "@mui/material";

import { motion } from "framer-motion";

// MUI X Charts
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

// ────────────────────────────────────────────────
function StatCard({ title, value, icon, color, subtitle = "" }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: "blur(16px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          boxShadow: `0 8px 32px ${alpha(color, 0.12)}`,
          transition: "all 0.4s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 16px 48px ${alpha(color, 0.22)}`,
          },
        }}
      >
        <CardContent sx={{ p: 3.5 }}>
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2.5,
                bgcolor: alpha(color, 0.12),
                color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6, fontSize: "0.78rem" }}
              >
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={700} color={color} sx={{ mt: 0.4 }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: alpha(color, 0.85), mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ────────────────────────────────────────────────
export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = (() => {
    const h = currentTime.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const handleLogout = () => {
    if (window.confirm("Logout from Sri Balaji Chit Funds Dashboard?")) {
      logout();
      navigate("/login");
    }
  };

  // Sample data — replace with real data later
  const monthlyData = [
    { month: "Jan", value: 180000 },
    { month: "Feb", value: 215000 },
    { month: "Mar", value: 248000 },
    { month: "Apr", value: 315000 },
    { month: "May", value: 292000 },
    { month: "Jun", value: 405000 },
  ];

  const pieData = [
    { id: 0, value: 856, label: "Active", color: "#10b981" },
    { id: 1, value: 312, label: "Completed", color: "#3b82f6" },
    { id: 2, value: 98, label: "Delayed", color: "#ef4444" },
    { id: 3, value: 145, label: "Upcoming", color: "#f59e0b" },
  ];

  return (
    <>
      {/* ─── Header ─── */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.default",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 5 }, py: 1.8 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Sri Balaji Chit Funds
          </Typography>

          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            {" • "}
            {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ─── Content ─── */}
      <Box
        component="main"
        sx={{
          p: { xs: 3, md: 5 },
          maxWidth: 1680,
          mx: "auto",
          bgcolor: "background.default",
        }}
      >
        {/* Greeting */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              fontWeight: 800,
              letterSpacing: -1,
              background: "linear-gradient(90deg, #2563eb, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {greeting}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Manage chit collections, members & operations efficiently
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 7 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Members" value="1,234" color="#2563eb" icon="👥" subtitle="Active members" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Running Chits" value="856" color="#10b981" icon="🔄" subtitle="Ongoing" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Today's Collection" value="₹2.50 Lakh" color="#d97706" icon="₹" subtitle="+12% today" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Pending Dues" value="₹5.20 Lakh" color="#dc2626" icon="⚠️" subtitle="42 members" />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 7 }}>
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.75),
                backdropFilter: "blur(16px)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Collection Trend (Last 6 Months)
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ height: 380 }}>
                  <LineChart
                    xAxis={[{ scaleType: "band", data: monthlyData.map(d => d.month) }]}
                    series={[{ data: monthlyData.map(d => d.value), color: "#2563eb", label: "Amount (₹)" }]}
                    height={380}
                    margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
                bgcolor: alpha(theme.palette.background.paper, 0.75),
                backdropFilter: "blur(16px)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Chit Status Breakdown
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PieChart
                    series={[{
                      data: pieData,
                      innerRadius: 55,
                      outerRadius: 110,
                      paddingAngle: 4,
                      arcLabel: (item) => `${item.label}`,
                      arcLabelMinAngle: 45,
                    }]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: theme.palette.text.primary,
                        fontWeight: 600,
                        fontSize: 12,
                      },
                    }}
                    height={320}
                    legend={{ hidden: true }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card
          sx={{
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.75),
            backdropFilter: "blur(16px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>
            Quick Actions
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate("/Main_personal_file")}
                sx={{
                  py: 2,
                  borderRadius: 2.5,
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  textTransform: "none",
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                Add New Member
              </Button>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={() => navigate("/Loan")}
                sx={{
                  py: 2,
                  borderRadius: 2.5,
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Start New Chit
              </Button>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="large"
                onClick={handleLogout}
                sx={{
                  py: 2,
                  borderRadius: 2.5,
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
}