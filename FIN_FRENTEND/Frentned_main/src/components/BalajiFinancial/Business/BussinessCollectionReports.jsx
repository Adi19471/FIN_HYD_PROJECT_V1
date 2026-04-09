import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import dayjs from "dayjs";

const token = getSession()?.token || getSession("token") || "";

const BussinessCollectionReports = () => {
  const [loanData, setLoanData] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fromDate = "2025-12-10";
  const toDate = "2026-04-08";
  const includeDF = true;
  const includeMF = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_BASE}/balaji-finance/businessOverview/${fromDate}/${toDate}/${includeDF}/${includeMF}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLoanData(response.data.loanDisbursedInformation || []);
        setRevenues(response.data.businessOverviewProjections || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch business overview");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate Totals
  const totalLoansDisbursed = loanData.reduce((sum, item) => sum + (item.loansDisbursed || 0), 0);
  const totalInterestReceivable = loanData.reduce((sum, item) => sum + (item.interestReceivable || 0), 0);
  const totalLoansPaid = loanData.reduce((sum, item) => sum + (item.loansPaid || 0), 0);
  const totalInterestPaid = loanData.reduce((sum, item) => sum + (item.interestPaid || 0), 0);

  const totalRevenues = revenues
    .filter((r) => r.type === "REVENUES")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  // TODO: Update this when backend sends expenses
  const totalExpenses = 0;

  const netProfit = totalRevenues - totalExpenses;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Business Overview
      </Typography>
      <Typography variant="subtitle1" align="right" gutterBottom>
        YellaReddy Guda, Hyderabad | Date: {dayjs().format("DD-MMM-YYYY")}
      </Typography>

      {/* Loans Disbursed Information */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Loans Disbursed Information
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Loan Type</strong></TableCell>
                <TableCell align="right"><strong>Loans Disbursed (A)</strong></TableCell>
                <TableCell align="right"><strong>Interest Receivable (B)</strong></TableCell>
                <TableCell align="right"><strong>Total (A+B)</strong></TableCell>
                <TableCell align="right"><strong>Loans Paid (X)</strong></TableCell>
                <TableCell align="right"><strong>Interest Paid (Y)</strong></TableCell>
                <TableCell align="right"><strong>Total (X+Y)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanData.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {loan.loanType === "DAILY_FINANCE" ? "DF" : "MF"}
                  </TableCell>
                  <TableCell align="right">{Number(loan.loansDisbursed || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{Number(loan.interestReceivable || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    {Number(loan.sumOfLoansDisbursedAndInterestReceivable || 0).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{Number(loan.loansPaid || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{Number(loan.interestPaid || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    {loan.sumOfloansPaidAndInterestPaid
                      ? Number(loan.sumOfloansPaidAndInterestPaid).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell align="right"><strong>{totalLoansDisbursed.toLocaleString()}</strong></TableCell>
                <TableCell align="right"><strong>{totalInterestReceivable.toLocaleString()}</strong></TableCell>
                <TableCell align="right">
                  <strong>{(totalLoansDisbursed + totalInterestReceivable).toLocaleString()}</strong>
                </TableCell>
                <TableCell align="right"><strong>{totalLoansPaid.toLocaleString()}</strong></TableCell>
                <TableCell align="right"><strong>{totalInterestPaid.toLocaleString()}</strong></TableCell>
                <TableCell align="right">
                  <strong>{(totalLoansPaid + totalInterestPaid).toLocaleString()}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Revenues */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">REVENUES</Typography>
          <Typography variant="h6" color="primary">
            Total: ₹{totalRevenues.toLocaleString()}
          </Typography>
        </Grid>

        <TableContainer>
          <Table size="small">
            <TableBody>
              {revenues
                .filter((r) => r.type === "REVENUES")
                .map((rev, index) => (
                  <TableRow key={index}>
                    <TableCell>{rev.code}</TableCell>
                    <TableCell align="right">₹{Number(rev.amount || 0).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Expenses - Placeholder */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">EXPENSES</Typography>
          <Typography variant="h6">Total: ₹{totalExpenses.toLocaleString()}</Typography>
        </Grid>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          Expenses data is not available in current API response.
          <br />
          Please update backend to send expenses for full report.
        </Typography>
      </Paper>

      {/* Net Profit Summary */}
      <Paper sx={{ p: 3, backgroundColor: netProfit >= 0 ? "#e8f5e9" : "#ffebee" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Net Profit</Typography>
            <Typography 
              variant="h4" 
              color={netProfit >= 0 ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              ₹{netProfit.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Total Shares :</strong> 13.0</Typography>
            <Typography><strong>Partner's Income :</strong> -2,11,745</Typography>
          </Grid>

        </Grid>
      </Paper>
    </Box>
  );
};

export default BussinessCollectionReports;