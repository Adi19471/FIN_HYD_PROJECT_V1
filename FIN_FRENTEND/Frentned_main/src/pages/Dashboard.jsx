import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ApprovalRounded,
  ArrowForwardRounded,
  AssessmentRounded,
  ContactsRounded,
  PointOfSaleRounded,
  LaunchRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  RefreshRounded,
  RequestQuoteRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const formatINR = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

// AuthContext already tracks lastActivity (mouse/keyboard/scroll/touch) for its
// inactivity-logout timer - reuse it so polling pauses when the user has genuinely
// stepped away, not just when the tab is backgrounded.
const IDLE_THRESHOLD_MS = 5 * 60 * 1000;
const isUserIdle = () => {
  const lastActivity = parseInt(getSession("lastActivity") || "0", 10);
  return Date.now() - lastActivity > IDLE_THRESHOLD_MS;
};

const modules = [
  { title: "Customer Master", path: "/customer", icon: ContactsRounded },
  { title: "Daily Finance", path: "/Daily-Finace", icon: PaymentsRounded },
  { title: "Monthly Finance", path: "/Monthly-Finance", icon: RequestQuoteRounded },
  { title: "Quick Cash Book", path: "/Transactions/Quick_Cash_Book", icon: PointOfSaleRounded },
  { title: "Daily Book", path: "/AccountsModules/DailyBook", icon: ReceiptLongRounded },
  { title: "Collection Report", path: "/Bussiness/BussinessCollectionReportsimport", icon: AssessmentRounded },
];

function MetricStrip({ title, value, note, tone = "primary" }) {
  return (
    <Box className={`dashboard-strip dashboard-strip-${tone}`}>
      <Typography variant="caption">{title}</Typography>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="caption">{note}</Typography>
    </Box>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <Paper className="enterprise-card dashboard-panel" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  // No "noopener" here on purpose: this is same-origin, trusted navigation, and dropping
  // the opener reference would break sessionStorage inheritance into the new tab, forcing
  // an unwanted re-login there.
  const openInNewTab = (path) => window.open(path, "_blank");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [metrics, setMetrics] = useState({
    portfolioValue: 0,
    todayCollection: 0,
    pendingDues: 0,
    activeMembers: 0,
    dueCases: 0,
    transactionRows: [],
    collectionRows: [],
    memberRows: [],
    dailySummaryRows: [],
    dailyTotals: {
      openingBalance: 0,
      credits: 0,
      debits: 0,
      closingBalance: 0,
    },
  });

  const token = getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Collections + daily summary are the genuinely "live" numbers on this screen,
  // so they're fast (no full-table scans) and safe to poll every 30s.
  const fetchLiveMetrics = useCallback(async () => {
    setLoading(true);
    setError("");
    const today = dayjs().format("YYYY-MM-DD");
    const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
    const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");

    try {
      const [collectionsRes, dailySummaryRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/businessCollectionsReport/${monthStart}/${monthEnd}`, { headers }),
        axios.get(`${API_BASE}/loadAllDayWiseTransactionsSummary/${today}`, { headers }),
      ]);

      const collectionRows = collectionsRes.status === "fulfilled" && Array.isArray(collectionsRes.value.data) ? collectionsRes.value.data : [];
      const dailySummary = dailySummaryRes.status === "fulfilled" ? dailySummaryRes.value.data || {} : {};
      const dailyRows = Array.isArray(dailySummary.cashBookSumaryViewPojoList) ? dailySummary.cashBookSumaryViewPojoList : [];

      const target = collectionRows.reduce((sum, item) => sum + Number(item.targetCollections || 0), 0);
      const received = collectionRows.reduce((sum, item) => sum + Number(item.receivedCollections || 0), 0);
      const balance = collectionRows.reduce((sum, item) => sum + Number(item.balanceCollections || 0), 0);
      const todayCollection = dailyRows.reduce(
        (sum, item) => sum + Number(item.credit || item.creditAmount || item.collectionAmount || item.amount || item.receivedAmount || 0),
        0
      );

      const transactionRows = dailyRows.slice(0, 20).map((item, index) => {
        const credit = Number(item.credit || item.creditAmount || item.collectionAmount || item.receivedAmount || 0);
        const debit = Number(item.debit || item.debitAmount || 0);

        return {
          id: item.transactionId || item.id || `DAY-${index + 1}`,
          customer: item.customerName || item.name || item.accountName || item.accountNumber || "-",
          type: item.transactionType || item.transaction || item.accountMastercode || "Daily Book",
          amount: credit || debit || Number(item.amount || 0),
          status: item.status || (credit ? "Credit" : debit ? "Debit" : "Posted"),
        };
      });

      setMetrics((prev) => ({
        ...prev,
        portfolioValue: target,
        todayCollection: todayCollection || received,
        pendingDues: balance,
        dueCases: collectionRows.filter((item) => Number(item.balanceCollections || 0) > 0).length,
        transactionRows,
        collectionRows,
        dailySummaryRows: dailyRows,
        dailyTotals: {
          openingBalance: Number(dailySummary.openingBalance || 0),
          credits: Number(dailySummary.credits || 0),
          debits: Number(dailySummary.debits || 0),
          closingBalance: Number(dailySummary.closingBalance || 0),
        },
      }));
      setLastUpdated(dayjs());
    } catch (err) {
      setError("Dashboard live data could not be refreshed. Please check API connection or login session.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  // Active-member count barely changes minute to minute, and PersonalInfo/findAll
  // scans the full customer/employee/partner/vendor table - fetch it once on open
  // instead of on every 30s live-metrics poll.
  const fetchMemberCount = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/findAll`, { headers });
      const memberRows = Array.isArray(res.data) ? res.data : [];
      setMetrics((prev) => ({ ...prev, activeMembers: memberRows.length, memberRows }));
    } catch {
      // Non-critical metric tile; leave the last known count in place.
    }
  }, [headers]);

  useEffect(() => {
    fetchLiveMetrics();
    fetchMemberCount();
    // Skip polling while this tab is backgrounded or the user has been idle for a
    // while - avoids piling up backend calls from tabs left open and untouched.
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible" && !isUserIdle()) fetchLiveMetrics();
    }, 30000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchLiveMetrics();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchLiveMetrics, fetchMemberCount]);

  const completionRate = useMemo(() => {
    const target = Number(metrics.portfolioValue || 0);
    const received = Number(metrics.todayCollection || 0);
    if (!target) return 0;
    return Math.min(100, Math.round((received / target) * 100));
  }, [metrics.portfolioValue, metrics.todayCollection]);

  const collections = useMemo(() => {
    return metrics.collectionRows.map((item) => ({
      label: `${String(item.loanType || "").replace("_FINANCE", "")} ${item.loanStatus || ""}`.replace("_", " "),
      value: Number(item.receivedCollections || 0),
    }));
  }, [metrics.collectionRows]);

  const dailyFlowRows = useMemo(
    () => [
      {
        label: dayjs().format("DD-MMM"),
        credit: Number(metrics.dailyTotals.credits || metrics.todayCollection || 0),
        debit: Number(metrics.dailyTotals.debits || 0),
      },
    ],
    [metrics.dailyTotals.credits, metrics.dailyTotals.debits, metrics.todayCollection]
  );

  const transactionColumns = [
    { field: "id", headerName: "Txn ID", width: 120 },
    { field: "customer", headerName: "Customer", minWidth: 190, flex: 1 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "amount", headerName: "Amount", width: 140, valueFormatter: (value) => formatINR(value) },
    {
      field: "status",
      headerName: "Status",
      width: 125,
      renderCell: (params) => (
        <span className={`finance-status ${params.value === "Posted" ? "success" : params.value === "Approval" ? "warning" : "error"}`}>
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <Stack spacing={2.5}>
      <Paper className="enterprise-card dashboard-hero dashboard-hero-redesign" elevation={0}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} justifyContent="space-between" alignItems={{ lg: "stretch" }}>
          <Box className="dashboard-hero-copy">
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip size="small" label={COMPANY_ADDRESS} color="primary" />
              <Chip size="small" label={loading ? "Refreshing..." : "Live dashboard"} variant="outlined" />
              {lastUpdated && <Chip size="small" label={`Updated ${lastUpdated.format("hh:mm A")}`} variant="outlined" />}
            </Stack>
            <Typography variant="h3" sx={{ mt: 2 }}>{COMPANY_NAME}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2.5 }}>
              <Button
                startIcon={<RefreshRounded />}
                variant="contained"
                onClick={() => {
                  fetchLiveMetrics();
                  fetchMemberCount();
                }}
                disabled={loading}
              >
                Refresh Counts
              </Button>
              <Button startIcon={<PointOfSaleRounded />} variant="outlined" onClick={() => navigate("/Transactions/Quick_Cash_Book")}>
                Quick Entry
              </Button>
              <Button startIcon={<ReceiptLongRounded />} variant="outlined" onClick={() => navigate("/AccountsModules/DailyBook")}>
                Daily Book
              </Button>
              <Button startIcon={<ApprovalRounded />} variant="outlined" onClick={() => navigate("/Loans/InstalmentDues")}>
                Dues Review
              </Button>
            </Stack>
          </Box>

          <Box className="dashboard-operator-card">
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Today Operating View</Typography>
                <Typography variant="subtitle1">Admin workspace</Typography>
              </Box>
              <Box className="dashboard-operator-icon">
                <TrendingUpRounded />
              </Box>
            </Stack>
            <Grid container spacing={1.25}>
              <Grid size={6}>
                <MetricStrip title="Collection" value={formatINR(metrics.todayCollection)} note="today" tone="success" />
              </Grid>
              <Grid size={6}>
                <MetricStrip title="Pending" value={formatINR(metrics.pendingDues)} note={`${metrics.dueCases} cases`} tone="warning" />
              </Grid>
              <Grid size={6}>
                <MetricStrip title="Members" value={metrics.activeMembers} note="active" tone="primary" />
              </Grid>
              <Grid size={6}>
                <MetricStrip title="Completion" value={`${completionRate}%`} note="against target" tone="info" />
              </Grid>
            </Grid>
          </Box>
        </Stack>
        {loading && <LinearProgress sx={{ mt: 2, borderRadius: 99 }} />}
      </Paper>
      {error && <Alert severity="warning">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid size={12}>
          <Panel
            title="Finance Workspace"
            action={<Button size="small" endIcon={<ArrowForwardRounded />} onClick={() => navigate("/Bussiness/BussinessCollectionReportsimport")}>Reports</Button>}
          >
            <Grid container spacing={2}>
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Grid
                    key={module.path}
                    size={{
                      xs: 12,
                      sm: 6,
                      xl: 4
                    }}>
                    <Paper className="enterprise-card dashboard-module" elevation={0} sx={{ boxShadow: "none" }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box className="dashboard-module-icon"><Icon /></Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle1">{module.title}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button size="small" variant="contained" onClick={() => navigate(module.path)}>Open</Button>
                            <Button size="small" variant="outlined" startIcon={<LaunchRounded />} onClick={() => openInNewTab(module.path)}>
                              New Tab
                            </Button>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Panel>
        </Grid>
      </Grid>
    </Stack>
  );
}
