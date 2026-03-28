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
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Business Overview
      </Typography>

      {/* FILTER SECTION */}
      <Grid container spacing={2} mb={3} alignItems="center">
        <Grid item>
          <RadioGroup
            row
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All Records" />
            <FormControlLabel
              value="RANGE"
              control={<Radio />}
              label="Date Range"
            />
          </RadioGroup>
        </Grid>

        {filterType === "RANGE" && (
          <>
            <Grid item>
              <TextField
                type="date"
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : ""}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>

            <Grid item>
              <TextField
                type="date"
                label="To Date"
                InputLabelProps={{ shrink: true }}
                value={toDate ? dayjs(toDate).format("YYYY-MM-DD") : ""}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>
          </>
        )}

        <Grid item>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={loading || (filterType === "RANGE" && (!fromDate || !toDate))}
          >
            {loading ? "Loading..." : "Generate Report"}
          </Button>
        </Grid>
      </Grid>

      {/* TABLE SECTION */}
      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          py={6}
        >
          No records found. Please select filter and click Generate Report.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                <TableCell>S.No</TableCell>
                <TableCell>Loan ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Guarantor</TableCell>
                <TableCell>Partner</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Paid</TableCell>
                <TableCell align="right">Due</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row.sno || index + 1}</TableCell>
                  <TableCell>{row.loanId}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.guarentorName}</TableCell>
                  <TableCell>{row.partnerName}</TableCell>
                  <TableCell>
                    {row.startDate ? dayjs(row.startDate).format("DD-MMM-YYYY") : ""}
                  </TableCell>
                  <TableCell>
                    {row.endDate ? dayjs(row.endDate).format("DD-MMM-YYYY") : ""}
                  </TableCell>
                  <TableCell align="right">
                    {row.amount?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell align="right">
                    {row.amountPaid?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell align="right">
                    {row.installmentDue?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}

              {/* TOTAL ROW */}
              {data.length > 0 && (
                <TableRow sx={{ backgroundColor: "#bbdefb", fontWeight: "bold" }}>
                  <TableCell colSpan={7}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.amount.toLocaleString()}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.paid.toLocaleString()}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.due.toLocaleString()}</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BusinessOverview;