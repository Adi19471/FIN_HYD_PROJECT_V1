import React, { useMemo, useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast, successToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader, isTotalRow, useDateRange } from "src/components/ui";
import { navIcons } from "src/lib/icons";

// The report prints plain grouped figures, the way the legacy dues report did -
// a rupee sign on every line of a two-line cell only crowds the column.
const money = (value) => Number(value || 0).toLocaleString("en-IN");

const dash = (value) => (value === 0 ? "0" : value ? String(value) : "-");

// Installments paid is not sent by the API yet; until it is, the figure the
// legacy report showed is the paid amount divided by one installment.
const paidCount = (row) => {
  if (row.noOfInstallmentsPaid != null) return row.noOfInstallmentsPaid;
  const installment = Number(row.installmentAmount || 0);
  return installment ? Math.floor(Number(row.amountPaid || 0) / installment) : "";
};

/**
 * The legacy report stacked two related figures in one column - the loan
 * amount over duration/installment, the paid amount over how many installments
 * that is - so a whole loan reads across one line of the page. These cells do
 * the same: the figure on top, its companion underneath.
 */
const TwoLine = ({ top, bottom, align = "left", tone, wrap = false }) => (
  <Stack
    spacing={0.15}
    sx={{
      width: "100%",
      py: 0.75,
      alignItems: align === "right" ? "flex-end" : "flex-start",
      textAlign: align,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontWeight: 700,
        lineHeight: 1.25,
        color: tone,
        ...(wrap
          ? {
            whiteSpace: "normal", wordBreak: "break-word", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
          }
          : {}),
      }}
    >
      {top}
    </Typography>
    {bottom !== "" && bottom != null && (
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          lineHeight: 1.2,
          ...(wrap
            ? {
              whiteSpace: "normal", wordBreak: "break-word", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
            }
            : {}),
        }}
      >
        {bottom}
      </Typography>
    )}
  </Stack>
);

// Column headings carry the same pairing as the cells under them.
const TwoLineHeader = ({ top, bottom, align = "left" }) => (
  <Box sx={{ lineHeight: 1.2, textAlign: align, textTransform: "uppercase", fontWeight: 800, fontSize: "0.75rem" }}>
    <Box>{top}</Box>
    <Box>{bottom}</Box>
  </Box>
);

// Monthly first: it is the book the office works most.
const loanTypes = [
  { label: "Monthly Finance", value: "MONTHLY_FINANCE" },
  { label: "Daily Finance", value: "DAILY_FINANCE" },
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
  const [loanType, setLoanType] = useState("MONTHLY_FINANCE");
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("INSTALLMENT_DATE");
  // On by default, the same way the partner dues report opens - closed loans
  // stay out of the list unless the office asks for them.
  const [activeLoans, setActiveLoans] = useState(true);
  const [showReceivedDues, setShowReceivedDues] = useState(false);


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
        { loanType, fromDate, toDate, orderBy, activeLoans,showReceivedDues },
        { headers }
      );
      setData((res.data || []).map((row, index) => ({ id: row.loanId || row.sno || index + 1, sno: row.sno || index + 1, ...row })));
      setAppliedFilters({ loanType, fromDate, toDate, orderBy, activeLoans ,showReceivedDues});
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
          { label: "Active Loans", value: appliedFilters.activeLoans ? "Yes" : "No" },
          { label: "Show Received Dues", value: appliedFilters.showReceivedDues ? "Yes" : "No" },
        ]
        : [],
    [appliedFilters]
  );

  // Column layout follows the legacy dues report: S.No, Loan ID, Customer,
  // Guarantor over Partner, Start over End, Amount over Duration/Installment,
  // each paid / due figure over its installment count, Late Fee and a blank
  // Remarks column the office fills in by hand. renderCell draws the two lines;
  // valueFormatter is what the Word / Excel / printed report reads, so each
  // exported cell carries both figures on one line.
  const showReceivedColumn = Boolean(appliedFilters?.showReceivedDues);

  const columns = [
    { field: "sno", headerName: "S.No", width: 70, align: "center", headerAlign: "center" },
    { field: "loanId", headerName: "Loan ID", width: 118 },
    {
      field: "customerName",
      headerName: "Customer Name / Mobile",
      renderHeader: () => <TwoLineHeader top="Customer Name" bottom="Mobile Number" />,
      minWidth: 210,
      flex: 1.2,
      exportParts: [
        { header: "Customer Name", value: (row) => row.customerName || "-" },
        { header: "Mobile Number", value: (row) => row.customerMobile || "-", nowrap: true },
      ],
      valueFormatter: (value, row) =>
        isTotalRow(row) ? value : [value, row.customerMobile].filter(Boolean).join(" / ") || "-",
      renderCell: (params) =>
        isTotalRow(params.row) ? params.value : (
          <TwoLine top={params.row.customerName || "-"} bottom={params.row.customerMobile || "-"} wrap />
        ),
    },
    {
      field: "guarentorName",
      headerName: "Guarantor / Partner Name",
      renderHeader: () => <TwoLineHeader top="Guarantor Name" bottom="Partner Name" />,
      minWidth: 210,
      flex: 1.2,
      sortable: false,
      exportParts: [
        { header: "Guarantor Name", value: (row) => row.guarentorName || "-" },
        { header: "Partner Name", value: (row) => row.partnerName || "-" },
      ],
      // Both names are POJO fields the dues API does not fill in yet - the
      // column is wired to them so it lights up the moment the service does.
      valueFormatter: (value, row) =>
        isTotalRow(row) ? "" : [value, row.partnerName].filter(Boolean).join(" / ") || "-",
      renderCell: (params) =>
        isTotalRow(params.row) ? "" : (
          <TwoLine top={params.row.guarentorName || "-"} bottom={params.row.partnerName || "-"} wrap />
        ),
    },
    {
      field: "startDate",
      headerName: "Start/End Date",
      renderHeader: () => <TwoLineHeader top="Start/End" bottom="Date" />,
      width: 128,
      // Print: start date over end date, each kept on one line.
      // Excel / CSV: separate Start Date and End Date columns.
      exportParts: [
        { header: "Start Date", value: (row) => row.startDate || "-", nowrap: true },
        { header: "End Date", value: (row) => row.endDate || "-", nowrap: true },
      ],
      valueFormatter: (value, row) =>
        isTotalRow(row) ? "" : [value, row.endDate].filter(Boolean).join(" / ") || "-",
      renderCell: (params) =>
        isTotalRow(params.row) ? "" : (
          <TwoLine top={params.row.startDate || "-"} bottom={params.row.endDate || "-"} />
        ),
    },
    {
      field: "amount",
      headerName: "Amount Dur/Inst.",
      renderHeader: () => <TwoLineHeader top="Amount" bottom="Dur/Inst." align="right" />,
      width: 140,
      align: "right",
      headerAlign: "right",
      exportParts: [
        { header: "Amount", value: (row) => row.amount, format: (value) => money(value), nowrap: true },
        // Excel / CSV only; in print the duration shares the line below.
        { header: "Duration", value: (row) => row.totalNoOfInstallments, print: false },
        {
          header: "Installment Amount",
          value: (row) => row.installmentAmount,
          format: (_, row) => `${dash(row.totalNoOfInstallments)}/${money(row.installmentAmount)}`,
          nowrap: true,
        },
      ],
      valueFormatter: (value, row) =>
        isTotalRow(row)
          ? money(value)
          : `${money(value)} (${dash(row.totalNoOfInstallments)}/${money(row.installmentAmount)})`,
      renderCell: (params) =>
        isTotalRow(params.row) ? money(params.value) : (
          <TwoLine
            align="right"
            top={money(params.value)}
            bottom={`${dash(params.row.totalNoOfInstallments)}/${money(params.row.installmentAmount)}`}
          />
        ),
    },
    {
      field: "amountPaid",
      headerName: "Inst. Paid",
      width: 120,
      align: "right",
      headerAlign: "right",
      exportParts: [
        { header: "Inst. Paid", value: (row) => row.amountPaid, format: (value) => money(value), nowrap: true },
        { header: "Inst. Paid (No.)", value: (row) => paidCount(row), format: (value) => dash(value) },
      ],
      valueFormatter: (value, row) =>
        isTotalRow(row) ? money(value) : `${money(value)} (${dash(paidCount(row))})`,
      renderCell: (params) =>
        isTotalRow(params.row) ? money(params.value) : (
          <TwoLine align="right" top={money(params.value)} bottom={dash(paidCount(params.row))} />
        ),
    },
    // Amount received inside the selected period (currentMonthPaidAmount).
    // Shown only when the loaded report was run with "Show Received Dues"
    // ticked; it follows appliedFilters, not the live checkbox, so the columns
    // always match the rows on screen and the exported file.
    showReceivedColumn && {
      field: "currentMonthPaidAmount",
      headerName: "Received",
      renderHeader: () => <TwoLineHeader top="Received" bottom="" align="right" />,
      width: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => money(value),
      renderCell: (params) =>
        isTotalRow(params.row) ? money(params.value) : (
          <TwoLine align="right" tone="success.main" top={money(params.value)} bottom="" />
        ),
    },
    {
      field: "installmentDue",
      headerName: "Inst. Dues",
      width: 120,
      align: "right",
      headerAlign: "right",
      exportParts: [
        { header: "Inst. Dues", value: (row) => row.installmentDue, format: (value) => money(value), nowrap: true },
        { header: "Inst. Pending (No.)", value: (row) => row.noOfInstallmentsPending, format: (value) => dash(value) },
      ],
      valueFormatter: (value, row) =>
        isTotalRow(row) ? money(value) : `${money(value)} (${dash(row.noOfInstallmentsPending)})`,
      renderCell: (params) =>
        isTotalRow(params.row) ? money(params.value) : (
          <TwoLine
            align="right"
            tone="error.main"
            top={money(params.value)}
            bottom={dash(params.row.noOfInstallmentsPending)}
          />
        ),
    },
    {
      field: "lateFee",
      headerName: "Late Fee",
      width: 108,
      align: "right",
      headerAlign: "right",
      exportParts: [
        { header: "Late Fee", value: (row) => row.lateFee, format: (value) => money(value), nowrap: true },
        {
          header: "Delayed Days",
          value: (row) => row.delayedDays ?? "",
          format: (value) => (value === "" ? "" : `(${value})`),
        },
      ],
      valueFormatter: (value, row) =>
        isTotalRow(row) || row.delayedDays == null
          ? money(value)
          : `${money(value)} (${row.delayedDays})`,
      renderCell: (params) =>
        isTotalRow(params.row) ? money(params.value) : (
          <TwoLine
            align="right"
            top={money(params.value)}
            bottom={params.row.delayedDays != null ? `(${params.row.delayedDays})` : ""}
          />
        ),
    },
    // Deliberately blank (unless the API sends `remarks`) - it carries through to
    // the Word / Excel / printed report as an empty column for the client to
    // fill in by hand, the way the legacy report's Remarks column worked.
    { field: "remarks", headerName: "Remarks", width: 170, sortable: false },
  ].filter(Boolean);

  return (
    <Stack spacing={2.5}>
      <PageHeader
        icon={navIcons.instalmentDues}
        title="Instalment Dues"
        subtitle="Instalments paid and still due on daily or monthly loans."
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
              md: 2
            }}>
            <FormControlLabel
              control={<Checkbox checked={activeLoans} onChange={(event) => setActiveLoans(event.target.checked)} />}
              label="Active Loans"
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <FormControlLabel
              control={<Checkbox checked={showReceivedDues} onChange={(event) => setShowReceivedDues(event.target.checked)} />}
              label="Show Received Dues"
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Button variant="contained" onClick={getInstallmentDues} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable
        rows={data}
        columns={columns}
        loading={loading}
        fileName="Instalment Due Details"
        height={580}
        period={reportPeriod}
        reportMeta={reportMeta}
        totalFields={
          showReceivedColumn
            ? ["amount", "amountPaid", "currentMonthPaidAmount", "installmentDue", "lateFee"]
            : ["amount", "amountPaid", "installmentDue", "lateFee"]
        }
        totalLabelCell={{ customerName: "TOTAL" }}
        // Two figures per cell need the taller row and the two-line headings
        // the legacy report used.
        rowHeight={64}
        columnHeaderHeight={62}
      />
    </Stack>
  );
};

export default InstalmentDues;
