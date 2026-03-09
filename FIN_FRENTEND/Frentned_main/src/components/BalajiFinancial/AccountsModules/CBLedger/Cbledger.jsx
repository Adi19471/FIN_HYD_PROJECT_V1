import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";
import Loans from "../Loans";

const Cbledger = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showAllData, setShowAllData] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLedgerData = async () => {
    if (!fromDate || !toDate) {
      errorToast("Please select From Date and To Date");
      return;
    }

    setLoading(true);

    try {
      const token = getSession()?.token || getSession("token") || "";

      if (!token) {
        errorToast("Authentication token not found. Please login again.");
        return;
      }

      const url = showAllData
        ? `${API_BASE}/getAllCBLedgerData/${fromDate}/${toDate}`
        : `${API_BASE}/getCollectionsCBLedgerData/${fromDate}/${toDate}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response?.data || [];

      if (Array.isArray(data) && data.length > 0) {
        setLedgerData(data);
        successToast("Ledger Data Loaded Successfully!");
      } else {
        setLedgerData([]);
        successToast("No records found for the selected period");
      }
    } catch (error) {
      console.error("Ledger fetch error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch Ledger Data";
      errorToast(message);
      setLedgerData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, position: "relative" }}>
      <Loans />

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            borderRadius: 3,
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            CB Ledger Report
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: toDate || new Date().toISOString().split("T")[0] }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: fromDate }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showAllData}
                    onChange={(e) => setShowAllData(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show All Data (Collections + Others)"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={fetchLedgerData}
                disabled={loading || !fromDate || !toDate}
                sx={{ height: "56px", fontWeight: "bold" }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch Ledger"}
              </Button>
            </Grid>
          </Grid>

          {/* Results Table */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ledger Summary
              {ledgerData.length > 0 && ` (${ledgerData.length})`}
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, overflow: "auto", maxHeight: 500 }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                      S.No
                    </TableCell>
                    <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                      Date
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      Monthly Collections
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      Daily Collections
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : ledgerData.length > 0 ? (
                    ledgerData.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{row.sno ?? index + 1}</TableCell>
                        <TableCell>{row.date || "-"}</TableCell>
                        <TableCell align="right">
                          {row.monthlyFinanceCollections != null
                            ? Number(row.monthlyFinanceCollections).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "-"}
                        </TableCell>
                        <TableCell align="right">
                          {row.dailyFinanceCollections != null
                            ? Number(row.dailyFinanceCollections).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "-"}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "medium" }}>
                          {row.total != null
                            ? Number(row.total).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        No data available for selected period
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cbledger;