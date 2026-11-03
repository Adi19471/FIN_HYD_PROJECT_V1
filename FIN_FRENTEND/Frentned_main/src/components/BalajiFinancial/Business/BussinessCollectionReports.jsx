import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { actionIcons, navIcons } from "src/lib/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import {
  AppDatePicker,
  ReportToolbar,
  TableExportMenu,
  useDateRange,
} from "src/components/ui";

const GenerateIcon = actionIcons.generate;

const money = (value) => Number(value || 0).toLocaleString("en-IN");

const emptyStatus = {
  targetCollections: 0,
  receivedCollections: 0,
  balanceCollections: 0,
};

// The old report prints one block per loan type, DF first, then MF - both
// always, even when a type has nothing in the period.
const LOAN_TYPES = [
  { key: "DAILY_FINANCE", code: "DF", name: "Daily Finance" },
  { key: "MONTHLY_FINANCE", code: "MF", name: "Monthly Finance" },
];

// The service reports matured loans as COMPLETED; MATURED is accepted too.
const statusKey = (status) => {
  const value = String(status || "").toUpperCase();
  return value === "COMPLETED" || value === "MATURED" ? "MATURED" : value;
};

const FIGURES = [
  { field: "targetCollections", label: "Target Collections" },
  { field: "receivedCollections", label: "Received Collections" },
  { field: "balanceCollections", label: "Collections Balance" },
];

const sumOf = (a, b) =>
  FIGURES.reduce((acc, { field }) => {
    acc[field] = Number(a[field] || 0) + Number(b[field] || 0);
    return acc;
  }, {});

const displayDate = (value) => dayjs(value).format("DD-MMM-YYYY");

/**
 * One "Active Loans :" style group of the old report: a caption over Target
 * and Received, a rule, then the Balance - the figures in a fixed right-hand
 * column so they line up down the block.
 */
const FigureGroup = ({ title, figures }) => (
  <Box>
    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
      {title} :
    </Typography>
    {FIGURES.map(({ field, label }) => {
      const isBalance = field === "balanceCollections";
      return (
        <Stack
          key={field}
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          spacing={2}
          sx={{ pl: { xs: 1.5, sm: 4 }, py: 0.4 }}
        >
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              minWidth: { xs: 90, sm: 150 },
              flexShrink: 0,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
              fontWeight: isBalance ? 800 : 600,
              ...(isBalance && { borderTop: "1px solid", borderColor: "text.secondary", pt: 0.4 }),
            }}
          >
            {money(figures[field])}
          </Typography>
        </Stack>
      );
    })}
  </Box>
);

// A loan type's block: the DF / MF band, Active and Matured on the left,
// their Total on the right.
const LoanTypeBlock = ({ type, active, matured }) => (
  <Box>
    <Box
      sx={{
        px: 2,
        py: 0.9,
        backgroundColor: "var(--surface-4)",
        borderLeft: "4px solid var(--brand-primary)",
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle1" component="span" sx={{ fontWeight: 800 }}>
        {type.code}
      </Typography>
      <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1.25 }}>
        {type.name}
      </Typography>
    </Box>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        columnGap: 6,
        rowGap: 2,
        px: { xs: 1, sm: 2 },
        pt: 1.5,
        pb: 1,
      }}
    >
      <Stack spacing={1.5}>
        <FigureGroup title="Active Loans" figures={active} />
        <FigureGroup title="Matured Loans" figures={matured} />
      </Stack>
      <FigureGroup title="Total Loans" figures={sumOf(active, matured)} />
    </Box>
  </Box>
);

const BussinessCollectionReports = () => {
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange(
    dayjs().startOf("month").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  );
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  // The range the figures on screen were generated for - the caption and the
  // downloads state it, not whatever the pickers have been changed to since.
  const [generatedRange, setGeneratedRange] = useState({ fromDate, toDate });

  const token = getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/businessCollectionsReport/${fromDate}/${toDate}`, { headers });
      setReportData(Array.isArray(response.data) ? response.data : []);
      setLastUpdated(dayjs());
    } catch (error) {
      setReportData([]);
      console.error("Business Collection Report Error:", error);
    } finally {
      setGeneratedRange({ fromDate, toDate });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const groupedData = useMemo(() => {
    const result = {
      DAILY_FINANCE: { ACTIVE: emptyStatus, MATURED: emptyStatus },
      MONTHLY_FINANCE: { ACTIVE: emptyStatus, MATURED: emptyStatus },
    };

    reportData.forEach((item) => {
      if (!result[item.loanType]) result[item.loanType] = {};
      result[item.loanType][statusKey(item.loanStatus)] = item;
    });

    return result;
  }, [reportData]);

  // Download / print in the same order as the screen: per loan type a band,
  // Active Loans, Matured Loans and their Total Loans.
  const screenExportRows = useMemo(() => {
    if (!reportData.length) return [];

    return LOAN_TYPES.flatMap((type) => {
      const active = groupedData[type.key]?.ACTIVE || emptyStatus;
      const matured = groupedData[type.key]?.MATURED || emptyStatus;
      const figures = (item) =>
        FIGURES.reduce((acc, { field }) => ({ ...acc, [field]: Number(item[field] || 0) }), {});

      return [
        { id: `${type.code}-band`, section: `${type.code} - ${type.name}`, __isTotal: true, __band: true },
        { id: `${type.code}-active`, section: "Active Loans", ...figures(active) },
        { id: `${type.code}-matured`, section: "Matured Loans", ...figures(matured) },
        { id: `${type.code}-total`, section: "Total Loans", __isTotal: true, ...sumOf(active, matured) },
      ];
    });
  }, [reportData, groupedData]);

  // The DF / MF band rows carry no figures - blank, not 0.
  const amountColumn = (field, headerName) => ({
    field,
    headerName,
    width: 170,
    align: "right",
    valueFormatter: (value, row) => (row?.__band ? "" : money(value)),
  });

  const screenExportColumns = [
    { field: "section", headerName: "Particulars", width: 220 },
    amountColumn("targetCollections", "Target Collections"),
    amountColumn("receivedCollections", "Received Collections"),
    amountColumn("balanceCollections", "Collections Balance"),
  ];

  const reportOptions = useMemo(
    () => ({
      period: { ...generatedRange, label: "Business Collections From" },
    }),
    [generatedRange]
  );

  return (
    <>
      {/* The company name, address and date are printed on every download;
          on screen the header names the report and says how fresh it is. */}
      <ReportToolbar
        icon={navIcons.collectionReports}
        title="Collection Reports"
        subtitle={
          lastUpdated
            ? `Collection targets, receipts and balances. Last updated ${lastUpdated.format("DD-MMM-YYYY hh:mm A")}`
            : "Collection targets, receipts and balances."
        }
        onRefresh={fetchReport}
        loading={loading}
      >
        {/* Whole-screen download / print. */}
        <TableExportMenu
          rows={screenExportRows}
          columns={screenExportColumns}
          fileName="Business_Collections_Report"
          reportOptions={reportOptions}
        />
      </ReportToolbar>

      <Stack spacing={2.5} sx={{ mt: 2 }}>
        <Paper className="enterprise-card" elevation={0} sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap alignItems="center" justifyContent="flex-end">
            {/* not full width: side by side with the button, not one per line */}
            <AppDatePicker
              label="From Date"
              size="small"
              fullWidth={false}
              value={fromDate}
              onChange={setFromDate}
            />
            <AppDatePicker
              label="To Date"
              size="small"
              fullWidth={false}
              value={toDate}
              onChange={setToDate}
              minDate={toDateMin}
              maxDate={toDateMax}
            />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <GenerateIcon />}
              onClick={fetchReport}
              disabled={loading}
            >
              {loading ? "Loading" : "Generate"}
            </Button>
          </Stack>
        </Paper>

        {/* The old Business Collections report, laid out as it prints: the
            period line, then a DF and an MF block. */}
        <Paper className="enterprise-card" elevation={0} sx={{ p: { xs: 2, sm: 3 }, position: "relative" }}>
          {loading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />}
          <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700, mb: 2.5 }}>
            Business Collections Report From {displayDate(generatedRange.fromDate)} To {displayDate(generatedRange.toDate)}
          </Typography>
          <Stack spacing={2.5}>
            {LOAN_TYPES.map((type) => (
              <LoanTypeBlock
                key={type.key}
                type={type}
                active={groupedData[type.key]?.ACTIVE || emptyStatus}
                matured={groupedData[type.key]?.MATURED || emptyStatus}
              />
            ))}
          </Stack>
        </Paper>
      </Stack>
    </>
  );
};

export default BussinessCollectionReports;
