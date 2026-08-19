import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import { AppDatePicker, TableExportMenu, useDateRange } from "src/components/ui";

const REVENUE = "REVENUES";
const EXPENSE = "EXPENSES";

// API sends REVENUES / EXPENSES - normalise so casing or singular/plural doesn't break grouping
const normalizeType = (type) => {
  const value = String(type || "").trim().toUpperCase();
  if (value.startsWith("REVENUE") || value.startsWith("INCOME")) return REVENUE;
  if (value.startsWith("EXPENSE")) return EXPENSE;
  return value || "OTHERS";
};

const TYPE_LABELS = { [REVENUE]: "Revenue", [EXPENSE]: "Expenses" };
const labelFor = (type) => TYPE_LABELS[type] || type;

// TOTAL PER GROUP
const getTotal = (items) =>
  items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

const fmt = (value) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Columns for the Excel / PDF / Word / CSV / Print exports. Amount stays a raw
// number so Excel keeps it summable; the formatter only dresses up the
// document exports, which read through valueFormatter.
const exportColumns = [
  { field: "sno", headerName: "#", width: 60 },
  { field: "particulars", headerName: "Particulars", width: 340 },
  {
    field: "amount",
    headerName: "Amount",
    width: 160,
    align: "right",
    valueFormatter: (value) => fmt(value),
  },
];

const RevenueExpenseStatement = () => {
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange(null, null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get authentication token
  const token = getSession()?.token || getSession("token") || "";

  // API CALL with Token
  const fetchData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
      return;
    }

    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/revenueExpenseStatement/${dayjs(fromDate).format(
          "YYYY-MM-DD"
        )}/${dayjs(toDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching revenue & expense statement:", err);
      alert(
        err.response?.data?.message ||
        "Failed to fetch Revenue & Expense Statement. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // GROUP DATA BY TYPE (REVENUES / EXPENSES)
  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach((item) => {
      const type = normalizeType(item.type);
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(item);
    });
    return groups;
  }, [data]);

  // Revenue first, Expenses next, anything else after
  const orderedTypes = useMemo(() => {
    const keys = Object.keys(groupedData);
    const preferred = [REVENUE, EXPENSE];
    return [
      ...preferred.filter((type) => keys.includes(type)),
      ...keys.filter((type) => !preferred.includes(type)),
    ];
  }, [groupedData]);

  // TOTALS
  const totalRevenue = useMemo(
    () => getTotal(groupedData[REVENUE] || []),
    [groupedData]
  );
  const totalExpense = useMemo(
    () => getTotal(groupedData[EXPENSE] || []),
    [groupedData]
  );
  const netProfit = totalRevenue - totalExpense;
  const isLoss = netProfit < 0;

  // Flatten the grouped table into export rows in the order shown on screen:
  // each section heading with its total, then its line items, then Net Profit / Loss.
  // Section and net rows carry __isTotal so the exports render them bold.
  const exportRows = useMemo(() => {
    const rows = [];

    orderedTypes.forEach((type) => {
      const items = groupedData[type] || [];

      rows.push({
        id: `${type}-section`,
        sno: "",
        particulars: labelFor(type),
        amount: getTotal(items),
        __isTotal: true,
      });

      items.forEach((item, index) => {
        rows.push({
          id: `${type}-${item.code}-${index}`,
          sno: index + 1,
          particulars: item.description || item.code,
          amount: Number(item.amount) || 0,
        });
      });
    });

    if (rows.length) {
      rows.push({
        id: "net",
        sno: "",
        particulars: `Net ${isLoss ? "Loss" : "Profit"}`,
        amount: netProfit,
        __isTotal: true,
      });
    }

    return rows;
  }, [groupedData, orderedTypes, isLoss, netProfit]);

  // Period line and the summary block printed under the exported table.
  const reportOptions = useMemo(
    () => ({
      period: { fromDate, toDate, label: "Statement Period" },
      summary: [
        { label: "Total Revenue", value: totalRevenue },
        { label: "Total Expenses", value: totalExpense },
        { label: isLoss ? "Net Loss" : "Net Profit", value: netProfit },
      ],
    }),
    [fromDate, toDate, totalRevenue, totalExpense, netProfit, isLoss]
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        mb={1}
      >
        <Typography variant="h6" fontWeight={700}>
          Revenue & Expense Statement
        </Typography>
        {/* Single download entry point: Excel / PDF / Word / CSV / Print. */}
        <TableExportMenu
          rows={exportRows}
          columns={exportColumns}
          fileName="Revenue-Expense-Statement"
          reportOptions={reportOptions}
        />
      </Stack>
      {/* FILTER CARD */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">

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
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={fetchData}
              disabled={loading || !fromDate || !toDate}
            >
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </Grid>

        </Grid>
      </Paper>
      {/* SUMMARY CARDS */}
      {data.length > 0 && (
        <Grid container spacing={2} mb={3}>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Paper sx={{ p: 2, borderLeft: "5px solid green" }}>
              <Typography variant="subtitle2">Total Revenue</Typography>
              <Typography variant="h6" fontWeight={700}>
                {fmt(totalRevenue)}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Paper sx={{ p: 2, borderLeft: "5px solid red" }}>
              <Typography variant="subtitle2">Total Expenses</Typography>
              <Typography variant="h6" fontWeight={700}>
                {fmt(totalExpense)}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Paper sx={{ p: 2, borderLeft: "5px solid blue" }}>
              <Typography variant="subtitle2">Net Profit / Loss</Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                color={isLoss ? "error.main" : "success.main"}
              >
                {fmt(netProfit)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      {/* TABLE */}
      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography color="text.secondary">
            No data found. Select date range and generate report.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "auto",
            maxHeight: { xs: 420, sm: 520, md: 620, lg: 720 },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="60px">#</TableCell>
                <TableCell>Particulars</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {orderedTypes.map((type, groupIndex) => {
                const items = groupedData[type];
                const total = getTotal(items);

                return (
                  <React.Fragment key={type}>

                    {/* SPACER BETWEEN GROUPS */}
                    {groupIndex > 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{ p: 0, height: 20, border: 0 }}
                        />
                      </TableRow>
                    )}

                    {/* SECTION HEADER */}
                    <TableRow
                      sx={{
                        backgroundColor:
                          type === REVENUE
                            ? "#e8f5e9"
                            : type === EXPENSE
                              ? "#ffebee"
                              : "#f5f5f5",
                      }}
                    >
                      <TableCell colSpan={2}>
                        <Typography fontWeight={700}>
                          {labelFor(type)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={700}>
                          {fmt(total)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* ROWS */}
                    {items.map((row, index) => (
                      <TableRow key={`${type}-${row.code}-${index}`} hover>
                        <TableCell width="60px">{index + 1}</TableCell>
                        <TableCell>{row.description || row.code}</TableCell>
                        <TableCell align="right">
                          {fmt(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))}

                  </React.Fragment>
                );
              })}

              {/* SPACER BEFORE SUMMARY */}
              <TableRow>
                <TableCell colSpan={3} sx={{
                  p: 0,
                  height: 24,
                  border: 0,
                  backgroundColor: "background.default",
                }} />
              </TableRow>

              {/* NET PROFIT / LOSS - LAST ROW */}
              <TableRow
                sx={{
                  backgroundColor: isLoss ? "#ffebee" : "#e8f5e9",
                  borderTop: "2px solid",
                  borderColor: "divider",
                }}
              >
                <TableCell colSpan={2}>
                  <Typography fontWeight={700}>
                    Net {isLoss ? "Loss" : "Profit"}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    fontWeight={700}
                    color={isLoss ? "error.main" : "success.main"}
                  >
                    {fmt(netProfit)}
                  </Typography>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RevenueExpenseStatement;