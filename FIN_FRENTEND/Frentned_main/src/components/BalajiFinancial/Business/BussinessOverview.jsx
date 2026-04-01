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
  TableHead,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";


const BusinessOverview = () => {
  const [filterType, setFilterType] = useState("ALL");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get authentication token
  const token = getSession()?.token || getSession("token") || "";

  // API CALL with Token Authentication
  const fetchData = async () => {
    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    // Validation for Date Range
    if (filterType === "RANGE") {
      if (!fromDate || !toDate) {
        alert("Please select both From and To dates");
        return;
      }
    }

    try {
      setLoading(true);

      let url = "";

      if (filterType === "ALL") {
        url = `${API_BASE}/disbursedList`;
      } else {
        url = `${API_BASE}/disbursedList/${dayjs(fromDate).format(
          "YYYY-MM-DD"
        )}/${dayjs(toDate).format("YYYY-MM-DD")}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setData(res.data || []);
    } catch (err) {
      console.error("Error fetching business overview:", err);
      alert(
        err.response?.data?.message || 
        "Failed to fetch data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // TOTALS CALCULATION
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.amount += item.amount || 0;
        acc.paid += item.amountPaid || 0;
        acc.due += item.installmentDue || 0;
        return acc;
      },
      { amount: 0, paid: 0, due: 0 }
    );
  }, [data]);


  return (
  <Box sx={{ p: 3 }}>

    {/* HEADER */}
    <Typography variant="h6" fontWeight={700} mb={3}>
      Business Overview
    </Typography>

    {/* FILTER CARD */}
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">

        <Grid item xs={12} md={4}>
          <RadioGroup
            row
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel value="RANGE" control={<Radio />} label="Date Range" />
          </RadioGroup>
        </Grid>

        {filterType === "RANGE" && (
          <>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : ""}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="To Date"
                InputLabelProps={{ shrink: true }}
                value={toDate ? dayjs(toDate).format("YYYY-MM-DD") : ""}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={fetchData}
            disabled={loading || (filterType === "RANGE" && (!fromDate || !toDate))}
          >
            {loading ? "Loading..." : "Generate"}
          </Button>
        </Grid>

      </Grid>
    </Paper>

    {/* SUMMARY CARDS */}
    {data.length > 0 && (
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderLeft: "5px solid blue" }}>
            <Typography variant="subtitle2">Total Amount</Typography>
            <Typography variant="h6" fontWeight={700}>
              ₹ {totals.amount.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderLeft: "5px solid green" }}>
            <Typography variant="subtitle2">Amount Paid</Typography>
            <Typography variant="h6" fontWeight={700}>
              ₹ {totals.paid.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderLeft: "5px solid red" }}>
            <Typography variant="subtitle2">Total Due</Typography>
            <Typography variant="h6" fontWeight={700}>
              ₹ {totals.due.toLocaleString()}
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
          No records found. Please generate report.
        </Typography>
      </Paper>
    ) : (
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">

          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>S.No</TableCell>
              <TableCell>Loan ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Guarantor</TableCell>
              <TableCell>Partner</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Due</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover>

                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.loanId}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.guarentorName}</TableCell>
                <TableCell>{row.partnerName}</TableCell>

                <TableCell>
                  {row.startDate && dayjs(row.startDate).format("DD-MMM-YY")}
                </TableCell>

                <TableCell>
                  {row.endDate && dayjs(row.endDate).format("DD-MMM-YY")}
                </TableCell>

                <TableCell align="right">
                  ₹ {row.amount?.toLocaleString()}
                </TableCell>

                <TableCell align="right" sx={{ color: "green" }}>
                  ₹ {row.amountPaid?.toLocaleString()}
                </TableCell>

                <TableCell align="right" sx={{ color: "red" }}>
                  ₹ {row.installmentDue?.toLocaleString()}
                </TableCell>

                {/* STATUS BADGE */}
                <TableCell>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#fff",
                      backgroundColor:
                        row.status === "Closed"
                          ? "green"
                          : row.status === "Active"
                          ? "blue"
                          : "orange",
                    }}
                  >
                    {row.status}
                  </Box>
                </TableCell>

              </TableRow>
            ))}

            {/* TOTAL ROW */}
            <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
              <TableCell colSpan={7}>
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong>₹ {totals.amount.toLocaleString()}</strong>
              </TableCell>
              <TableCell align="right">
                <strong>₹ {totals.paid.toLocaleString()}</strong>
              </TableCell>
              <TableCell align="right">
                <strong>₹ {totals.due.toLocaleString()}</strong>
              </TableCell>
              <TableCell />
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    )}

  </Box>
);
};

export default BusinessOverview;