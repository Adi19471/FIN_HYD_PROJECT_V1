import React, { useMemo, useState } from "react";
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
  ReportToolbar,
  useReportZoom,
  useDateRange,
} from "src/components/ui";
import { navIcons } from "src/lib/icons";

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
  // What the rows on screen were generated for. It is printed on every
  // download, so the page still says which filters produced it after one is
  // changed on screen.
  const [applied, setApplied] = useState(null);

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

      setApplied({
        fromDate: dayjs(fromDate).format("YYYY-MM-DD"),
        toDate: dayjs(toDate).format("YYYY-MM-DD"),
        percentage,
      });

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

  const period = useMemo(
    () =>
      applied
        ? { label: "Business Period", fromDate: applied.fromDate, toDate: applied.toDate }
        : undefined,
    [applied]
  );
  const reportMeta = useMemo(
    () => (applied ? [{ label: "Percentage", value: `${applied.percentage}%` }] : []),
    [applied]
  );

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
      // the TOTAL row carries its caption in this cell
      valueGetter: (value, row) => (isTotalRow(row) ? value : value === "Y" ? "Yes" : "No"),
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
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatAmount(value),
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
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatAmount(value),
    },
    {
      field: "totalLoanAmount",
      headerName: "Total Loan Amount",
      width: 170,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatAmount(value),
    },
    {
      field: "targetAmount",
      headerName: "Target Amount",
      width: 150,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatAmount(value),
    },
    {
      field: "excess_or_deficit",
      headerName: "Excess / Deficit",
      width: 160,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatAmount(value),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatAmount(value),
    },
  ];

  return (
    <>
      {/* Generate lives in the filter card, next to the dates it acts on. */}
      <ReportToolbar
        icon={navIcons.partnerBusinessReports}
        title="Business Reports"
        subtitle="Each partner's business for a period."
        onRefresh={generateReport}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Business-Report"
        zoom={zoom}
      />
      <Paper sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={2} mb={2} alignItems="center">
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
            {/* small, like the two date fields beside it */}
            <TextField
              fullWidth
              size="small"
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
        
              variant="contained"
              onClick={generateReport}
              disabled={loading}
           
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
            // The screen header already names the report, so the card header
            // carries only the download name and the record count.
            fileName="Business-Report"
            subtitle={`Report date: ${dayjs().format("DD-MMM-YYYY")}`}
            period={period}
            reportMeta={reportMeta}
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