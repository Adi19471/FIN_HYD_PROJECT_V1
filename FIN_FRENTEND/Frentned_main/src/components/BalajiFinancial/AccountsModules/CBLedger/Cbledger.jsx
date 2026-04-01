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
  Divider,
  TablePagination,
} from "@mui/material";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast } from "toastify";


const Cbledger = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [collectionOnly, setCollectionOnly] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchLedgerData = async () => {
    if (!fromDate || !toDate) {
      errorToast("Please select From Date and To Date");
      return;
    }

    setLoading(true);

    try {
      const token = getSession()?.token || getSession("token") || "";

      const url = collectionOnly
        ? `${API_BASE}/getCollectionsCBLedgerData/${fromDate}/${toDate}`
        : `${API_BASE}/getAllCBLedgerData/${fromDate}/${toDate}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLedgerData(response?.data || []);
      setPage(0); // reset page
    } catch (err) {
      errorToast("Failed to fetch data");
      setLedgerData([]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated Data
  const paginatedData = ledgerData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Totals
  const totals = ledgerData.reduce(
    (acc, row) => {
      if (collectionOnly) {
        acc.monthly += row.monthlyFinanceCollections || 0;
        acc.daily += row.dailyFinanceCollections || 0;
        acc.total += row.total || 0;
      } else {
        acc.credit += row.credit || 0;
        acc.debit += row.debit || 0;
        acc.balance += row.balance || 0;
        acc.closing += row.closingBalance || 0;
      }
      return acc;
    },
    {
      monthly: 0,
      daily: 0,
      total: 0,
      credit: 0,
      debit: 0,
      balance: 0,
      closing: 0,
    }
  );

  return (
    <Box sx={{ p: 3 }}>
      

      <Card sx={{ mt: 3, borderRadius: 0, boxShadow: 0 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            CB Ledger Report
          </Typography>

          {/* Filters */}
          <Grid container spacing={2}>
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
                    checked={collectionOnly}
                    onChange={(e) => setCollectionOnly(e.target.checked)}
                  />
                }
                label="Collection Only"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchLedgerData}
                disabled={loading}
                sx={{ height: "56px", fontWeight: "bold" }}
              >
                {loading ? <CircularProgress size={24} /> : "Fetch"}
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 450,
              overflow: "auto",
              borderRadius: 3,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["S.No", "Date"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        fontWeight: "bold",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}

                  {collectionOnly ? (
                    ["Monthly", "Daily", "Total"].map((h) => (
                      <TableCell
                        key={h}
                        align="right"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))
                  ) : (
                    ["Credit", "Debit", "Balance", "Closing"].map((h) => (
                      <TableCell
                        key={h}
                        align="right"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length > 0 ? (
                  <>
                    {paginatedData.map((row, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                        <TableCell>{row.date}</TableCell>

                        {collectionOnly ? (
                          <>
                            <TableCell align="right">
                              {row.monthlyFinanceCollections}
                            </TableCell>
                            <TableCell align="right">
                              {row.dailyFinanceCollections}
                            </TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="right">{row.credit}</TableCell>
                            <TableCell align="right">{row.debit}</TableCell>
                            <TableCell align="right">{row.balance}</TableCell>
                            <TableCell align="right">
                              {row.closingBalance}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}

                    {/* Totals Row */}
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
                        Total
                      </TableCell>

                      {collectionOnly ? (
                        <>
                          <TableCell align="right">{totals.monthly}</TableCell>
                          <TableCell align="right">{totals.daily}</TableCell>
                          <TableCell align="right">{totals.total}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell align="right">{totals.credit}</TableCell>
                          <TableCell align="right">{totals.debit}</TableCell>
                          <TableCell align="right">{totals.balance}</TableCell>
                          <TableCell align="right">{totals.closing}</TableCell>
                        </>
                      )}
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={ledgerData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cbledger;