import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const Maturity = () => {
  const [loanType, setLoanType] = useState("MONTHLY_FINANCE"); // default selected
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
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

  const fetchMaturityLoans = async () => {
    if (!loanType || !fromDate || !toDate) {
      alert("Please select Loan Type and Date Range");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        loanType,
        fromDate,
        toDate,
      };

      const res = await axios.post(
        `${API_BASE}/maturityLoansList`,
        payload,
        { headers }
      );

      setData(res.data || []);
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to fetch maturity loans");
    } finally {
      setLoading(false);
    }
  };

  // Totals Calculation
  const totalAmount = data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalPaid = data.reduce((sum, item) => sum + Number(item.amountPaid || 0), 0);
  const totalDue = data.reduce((sum, item) => sum + Number(item.installmentDue || 0), 0);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Maturity Ledger Report
      </Typography>

      {/* Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Loan Type"
              fullWidth
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
              sx={{ height: 56 }}
              onClick={fetchMaturityLoans}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "GENERATE"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Section */}
      <Paper>
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
                <TableCell sx={{ color: "#fff" }}>Inst. Amt</TableCell>
                <TableCell sx={{ color: "#fff" }}>Paid</TableCell>
                <TableCell sx={{ color: "#fff" }}>Due</TableCell>
                <TableCell sx={{ color: "#fff" }}>Pending</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length > 0 ? (
                <>
                  {data.map((row, index) => (
                    <TableRow key={row.loanId || index}>
                      <TableCell>{row.sno}</TableCell>
                      <TableCell>{row.loanId}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>
                        {dayjs(row.startDate, "DD-MM-YYYY").format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell>
                        {dayjs(row.endDate, "DD-MM-YYYY").format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell>₹ {Number(row.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        ₹ {Number(row.installmentAmount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ₹ {Number(row.amountPaid).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`₹ ${Number(row.installmentDue).toLocaleString()}`}
                          color="error"
                        />
                      </TableCell>
                      <TableCell>{row.noOfInstallmentsPending}</TableCell>
                    </TableRow>
                  ))}

                  {/* Totals Row */}
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                      TOTAL
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      ₹ {totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell />
                    <TableCell sx={{ fontWeight: "bold" }}>
                      ₹ {totalPaid.toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
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
      </Paper>
    </Box>
  );
};

export default Maturity;