import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
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
  PageHeader,
} from "src/components/ui";

const Bussiness_Reports = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [percentage, setPercentage] = useState(10);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  };

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN");

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
      renderCell: ({ row }) =>
        row.bussinessExemption === "Y" ? "Yes" : "No",
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
      <PageHeader title="Business Report" />

      <Paper sx={{ p: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            SRI BALAJI ENTERPRISES
          </Typography>

          <Typography variant="subtitle1">
            Yella Reddy Guda, Hyderabad
          </Typography>

          <Typography mt={1}>
            Date : {dayjs().format("DD-MMM-YYYY")}
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            mt={2}
          >
            Business Report
          </Typography>
        </Box>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={3}>
            <AppDatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <AppDatePicker
              label="To Date"
              value={toDate}
              onChange={setToDate}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Percentage"
              value={percentage}
              onChange={(e) =>
                setPercentage(e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} md={2}>
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

        <DataTable
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default Bussiness_Reports;