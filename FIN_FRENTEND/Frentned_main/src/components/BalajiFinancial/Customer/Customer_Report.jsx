import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Alert, Autocomplete, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { actionIcons, navIcons } from "src/lib/icons";
import { AppDatePicker, DataTable, EmptyState, ScreenHeader, formatReportDate, useDateRange } from "src/components/ui";

const GenerateIcon = actionIcons.generate;

const formatMoney = (value) =>
  value === null || value === undefined || value === "" ? "" : Number(value).toLocaleString("en-IN");

// One definition drives the grid on screen and every download / print of it.
const columns = [
  { field: "sNo", headerName: "S.No", width: 80, align: "right", headerAlign: "right" },
  { field: "customerId", headerName: "Customer ID", width: 150 },
  { field: "customerName", headerName: "Customer Name", minWidth: 240, flex: 1 },
  { field: "credits", headerName: "Credits", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatMoney(value) },
  { field: "debits", headerName: "Debits", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatMoney(value) },
  {
    field: "balance",
    headerName: "Balance",
    width: 170,
    align: "right",
    headerAlign: "right",
    // in credit reads green, overdrawn reads red
    cellClassName: (params) => (Number(params.value || 0) >= 0 ? "cell-credit" : "cell-debit"),
    valueFormatter: (value) => formatMoney(value),
  },
];

const TOTAL_FIELDS = ["credits", "debits", "balance"];
const TOTAL_LABEL_CELL = { customerName: "TOTAL" };

const Customer_Report = () => {
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);
  // The report is always for a period: 1 Jan of this year up to today unless
  // changed. `applied` is the period the rows on screen were generated for, so
  // downloads keep stating it even after the pickers are changed.
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange(
    dayjs().startOf("year").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  );
  const [applied, setApplied] = useState(null);
  const datesValid = Boolean(fromDate && toDate) && !dayjs(toDate).isBefore(dayjs(fromDate), "day");

  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Fetch Account Master Codes
  const fetchMasterCodes = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const res = await axios.get(
        `${API_BASE}/account-master-droddown/findAllMasterCodes`,
        { headers }
      );
      const options = (Array.isArray(res.data) ? res.data : []).map((code) => ({
        label: code,
        value: code,
      }));
      setAccountOptions(options);
    } catch (err) {
      console.error("Failed to fetch master codes:", err);
      setAccountOptions([]);
    } finally {
      setLoadingAccounts(false);
    }
  }, [headers]);

  // Fetch Report
  const fetchReport = useCallback(async (accountCode) => {
    if (!accountCode) return;
    if (!datesValid) {
      setError("Choose a From and To date (To on or after From).");
      return;
    }

    setLoadingReport(true);
    setError(null);
    setReportData([]); // Clear immediately to avoid old data flash

    try {
      const res = await axios.get(
        `${API_BASE}/customerReportController/${encodeURIComponent(accountCode)}/${fromDate}/${toDate}`,
        { headers }
      );
      setReportData(Array.isArray(res.data) ? res.data : []);
      setApplied({ fromDate, toDate });
    } catch (err) {
      console.error("Report fetch error:", err);
      setError("Failed to load report. Please try again.");
      setReportData([]);
    } finally {
      setLoadingReport(false);
    }
  }, [headers, fromDate, toDate, datesValid]);

  useEffect(() => {
    fetchMasterCodes();
  }, [fetchMasterCodes]);

  const handleAccountSelect = (event, newValue) => {
    setSelectedAccount(newValue);
    if (newValue?.value) {
      fetchReport(newValue.value);
    } else {
      setReportData([]);
      setApplied(null);
    }
  };

  const totals = useMemo(() => {
    const totalCredits = reportData.reduce((sum, item) => sum + (item.credits || 0), 0);
    const totalDebits = reportData.reduce((sum, item) => sum + (item.debits || 0), 0);
    const totalBalance = reportData.reduce((sum, item) => sum + (item.balance || 0), 0);
    return { totalCredits, totalDebits, totalBalance };
  }, [reportData]);

  const rows = useMemo(
    // the grid needs a unique id per row; the position in the list is always one
    () => reportData.map((row, index) => ({ ...row, id: index + 1, sNo: index + 1 })),
    [reportData]
  );

  // Credits / Debits / Balance under the grid, and on every download.
  const summary = useMemo(
    () => [
      { label: "Credits", value: totals.totalCredits },
      { label: "Debits", value: totals.totalDebits },
      { label: "Balance", value: totals.totalBalance },
    ],
    [totals]
  );

  const reportMeta = useMemo(
    () => (selectedAccount?.label ? [{ label: "Account Head", value: selectedAccount.label }] : []),
    [selectedAccount]
  );

  const period = useMemo(
    () => (applied ? { label: "Customer Report Period", fromDate: applied.fromDate, toDate: applied.toDate } : undefined),
    [applied]
  );

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.customerReport}
        title="Customer Report"
        subtitle="Credits, debits and balance of every customer under one account head."
      />

      <section className="scr-card">
        <div className="scr-toolbar">
          <div className="scr-grow scr-search">
            <Autocomplete
              openOnFocus
              size="small"
              options={accountOptions}
              loading={loadingAccounts}
              value={selectedAccount}
              onChange={handleAccountSelect}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Account Head"
                  placeholder="Choose an account..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAccounts && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>
          <div className="scr-toolbar-date">
            <AppDatePicker label="From" value={fromDate} onChange={setFromDate} />
          </div>
          <div className="scr-toolbar-date">
            <AppDatePicker
              label="To"
              value={toDate}
              onChange={setToDate}
              minDate={toDateMin}
              maxDate={toDateMax}
            />
          </div>
          <Button
            variant="contained"
            size="large"
            startIcon={<GenerateIcon />}
            onClick={() => selectedAccount?.value && fetchReport(selectedAccount.value)}
            disabled={loadingReport || !selectedAccount || !datesValid}
          >
            Generate Report
          </Button>
        </div>
      </section>

      {error && <Alert severity="error">{error}</Alert>}

      {selectedAccount ? (
        <DataTable
          title="Customer Report"
          subtitle={`Account Head: ${selectedAccount.label}${applied ? ` / ${formatReportDate(applied.fromDate)} to ${formatReportDate(applied.toDate)}` : ""}`}
          fileName="Customer_Report"
          rows={rows}
          columns={columns}
          loading={loadingReport}
          pageSize={10}
          totalFields={TOTAL_FIELDS}
          totalLabelCell={TOTAL_LABEL_CELL}
          summary={rows.length ? summary : undefined}
          period={period}
          reportMeta={reportMeta}
        />
      ) : (
        <EmptyState icon={navIcons.customerReport} title="No account head selected">
          Choose an account head above to list its customers with their credits, debits and balance.
        </EmptyState>
      )}
    </div>
  );
};

export default Customer_Report;
