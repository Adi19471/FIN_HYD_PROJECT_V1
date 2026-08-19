import React, { useMemo, useState } from "react";
import { Button, Chip, Grid, MenuItem, Paper, Stack, TextField } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast, successToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader, useDateRange } from "src/components/ui";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const loanTypes = [
  { label: "Daily Finance", value: "DAILY_FINANCE" },
  { label: "Monthly Finance", value: "MONTHLY_FINANCE" },
];

const orderByOptions = [
  { label: "Loan Start Date", value: "LOAN_START_DATE" },
  { label: "Installment Date", value: "INSTALLMENT_DATE" },
  { label: "Partner", value: "PARTNER" },
  { label: "Delayed Days", value: "DELAYED_DAYS" },
  { label: "Installment Balance", value: "INSTALLMENT_BALANCE" },
];

const labelOf = (options, value) => options.find((option) => option.value === value)?.label || value;

const InstalmentDues = () => {
  const [data, setData] = useState([]);
  const [loanType, setLoanType] = useState("");
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("INSTALLMENT_DATE");
  // Snapshot of the filters that produced the rows on screen. Exports print
  // this, not the live pickers, so a downloaded file always states the range it
  // actually covers even if the user changes the pickers afterwards.
  const [appliedFilters, setAppliedFilters] = useState(null);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${getSession("token") || ""}`,
      "Content-Type": "application/json",
    }),
    []
  );

  const getInstallmentDues = async () => {
    if (!loanType || !fromDate || !toDate) {
      errorToast("Please select Loan Type and Date Range");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/installmentDuesList`,
        { loanType, fromDate, toDate, orderBy, },
        { headers }
      );
      setData((res.data || []).map((row, index) => ({ id: row.loanId || row.sno || index + 1, sno: row.sno || index + 1, ...row })));
      setAppliedFilters({ loanType, fromDate, toDate, orderBy });
      successToast("Installment dues loaded successfully");
    } catch (error) {
      console.error("API Error:", error);
      errorToast("Failed to fetch installment dues");
    } finally {
      setLoading(false);
    }
  };

  const reportPeriod = useMemo(
    () =>
      appliedFilters
        ? {
            label: "Installments Dues From",
            fromDate: appliedFilters.fromDate,
            toDate: appliedFilters.toDate,
          }
        : undefined,
    [appliedFilters]
  );

  const reportMeta = useMemo(
    () =>
      appliedFilters
        ? [
            { label: "Loan Type", value: labelOf(loanTypes, appliedFilters.loanType) },
            { label: "Order By", value: labelOf(orderByOptions, appliedFilters.orderBy) },
          ]
        : [],
    [appliedFilters]
  );

  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "loanId", headerName: "Loan ID", width: 120 },
    { field: "customerName", headerName: "Customer", minWidth: 200, flex: 1 },
    { field: "startDate", headerName: "Start", width: 130 },
    { field: "endDate", headerName: "End", width: 130 },
    { field: "amount", headerName: "Amount", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "installmentAmount", headerName: "Inst. Amt", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "amountPaid", headerName: "Paid", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    {
      field: "installmentDue",
      headerName: "Due",
      width: 140,
      align: "right",
      headerAlign: "right",
      // renderCell draws the chip on screen; valueFormatter is what the export
      // reads, so Due prints "₹ 13,000" like its neighbours instead of raw 13000.
      valueFormatter: (value) => formatINR(value),
      renderCell: (params) =>
        params.value && !params.row.__isTotal ? (
          <Chip label={formatINR(params.value)} color="error" size="small" />
        ) : (
          params.formattedValue
        ),
    },
    { field: "noOfInstallmentsPending", headerName: "Pending", width: 120 },
    // Deliberately blank (unless the API sends `remarks`) - it carries through to
    // the Word / Excel / printed report as an empty column for the client to
    // fill in by hand, the way the legacy report's Remarks column worked.
    { field: "remarks", headerName: "Remarks", width: 200, sortable: false },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Instalment Dues"
        subtitle="Pending installment dues by loan type and date-only MUI calendar range."
        totalCount={data.length}
        onRefresh={getInstallmentDues}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <TextField select label="Loan Type" fullWidth size="small" value={loanType} onChange={(event) => setLoanType(event.target.value)}>
              {loanTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 2.4,
            }}
          >
            <TextField
              select
              label="Order By"
              fullWidth
              size="small"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              {orderByOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} minDate={toDateMin} maxDate={toDateMax} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Button fullWidth variant="contained" onClick={getInstallmentDues} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable
        rows={data}
        columns={columns}
        loading={loading}
        title="Instalment Due Details"
        height={580}
        period={reportPeriod}
        reportMeta={reportMeta}
        totalFields={["amount", "installmentAmount", "amountPaid", "installmentDue"]}
        totalLabelCell={{ customerName: "TOTAL" }}
      />
    </Stack>
  );
};

export default InstalmentDues;
