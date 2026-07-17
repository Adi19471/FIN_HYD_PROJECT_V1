import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import { AppDatePicker, useDateRange } from "src/components/ui";


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

      setData(res.data || []);
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

  // GROUP DATA BY TYPE (Revenue / Expense)
  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach((item) => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
    });
    return groups;
  }, [data]);

  // TOTAL PER GROUP
  const getTotal = (items) =>
    items.reduce((sum, item) => sum + (item.amount || 0), 0);

  // GRAND TOTAL
  const grandTotal = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [data]);


  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Typography variant="h6" fontWeight={700} mb={1}>
        Revenue & Expense Statement
      </Typography>
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
                ₹ {getTotal(groupedData["Revenue"] || []).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Paper sx={{ p: 2, borderLeft: "5px solid red" }}>
              <Typography variant="subtitle2">Total Expense</Typography>
              <Typography variant="h6" fontWeight={700}>
                ₹ {getTotal(groupedData["Expense"] || []).toLocaleString()}
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
              <Typography variant="h6" fontWeight={700}>
                ₹{" "}
                {(
                  getTotal(groupedData["Revenue"] || []) -
                  getTotal(groupedData["Expense"] || [])
                ).toLocaleString()}
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
          <Table>
            <TableBody>

              {Object.keys(groupedData).map((type) => {
                const items = groupedData[type];
                const total = getTotal(items);

                return (
                  <React.Fragment key={type}>

                    {/* SECTION HEADER */}
                    <TableRow
                      sx={{
                        backgroundColor:
                          type === "Revenue" ? "#e8f5e9" : "#ffebee",
                      }}
                    >
                      <TableCell colSpan={3}>
                        <Typography fontWeight={700}>
                          {type}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={700}>
                          ₹ {total.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {/* ROWS */}
                    {items.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell width="50px">{index + 1}</TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">
                          ₹ {row.amount?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}

                  </React.Fragment>
                );
              })}

              {/* GRAND TOTAL */}
              <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                <TableCell colSpan={3}>
                  <Typography fontWeight={700}>Grand Total</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700}>
                    ₹ {grandTotal.toLocaleString()}
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
