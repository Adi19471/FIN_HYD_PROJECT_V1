import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { AppDatePicker, ReportCompanyHeader, TableExportMenu, useDateRange as useDateRangeHook } from "src/components/ui";

// The endpoint takes its range as two path segments, so "All" still has to send
// a pair of dates - a window wide enough to hold every record stands in for
// "no filter".
const ALL_FROM_DATE = "2000-01-01";
const ALL_TO_DATE = "2099-12-31";

// The legacy report prints a fixed DF row over an MF row, whether or not either
// had activity in the range, so the two tables always read the same way.
const LOAN_TYPES = [
  { code: "DAILY_FINANCE", label: "DF" },
  { code: "MONTHLY_FINANCE", label: "MF" },
];

const typeCode = (value) => String(value || "").trim().toUpperCase();

// Plain Indian-grouped whole rupees, the way the legacy report prints them - no
// symbol, no decimals, and a blank cell rather than a 0 where there is no
// figure at all.
const amount = (value) =>
  value === null || value === undefined || value === ""
    ? ""
    : Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// Blank + blank stays blank, so an untouched row does not print a 0 total.
const addOrNull = (first, second) =>
  first == null && second == null ? null : Number(first || 0) + Number(second || 0);

const sumField = (rows, field) => rows.reduce((total, row) => total + Number(row[field] || 0), 0);

/**
 * One API row in the legacy report's shape. The service fills
 * sumOfLoansDisbursedAndInterestReceivable but never sets the paid-side sum, so
 * both totals are added up here instead - that keeps Total (X+Y) populated
 * whichever way the service goes.
 *
 * totalOutstanding / outstandingExcludingInterest feed the second table. They
 * are not on BusinessSharePojo yet; the columns are wired to them so the
 * section lights up the moment the service sends them.
 */
const toRow = (row, label) => {
  const loansDisbursed = row?.loansDisbursed ?? null;
  const interestReceivable = row?.interestReceivable ?? null;
  const loansPaid = row?.loansPaid ?? null;
  const interestPaid = row?.interestPaid ?? null;

  return {
    id: label,
    loanType: label,
    loansDisbursed,
    interestReceivable,
    totalReceivable: addOrNull(loansDisbursed, interestReceivable),
    loansPaid,
    interestPaid,
    totalPaid: addOrNull(loansPaid, interestPaid),
    totalOutstanding: row?.totalOutstanding ?? null,
    outstandingExcludingInterest: row?.outstandingExcludingInterest ?? null,
  };
};

const buildRows = (data) => {
  const byType = new Map(data.map((row) => [typeCode(row.loanType), row]));
  const known = LOAN_TYPES.map(({ code, label }) => toRow(byType.get(code), label));
  // Anything the API sends that is not DF or MF still gets a row of its own.
  const extras = data
    .filter((row) => !LOAN_TYPES.some((type) => type.code === typeCode(row.loanType)))
    .map((row) => toRow(row, row.loanType || "-"));

  return [...known, ...extras];
};

const DISBURSED_FIELDS = [
  "loansDisbursed",
  "interestReceivable",
  "totalReceivable",
  "loansPaid",
  "interestPaid",
  "totalPaid",
];

const OUTSTANDING_FIELDS = ["totalOutstanding", "outstandingExcludingInterest"];

// What the business is worth gets split over the partners' shares. The service
// sends the count it holds, but personal_info.SHARES is still blank for most
// partners, which makes that total 1 rather than a real count - so the field on
// screen only takes the API's number when it is one, and otherwise stays at the
// 13 the business runs on today.
const DEFAULT_TOTAL_SHARES = 13;

// The per-share figure is the one line that is not whole rupees - paise matter
// once a total is cut into shares.
const perShareAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Excel / PDF / Word / CSV / Print read these. Amounts stay raw numbers so Excel
// keeps them summable; valueFormatter only dresses up the documents.
const exportColumns = [
  { field: "loanType", headerName: "Loan Type", width: 110 },
  { field: "loansDisbursed", headerName: "Loans Disbursed (A)", width: 150, align: "right", valueFormatter: (value) => amount(value) },
  { field: "interestReceivable", headerName: "Interest Receivable (B)", width: 160, align: "right", valueFormatter: (value) => amount(value) },
  { field: "totalReceivable", headerName: "Total (A+B)", width: 140, align: "right", valueFormatter: (value) => amount(value) },
  { field: "loansPaid", headerName: "Loans Paid (X)", width: 140, align: "right", valueFormatter: (value) => amount(value) },
  { field: "interestPaid", headerName: "Interest Paid (Y)", width: 140, align: "right", valueFormatter: (value) => amount(value) },
  { field: "totalPaid", headerName: "Total (X+Y)", width: 140, align: "right", valueFormatter: (value) => amount(value) },
];

// The legacy report's boxed grid. Banding the head is left to the app's design
// layer, which already gives every table head its surface and weight; the Total
// row borrows the same surface so the two bands read as a pair.
const cellSx = { border: "1px solid", borderColor: "divider", py: 0.75 };
const headSx = { ...cellSx, lineHeight: 1.25 };
const totalSx = { ...cellSx, backgroundColor: "var(--surface-2)", fontWeight: 700 };

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontWeight: 700, mt: 3, mb: 1 }}>{children}</Typography>
);

const BussinessShare = () => {
  // Controls State
  const [useDateRange, setUseDateRange] = useState(true);        // true = Date Range, false = All
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRangeHook(
    dayjs().startOf("month").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  );

  const [rows, setRows] = useState([]);
  // Everything under the loan tables - what is still owed, what the business
  // holds and what it owes as on the report's To date - is worked out by the
  // service and arrives with the statement.
  const [valueOfBusiness, setValueOfBusiness] = useState(null);
  // Held as text so the field can be emptied while it is being retyped; the
  // block falls back to 13 for anything that is not a positive number.
  const [shareCount, setShareCount] = useState(String(DEFAULT_TOTAL_SHARES));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Range that produced the rows on screen. The banner and the exports print
  // this, not the live pickers, so a download always states the period it
  // actually covers.
  const [appliedRange, setAppliedRange] = useState(null);

  const fetchData = async () => {
    if (useDateRange && (!fromDate || !toDate)) {
      setError("Please select both From and To dates.");
      return;
    }

    const token = getSession()?.token || getSession("token") || "";
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    const from = useDateRange ? dayjs(fromDate).format("YYYY-MM-DD") : ALL_FROM_DATE;
    const to = useDateRange ? dayjs(toDate).format("YYYY-MM-DD") : ALL_TO_DATE;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_BASE}/businessShareStatement/${from}/${to}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // The service used to answer with the loan rows alone. If that is what
      // comes back - an older build behind a newer screen - the report still
      // prints and only the value block goes quiet.
      const payload = res.data;
      const loanRows = Array.isArray(payload) ? payload : payload?.loanInformation;
      const value = Array.isArray(payload) ? null : payload;

      setRows(buildRows(Array.isArray(loanRows) ? loanRows : []));
      setValueOfBusiness(value);

      // A share count worth having takes the field over; a blank SHARES column
      // answers 1, which is not one.
      const shares = Number(value?.totalShares || 0);
      if (shares > 1) setShareCount(String(shares));

      setAppliedRange({ fromDate: from, toDate: to, allRecords: !useDateRange });
    } catch (err) {
      console.error("Error fetching business share statement:", err);
      setRows([]);
      setValueOfBusiness(null);
      setAppliedRange(null);
      setError(err.response?.data?.message || "Failed to fetch Business Share Statement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const disbursedTotals = useMemo(
    () => DISBURSED_FIELDS.reduce((totals, field) => ({ ...totals, [field]: sumField(rows, field) }), {}),
    [rows]
  );

  // The outstanding table only appears once the API actually sends the figures.
  const outstandingRows = useMemo(
    () => rows.filter((row) => OUTSTANDING_FIELDS.some((field) => row[field] != null)),
    [rows]
  );

  const outstandingTotals = useMemo(
    () => OUTSTANDING_FIELDS.reduce((totals, field) => ({ ...totals, [field]: sumField(outstandingRows, field) }), {}),
    [outstandingRows]
  );

  /**
   * The block the partners asked for: everything the business holds, less
   * everything it owes, split over the shares. Every figure but the split
   * itself is worked out by the service, as on the report's To date - the loans
   * still owed from the loan ledger, the rest from the balance sheet.
   */
  const valueBlock = useMemo(() => {
    const figure = (field) => Number(valueOfBusiness?.[field] || 0);

    const netValue = figure("netBusinessValue");
    const shares = Number(shareCount) > 0 ? Number(shareCount) : DEFAULT_TOTAL_SHARES;

    return {
      loansOutstanding: figure("loansOutstanding"),
      advances: figure("advances"),
      bankDeposits: figure("bankDeposits"),
      cashInHand: figure("cashInHand"),
      otherAssets: figure("otherAssets"),
      totalAssets: figure("totalAssets"),
      handLoans: figure("handLoans"),
      fdDeposits: figure("fdDeposits"),
      otherLiabilities: figure("otherLiabilities"),
      totalLiabilities: figure("totalLiabilities"),
      netValue,
      shares,
      valuePerShare: netValue / shares,
    };
  }, [valueOfBusiness, shareCount]);

  // One list drives the printed block and the exported summary, so a download
  // can never disagree with the screen. `less` lines are the ones taken off.
  const valueLines = useMemo(
    () => [
      { label: "Total Loans Outstanding", value: valueBlock.loansOutstanding },
      { label: "Advances", value: valueBlock.advances },
      { label: "Bank Deposits", value: valueBlock.bankDeposits },
      { label: "Cash in Hand", value: valueBlock.cashInHand },
      { label: "Other Assets", value: valueBlock.otherAssets },
      { label: "Total Assets (A)", value: valueBlock.totalAssets, strong: true },
      { label: "Hand Loans", value: valueBlock.handLoans, less: true },
      { label: "FD Deposits", value: valueBlock.fdDeposits, less: true },
      { label: "Other Liabilities", value: valueBlock.otherLiabilities, less: true },
      { label: "Total Liabilities (B)", value: valueBlock.totalLiabilities, strong: true },
      { label: "Net Business Value (A - B)", value: valueBlock.netValue, strong: true },
    ],
    [valueBlock]
  );

  // An older service sends the loan rows alone, and the block would otherwise
  // print a screenful of zeros without saying why.
  const valueError =
    rows.length && !valueOfBusiness
      ? "Business value figures were not sent by the service - it may be an older build."
      : "";

  // The value block is a position as on a date rather than a range, so it names
  // the date it was taken - the report's To date - unless the run was for All.
  const asOnLabel =
    appliedRange && !appliedRange.allRecords
      ? ` as on ${dayjs(appliedRange.toDate).format("DD-MMM-YYYY")}`
      : "";

  const reportTitle = appliedRange
    ? appliedRange.allRecords
      ? "Business Share - All"
      : `Business Share From ${dayjs(appliedRange.fromDate).format("DD-MMM-YYYY")} To ${dayjs(appliedRange.toDate).format("DD-MMM-YYYY")}`
    : "Business Share";

  // The on-screen Total row, carried into every export. __isTotal is what the
  // exporters read to render it bold.
  const exportRows = useMemo(
    () => (rows.length ? [...rows, { id: "total", loanType: "Total", ...disbursedTotals, __isTotal: true }] : []),
    [rows, disbursedTotals]
  );

  // Exports carry one table, so the outstanding figures ride along as summary
  // lines printed under it.
  const reportOptions = useMemo(
    () => ({
      period: appliedRange?.allRecords
        ? undefined
        : { fromDate: appliedRange?.fromDate, toDate: appliedRange?.toDate, label: "Business Share From" },
      meta: [{ label: "Range", value: appliedRange?.allRecords ? "All" : "Date Range" }],
      summary: [
        ...(outstandingRows.length
          ? [
              { label: "Total Outstanding", value: outstandingTotals.totalOutstanding },
              { label: "Outstanding Excluding Interest", value: outstandingTotals.outstandingExcludingInterest },
            ]
          : []),
        // Printed the way the block reads: what comes off carries its minus,
        // though a nil line stays a plain 0 instead of turning into -0.00.
        ...valueLines.map((line) => ({ label: line.label, value: line.less && line.value ? -line.value : line.value })),
        // A count, not a figure, so it goes as text and does not print as 13.00.
        { label: "No. of Shares", value: String(valueBlock.shares) },
        { label: "Value Per Share", value: valueBlock.valuePerShare },
      ],
      orientation: "landscape",
    }),
    [appliedRange, outstandingRows, outstandingTotals, valueLines, valueBlock]
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={1}>
        <Typography variant="h6" fontWeight={700}>
          Business Share
        </Typography>
        {/* Single download entry point: Excel / PDF / Word / CSV / Print. */}
        <TableExportMenu
          rows={exportRows}
          columns={exportColumns}
          fileName="Business-Share"
          reportOptions={reportOptions}
        />
      </Stack>

      {/* FILTER BAR - All / Date Range / From / To / Generate, as the legacy screen laid it out */}
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl>
              <RadioGroup
                row
                value={useDateRange ? "range" : "all"}
                onChange={(event) => setUseDateRange(event.target.value === "range")}
              >
                <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
                <FormControlLabel value="range" control={<Radio size="small" />} label="Date Range" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <AppDatePicker label="From" value={fromDate} onChange={setFromDate} disabled={!useDateRange} />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <AppDatePicker
              label="To"
              value={toDate}
              onChange={setToDate}
              minDate={toDateMin}
              maxDate={toDateMax}
              disabled={!useDateRange}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchData}
              disabled={loading || (useDateRange && (!fromDate || !toDate))}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* REPORT */}
      {loading ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <CircularProgress />
        </Paper>
      ) : rows.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography color="text.secondary">
            No data found. Choose All or a date range and generate the report.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <ReportCompanyHeader title={reportTitle} />

          {/* SECTION 1 - Loans Disbursed Information */}
          <SectionTitle>Loans Disbursed Information :</SectionTitle>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headSx}>Loan Type</TableCell>
                  <TableCell sx={headSx} align="right">Loans Disbursed (A)</TableCell>
                  <TableCell sx={headSx} align="right">Interest Receivable (B)</TableCell>
                  <TableCell sx={headSx} align="right">Total (A+B)</TableCell>
                  <TableCell sx={headSx} align="right">Loans Paid (X)</TableCell>
                  <TableCell sx={headSx} align="right">Interest Paid (Y)</TableCell>
                  <TableCell sx={headSx} align="right">Total (X+Y)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={cellSx}>{row.loanType}</TableCell>
                    {DISBURSED_FIELDS.map((field) => (
                      <TableCell key={field} sx={cellSx} align="right">
                        {amount(row[field])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* TOTAL */}
                <TableRow>
                  <TableCell sx={{ ...totalSx, textAlign: "right" }}>Total</TableCell>
                  {DISBURSED_FIELDS.map((field) => (
                    <TableCell key={field} sx={totalSx} align="right">
                      {amount(disbursedTotals[field])}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* SECTION 2 - Loans Outstanding Information */}
          {outstandingRows.length > 0 && (
            <>
              <SectionTitle>Loans Outstanding Information{asOnLabel} :</SectionTitle>

              <TableContainer sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headSx}>Loan Type</TableCell>
                      <TableCell sx={headSx} align="right">Total Outstanding</TableCell>
                      <TableCell sx={headSx} align="right">Outstanding Excluding Interest</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outstandingRows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={cellSx}>{row.loanType}</TableCell>
                        {OUTSTANDING_FIELDS.map((field) => (
                          <TableCell key={field} sx={cellSx} align="right">
                            {amount(row[field])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                    {/* TOTAL */}
                    <TableRow>
                      <TableCell sx={{ ...totalSx, textAlign: "right" }}>Total</TableCell>
                      {OUTSTANDING_FIELDS.map((field) => (
                        <TableCell key={field} sx={totalSx} align="right">
                          {amount(outstandingTotals[field])}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* SECTION 3 - Business Value and Share Distribution */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <SectionTitle>Business Value &amp; Share Distribution{asOnLabel} :</SectionTitle>
            {/* Sits with the block it divides, and re-splits as it is typed -
                no second trip to the server to change the count. */}
            <TextField
              label="No. of Shares"
              size="small"
              type="number"
              value={shareCount}
              onChange={(event) => setShareCount(event.target.value)}
              inputProps={{ min: 1, step: 1 }}
              sx={{ width: 150, mt: 3, mb: 1 }}
            />
          </Stack>

          {valueError && (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              {valueError}
            </Alert>
          )}

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 420, maxWidth: 680 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headSx}>Particulars</TableCell>
                  <TableCell sx={headSx} align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {valueLines.map((line) => (
                  <TableRow key={line.label} hover={!line.strong}>
                    <TableCell sx={line.strong ? totalSx : cellSx}>{line.label}</TableCell>
                    <TableCell sx={line.strong ? totalSx : cellSx} align="right">
                      {line.less && line.value ? `-${amount(line.value)}` : amount(line.value)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow hover>
                  <TableCell sx={cellSx}>No. of Shares</TableCell>
                  <TableCell sx={cellSx} align="right">{valueBlock.shares}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={totalSx}>Value Per Share</TableCell>
                  <TableCell sx={totalSx} align="right">
                    {perShareAmount(valueBlock.valuePerShare)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default BussinessShare;
