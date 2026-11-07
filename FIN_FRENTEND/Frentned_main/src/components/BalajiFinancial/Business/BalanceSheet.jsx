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
  useScreenExport,
} from "src/components/ui";

const GenerateIcon = actionIcons.generate;

// Indian grouping, sign kept: 61,57,230 / -1,09,950, as on the printed sheet.
const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// Rupee amounts for the profit summary: ₹68,700 / ₹5,284.615
const rupees = (value, decimals = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: decimals })}`;

const rowName = (row) =>
  row.code || row.description || row.accountName || row.name || row.accountCode || "-";

const normalizeType = (type = "") => {
  const value = String(type).trim().toUpperCase();
  return value.includes("LIABIL") ? "LIABILITIES" : "ASSETS";
};

const SECTIONS = ["ASSETS", "LIABILITIES"];

// The groups the service works out itself (cash from the day's opening
// balance, profit from the books) close their section, after the account
// groups in alphabetical order - CHIT, LOANS, then CASH ON HAND.
const CLOSING_GROUPS = ["CASH ON HAND", "PROFIT"];

// -1 for an account group, so all of them come before the closing ones
const closingRank = (name) => CLOSING_GROUPS.indexOf(name);

const groupOrder = (a, b) => closingRank(a.name) - closingRank(b.name) || a.name.localeCompare(b.name);

/** Rows -> { ASSETS: { total, groups: [{ name, total, items }] }, LIABILITIES: ... } */
const buildSheet = (rows = []) =>
  SECTIONS.reduce((sheet, section) => {
    const groups = new Map();
    rows
      .filter((row) => normalizeType(row.type) === section)
      .forEach((row) => {
        const name = String(row.masterCode || row.accountMasterCode || "OTHERS").toUpperCase();
        if (!groups.has(name)) groups.set(name, { name, total: 0, items: [] });
        const group = groups.get(name);
        const amount = Number(row.amount || 0);
        group.items.push({ code: String(rowName(row)).toUpperCase(), amount });
        group.total += amount;
      });
    const list = [...groups.values()].sort(groupOrder);
    sheet[section] = { total: list.reduce((sum, group) => sum + group.total, 0), groups: list };
    return sheet;
  }, {});

// The PROFIT group's total, from whichever side the service put it on.
const profitOf = (sheet) =>
  SECTIONS.reduce(
    (sum, section) =>
      sum + sheet[section].groups.filter((g) => g.name === "PROFIT").reduce((s, g) => s + g.total, 0),
    0
  );

// The service now answers { balanceSheetProjections: [...], totalShares };
// a bare array (the old shape) is still accepted.
const parseResponse = (body) => {
  const payload = body?.data && !Array.isArray(body.data) ? body.data : body;
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.balanceSheetProjections)
      ? payload.balanceSheetProjections
      : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body?.result)
          ? body.result
          : [];
  const totalShares = Number(payload?.totalShares || 0);
  return { rows, totalShares };
};

// Print and downloads follow the sheet line by line: the section band and each
// group print bold on the tinted band (__isTotal), the accounts numbered under
// them. Amounts stay numbers so Excel keeps them summable.
const EXPORT_COLUMNS = [
  { field: "no", headerName: "No", width: 50 },
  { field: "account", headerName: "Account", width: 380 },
  { field: "amount", headerName: "Amount", width: 150, align: "right", valueFormatter: (value) => money(value) },
];

const sheetRows = (sheet) =>
  SECTIONS.flatMap((section) => [
    { id: section, no: "", account: `${section} (Total)`, amount: sheet[section].total, __isTotal: true },
    ...sheet[section].groups.flatMap((group) => [
      { id: `${section}-${group.name}`, no: "", account: group.name, amount: group.total, __isTotal: true },
      ...group.items.map((item, index) => ({
        id: `${section}-${group.name}-${index}`,
        no: index + 1,
        account: item.code,
        amount: item.amount,
      })),
    ]),
  ]);

const BalanceSheet = () => {
  const [toDate, setToDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [totalShares, setTotalShares] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(null);

  const token = getSession()?.token || getSession("token") || "";

  const sheet = useMemo(() => buildSheet(data), [data]);
  const difference = sheet.ASSETS.total - sheet.LIABILITIES.total;
  const upTo = dayjs(generatedDate || toDate).format("DD-MMM-YYYY");
  const title = `Balance Sheet Up To ${upTo}`;

  // Total Profit / Total Shares = Net Profit (per share)
  const totalProfit = useMemo(() => profitOf(sheet), [sheet]);
  const netProfit = totalShares ? totalProfit / totalShares : null;
  const profitSummary = [
    { label: "Total Profit", value: rupees(totalProfit) },
    { label: "Total Shares", value: Number(totalShares).toLocaleString("en-IN") },
    { label: "Net Profit", value: netProfit === null ? "-" : rupees(netProfit, 3) },
  ];

  const exportRows = useMemo(() => (data.length ? sheetRows(sheet) : []), [data.length, sheet]);

  // The sheet's own title heads every download; a difference, if the two
  // sides do not agree, is printed under it, then the profit summary.
  const reportOptions = useMemo(
    () => ({
      title,
      summary: [
        ...(difference ? [{ label: "Difference", value: money(difference) }] : []),
        ...(data.length ? profitSummary : []),
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title, difference, data.length, totalProfit, totalShares]
  );

  const fetchData = async () => {
    if (!toDate) {
      alert("Please select a date");
      return;
    }

    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const reportDate = dayjs(toDate).format("YYYY-MM-DD");
      const res = await axios.get(`${API_BASE}/balanceSheet/${reportDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { rows, totalShares: shares } = parseResponse(res.data);

      setData(rows);
      setTotalShares(shares);
      setGeneratedDate(toDate);
    } catch (err) {
      console.error("Error fetching balance sheet:", err);
      alert(err.response?.data?.message || "Failed to fetch balance sheet");
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (name) => {
    const section = sheet[name];
    return (
      <table className="bs-table" key={name}>
        <colgroup>
          <col className="bs-col-no" />
          <col />
          <col className="bs-col-amount" />
        </colgroup>
        <tbody>
          <tr className="bs-section">
            <th colSpan={2} scope="rowgroup">{name}</th>
            <td className="bs-amount">
              <span className="bs-total-label">Total:</span>
              {money(section.total)}
            </td>
          </tr>
          {section.groups.length === 0 ? (
            <tr>
              <td colSpan={3} className="bs-none">No accounts</td>
            </tr>
          ) : (
            section.groups.map((group) => (
              <React.Fragment key={group.name}>
                <tr className="bs-group">
                  <th colSpan={2} scope="row">{group.name}</th>
                  <td className="bs-amount">{money(group.total)}</td>
                </tr>
                {group.items.map((item, index) => (
                  <tr key={`${group.name}-${item.code}-${index}`}>
                    <td className="bs-no">{index + 1}</td>
                    <td>{item.code}</td>
                    <td className="bs-amount">{money(item.amount)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    );
  };

  // Bottom-right block under the sheet: Total Profit, Total Shares, then
  // Net Profit set apart below them.
  const renderProfitSummary = () => (
    <Box
      className="bs-profit-summary"
      sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
    >
      <Box
        component="dl"
        sx={{
          m: 0,
          minWidth: 260,
          display: "grid",
          gridTemplateColumns: "auto auto",
          columnGap: 2,
          rowGap: 1,
          "& dt": { fontWeight: 600 },
          "& dd": { m: 0, textAlign: "right", fontVariantNumeric: "tabular-nums" },
        }}
      >
        {profitSummary.map(({ label, value }) => {
          const isNet = label === "Net Profit";
          const spacer = isNet ? { mt: 2, pt: 1, borderTop: 1, borderColor: "divider" } : {};
          return (
            <React.Fragment key={label}>
              <Box component="dt" sx={spacer}>{label} :</Box>
              <Box component="dd" sx={{ ...spacer, fontWeight: isNet ? 700 : 400 }}>{value}</Box>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );

  // Download / Print for this screen sit in its header (screenExport.jsx).
  useScreenExport({ rows: exportRows, columns: EXPORT_COLUMNS, fileName: "Balance_Sheet", reportOptions });

  return (
    <>
      {/* The company name and address are printed on every download, not
          shown on screen. */}
      <ReportToolbar
        icon={navIcons.balanceSheet}
        title="Balance Sheet"
        subtitle="Assets, liabilities and the balance difference as on a date."
        onRefresh={fetchData}
        loading={loading}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2, mt: 1.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
          <AppDatePicker
            label="Date"
            value={toDate}
            onChange={setToDate}
            sx={{ width: { xs: "100%", sm: 240 } }}
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
        ) : data.length === 0 ? (
          <EmptyState icon={navIcons.balanceSheet} title="No balance sheet yet">
            Pick the date and Generate: the assets and liabilities up to that day appear here.
          </EmptyState>
        ) : (
          // Laid out as the printed sheet: the date on the right, the title,
          // then each side as a band with its total, its groups with theirs,
          // and the accounts numbered under each group.
          <div className="bs-sheet">
            <p className="bs-date">
              <span>Date:</span>
              {dayjs().format("DD-MMM-YYYY")}
            </p>
            <h2 className="bs-title">{title}</h2>
            {SECTIONS.map(renderSection)}
            {renderProfitSummary()}
          </div>
        )}
      </Paper>
    </>
  );
};

export default BalanceSheet;