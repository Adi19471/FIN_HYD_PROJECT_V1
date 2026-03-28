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
  TextField,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";


const RevenueExpenseStatement = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
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
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Revenue & Expense Statement
      </Typography>

      {/* DATE FILTER */}
      <Grid container spacing={2} mb={3} alignItems="center">
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

        <Grid item>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={loading || !fromDate || !toDate}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </Grid>
      </Grid>

      {/* TABLE */}
      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          py={6}
        >
          No data found. Please select date range and click Generate.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {Object.keys(groupedData).map((type) => {
                const items = groupedData[type];
                const total = getTotal(items);

                return (
                  <React.Fragment key={type}>
                    {/* SECTION HEADER (Revenue / Expense) */}
                    <TableRow sx={{ backgroundColor: "#bbdefb" }}>
                      <TableCell colSpan={3}>
                        <strong>{type}</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{total.toLocaleString()}</strong>
                      </TableCell>
                    </TableRow>

                    {/* DETAIL ROWS */}
                    {items.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell width="50px" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.description || ""}</TableCell>
                        <TableCell align="right">
                          {row.amount?.toLocaleString() || "0"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}

              {/* GRAND TOTAL */}
              {data.length > 0 && (
                <TableRow sx={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}>
                  <TableCell colSpan={3}>
                    <strong>Grand Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{grandTotal.toLocaleString()}</strong>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RevenueExpenseStatement;