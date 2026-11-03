import React, { useMemo, useState } from "react";
import { Box, Button, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { infoToast, successToast, warningToast, errorToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader, formatReportDate, useDateRange } from "src/components/ui";

// Ledger figures read as on the printed Accounts Ledger: Indian grouping, no
// forced decimals - 26,00,000 / -1,51,700.
const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const sumBalance = (list = []) =>
  Math.round(list.reduce((sum, item) => sum + Number(item.balance || 0), 0) * 100) / 100;

// Everything before the From date counts towards the opening balance.
const LEDGER_START = "1900-01-01";

const TOTAL_FIELDS = ["credit", "debit", "balance"];
const TOTAL_LABEL_CELL = { accountMaster: "Total" };

const columns = [
  { field: "sno", headerName: "S.No", width: 80 },
  { field: "accountMaster", headerName: "Account Master", flex: 1, minWidth: 220 },
  { field: "credit", headerName: "Credit", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
  { field: "debit", headerName: "Debit", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
  { field: "balance", headerName: "Balance", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
];

const AccountLedger = () => {
  const [filterType, setFilterType] = useState("ALL");
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  // What the rows on screen were generated for - period and opening balance -
  // so the labels and every download keep saying it after the filters change.
  const [applied, setApplied] = useState(null);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  };

  const handleGenerate = async () => {
    const isRange = filterType === "DATE_RANGE";
    if (isRange && (!fromDate || !toDate)) {
      warningToast("Please select From Date and To Date");
      return;
    }

    try {
      setLoading(true);
      const url = isRange
        ? `${API_BASE}/getAccountsLedger/${fromDate}/${toDate}`
        : `${API_BASE}/getAccountsLedger`;
      // Opening balance: the net of every account up to the day before From.
      // "All" starts from the first entry, so it opens at 0.
      const dayBeforeFrom = isRange ? dayjs(fromDate).subtract(1, "day").format("YYYY-MM-DD") : null;
      const openingRequest = isRange
        ? axios
            .get(`${API_BASE}/getAccountsLedger/${LEDGER_START}/${dayBeforeFrom}`, { headers })
            .then((res) => sumBalance(res.data || []))
            .catch((err) => {
              console.error("Opening balance error:", err);
              errorToast("Could not work out the opening balance");
              return null;
            })
        : Promise.resolve(0);

      const [res, openingBalance] = await Promise.all([axios.get(url, { headers }), openingRequest]);
      const formatted = (res.data || []).map((item, index) => ({
        id: index + 1,
        sno: index + 1,
        ...item,
      }));

      setRows(formatted);
      setApplied({
        ...(isRange ? { fromDate, toDate } : {}),
        openingBalance,
        closingBalance: openingBalance === null ? null : Math.round((openingBalance + sumBalance(formatted)) * 100) / 100,
      });
      formatted.length ? successToast("Accounts ledger loaded successfully") : infoToast("No ledger records found");
    } catch (err) {
      console.error("Ledger API Error:", err);
      errorToast("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  const showBalance = (value) => (value === null || value === undefined ? "—" : formatAmount(value));

  const period = useMemo(
    () => (applied?.fromDate ? { label: "Period", fromDate: applied.fromDate, toDate: applied.toDate } : undefined),
    [applied]
  );
  // Opening Balance prints above the table, Closing Balance under it - the
  // layout of the printed Accounts Ledger.
  const reportMeta = useMemo(
    () =>
      applied
        ? [
            ...(applied.fromDate ? [] : [{ label: "Period", value: "All Dates" }]),
            { label: "Opening Balance", value: showBalance(applied.openingBalance) },
          ]
        : [],
    [applied]
  );
  const summary = useMemo(
    () => (applied ? [{ label: "Closing Balance", value: showBalance(applied.closingBalance) }] : undefined),
    [applied]
  );

  const subtitle = applied
    ? applied.fromDate
      ? `${formatReportDate(applied.fromDate)} to ${formatReportDate(applied.toDate)}`
      : "All dates"
    : "Choose All or a date range and Generate.";

  return (
    <Stack spacing={2.5}>
      <PageHeader
        onRefresh={handleGenerate}
        loading={loading}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
          <RadioGroup row value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel value="DATE_RANGE" control={<Radio />} label="Date Range" />
          </RadioGroup>
          <Box sx={{ width: { xs: "100%", md: 220 } }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} disabled={filterType === "ALL"} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: 220 } }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} disabled={filterType === "ALL"} minDate={toDateMin} maxDate={toDateMax} />
          </Box>
          <Button variant="contained" onClick={handleGenerate} disabled={loading}>
            Generate
          </Button>
        </Stack>
      </Paper>

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Accounts Ledger"
        subtitle={subtitle}
        fileName="Accounts_Ledger"
        actions={
          applied && (
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
              Opening Balance:&nbsp;
              <Box component="span" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {showBalance(applied.openingBalance)}
              </Box>
            </Typography>
          )
        }
        // Tall enough for a dozen account heads and the Total under them, as on
        // the printed sheet. Not autoHeight: the theme forces taller rows than
        // the grid measures, so a grid sized to "fit" cuts off its last rows.
        height={760}
        period={period}
        reportMeta={reportMeta}
        totalFields={TOTAL_FIELDS}
        totalLabelCell={TOTAL_LABEL_CELL}
        summary={summary}
      />
    </Stack>
  );
};

export default AccountLedger;
