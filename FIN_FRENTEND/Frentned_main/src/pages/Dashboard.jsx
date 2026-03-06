import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";

import {
  PeopleAltRounded,
  AutorenewRounded,
  CurrencyRupeeRounded,
  WarningAmberRounded,
  TrendingUpRounded,
  LogoutRounded,
  AccountBalance,
  GroupAddRounded,
  PaymentsRounded,
} from "@mui/icons-material";

import { motion } from "framer-motion";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

// Rupee formatter
const formatINR = (num) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);

// Mock data for fallback
const getMockData = (accountId) => ({
  user: {
    name: "User",
    role: accountId ? "Account Admin" : "Branch Admin",
  },
  stats: {
    totalMembers: 1341,
    activeMembers: 928,
    inactiveMembers: 413,
    runningChits: 862,
    chitValue: 18700000,
    todayCollection: 318000,
    todayMembers: 214,
    pendingDues: 684000,
    pendingMembers: 68,
    pendingInstalments: 142,
  },
  collectionTrend: [
    { month: "Jan", value: 184000 },
    { month: "Feb", value: 221000 },
    { month: "Mar", value: 258000 },
    { month: "Apr", value: 327000 },
    { month: "May", value: 305000 },
    { month: "Jun", value: 418000 },
  ],
  statusData: [
    { id: 0, value: 862, label: "Active", color: "#22c55e" },
    { id: 1, value: 298, label: "Completed", color: "#3b82f6" },
    { id: 2, value: 112, label: "Delayed", color: "#ef4444" },
    { id: 3, value: 168, label: "Upcoming", color: "#f59e0b" },
  ],
  trends: {
    members: 5.8,
    chits: 0,
    collection: 18,
    dues: -4.2,
  },
});

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgLight,
  trend,
  trendUp = true,
  alert = false,
  loading = false,
}) {
  if (loading) {
    return (
      <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
        <Box sx={{ height: 6, bgcolor: color }} />
        <CardContent sx={{ p: 3.5 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="80%" height={48} sx={{ my: 1 }} />
          <Skeleton variant="text" width="40%" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${bgLight}80`,
          transition: "all 0.25s ease",
          height: "100%",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 16px 40px ${bgLight}60`,
          },
        }}
      >
        <Box sx={{ height: 6, bgcolor: color }} />
        <CardContent sx={{ p: 3.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: 0.8,
                  mb: 0.8,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  color: alert ? "error.main" : color,
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6, fontSize: "0.8rem" }}>
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                bgcolor: bgLight,
                color,
                borderRadius: 2,
                width: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                ml: 1.5,
              }}
            >
              <Icon sx={{ fontSize: 28 }} />
            </Box>
          </Stack>

          {trend !== undefined && (
            <Chip
              size="small"
              icon={
                <TrendingUpRounded
                  fontSize="small"
                  sx={{ transform: trendUp ? "none" : "rotate(180deg)" }}
                />
              }
              label={`${trendUp ? "+" : ""}${trend}% this month`}
              color={trendUp ? "success" : "error"}
              variant="outlined"
              sx={{ mt: 2, fontWeight: 600, borderRadius: 12, fontSize: "0.7rem" }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ────────────────────────────────────────────────
export default function ProfessionalDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  
  // Dashboard data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Get user info from auth context
  const userName = user?.name || "User";
  const userRole = user?.role || "Branch Admin";
  const accountId = user?.accountId || user?.branchId || null;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to fetch from API if accountId exists
        if (accountId) {
          const response = await apiFetch(`/dashboard?accountId=${accountId}`);
          setDashboardData(response.data || getMockData(accountId));
        } else {
          // Use mock data for now
          setDashboardData(getMockData(accountId));
        }
      } catch (err) {
        console.log("Using mock data due to API error:", err.message);
        // Fallback to mock data
        setDashboardData(getMockData(accountId));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [accountId]);

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  // Extract data from state or use defaults
  const stats = dashboardData?.stats || {};
  const collectionTrend = dashboardData?.collectionTrend || [];
  const statusData = dashboardData?.statusData || [];
  const trends = dashboardData?.trends || {};

  return (
    <>
      {/* HEADER */}
      <AppBar 
        position="static" 
        color="default" 
        elevation={2}
        sx={{ 
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ 
          justifyContent: "space-between", 
          px: { xs: 2, md: 4 }, 
          py: 1.5,
          flexWrap: "wrap",
          gap: 1,
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AccountBalance sx={{ color: "primary.main", fontSize: 32 }} />
            <Typography 
              variant="h6" 
              fontWeight={700} 
              color="primary.main"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Sri Balaji Chit Funds
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={{ xs: 1, sm: 3 }} 
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary" 
              fontWeight={500}
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              {time.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" • "}
              {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38, fontSize: "1rem" }}>
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: "0.875rem" }}>
                  {userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userRole}
                </Typography>
              </Box>
            </Stack>

            <IconButton 
              color="inherit" 
              onClick={() => logout()}
              sx={{ 
                color: "text.secondary",
                "&:hover": { color: "error.main", bgcolor: "error.light" }
              }}
            >
              <LogoutRounded />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* QUICK ACTION BAR */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 2, md: 4 },
          py: 2,
        }}
      >
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={2}
          sx={{
            "& > *": {
              width: { xs: "100%", sm: "auto" },
            }
          }}
        >
          <Button
            variant="contained"
            startIcon={<GroupAddRounded />}
            onClick={() => navigate("/Main_personal_file")}
            sx={{ 
              minWidth: { xs: "100%", sm: 180 }, 
              py: 1.2, 
              fontWeight: 600,
              fontSize: "0.875rem"
            }}
          >
            Add New Member
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<PaymentsRounded />}
            onClick={() => navigate("/Loan")}
            sx={{ 
              minWidth: { xs: "100%", sm: 180 }, 
              py: 1.2, 
              fontWeight: 600,
              fontSize: "0.875rem"
            }}
          >
            Start New Chit
          </Button>
         
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              background: "linear-gradient(90deg, #1e40af, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -0.5,
              fontSize: { xs: "0.75rem", sm: "2.25rem", md: "2.5rem" },
            }}
          >
            {greeting}, {userName.split(' ')[0]}
          </Typography>
        </Stack>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: 1680,
          mx: "auto",
          bgcolor: "grey.50",
          minHeight: "100vh",
        }}
      >
        {/* Error Alert */}
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

      

        {/* KPI CARDS – 4 in a row */}
        <Typography 
          variant="h6" 
          fontWeight={700} 
          gutterBottom 
          sx={{ mb: 3, fontSize: { xs: "1rem", sm: "1.25rem" } }}
        >
          Key Performance Indicators
        </Typography>

        <Grid container spacing={12} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Members"
              value={loading ? "" : `${stats.totalMembers?.toLocaleString() || 0}`}
              subtitle={loading ? "" : `${stats.activeMembers || 0} active • ${stats.inactiveMembers || 0} inactive`}
              icon={PeopleAltRounded}
              color="#2563eb"
              bgLight="#dbeafe"
              trend={trends.members}
              trendUp={trends.members >= 0}
              loading={loading}
            />
          </Grid>

         

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Today's Collection"
              value={loading ? "" : formatINR(stats.todayCollection || 0)}
              subtitle={loading ? "" : `from ${stats.todayMembers || 0} members`}
              icon={CurrencyRupeeRounded}
              color="#d97706"
              bgLight="#fef3c7"
              trend={trends.collection}
              trendUp={trends.collection >= 0}
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Dues"
              value={loading ? "" : formatINR(stats.pendingDues || 0)}
              subtitle={loading ? "" : `${stats.pendingMembers || 0} members • ${stats.pendingInstalments || 0} instalments`}
              icon={WarningAmberRounded}
              color="#dc2626"
              bgLight="#fee2e2"
              trend={trends.dues}
              trendUp={trends.dues >= 0}
              alert={true}
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* CHARTS */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card 
              elevation={4} 
              sx={{ 
                borderRadius: 3,
                height: { xs: "auto", lg: "100%" },
                minHeight: { lg: 500 }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Monthly Collection Trend – Last 6 Months
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ 
                  height: { xs: 300, sm: 350, md: 420 }, 
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                  ) : (
                    <LineChart
                      xAxis={[
                        {
                          scaleType: "band",
                          data: collectionTrend.map((d) => d.month),
                          tickLabelStyle: { 
                            angle: -35, 
                            textAnchor: "end", 
                            fontSize: 11,
                            fill: "#666"
                          },
                        },
                      ]}
                      series={[
                        {
                          data: collectionTrend.map((d) => d.value),
                          label: "Collection (₹)",
                          color: "#2563eb",
                          area: true,
                          curve: "natural",
                          showMark: true,
                        },
                      ]}
                      height={collectionTrend.length > 0 ? (window.innerWidth < 600 ? 300 : 420) : 300}
                      margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
                      sx={{
                        width: "100%",
                        "& .MuiChartsAxis-label": {
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card 
              elevation={4} 
              sx={{ 
                borderRadius: 3, 
                height: "100%",
                minHeight: { xs: 450, lg: "auto" }
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Current Chit Status Distribution
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ 
                  flex: 1, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  minHeight: { xs: 300, md: 350 }
                }}>
                  {loading ? (
                    <Skeleton variant="circular" width={250} height={250} />
                  ) : (
                    <PieChart
                      series={[
                        {
                          data: statusData,
                          innerRadius: 60,
                          outerRadius: 100,
                          paddingAngle: 3,
                          arcLabel: (item) => `${item.value}`,
                          arcLabelMinAngle: 45,
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "#fff",
                          fontWeight: 700,
                          fontSize: 12,
                          textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                        },
                      }}
                      height={300}
                    />
                  )}
                </Box>
                {/* Legend */}
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, mt: 2 }}>
                  {statusData.map((item) => (
                    <Chip
                      key={item.id}
                      size="small"
                      label={`${item.label}: ${item.value}`}
                      sx={{
                        bgcolor: item.color + "20",
                        color: item.color,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

