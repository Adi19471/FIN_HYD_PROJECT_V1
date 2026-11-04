import React, { useMemo, useState } from "react";
import { Box, Button, Paper, Stack } from "@mui/material";
import { actionIcons, navIcons } from "src/lib/icons";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import {
  AppDatePicker,
  EmptyState,
  ReportToolbar,
  useDateRange,
  useScreenExport,
} from "src/components/ui";

const GenerateIcon = actionIcons.generate;

/* ============================================================
   Business Share - laid out as the old system's printed statement:

     Date: 06-Mar-2026                                   (right)
     Business Share From 01-Feb-2026 To 28-Feb-2026      (centred)
     Loans Disbursed Information :    DF / MF / Total
     Loans Outstanding Information :  MF / Total
     Total Loans Outstanding, the balance-sheet groups,
     Total, Shares, Share Value As On <To date>

   Everything comes from GET /businessShareStatement/{from}/{to}.
   ============================================================ */

const LOAN_TYPES = [
  { key: "DAILY_FINANCE", code: "DF", name: "Daily Finance" },
  { key: "MONTHLY_FINANCE", code: "MF", name: "Monthly Finance" },
];

const DISBURSED_COLUMNS = [
  { field: "loansDisbursed", label: "Loans Disbursed (A)" },
  { field: "interestReceivable", label: "Interest Receivable (B)" },
  { field: "sumOfLoansDisbursedAndInterestReceivable", label: "Total (A+B)" },
  { field: "loansPaid", label: "Loans Paid (X)" },
  { field: "interestPaid", label: "Interest Paid (Y)" },
  { field: "sumOfloansPaidAndInterestPaid", label: "Total (X+Y)" },
];

const OUTSTANDING_COLUMNS = [
  { field: "totalOutstanding", label: "Total Outstanding" },
  { field: "outstandingExcludingInterest", label: "Outstanding Excluding Interest" },
];

const isBlank = (value) => value === null || value === undefined || value === "";

// Indian grouping, sign kept: 75,45,801 / -61,600, as on the printed sheet. A
// figure the service did not send stays blank (DF with nothing lent in the
// range), while a real 0 prints as 0.
const money = (value) =>
  isBlank(value) ? "" : Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const shares = (value) =>
  Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

const shareValue = (value) =>
  Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sumOf = (rows, field) => rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

const typeKey = (loanType) => String(loanType || "").trim().toUpperCase();

const displayDate = (value) => (value ? dayjs(value).format("DD-MMM-YYYY") : "");

/** DF and MF always get their row, as on the sheet; any other type the service sends follows them. */
const buildLoanRows = (info = []) => {
  const byType = new Map(info.map((row) => [typeKey(row.loanType), row]));
  const known = LOAN_TYPES.map((type) => ({ ...(byType.get(type.key) || {}), code: type.code, name: type.name }));
  const others = info
    .filter((row) => !LOAN_TYPES.some((type) => type.key === typeKey(row.loanType)))
    .map((row) => ({ ...row, code: String(row.loanType || "-"), name: String(row.loanType || "-") }));
  return [...known, ...others];
};

/**
 * The balance-sheet accounts the service values the business with, one line
 * per group. The service sends every balance unsigned and adds the assets /
 * takes off the liabilities itself, so the same sign is shown here: the
 * lines then add up to the Total it returns.
 */
const buildValueLines = (rows = []) => {
  const lines = new Map();
  rows.forEach((row) => {
    const liability = String(row.type || "").toUpperCase().includes("LIABIL");
    const name = String(row.masterCode || row.code || "OTHERS").trim().toUpperCase();
    const key = `${liability ? "L" : "A"}|${name}`;
    if (!lines.has(key)) lines.set(key, { key, name, amount: 0 });
    lines.get(key).amount += Math.abs(Number(row.amount || 0)) * (liability ? -1 : 1);
  });
  return [...lines.values()];
};

// Print and downloads: one row per loan type with both tables side by side,
// a bold Total row, and the value block printed under it as the summary.
const EXPORT_COLUMNS = [
  { field: "code", headerName: "Loan Type", width: 80 },
  ...[...DISBURSED_COLUMNS, ...OUTSTANDING_COLUMNS].map((column) => ({
    field: column.field,
    headerName: column.label,
    width: 120,
    align: "right",
    valueFormatter: (value) => money(value),
  })),
];

const BussinessShare = () => {
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange(
    dayjs().startOf("month").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  );
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  // The range the figures on screen were generated for - the title and the
  // downloads state it, not whatever the pickers have been changed to since.
  const [generated, setGenerated] = useState(null);

  const token = getSession()?.token || getSession("token") || "";

  const loanRows = useMemo(() => buildLoanRows(report?.loanInformation || []), [report]);
  const outstandingRows = useMemo(
    () => loanRows.filter((row) => OUTSTANDING_COLUMNS.some((column) => !isBlank(row[column.field]))),
    [loanRows]
  );
  const valueLines = useMemo(() => buildValueLines(report?.balanceSheetProjectionList || []), [report]);

  const from = displayDate(generated?.fromDate);
  const to = displayDate(generated?.toDate);
  const title = `Business Share From ${from} To ${to}`;

  const exportRows = useMemo(() => {
    if (!report) return [];
    const totals = Object.fromEntries(
      [...DISBURSED_COLUMNS, ...OUTSTANDING_COLUMNS].map((column) => [column.field, sumOf(loanRows, column.field)])
    );
    return [
      ...loanRows.map((row) => ({ ...row, id: row.code })),
      { id: "total", code: "Total", ...totals, __isTotal: true },
    ];
  }, [report, loanRows]);

  const reportOptions = useMemo(
    () => ({
      title,
      orientation: "landscape",
      summary: report
        ? [
            { label: "Total Loans Outstanding", value: money(report.loansOutstanding ?? 0) },
            ...valueLines.map((line) => ({ label: line.name, value: money(line.amount) })),
            { label: "Total", value: money(report.netBusinessValue ?? 0) },
            { label: "Shares", value: shares(report.totalShares) },
            { label: `Share Value As On ${to}`, value: shareValue(report.valuePerShare) },
          ]
        : [],
    }),
    [title, report, valueLines, to]
  );

  // Download / Print for this screen sit in its header (screenExport.jsx).
  useScreenExport({ rows: exportRows, columns: EXPORT_COLUMNS, fileName: "Business_Share", reportOptions });

  const fetchData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select the From and To dates");
      return;
    }

    if (dayjs(toDate).isBefore(dayjs(fromDate), "day")) {
      alert("To Date cannot be before From Date");
      return;
    }

    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const start = dayjs(fromDate).format("YYYY-MM-DD");
      const end = dayjs(toDate).format("YYYY-MM-DD");
      const res = await axios.get(`${API_BASE}/businessShareStatement/${start}/${end}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setReport(res.data && typeof res.data === "object" ? res.data : {});
      setGenerated({ fromDate: start, toDate: end });
    } catch (err) {
      console.error("Error fetching business share statement:", err);
      alert(err.response?.data?.message || "Failed to fetch business share statement");
    } finally {
      setLoading(false);
    }
  };

  const renderLoanTable = (caption, columns, rows, className) => (
    <>
      <h3 className="bshare-caption">{caption} :</h3>
      <div className="bshare-scroll">
        <table className={`bs-table bshare-table ${className}`}>
          <colgroup>
            <col className="bshare-col-type" />
            {columns.map((column) => (
              <col key={column.field} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Loan Type</th>
              {columns.map((column) => (
                <th key={column.field} scope="col" className="bs-amount">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="bs-none">
                  No loans
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.code}>
                  <th scope="row" title={row.name}>
                    {row.code}
                  </th>
                  {columns.map((column) => (
                    <td key={column.field} className="bs-amount">
                      {money(row[column.field])}
                    </td>
                  ))}
                </tr>
              ))
            )}
            <tr className="bshare-total">
              <th scope="row">Total</th>
              {columns.map((column) => (
                <td key={column.field} className="bs-amount">
                  {money(sumOf(rows, column.field))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <>
      {/* The company name and address are printed on every download, not
          shown on screen. */}
      <ReportToolbar
        icon={navIcons.businessShare}
        title="Business Share"
        subtitle="Loans lent and collected in a period, what is outstanding, and the value of one share."
        onRefresh={fetchData}
        loading={loading}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2, mt: 1.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
          <AppDatePicker
            label="From Date"
            value={fromDate}
            onChange={setFromDate}
            sx={{ width: { xs: "100%", sm: 220 } }}
          />
          <AppDatePicker
            label="To Date"
            value={toDate}
            onChange={setToDate}
            minDate={toDateMin}
            maxDate={toDateMax}
            sx={{ width: { xs: "100%", sm: 220 } }}
          />
          <Button variant="contained" onClick={fetchData} disabled={loading} startIcon={<GenerateIcon />}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </Stack>
      </Paper>

      <Paper className="enterprise-card" elevation={0} sx={{ p: { xs: 1.5, md: 3 }, mt: 1.5 }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", minHeight: 360 }}>
            <LoadingSpinner />
          </Box>
        ) : !report ? (
          <EmptyState icon={navIcons.businessShare} title="No business share statement yet">
            Pick the From and To dates and Generate: the loans, what is outstanding and the value of one share
            appear here.
          </EmptyState>
        ) : (
          <div className="bs-sheet bshare-sheet">
            <p className="bs-date">
              <span>Date:</span>
              {dayjs().format("DD-MMM-YYYY")}
            </p>
            <h2 className="bs-title">{title}</h2>

            {renderLoanTable("Loans Disbursed Information", DISBURSED_COLUMNS, loanRows, "bshare-disbursed")}
            {renderLoanTable(
              "Loans Outstanding Information",
              OUTSTANDING_COLUMNS,
              outstandingRows,
              "bshare-outstanding"
            )}

            {/* What the business is worth on the To date, and one share of it. */}
            <dl className="bshare-value">
              <div>
                <dt>Total Loans Outstanding :</dt>
                <dd>{money(report.loansOutstanding ?? 0)}</dd>
              </div>
              {valueLines.map((line) => (
                <div key={line.key}>
                  <dt>{line.name} :</dt>
                  <dd>{money(line.amount)}</dd>
                </div>
              ))}
              <div className="bshare-value-total">
                <dt>Total :</dt>
                <dd>{money(report.netBusinessValue ?? 0)}</dd>
              </div>
              <div>
                <dt>Shares :</dt>
                <dd>{shares(report.totalShares)}</dd>
              </div>
              <div className="bshare-value-final">
                <dt>Share Value As On {to} :</dt>
                <dd>{shareValue(report.valuePerShare)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Paper>
    </>
  );
};

export default BussinessShare;
