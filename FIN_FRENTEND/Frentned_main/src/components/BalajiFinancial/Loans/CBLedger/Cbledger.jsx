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
    try {
      if (!fromDate || !toDate) {
        errorToast("Please select From Date and To Date");
        return;
      }

      setLoading(true);

      const session = getSession();
      const token = session?.token;

      let url = "";

      if (showAllData) {
        url = `${API_BASE}/getAllCBLedgerData/${fromDate}/${toDate}`;
      } else {
        url = `${API_BASE}/getCollectionsCBLedgerData/${fromDate}/${toDate}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data) {
        setLedgerData(response.data);
        successToast("Ledger Data Loaded Successfully!");
      } else {
        setLedgerData([]);
        errorToast("No Data Found!");
      }
    } catch (error) {
      console.error(error);
      errorToast("Failed to fetch Ledger Data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Loans />

      <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            CB Ledger Report
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showAllData}
                    onChange={(e) => setShowAllData(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show All Data"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={fetchLedgerData}
                disabled={loading}
                sx={{ height: "55px", fontWeight: "bold" }}
              >
                {loading ? <CircularProgress size={25} color="inherit" /> : "Fetch Data"}
              </Button>
            </Grid>
          </Grid>

          {/* Table Display */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Ledger Data List
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      S.No
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Customer Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Amount
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Remarks
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ledgerData.length > 0 ? (
                    ledgerData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row?.date || "-"}</TableCell>
                        <TableCell>{row?.customerName || row?.name || "-"}</TableCell>
                        <TableCell>{row?.amount || row?.amt || "-"}</TableCell>
                        <TableCell>{row?.remarks || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No Data Available
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
