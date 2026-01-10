import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  MenuBook,
  AccountBalanceWallet,
  AccountBalance,
  People,
  ReceiptLong,
  Print,
  PictureAsPdf,
  Description,
  TableChart,
  CalendarToday,
} from "@mui/icons-material";
import { format } from "date-fns";
import axios from "axios";
import { successToast, errorToast } from "toastify"; // Assuming you have a toastify wrapper
import { API_BASE } from "lib/config";

// Tab configuration
const tabItems = [
  { label: "Daily Book", icon: <MenuBook /> },
  { label: "CB Ledger", icon: <AccountBalanceWallet /> },
  { label: "Accounts Ledger", icon: <AccountBalance /> },
  { label: "Accounts Master Ledger", icon: <AccountBalance /> },
  { label: "User Collections Ledger", icon: <People /> },
  { label: "Receipts Ledger", icon: <ReceiptLong /> },
];

const Daily_Book = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd")); // Default today
  const [loading, setLoading] = useState(false);

  // Data from API
  const [transactions, setTransactions] = useState([]);
  const [openingBalance, setOpeningBalance] = useState(0);

  // Derived calculations
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
  const closingBalance = openingBalance + totalCredit - totalDebit;

  // Service: Fetch day-wise transactions
  const fetchDayWiseSummary = async (date) => {
    if (!date) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/loadAllDayWiseTransactionsSummary/${date}`,
        {
          headers: {
            Authorization: `Bearer ${getSession()?.token}`, // Adjust based on your auth method
          },
        }
      );

      const data = response.data;
      setTransactions(data.cashBookSumaryViewPojoList || []);
      setOpeningBalance(data.openingBalance || 0);
      successToast("Data loaded successfully!");
    } catch (err) {
      console.error("Error fetching transactions:", err);
      errorToast("Failed to load data. Please try again.");
      setTransactions([]);
      setOpeningBalance(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle Generate button
  const handleGenerate = () => {
    fetchDayWiseSummary(selectedDate);
  };

  // Optional: Auto-fetch on mount or date change (uncomment if needed)
  // useEffect(() => {
  //   fetchDayWiseSummary(selectedDate);
  // }, [selectedDate]);

  const handlePrint = () => window.print();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f5f5" }}>
      {/* Top Toolbar */}
      <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1" fontWeight="medium">
            Date:
          </Typography>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalendarToday />}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Generate"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={handlePrint} title="Print">
            <Print />
          </IconButton>
          <IconButton title="Export to PDF">
            <PictureAsPdf sx={{ color: "red" }} />
          </IconButton>
          <IconButton title="Export to Excel">
            <Description sx={{ color: "green" }} />
          </IconButton>
          <IconButton title="Export to CSV">
            <TableChart sx={{ color: "blue" }} />
          </IconButton>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Reports Tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
            },
          }}
        >
          {tabItems.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{
                minHeight: 64,
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Paper id="printable-area" elevation={2} sx={{ p: 4, minHeight: "100%" }}>
          {/* Company Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              SRI BALAJI ENTERPRISES
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Madhura Nagar, Hyderabad.
            </Typography>
            <Typography variant="h6" mt={3}>
              Date: {format(new Date(selectedDate), "dd-MMM-yyyy")}
            </Typography>
            <Typography variant="h5" mt={3} fontWeight="bold">
              Cash Book As on : {format(new Date(selectedDate), "dd-MMM-yyyy")}
            </Typography>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box textAlign="center" my={5}>
              <CircularProgress />
              <Typography>Loading transactions...</Typography>
            </Box>
          )}

          {/* Transactions Table */}
          {!loading && (
            <>
              <TableContainer sx={{ mb: 6 }}>
                <Table sx={{ border: "1px solid #aaa" }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#006064" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Trans ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Acc. No</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Type</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>Particulars</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">
                        Credit
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">
                        Debit
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No transactions found for this date.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((row, index) => (
                        <TableRow key={row.transactionId || index} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.transactionId}</TableCell>
                          <TableCell>{row.accountNumber || "-"}</TableCell>
                          <TableCell>{row.name || "-"}</TableCell>
                          <TableCell>{row.transactionType || "-"}</TableCell>
                          <TableCell>{row.particulars || "-"}</TableCell>
                          <TableCell align="right">
                            {row.credit ? row.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
                          </TableCell>
                          <TableCell align="right">
                            {row.debit ? row.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
                          </TableCell>
                          <TableCell>{row.user || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                    {transactions.length > 0 && (
                      <TableRow sx={{ bgcolor: "#e0f7fa", fontWeight: "bold" }}>
                        <TableCell colSpan={6} align="right">
                          Total
                        </TableCell>
                        <TableCell align="right">
                          {totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell align="right">
                          {totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Balance Summary */}
              <Grid container justifyContent="flex-end" mb={6}>
                <Grid item xs={12} md={5}>
                  <Box sx={{ textAlign: "right", pr: 2 }}>
                    <Typography variant="body1">
                      <strong>Opening Balance :</strong>{" "}
                      {openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Credits (+):</strong>{" "}
                      <span style={{ color: "green" }}>
                        {totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </Typography>
                    <Typography variant="body1">
                      <strong>Debits (-):</strong>{" "}
                      <span style={{ color: "red" }}>
                        {totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      <strong>Closing Balance :</strong>{" "}
                      {closingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Placeholder for User Collections (can be extended later) */}
              <Typography variant="h6" gutterBottom>
                User Collections :
              </Typography>
              <TableContainer>
                <Table sx={{ border: "1px solid #aaa" }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#006064" }}>
                      <TableCell sx={{ color: "white" }}>User</TableCell>
                      <TableCell sx={{ color: "white" }}>MF Loans</TableCell>
                      <TableCell sx={{ color: "white" }}>DF Loans</TableCell>
                      <TableCell sx={{ color: "white" }}>MF Coll.</TableCell>
                      <TableCell sx={{ color: "white" }}>DF Coll.</TableCell>
                      <TableCell sx={{ color: "white" }}>Late Fee</TableCell>
                      <TableCell sx={{ color: "white" }}>Credits/Debits</TableCell>
                      <TableCell sx={{ color: "white" }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        User-wise collection summary will be available in respective ledger tabs.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Box textAlign="center" mt={6} color="text.secondary">
            <Typography variant="body2">Page 1 of 1</Typography>
          </Box>
        </Paper>
      </Box>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area,
          #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default Daily_Book;