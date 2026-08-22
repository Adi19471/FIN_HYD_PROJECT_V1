import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import {
  successToast,
  errorToast,
} from "toastify";

import {
  AppDatePicker,
  DataTable,
  isTotalRow,
  PageHeader,
  ReportCompanyHeader,
  ReportToolbar,
  useReportZoom,
  useDateRange,
} from "src/components/ui";

// The figures the legacy report adds up on its last line: the loan counts, the
// money columns and the target / excess split. Anything else (S.No, Partner ID,
// Name, Shares) stays blank on the TOTAL row, as it does on the old report.
const TOTAL_FIELDS = [
  "noOfMonthlyLoans",
  "monthlyLoanAmount",
  "noOfDailyLoans",
  "dailyLoanAmount",
  "totalLoanAmount",
  "targetAmount",
  "excess_or_deficit",
  "amount",
];

// TOTAL caption sits in the Exempt cell, immediately before MF Loans, exactly
// where the old report prints it.
const TOTAL_LABEL_CELL = { bussinessExemption: "Total" };

const Bussiness_Reports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange(
    dayjs().startOf("month"),
    dayjs()
  );
  const [percentage, setPercentage] = useState(10);

  const zoom = useReportZoom();

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  };

  // Whole rupees - the report carries no paise, so no decimal point is printed.
  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });



  const generateReport = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE}/business-report`,
        {
          headers,
          params: {
            fromDate: dayjs(fromDate).format("YYYY-MM-DD"),
            toDate: dayjs(toDate).format("YYYY-MM-DD"),
            percentage,
          },
        }
      );

      const data = response.data || [];

      setRows(
        data.map((item, index) => ({
          id: index + 1,
          ...item,
        }))
      );

      successToast("Business Report Generated Successfully");
    } catch (error) {
      console.error(error);

      errorToast(
        error?.response?.data?.message ||
          "Failed to Generate Business Report"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 70,
    },
    {
      field: "partnerId",
      headerName: "Partner ID",
      width: 110,
    },
    {
      field: "partnerName",
      headerName: "Partner Name",
      width: 250,
    },
    {
      field: "shares",
      headerName: "Shares",
      width: 90,
    },
    {
      field: "bussinessExemption",
      headerName: "Exempt",
      width: 100,
      renderCell: ({ row }) => {
        if (isTotalRow(row)) return row.bussinessExemption;
        return row.bussinessExemption === "Y" ? "Yes" : "No";
      },
    },
    {
      field: "noOfMonthlyLoans",
      headerName: "MF Loans",
      width: 100,
    },
    {
      field: "monthlyLoanAmount",
      headerName: "MF Loan Amount",
      width: 160,
      renderCell: ({ row }) =>
        formatAmount(row.monthlyLoanAmount),
    },
    {
      field: "noOfDailyLoans",
      headerName: "DF Loans",
      width: 100,
    },
    {
      field: "dailyLoanAmount",
      headerName: "DF Loan Amount",
      width: 160,
      renderCell: ({ row }) =>
        formatAmount(row.dailyLoanAmount),
    },
    {
      field: "totalLoanAmount",
      headerName: "Total Loan Amount",
      width: 170,
      renderCell: ({ row }) =>
        formatAmount(row.totalLoanAmount),
    },
    {
      field: "targetAmount",
      headerName: "Target Amount",
      width: 150,
      renderCell: ({ row }) =>
        formatAmount(row.targetAmount),
    },
    {
      field: "excess_or_deficit",
      headerName: "Excess / Deficit",
      width: 160,
      renderCell: ({ row }) =>
        formatAmount(row.excess_or_deficit),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      renderCell: ({ row }) =>
        formatAmount(row.amount),
    },
  ];

  return (
    <>
      <PageHeader
        title="Business Report"
        subtitle="Partner-wise business report with totals, search, exports and print."
        totalCount={rows.length}
        onRefresh={generateReport}
        loading={loading}
      />
      <ReportToolbar
        onGenerate={generateReport}
        onRefresh={generateReport}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Business-Report"
        zoom={zoom}
      />
      <Paper sx={{ p: 3, mt: 2 }}>
        <ReportCompanyHeader title="Business Report" />

        <Grid container spacing={2} mb={3}>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker
              label="To Date"
              value={toDate}
              onChange={setToDate}
              minDate={toDateMin}
              maxDate={toDateMax}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <TextField
              fullWidth
              label="Percentage"
              value={percentage}
              onChange={(e) =>
                setPercentage(e.target.value)
              }
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <Button
              fullWidth
              variant="contained"
              onClick={generateReport}
              disabled={loading}
              sx={{ height: 56 }}
            >
              {loading ? "Loading..." : "Generate"}
            </Button>
          </Grid>
        </Grid>

        <Box ref={zoom.targetRef}>
          <DataTable
            rows={rows}
            columns={columns}
            loading={loading}
            // Names the screen on the printed / downloaded report.
            title="Business Report"
            subtitle={`Report date: ${dayjs().format("DD-MMM-YYYY")}`}
            totalFields={TOTAL_FIELDS}
            totalLabelCell={TOTAL_LABEL_CELL}
            // No autoHeight: the report is wider than the screen, and a grid
            // that grows to fit every row puts its horizontal scrollbar out of
            // reach at the very bottom of the page.
            pageSize={25}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>
    </>
  );
};

export default Bussiness_Reports;