import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { Alert, Box, Button, Grid, IconButton, LinearProgress, Skeleton, Tooltip as MuiTooltip, Typography } from "@mui/material";
import {
  ArrowForwardRounded,
  AccountBalanceRounded,
  FlagRounded,
  GroupsRounded,
  PieChartRounded,
  RequestQuoteRounded,
  ShowChartRounded,
  LaunchRounded,
  PendingActionsRounded,
  PointOfSaleRounded,
  SavingsRounded,
} from "@mui/icons-material";
import { actionIcons, navIcons } from "src/lib/icons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import { DataTable } from "src/components/ui";
import { useTheme } from "@mui/material/styles";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess, PATH_PERMISSION_CODES } from "src/utils/permissions";

const RefreshRounded = actionIcons.refresh;

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

// Shortcuts into the screens people open from here most. Icons are the ones
// the menu gives each screen (src/lib/icons.js); a shortcut the signed-in user
// has no permission for is left out, the same way the menu leaves it out.
const shortcuts = [
  { title: "Quick Cash Book", path: "/Transactions/Quick_Cash_Book", icon: navIcons.quickCashBook },
  { title: "Daily Book", path: "/AccountsModules/DailyBook", icon: navIcons.dailyBook },
  { title: "Instalment Dues", path: "/Loans/InstalmentDues", icon: navIcons.instalmentDues },
  { title: "Daily Finance", path: "/Daily-Finace", icon: navIcons.loan },
  { title: "Monthly Finance", path: "/Monthly-Finance", icon: navIcons.masterLoans },
  { title: "Customer Master", path: "/customer", icon: navIcons.personalInformation },
  { title: "Collection Report", path: "/Bussiness/BussinessCollectionReportsimport", icon: navIcons.collectionReports },
];

// Loan types as the Business Share screen names them.
const LOAN_TYPE_NAMES = { DAILY_FINANCE: "Daily Finance", MONTHLY_FINANCE: "Monthly Finance" };
const loanTypeName = (value) => {
  const key = String(value || "").trim().toUpperCase();
  return LOAN_TYPE_NAMES[key] || key.replace(/_/g, " ") || "Other";
};

// Axis ticks and donut centres: ₹12.5K / ₹3.4L / ₹1.2Cr, so the axis needs
// a narrow gutter instead of a 90px one for "Rs 1,23,45,678".
const formatCompact = (value) => {
  const n = Number(value || 0);
  const abs = Math.abs(n);
  const fmt = (v, unit) => `₹${Number(v.toFixed(v >= 100 ? 0 : 1))}${unit}`;
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e7) return sign + fmt(abs / 1e7, "Cr");
  if (abs >= 1e5) return sign + fmt(abs / 1e5, "L");
  if (abs >= 1e3) return sign + fmt(abs / 1e3, "K");
  return `${sign}₹${abs.toFixed(0)}`;
};

const CHART_H = 220;
const DONUT_H = 168;

/** Legend under a ring: colour, name, amount and share of the whole. */
function DonutLegend({ rows }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  return (
    <ul className="dash-legend">
      {rows.map((row) => (
        <li key={row.name}>
          <span className="dash-legend-dot" style={{ background: row.color }} aria-hidden="true" />
          <span className="dash-legend-name">{row.name}</span>
          <span className="dash-legend-value">{formatINR(row.value)}</span>
          <span className="dash-legend-pct">{Math.round((row.value / total) * 100)}%</span>
        </li>
      ))}
    </ul>
  );
}

const formatShares = (value) =>
  Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

const formatShareValue = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const greetingFor = (hour) => (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");

/** One headline figure: icon, label, the number, and a line of context under it. */
function Kpi({ icon: Icon, tone, label, value, note, loading, children }) {
  return (
    <div className={`dash-kpi dash-tone-${tone}`}>
      <div className="dash-kpi-top">
        <span className="dash-kpi-icon" aria-hidden="true">
          <Icon />
        </span>
        <span className="dash-kpi-label">{label}</span>
      </div>
      <div className="dash-kpi-value">{loading ? <Skeleton width="68%" /> : value}</div>
      <div className="dash-kpi-note">{loading ? <Skeleton width="45%" /> : note}</div>
      {children}
    </div>
  );
}

/** A titled card: every block under the headline figures is one of these. */
function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`dash-card ${className}`}>
      <div className="dash-card-head">
        <div className="dash-card-heading">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * A chart panel's three real states: still loading, loaded with nothing to
 * plot, or loaded with data. Recharts renders an empty axis pair for [], which
 * reads as a bug rather than "no collections yet" - so the empty state is
 * handled explicitly instead of handing recharts a blank array.
 */
function ChartCard({ height = 260, loading, empty, emptyLabel, children }) {
  if (loading) return <Skeleton variant="rounded" height={height} />;
  if (empty) {
    return (
      <div className="dash-empty" style={{ height }}>
        {emptyLabel}
      </div>
    );
  }
  return (
    <Box sx={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
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

  // Business share for this month so far - the same figures as the Business
  // Share screen. It values the whole balance sheet, so it is fetched on open
  // and on Refresh, not on the 30s poll.
  const [share, setShare] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const fetchShareStatement = useCallback(async () => {
    setShareLoading(true);
    try {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().format("YYYY-MM-DD");
      const res = await axios.get(`${API_BASE}/businessShareStatement/${start}/${end}`, { headers });
      setShare(res.data && typeof res.data === "object" ? res.data : {});
    } catch {
      setShare((prev) => prev || {});
    } finally {
      setShareLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchLiveMetrics();
    fetchMemberCount();
    fetchShareStatement();
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
  }, [fetchLiveMetrics, fetchMemberCount, fetchShareStatement]);

  const completionRate = useMemo(() => {
    const target = Number(metrics.portfolioValue || 0);
    const received = Number(metrics.todayCollection || 0);
    if (!target) return 0;
    return Math.min(100, Math.round((received / target) * 100));
  }, [metrics.portfolioValue, metrics.todayCollection]);

  const collections = useMemo(() => {
    return metrics.collectionRows.map((item) => ({
      label: [loanTypeName(item.loanType).replace(" Finance", ""), item.loanStatus]
        .filter(Boolean)
        .map((part) => String(part).replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(" · "),
      value: Number(item.receivedCollections || 0),
    }));
  }, [metrics.collectionRows]);

  // Today only has one day's figures to show, so a Credit/Debit pair reads
  // better as two comparable bars than as a single-point line.
  const dailyFlowRows = useMemo(
    () => [
      { name: "Credit", value: Number(metrics.dailyTotals.credits || metrics.todayCollection || 0) },
      { name: "Debit", value: Number(metrics.dailyTotals.debits || 0) },
    ],
    [metrics.dailyTotals.credits, metrics.dailyTotals.debits, metrics.todayCollection]
  );
  // This month's collections as one whole: what came in against what is
  // still to come, so the ring reads as progress toward the target.
  const collectionSplit = useMemo(() => {
    const received = metrics.collectionRows.reduce((sum, item) => sum + Number(item.receivedCollections || 0), 0);
    const balance = metrics.collectionRows.reduce((sum, item) => sum + Math.max(0, Number(item.balanceCollections || 0)), 0);
    return [
      { name: "Received", value: received, color: theme.palette.success.main },
      { name: "Balance", value: balance, color: theme.palette.warning.main },
    ];
  }, [metrics.collectionRows, theme.palette.success.main, theme.palette.warning.main]);
  const collectionTotal = collectionSplit.reduce((sum, row) => sum + row.value, 0);
  const collectionPct = collectionTotal ? Math.round((collectionSplit[0].value / collectionTotal) * 100) : 0;

  // Per loan type from the share statement: outstanding for the ring,
  // lent against repaid for the bars.
  const loanTypeColors = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main, theme.palette.warning.main];
  const shareLoanRows = useMemo(
    () =>
      (Array.isArray(share?.loanInformation) ? share.loanInformation : []).map((row) => ({
        name: loanTypeName(row.loanType),
        outstanding: Math.max(0, Number(row.totalOutstanding || 0)),
        disbursed: Number(row.sumOfLoansDisbursedAndInterestReceivable || row.loansDisbursed || 0),
        paid: Number(row.sumOfloansPaidAndInterestPaid || row.loansPaid || 0),
      })),
    [share]
  );
  const outstandingSplit = shareLoanRows.filter((row) => row.outstanding > 0);
  const outstandingTotal = outstandingSplit.reduce((sum, row) => sum + row.outstanding, 0);
  const outstandingDonut = outstandingSplit.map((row, index) => ({
    name: row.name,
    value: row.outstanding,
    color: loanTypeColors[index % loanTypeColors.length],
  }));
  const hasLendingFlow = shareLoanRows.some((row) => row.disbursed > 0 || row.paid > 0);
  const shareFirstLoad = shareLoading && !share;

  const hasDailyFlow = dailyFlowRows.some((row) => row.value > 0);
  const hasCollections = collections.some((row) => row.value > 0);

  // Tooltip styling is the one place recharts needs the theme handed to it
  // directly - it renders its own floating box outside the app's CSS.
  const tooltipStyle = {
    contentStyle: {
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 8,
      color: theme.palette.text.primary,
      fontSize: 13,
    },
    labelStyle: { color: theme.palette.text.secondary, fontWeight: 700 },
    formatter: (value) => [formatINR(value), ""],
  };

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

  // Skeletons only before the first answer; the 30-second refresh after that
  // swaps the numbers in place instead of blanking the screen each time.
  const firstLoad = loading && !lastUpdated;
  const firstName = String(user?.name || "").trim().split(/\s+/)[0];
  const visibleShortcuts = shortcuts.filter((item) => hasPermissionAccess(user, PATH_PERMISSION_CODES[item.path]));
  const canOpen = (path) => hasPermissionAccess(user, PATH_PERMISSION_CODES[path]);

  const refresh = () => {
    fetchLiveMetrics();
    fetchMemberCount();
    fetchShareStatement();
  };

  // A ring filling its box, its headline figure in the hole; the legend
  // with the amounts sits under it as HTML (DonutLegend), not inside the SVG.
  const renderDonut = (data, centerValue, centerLabel) => (
    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
      <Pie data={data} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="96%" paddingAngle={data.length > 1 ? 2 : 0} stroke="none" isAnimationActive={false}>
        {data.map((row) => (
          <Cell key={row.name} fill={row.color} />
        ))}
      </Pie>
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="dash-donut-value">
        {centerValue}
      </text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="dash-donut-label">
        {centerLabel}
      </text>
      <Tooltip {...tooltipStyle} formatter={(value, name) => [formatINR(value), name]} />
    </PieChart>
  );

  return (
    <div className="dash">
      {/* ---------- who, when, and the two things done from here most ---------- */}
      <header className="dash-head">
        <div className="dash-head-text">
          <p className="dash-eyebrow">{dayjs().format("dddd, DD MMM YYYY")}</p>
          <h1 className="dash-title">
            {greetingFor(dayjs().hour())}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="dash-sub">
            {COMPANY_NAME} · {COMPANY_ADDRESS}
          </p>
        </div>

        <div className="dash-head-actions">
          <span className={`dash-live ${loading ? "is-loading" : ""}`} role="status">
            <span className="dash-live-dot" aria-hidden="true" />
            {loading ? "Refreshing…" : lastUpdated ? `Updated ${lastUpdated.format("hh:mm A")}` : "Live"}
          </span>
          <Button variant="outlined" startIcon={<RefreshRounded />} onClick={refresh} disabled={loading}>
            Refresh
          </Button>
          {canOpen("/Transactions/Quick_Cash_Book") && (
            <Button variant="contained" startIcon={<PointOfSaleRounded />} onClick={() => navigate("/Transactions/Quick_Cash_Book")}>
              Quick Entry
            </Button>
          )}
        </div>
        {loading && <LinearProgress className="dash-head-progress" />}
      </header>

      {error && <Alert severity="warning">{error}</Alert>}

      {/* ---------- the four figures ---------- */}
      <div className="dash-kpis">
        <Kpi icon={SavingsRounded} tone="success" label="Collection" value={formatINR(metrics.todayCollection)} note="today" loading={firstLoad} />
        <Kpi
          icon={PendingActionsRounded}
          tone="warning"
          label="Pending dues"
          value={formatINR(metrics.pendingDues)}
          note={`${metrics.dueCases} ${metrics.dueCases === 1 ? "case" : "cases"} this month`}
          loading={firstLoad}
        />
        <Kpi
          icon={FlagRounded}
          tone="primary"
          label="Completion"
          value={`${completionRate}%`}
          note={`against ${formatINR(metrics.portfolioValue)} target`}
          loading={firstLoad}
        >
          <div className="dash-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completionRate} aria-label="Collection against target">
            <span style={{ width: `${completionRate}%` }} />
          </div>
        </Kpi>
        <Kpi icon={GroupsRounded} tone="info" label="Members" value={Number(metrics.activeMembers || 0).toLocaleString("en-IN")} note="active" loading={firstLoad} />
      </div>

      {/* ---------- today's cash position: opening + credits - debits = closing ---------- */}
      <section className="dash-card dash-position" aria-label="Today's cash position">
        <div className="dash-position-item">
          <span>Opening balance</span>
          <strong>{firstLoad ? <Skeleton width={110} /> : formatINR(metrics.dailyTotals.openingBalance)}</strong>
        </div>
        <span className="dash-op" aria-hidden="true">+</span>
        <div className="dash-position-item is-credit">
          <span>Credits today</span>
          <strong>{firstLoad ? <Skeleton width={110} /> : formatINR(metrics.dailyTotals.credits)}</strong>
        </div>
        <span className="dash-op" aria-hidden="true">−</span>
        <div className="dash-position-item is-debit">
          <span>Debits today</span>
          <strong>{firstLoad ? <Skeleton width={110} /> : formatINR(metrics.dailyTotals.debits)}</strong>
        </div>
        <span className="dash-op" aria-hidden="true">=</span>
        <div className="dash-position-item is-closing">
          <span>Closing balance</span>
          <strong>{firstLoad ? <Skeleton width={110} /> : formatINR(metrics.dailyTotals.closingBalance)}</strong>
        </div>
      </section>


      {/* ---------- business share: the figures of the Business Share screen ---------- */}
      <Panel
        className="dash-card-compact"
        title="Business share"
        subtitle={`${dayjs().startOf("month").format("DD MMM")} – ${dayjs().format("DD MMM YYYY")}`}
        action={
          canOpen("/Bussiness/BussinessShare") && (
            <Button size="small" endIcon={<ArrowForwardRounded />} onClick={() => navigate("/Bussiness/BussinessShare")}>
              Business Share
            </Button>
          )
        }
      >
        <div className="dash-share-strip">
          {[
            { icon: PieChartRounded, tone: "primary", label: "Total shares", value: formatShares(share?.totalShares) },
            { icon: ShowChartRounded, tone: "success", label: "Value per share", value: formatShareValue(share?.valuePerShare) },
            { icon: AccountBalanceRounded, tone: "info", label: "Net business value", value: formatINR(share?.netBusinessValue) },
            { icon: RequestQuoteRounded, tone: "warning", label: "Loans outstanding", value: formatINR(share?.loansOutstanding) },
          ].map(({ icon: Icon, tone, label, value }) => (
            <div key={label} className={`dash-share-item dash-tone-${tone}`}>
              <span className="dash-kpi-icon" aria-hidden="true">
                <Icon />
              </span>
              <div className="dash-share-text">
                <span>{label}</span>
                <strong>{shareFirstLoad ? <Skeleton width={90} /> : value}</strong>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Grid container spacing={2}>
        {/* ---------- this month's collections: by type, and as a whole ---------- */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Panel title="Collections this month" subtitle="Received, by loan type and status">
            <ChartCard height={CHART_H} loading={loading && !collections.length} empty={!hasCollections} emptyLabel="No collections recorded for this month yet.">
              <BarChart data={collections} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} interval={0} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickFormatter={formatCompact} width={48} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: theme.palette.action.hover }} />
                <Bar dataKey="value" name="Received" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ChartCard>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Panel title="Collection status" subtitle="Received vs balance">
            <ChartCard height={DONUT_H} loading={firstLoad} empty={!collectionTotal} emptyLabel="No collections due this month yet.">
              {renderDonut(collectionSplit, `${collectionPct}%`, "collected")}
            </ChartCard>
            {!!collectionTotal && <DonutLegend rows={collectionSplit} />}
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Panel title="Outstanding" subtitle="By loan type">
            <ChartCard height={DONUT_H} loading={shareFirstLoad} empty={!outstandingTotal} emptyLabel="No loans outstanding.">
              {renderDonut(outstandingDonut, formatCompact(outstandingTotal), "total")}
            </ChartCard>
            {!!outstandingTotal && <DonutLegend rows={outstandingDonut} />}
          </Panel>
        </Grid>

        {/* ---------- money in and out: today, and lending this month ---------- */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Panel title="Today's cash flow" subtitle={dayjs().format("DD MMM YYYY")}>
            <ChartCard height={CHART_H} loading={loading && !hasDailyFlow} empty={!hasDailyFlow} emptyLabel="No credit or debit posted for today yet.">
              <BarChart data={dailyFlowRows} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickFormatter={formatCompact} width={48} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: theme.palette.action.hover }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={56}>
                  {dailyFlowRows.map((row) => (
                    <Cell key={row.name} fill={row.name === "Credit" ? theme.palette.success.main : theme.palette.error.main} />
                  ))}
                </Bar>
              </BarChart>
            </ChartCard>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Panel title="Lent vs repaid" subtitle="This month, principal + interest">
            <ChartCard height={CHART_H} loading={shareFirstLoad} empty={!hasLendingFlow} emptyLabel="Nothing lent or repaid this month yet.">
              <BarChart data={shareLoanRows} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} tickFormatter={formatCompact} width={48} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: theme.palette.action.hover }} formatter={(value, name) => [formatINR(value), name]} />
                <Legend verticalAlign="top" align="right" height={22} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="disbursed" name="Lent" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="paid" name="Repaid" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ChartCard>
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Panel title="Shortcuts" subtitle="Open here, or in a new tab">
            <ul className="dash-links">
              {visibleShortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path} className="dash-link">
                    <button type="button" className="dash-link-main" onClick={() => navigate(item.path)}>
                      <span className="dash-link-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="dash-link-title">{item.title}</span>
                      <ArrowForwardRounded className="dash-link-arrow" aria-hidden="true" />
                    </button>
                    <MuiTooltip title="Open in a new tab" arrow>
                      <IconButton size="small" onClick={() => openInNewTab(item.path)} aria-label={`Open ${item.title} in a new tab`}>
                        <LaunchRounded fontSize="small" />
                      </IconButton>
                    </MuiTooltip>
                  </li>
                );
              })}
            </ul>
            {visibleShortcuts.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No shortcuts are available for your account.
              </Typography>
            )}
          </Panel>
        </Grid>

        <Grid size={12}>
          <Panel
            title="Recent transactions"
            subtitle="Today's postings from the daily book"
            className="dash-card-flush"
            action={
              canOpen("/AccountsModules/DailyBook") && (
                <Button size="small" endIcon={<ArrowForwardRounded />} onClick={() => navigate("/AccountsModules/DailyBook")}>
                  Daily Book
                </Button>
              )
            }
          >
            {metrics.transactionRows.length === 0 && !loading ? (
              <div className="dash-empty" style={{ height: 120 }}>
                No transactions posted today yet.
              </div>
            ) : (
              <DataTable
                rows={metrics.transactionRows}
                columns={transactionColumns}
                loading={loading && metrics.transactionRows.length === 0}
                height={340}
                pageSize={5}
                disableRowSelectionOnClick
              />
            )}
          </Panel>
        </Grid>
      </Grid>
    </div>
  );
}
