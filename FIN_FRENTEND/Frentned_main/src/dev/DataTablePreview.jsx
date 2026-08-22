// TEMPORARY preview harness - verifies the report table changes with mock data.
import React from "react";
import { createRoot } from "react-dom/client";
import { Box } from "@mui/material";
import DataTable from "src/components/ui/DataTable";
import { isTotalRow } from "src/components/ui/reportExport";

const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const TOTAL_FIELDS = [
  "noOfMonthlyLoans", "monthlyLoanAmount", "noOfDailyLoans", "dailyLoanAmount",
  "totalLoanAmount", "targetAmount", "excess_or_deficit", "amount",
];
const TOTAL_LABEL_CELL = { bussinessExemption: "Total" };

const columns = [
  { field: "sno", headerName: "S.No", width: 70 },
  { field: "partnerId", headerName: "Partner ID", width: 110 },
  { field: "partnerName", headerName: "Partner Name", width: 250 },
  { field: "shares", headerName: "Shares", width: 90 },
  {
    field: "bussinessExemption", headerName: "Exempt", width: 100,
    renderCell: ({ row }) => {
      if (isTotalRow(row)) return row.bussinessExemption;
      return row.bussinessExemption === "Y" ? "Yes" : "No";
    },
  },
  { field: "noOfMonthlyLoans", headerName: "MF Loans", width: 100 },
  { field: "monthlyLoanAmount", headerName: "MF Loan Amount", width: 160, renderCell: ({ row }) => formatAmount(row.monthlyLoanAmount) },
  { field: "noOfDailyLoans", headerName: "DF Loans", width: 100 },
  { field: "dailyLoanAmount", headerName: "DF Loan Amount", width: 160, renderCell: ({ row }) => formatAmount(row.dailyLoanAmount) },
  { field: "totalLoanAmount", headerName: "Total Loan Amount", width: 170, renderCell: ({ row }) => formatAmount(row.totalLoanAmount) },
  { field: "targetAmount", headerName: "Target Amount", width: 150, renderCell: ({ row }) => formatAmount(row.targetAmount) },
  { field: "excess_or_deficit", headerName: "Excess / Deficit", width: 160, renderCell: ({ row }) => formatAmount(row.excess_or_deficit) },
  { field: "amount", headerName: "Amount", width: 150, renderCell: ({ row }) => formatAmount(row.amount) },
];

const raw = [
  ["P001", "JAYARANJAN ROKKAM", 1.0, "Y", 3, 250000, 0, 0, 250000, 0, 0, 0],
  ["P002", "SURENDAR REDDY GURRAM", 1.0, "N", 1, 100000, 0, 0, 100000, 111363, -11363, -681],
  ["P003", "MAHESH JANAKI", 1.0, "Y", 4, 400000, 0, 0, 400000, 0, 0, 0],
  ["P004", "RANGA SWAMY ARRAM", 1.0, "N", 6, 700000, 0, 0, 700000, 111363, 588636, 35318],
  ["P005", "SANGRAM BIRADARI", 1.0, "N", 1, 100000, 0, 0, 100000, 111363, -11363, -681],
  ["P006", "RAJU MILAP", 1.0, "N", 2, 60000, 0, 0, 60000, 111363, -51363, -3081],
  ["P007", "RAMU BIRADAR", 1.0, "N", 1, 100000, 0, 0, 100000, 111363, -11363, -681],
  ["P008", "RAJU NAMA", 1.0, "N", 0, 0, 0, 0, 0, 111363, -111363, -6681],
  ["P009", "SRINIVAS RAO A", 1.0, "N", 4, 165000, 0, 0, 165000, 111363, 53636, 3218],
  ["P010", "JAYARANJAN.R ( II )", 1.0, "N", 0, 0, 0, 0, 0, 111363, -111363, -6681],
];

const rows = raw.map((r, index) => ({
  id: index + 1, sno: index + 1, partnerId: r[0], partnerName: r[1], shares: r[2],
  bussinessExemption: r[3], noOfMonthlyLoans: r[4], monthlyLoanAmount: r[5],
  noOfDailyLoans: r[6], dailyLoanAmount: r[7], totalLoanAmount: r[8],
  targetAmount: r[9], excess_or_deficit: r[10], amount: r[11],
}));

createRoot(document.getElementById("root")).render(
  <Box sx={{ p: 3, background: "#eef2f7", minHeight: "100vh" }}>
    <DataTable
      rows={rows}
      columns={columns}
      title="Business Report"
      subtitle="Report date: 21-Aug-2026"
      totalFields={TOTAL_FIELDS}
      totalLabelCell={TOTAL_LABEL_CELL}
      disableRowSelectionOnClick
    />
  </Box>
);
