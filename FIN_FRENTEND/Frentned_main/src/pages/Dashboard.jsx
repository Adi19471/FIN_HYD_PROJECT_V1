import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Chip,
  Skeleton,
} from "@mui/material";

import {
  PeopleAltRounded,
  AutorenewRounded,
  CurrencyRupeeRounded,
  WarningAmberRounded,
  TrendingUpRounded,
  PaymentsRounded,
  MenuBookRounded,
  AccountTreeRounded,
  ReceiptRounded,
  PersonAddRounded,
  ReceiptLongRounded,
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
  index = 0,
}) {
  if (loading) {
    return (
      <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
        <Box sx={{ height: 6, bgcolor: color }} />
        <CardContent sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="80%" height={40} sx={{ my: 1 }} />
          <Skeleton variant="text" width="40%" height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${bgLight}`,
          transition: "all 0.2s ease",
          height: "100%",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 25px ${bgLight}`,
          },
        }}
      >
        <Box sx={{ height: 4, bgcolor: color }} />
        <CardContent sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.65rem",
                  letterSpacing: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: alert ? "error.main" : "#1e293b",
                  lineHeight: 1.3,
                  fontSize: "1.25rem",
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem" }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                bgcolor: bgLight,
                color,
                borderRadius: 1.5,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                ml: 1,
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
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
              label={`${trendUp ? "+" : ""}${trend}%`}
              color={trendUp ? "success" : "error"}
              variant="outlined"
              sx={{ mt: 1.5, fontWeight: 600, fontSize: "0.6rem", height: 22 }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick Action Button Component
function QuickActionButton({ icon: Icon, label, onClick, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="contained"
        startIcon={<Icon />}
        onClick={onClick}
        sx={{
          minWidth: 130,
          py: 1,
          fontWeight: 600,
          fontSize: "0.75rem",
          bgcolor: color,
          color: "#fff",
          boxShadow: "none",
          "&:hover": { bgcolor: color, opacity: 0.9 },
          borderRadius: 1.5,
          textTransform: "none",
        }}
      >
        {label}
      </Button>
    </motion.div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const userName = user?.name || "User";
  const userRole = user?.role || "Branch Admin";
  const accountId = user?.accountId || user?.branchId || null;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (accountId) {
          const response = await apiFetch(`/dashboard?accountId=${accountId}`);
          setDashboardData(response.data || getMockData(accountId));
        } else {
          setDashboardData(getMockData(accountId));
        }
      } catch (err) {
        setDashboardData(getMockData(accountId));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
    const refreshInterval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(refreshInterval);
  }, [accountId]);

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const stats = dashboardData?.stats || {};
  const collectionTrend = dashboardData?.collectionTrend || [];
  const statusData = dashboardData?.statusData || [];
  const trends = dashboardData?.trends || {};

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      {/* Quick Action Bar */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: "1px solid #e2e8f0" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          flexWrap="wrap"
          useFlexGap
        >
          <QuickActionButton
            icon={PersonAddRounded}
            label="Add Member"
            onClick={() => navigate("/Main_personal_file")}
            color="#0ea5e9"
          />
          <QuickActionButton
            icon={AccountTreeRounded}
            label="New Chit"
            onClick={() => navigate("/Loan")}
            color="#8b5cf6"
          />
          <QuickActionButton
            icon={MenuBookRounded}
            label="Cashbook"
            onClick={() => navigate("/Transactions/Cashbook")}
            color="#10b981"
          />
          <QuickActionButton
            icon={ReceiptLongRounded}
            label="Registration"
            onClick={() => navigate("/AccountMasterSetup/Registraion_creation")}
            color="#f59e0b"
          />
          <QuickActionButton
            icon={ReceiptRounded}
            label="Daily Book"
            onClick={() => navigate("/AccountsModules/DailBook")}
            color="#ec4899"
          />
        </Stack>
      </Box>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: "#1e293b", fontSize: { xs: "1.25rem", md: "1.5rem" } }}
          >
            {greeting} 👋 {userName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.85rem" }}
          >
            Here's your business overview for today
          </Typography>
        </Box>
      </motion.div>

      {/* KPI Cards - 5 in a row */}
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ mb: 2, color: "#1e293b" }}
      >
        Key Performance Indicators
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title="Total Members"
            value={`${stats.totalMembers?.toLocaleString() || 0}`}
            subtitle={`${stats.activeMembers || 0} active`}
            icon={PeopleAltRounded}
            color="#0ea5e9"
            bgLight="#e0f2fe"
            trend={trends.members}
            trendUp={trends.members >= 0}
            loading={loading}
            index={0}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title="Running Chits"
            value={`${stats.runningChits?.toLocaleString() || 0}`}
            subtitle={`${statusData[0]?.value || 0} active`}
            icon={AutorenewRounded}
            color="#8b5cf6"
            bgLight="#ede9fe"
            trend={trends.chits}
            trendUp={trends.chits >= 0}
            loading={loading}
            index={1}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title="Chit Value"
            value={formatINR(stats.chitValue || 0)}
            subtitle="Total fund value"
            icon={CurrencyRupeeRounded}
            color="#10b981"
            bgLight="#d1fae5"
            loading={loading}
            index={2}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title="Today's Collection"
            value={formatINR(stats.todayCollection || 0)}
            subtitle={`${stats.todayMembers || 0} members`}
            icon={PaymentsRounded}
            color="#f59e0b"
            bgLight="#fef3c7"
            trend={trends.collection}
            trendUp={trends.collection >= 0}
            loading={loading}
            index={3}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title="Pending Dues"
            value={formatINR(stats.pendingDues || 0)}
            subtitle={`${stats.pendingMembers || 0} members`}
            icon={WarningAmberRounded}
            color="#ef4444"
            bgLight="#fee2e2"
            trend={trends.dues}
            trendUp={trends.dues >= 0}
            alert={stats.pendingDues > 500000}
            loading={loading}
            index={4}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      {/* <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: "1rem" }}>Collection Trend</Typography>
                  <Chip label="Last 6 Months" size="small" sx={{ fontSize: "0.65rem", height: 22 }} />
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 280 }}>
                  {loading ? <Skeleton variant="rectangular" width="100%" height="100%" /> : (
                    <LineChart
                      xAxis={[{ scaleType: "band", data: collectionTrend.map((d) => d.month), tickLabelStyle: { angle: -30, textAnchor: "end", fontSize: 10 } }]}
                      series={[{ data: collectionTrend.map((d) => d.value), label: "Collection", color: "#2563eb", area: true, curve: "natural" }]}
                      height={280}
                      margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
            <Card elevation={2} sx={{ borderRadius: 2, height: "100%", minHeight: 380 }}>
              <CardContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: "1rem", mb: 1 }}>Chit Status</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 }}>
                  {loading ? <Skeleton variant="circular" width={180} height={180} /> : (
                    <PieChart
                      series={[{ data: statusData, innerRadius: 50, outerRadius: 80, paddingAngle: 2, arcLabel: (item) => `${item.value}`, arcLabelMinAngle: 45 }]}
                      sx={{ [`& .${pieArcLabelClasses.root}`]: { fill: "#fff", fontWeight: 700, fontSize: 11 } }}
                      height={220}
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mt: 1 }}>
                  {statusData.map((item) => (
                    <Chip key={item.id} size="small" label={`${item.label}: ${item.value}`} sx={{ bgcolor: item.color + "20", color: item.color, fontWeight: 600, fontSize: "0.65rem" }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid> */}

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                color: "#fff",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TrendingUpRounded
                          sx={{ fontSize: 22, color: "#22c55e" }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {formatINR(stats.todayCollection || 0)}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Today's Collection
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PeopleAltRounded
                          sx={{ fontSize: 22, color: "#0ea5e9" }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {stats.todayMembers || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Members Paid Today
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <WarningAmberRounded
                          sx={{ fontSize: 22, color: "#f59e0b" }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {stats.pendingInstalments || 0}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Pending Instalments
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
