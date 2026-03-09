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
  TableHead,
  TableRow,
  TextField,
  Chip,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";

const InstalmentDues = () => {
  const [data, setData] = useState([]);
  const [loanType, setLoanType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const token = getSession("token");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const loanTypes = [
    { label: "Daily Finance", value: "DAILY_FINANCE" },
    { label: "Monthly Finance", value: "MONTHLY_FINANCE" },
  ];

  const getInstallmentDues = async () => {
    if (!loanType || !fromDate || !toDate) {
      alert("Please select Loan Type and Date Range");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/installmentDuesList`,
        {
          loanType,
          fromDate,
          toDate,
        },
        { headers }
      );

      setData(res.data || []);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch installment dues");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Totals Calculation
  const totalAmount = data.reduce((sum, row) => sum + (row.amount || 0), 0);

  const totalInstallmentAmount = data.reduce(
    (sum, row) => sum + (row.installmentAmount || 0),
    0
  );

  const totalPaid = data.reduce(
    (sum, row) => sum + (row.amountPaid || 0),
    0
  );

  const totalDue = data.reduce(
    (sum, row) => sum + (row.installmentDue || 0),
    0
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Installment Dues Report
      </Typography>

      {/* FILTER SECTION */}
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Loan Type"
              fullWidth
              size="small"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
            >
              {loanTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="From Date"
              type="date"
              size="small"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="To Date"
              type="date"
              size="small"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={getInstallmentDues}
              sx={{ height: 40, fontWeight: "bold" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} /> : "GENERATE"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

{/* TABLE SECTION */}
      <Paper>
        {loading && data.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <LoadingSpinner />
          </Box>
        ) : (
          <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>S.No</TableCell>
                <TableCell sx={{ color: "#fff" }}>Loan ID</TableCell>
                <TableCell sx={{ color: "#fff" }}>Customer</TableCell>
                <TableCell sx={{ color: "#fff" }}>Start</TableCell>
                <TableCell sx={{ color: "#fff" }}>End</TableCell>
                <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
                <TableCell sx={{ color: "#fff" }}>Installment Amt</TableCell>
                <TableCell sx={{ color: "#fff" }}>Paid</TableCell>
                <TableCell sx={{ color: "#fff" }}>Due</TableCell>
                <TableCell sx={{ color: "#fff" }}>Pending</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length > 0 ? (
                <>
                  {data.map((row) => (
                    <TableRow key={row.sno}>
                      <TableCell>{row.sno}</TableCell>
                      <TableCell>{row.loanId}</TableCell>
                      <TableCell>{row.customerName}</TableCell>

                      <TableCell>
                        {dayjs(row.startDate, "DD-MM-YYYY").format("DD MMM YYYY")}
                      </TableCell>

                      <TableCell>
                        {dayjs(row.endDate, "DD-MM-YYYY").format("DD MMM YYYY")}
                      </TableCell>

                      <TableCell>
                        ₹ {row.amount?.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        ₹ {row.installmentAmount?.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        ₹ {row.amountPaid?.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`₹ ${row.installmentDue?.toLocaleString()}`}
                          color="error"
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {row.noOfInstallmentsPending}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* TOTAL ROW */}
                  <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                    <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                      TOTAL
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }}>
                      ₹ {totalAmount.toLocaleString()}
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }}>
                      ₹ {totalInstallmentAmount.toLocaleString()}
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }}>
                      ₹ {totalPaid.toLocaleString()}
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold", color: "red" }}>
                      ₹ {totalDue.toLocaleString()}
                    </TableCell>

                    <TableCell />
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default InstalmentDues;