

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
  Button,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";

import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import dayjs from "dayjs";
import { AppDatePicker, ReportCompanyHeader, TableExportMenu, useDateRange as useDateRangeHook } from "src/components/ui";

const token = getSession()?.token || getSession("token") || "";

const BusinessOverview = () => {
  const [loanData, setLoanData] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Controls State
  const [useDateRange, setUseDateRange] = useState(true);        // true = Date Range, false = All
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRangeHook(
    dayjs().startOf("month").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  );
  const [excludeDividends, setExcludeDividends] = useState(true);
  const [accruedRevenues, setAccruedRevenues] = useState(true);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const [totalShares, setTotalShares] = useState(0);


  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);

      if (useDateRange && (!fromDate || !toDate)) {
        setError("Please select both From and To dates.");
        return;
      }

      // If "All" is selected, we can send a wide date range or let backend handle it
      const finalFromDate = useDateRange ? fromDate : "2020-01-01";   // Change this default if needed
      const finalToDate = useDateRange ? toDate : dayjs().format("YYYY-MM-DD");

      const response = await axios.get(
        `${API_BASE}/businessOverview/${finalFromDate}/${finalToDate}/${excludeDividends}/${accruedRevenues}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoanData(response.data.loanDisbursedInformation || []);
      setRevenues(response.data.businessOverviewProjections || []);

      setOpeningBalance(response.data.openingBalance || 0);
      setClosingBalance(response.data.closingBalance || 0);
      setTotalShares(response.data.totalShares || 0);


    } catch (err) {
      setError("Failed to load Business Overview Report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch when component loads
  useEffect(() => {
    fetchReport();
  }, []);

  // Recalculate totals
  const totalLoansDisbursed = loanData.reduce((sum, item) => sum + (item.loansDisbursed || 0), 0);
  const totalInterestReceivable = loanData.reduce((sum, item) => sum + (item.interestReceivable || 0), 0);
  const totalLoansPaid = loanData.reduce((sum, item) => sum + (item.loansPaid || 0), 0);
  const totalInterestPaid = loanData.reduce((sum, item) => sum + (item.interestPaid || 0), 0);




  const totalRevenues = revenues
    .filter((r) => r.type === "REVENUES")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const revenueList = revenues.filter((r) => r.type === "REVENUES");

  const expenseList = revenues.filter((r) => r.type === "EXPENSES");

  const totalExpenses = expenseList.reduce(
    (sum, r) => sum + Math.abs(r.amount || 0),
    0
  );



  // Profit = Revenues - Expenses
  const totalProfit = totalRevenues - totalExpenses;

  // Net Profit Per Share
  const netProfit = totalShares > 0
    ? totalProfit / totalShares
    : 0;



  const exportRows = [
    ...loanData.map((loan) => ({
      section: "Loans Disbursed",
      name: loan.loanType === "DAILY_FINANCE" ? "DF" : "MF",
      loansDisbursed: loan.loansDisbursed || 0,
      interestReceivable: loan.interestReceivable || 0,
      totalReceivable: loan.sumOfLoansDisbursedAndInterestReceivable || 0,
      loansPaid: loan.loansPaid || 0,
      interestPaid: loan.interestPaid || 0,
      amount: loan.sumOfloansPaidAndInterestPaid || 0,
    })),
    ...revenues.filter((r) => r.type === "REVENUES").map((rev) => ({
      section: "Revenue",
      name: rev.code,
      loansDisbursed: "",
      interestReceivable: "",
      totalReceivable: "",
      loansPaid: "",
      interestPaid: "",
      amount: rev.amount || 0,
    })),
  ];
  const exportColumns = ["section", "name", "loansDisbursed", "interestReceivable", "totalReceivable", "loansPaid", "interestPaid", "amount"];
  const reportRange = useDateRange
    ? `From ${dayjs(fromDate).format("DD-MMM-YYYY")} To ${dayjs(toDate).format("DD-MMM-YYYY")}`
    : "All Dates";

  return (
    <Box sx={{ p: 2, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Top Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={useDateRange ? "date" : "all"}
                onChange={(e) => setUseDateRange(e.target.value === "date")}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="date" control={<Radio />} label="Date Range" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid>
            <AppDatePicker
              label="From"
              value={fromDate}
              onChange={setFromDate}
              disabled={!useDateRange}
            />
          </Grid>

          <Grid>
            <AppDatePicker
              label="To"
              value={toDate}
              onChange={setToDate}
              disabled={!useDateRange}
              minDate={toDateMin}
              maxDate={toDateMax}
            />
          </Grid>

          <Grid size="grow">
            <FormControlLabel
              control={
                <Checkbox
                  checked={excludeDividends}
                  onChange={(e) => setExcludeDividends(e.target.checked)}
                />
              }
              label="Exclude Dividends"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accruedRevenues}
                  onChange={(e) => setAccruedRevenues(e.target.checked)}
                />
              }
              label="Accrued Revenues"
            />
          </Grid>

          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchReport}
              sx={{ mr: 1 }}
            >
              Generate
            </Button>
            <TableExportMenu rows={exportRows} columns={exportColumns} fileName="Business_Overview" />
          </Grid>
        </Grid>
      </Paper>
      {/* Report Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : (
        <Paper sx={{ p: 4, backgroundColor: "white", boxShadow: 2 }}>
          <ReportCompanyHeader
            title="Business Overview"
            subtitle={reportRange}
            date={dayjs()}
          />

          {/* Loans Disbursed Information */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Loans Disbursed Information :
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 5, overflow: "auto" }}>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
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
                    <TableCell>{loan.loanType === "DAILY_FINANCE" ? "DF" : "MF"}</TableCell>
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
                        : "0"}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow sx={{ backgroundColor: "#e3f2fd", fontWeight: "bold" }}>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell align="right"><strong>{totalLoansDisbursed.toLocaleString()}</strong></TableCell>
                  <TableCell align="right"><strong>{totalInterestReceivable.toLocaleString()}</strong></TableCell>
                  <TableCell align="right"><strong>{(totalLoansDisbursed + totalInterestReceivable).toLocaleString()}</strong></TableCell>
                  <TableCell align="right"><strong>{totalLoansPaid.toLocaleString()}</strong></TableCell>
                  <TableCell align="right"><strong>{totalInterestPaid.toLocaleString()}</strong></TableCell>
                  <TableCell align="right"><strong>{(totalLoansPaid + totalInterestPaid).toLocaleString()}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Revenues */}
          <Box>
            <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">REVENUES</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                Total: ₹{totalRevenues.toLocaleString()}
              </Typography>
            </Grid>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  {revenueList.map((rev, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{rev.code}</TableCell>
                      <TableCell align="right">
                        ₹{Number(rev.amount || 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 4 }}>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  EXPENSES
                </Typography>

                <Typography variant="subtitle1" fontWeight="bold">
                  Total: ₹{totalExpenses.toLocaleString()}
                </Typography>
              </Grid>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {expenseList.map((exp, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{exp.code}</TableCell>
                        <TableCell align="right">
                          ₹{Math.abs(exp.amount || 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          {/* Summary Section */}
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>

              {/* Left Side */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" fontWeight="bold">
                  Opening Balance :
                  ₹{Number(openingBalance).toLocaleString()}
                </Typography>

                <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                  Closing Balance :
                  ₹{Number(closingBalance).toLocaleString()}
                </Typography>
              </Grid>

              {/* Right Side */}
              <Grid size={{ xs: 12, md: 6 }} textAlign="right">


                <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                  Total Profit :
                  ₹{Number(totalProfit).toLocaleString()}
                </Typography>

                <Typography variant="body1" fontWeight="bold">
                  Total Shares :
                  {Number(totalShares).toLocaleString()}
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={netProfit >= 0 ? "success.main" : "error.main"}
                  sx={{ mt: 1 }}
                >
                  Net Profit :
                  ₹{Number(netProfit).toLocaleString()}
                </Typography>
              </Grid>

            </Grid>
          </Box>
          <Typography align="center" sx={{ mt: 5, color: "#666" }}>
            Page 1 of 1
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BusinessOverview;
