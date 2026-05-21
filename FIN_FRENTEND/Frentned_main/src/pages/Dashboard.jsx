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
  AccountBalanceRounded,
  AddCardRounded,
  ApprovalRounded,
  ArrowForwardRounded,
  AssessmentRounded,
  CurrencyRupeeRounded,
  GroupsRounded,
  LaunchRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  RefreshRounded,
  SavingsRounded,
  WarningAmberRounded,
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
import { DataTable } from "src/components/ui";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const formatINR = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fallbackTransactions = [
  { id: "TXN-1048", customer: "Rajesh Kumar", type: "Receipt", amount: 18000, status: "Posted" },
  { id: "TXN-1047", customer: "Lakshmi Traders", type: "Loan", amount: 125000, status: "Approval" },
  { id: "TXN-1046", customer: "Mohan Rao", type: "Installment", amount: 9200, status: "Overdue" },
  { id: "TXN-1045", customer: "Sri Sai Stores", type: "Cashbook", amount: 44000, status: "Posted" },
  { id: "TXN-1044", customer: "Venkata Agency", type: "Receipt", amount: 26500, status: "Posted" },
];

const modules = [
  { title: "Customer Master", path: "/customer", note: "Profiles, KYC, search, export", icon: GroupsRounded },
  { title: "Daily Finance", path: "/Daily-Finace", note: "Daily loan register and filters", icon: CurrencyRupeeRounded },
  { title: "Monthly Finance", path: "/Monthly-Finance", note: "Monthly loan creation and reports", icon: AccountBalanceRounded },
  { title: "Quick Cash Book", path: "/Transactions/Quick_Cash_Book", note: "Fast transaction entry", icon: AddCardRounded },
  { title: "Daily Book", path: "/AccountsModules/DailyBook", note: "Cash movement and day close", icon: ReceiptLongRounded },
  { title: "Collection Report", path: "/Bussiness/BussinessCollectionReportsimport", note: "Daily and monthly collection status", icon: AssessmentRounded },
];

const fallbackCashflow = [
  { month: "Jan", income: 42, expense: 24 },
  { month: "Feb", income: 48, expense: 26 },
  { month: "Mar", income: 55, expense: 30 },
  { month: "Apr", income: 51, expense: 27 },
  { month: "May", income: 63, expense: 32 },
  { month: "Jun", income: 71, expense: 35 },
];

function KpiCard({ item, loading }) {
  const Icon = item.icon;
  return (
    <Paper className="enterprise-card dashboard-kpi" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">{item.title}</Typography>
          {loading ? <Skeleton width={150} height={42} /> : <Typography variant="h5" sx={{ mt: 0.75 }}>{item.label}</Typography>}
        </Box>
        <Box className="dashboard-kpi-icon" sx={{ color: item.tone, bgcolor: `${item.tone}18` }}>
          <Icon />
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
        <Chip size="small" label={item.delta} color={item.color || "success"} />
        <Typography variant="caption" color="text.secondary">{item.note}</Typography>
      </Stack>
    </Paper>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <Paper className="enterprise-card dashboard-panel" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const openInNewTab = (path) => window.open(path, "_blank", "noopener,noreferrer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [metrics, setMetrics] = useState({
    portfolioValue: 18700000,
    todayCollection: 318000,
    pendingDues: 684000,
    activeMembers: 928,
    dueCases: 42,
    transactionRows: fallbackTransactions,
    collectionRows: [],
    memberRows: [],
    dailySummaryRows: [],
  });

  const token = getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const today = dayjs().format("YYYY-MM-DD");
    const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
    const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");

    try {
      const [collectionsRes, dailySummaryRes, membersRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/businessCollectionsReport/${monthStart}/${monthEnd}`, { headers }),
        axios.get(`${API_BASE}/loadAllDayWiseTransactionsSummary/${today}`, { headers }),
        axios.get(`${API_BASE}/PersonalInfo/findAll`, { headers }),
      ]);

      const collectionRows = collectionsRes.status === "fulfilled" && Array.isArray(collectionsRes.value.data) ? collectionsRes.value.data : [];
      const dailySummary = dailySummaryRes.status === "fulfilled" ? dailySummaryRes.value.data || {} : {};
      const dailyRows = Array.isArray(dailySummary.cashBookSumaryViewPojoList) ? dailySummary.cashBookSumaryViewPojoList : [];
      const memberRows = membersRes.status === "fulfilled" && Array.isArray(membersRes.value.data) ? membersRes.value.data : [];

      const target = collectionRows.reduce((sum, item) => sum + Number(item.targetCollections || 0), 0);
      const received = collectionRows.reduce((sum, item) => sum + Number(item.receivedCollections || 0), 0);
      const balance = collectionRows.reduce((sum, item) => sum + Number(item.balanceCollections || 0), 0);
      const todayCollection = dailyRows.reduce(
        (sum, item) => sum + Number(item.creditAmount || item.collectionAmount || item.amount || item.receivedAmount || 0),
        0
      );

      const transactionRows = dailyRows.length
        ? dailyRows.slice(0, 8).map((item, index) => ({
            id: item.transactionId || item.id || `DAY-${index + 1}`,
            customer: item.customerName || item.name || item.accountName || item.accountNumber || "-",
            type: item.transactionType || item.transaction || item.accountMastercode || "Daily Book",
            amount: Number(item.creditAmount || item.debitAmount || item.amount || item.receivedAmount || 0),
            status: item.status || "Posted",
          }))
        : fallbackTransactions;

      setMetrics({
        portfolioValue: target || metrics.portfolioValue,
        todayCollection: todayCollection || received || metrics.todayCollection,
        pendingDues: balance || metrics.pendingDues,
        activeMembers: memberRows.length || metrics.activeMembers,
        dueCases: collectionRows.filter((item) => Number(item.balanceCollections || 0) > 0).length || metrics.dueCases,
        transactionRows,
        collectionRows,
        memberRows,
        dailySummaryRows: dailyRows,
      });
      setLastUpdated(dayjs());
    } catch (err) {
      setError("Dashboard live counts could not be refreshed. Showing last available values.");
    } finally {
      setLoading(false);
    }
  }, [headers, metrics.activeMembers, metrics.dueCases, metrics.pendingDues, metrics.portfolioValue, metrics.todayCollection]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const kpis = [
    { title: "Portfolio Value", label: formatINR(metrics.portfolioValue), delta: "Live", note: "month target", icon: AccountBalanceRounded, tone: "#0f62fe" },
    { title: "Today Collection", label: formatINR(metrics.todayCollection), delta: "Today", note: dayjs().format("DD-MMM"), icon: PaymentsRounded, tone: "#059669" },
    { title: "Pending Dues", label: formatINR(metrics.pendingDues), delta: `${metrics.dueCases} cases`, note: "collection balance", icon: WarningAmberRounded, tone: "#d97706", color: "warning" },
    { title: "Active Members", label: String(metrics.activeMembers), delta: "Realtime", note: "personal info", icon: GroupsRounded, tone: "#4338ca" },
  ];

  const collections = useMemo(() => {
    if (!metrics.collectionRows.length) {
      return [
        { label: "DF Active", value: 52 },
        { label: "DF Matured", value: 61 },
        { label: "MF Active", value: 76 },
        { label: "MF Matured", value: 69 },
      ];
    }
    return metrics.collectionRows.map((item) => ({
      label: `${String(item.loanType || "").replace("_FINANCE", "")} ${item.loanStatus || ""}`.replace("_", " "),
      value: Number(item.receivedCollections || 0),
    }));
  }, [metrics.collectionRows]);

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
      <Paper className="enterprise-card dashboard-hero" elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", xl: "row" }} spacing={2.5} justifyContent="space-between" alignItems={{ xl: "center" }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip size="small" label={COMPANY_ADDRESS} color="primary" />
              <Chip size="small" label={loading ? "Refreshing..." : "Live dashboard"} variant="outlined" />
              {lastUpdated && <Chip size="small" label={`Updated ${lastUpdated.format("hh:mm A")}`} variant="outlined" />}
            </Stack>
            <Typography variant="h3" sx={{ mt: 2 }}>{COMPANY_NAME}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
              Realtime collections, dues, ledgers, loans, reports, and daily cash operations from one admin workspace.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button startIcon={<RefreshRounded />} variant="contained" onClick={fetchDashboard} disabled={loading}>
              Refresh Counts
            </Button>
            <Button startIcon={<AddCardRounded />} variant="outlined" onClick={() => navigate("/Transactions/Quick_Cash_Book")}>
              Quick Entry
            </Button>
            <Button startIcon={<ReceiptLongRounded />} variant="outlined" onClick={() => navigate("/AccountsModules/DailyBook")}>
              Daily Book
            </Button>
            <Button startIcon={<ApprovalRounded />} variant="outlined" onClick={() => navigate("/Loans/InstalmentDues")}>
              Dues Review
            </Button>
          </Stack>
        </Stack>
        {loading && <LinearProgress sx={{ mt: 2, borderRadius: 99 }} />}
      </Paper>

      {error && <Alert severity="warning">{error}</Alert>}

      <Grid container spacing={2}>
        {kpis.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <KpiCard item={item} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Panel
            title="Finance Workspace"
            subtitle="Most-used operations with the same compact action style."
            action={<Button size="small" endIcon={<ArrowForwardRounded />} onClick={() => navigate("/Bussiness/BussinessCollectionReportsimport")}>Reports</Button>}
          >
            <Grid container spacing={2}>
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Grid item xs={12} sm={6} xl={4} key={module.path}>
                    <Paper className="enterprise-card dashboard-module" elevation={0} sx={{ boxShadow: "none" }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box className="dashboard-module-icon"><Icon /></Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle1">{module.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{module.note}</Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1.4 }}>
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

        <Grid item xs={12} lg={4}>
          <Panel title="Collection Process" subtitle="Current month received by finance status">
            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collections}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip formatter={(value) => formatINR(value)} />
                  <Bar dataKey="value" fill="var(--brand-success)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Panel>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Panel title="Revenue And Expense Trend" subtitle="Reference trend in lakh INR">
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fallbackCashflow}>
                  <defs>
                    <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#0f62fe" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.35} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stroke="#0f62fe" fill="url(#income)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expense" stroke="#d97706" fill="url(#expense)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Panel>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Panel title="Approval Health" subtitle="Workflow and audit status">
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Loan approvals</Typography>
                  <Typography variant="body2" fontWeight={900}>74%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={74} sx={{ mt: 1, height: 8, borderRadius: 99 }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Collection closure</Typography>
                  <Typography variant="body2" fontWeight={900}>89%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={89} color="success" sx={{ mt: 1, height: 8, borderRadius: 99 }} />
              </Box>
              {["Daily book closed by cashier", "Partner settlement request created", "Receipt ledger exported", "Customer KYC updated"].map((item) => (
                <Stack key={item} direction="row" spacing={1.2} alignItems="center">
                  <SavingsRounded color="primary" fontSize="small" />
                  <Typography variant="body2">{item}</Typography>
                </Stack>
              ))}
            </Stack>
          </Panel>
        </Grid>
      </Grid>

      <DataTable
        rows={metrics.transactionRows}
        columns={transactionColumns}
        height={430}
        title="Recent Transactions"
        subtitle="Live daily book rows when available, with search, export, print, pagination, and total count."
        pageSize={10}
        actions={<Button size="small" endIcon={<ArrowForwardRounded />} onClick={() => navigate("/Customer/Customer_Transactions")}>View All</Button>}
      />
    </Stack>
  );
}
