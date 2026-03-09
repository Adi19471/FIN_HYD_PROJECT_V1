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
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";

const Distubuted = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const token = getSession("token");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token || ""}`,
    }),
    [token]
  );

const getDisbursedList = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/disbursedList`, {
        headers,
        params: { fromDate, toDate },
      });
      setData(res.data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // 🔥 Calculate Totals
  const totalAmount = data.reduce(
    (sum, row) => sum + (row.amount || 0),
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
      <Typography variant="h5" mb={3} fontWeight="bold">
        Disbursed Loans Report
      </Typography>

      {/* Date Filter */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              label="From Date"
              type="date"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="To Date"
              type="date"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={getDisbursedList}
              sx={{ height: "56px" }}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

{/* Table */}
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
                  <TableCell sx={{ color: "white" }}>S.No</TableCell>
                  <TableCell sx={{ color: "white" }}>Loan ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Customer</TableCell>
                  <TableCell sx={{ color: "white" }}>Start</TableCell>
                  <TableCell sx={{ color: "white" }}>End</TableCell>
                  <TableCell sx={{ color: "white" }}>Amount</TableCell>
                  <TableCell sx={{ color: "white" }}>Paid</TableCell>
                  <TableCell sx={{ color: "white" }}>Due</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
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
                          ₹ {row.amountPaid?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₹ {row.installmentDue?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={row.status === "ACTIVE" ? "success" : "error"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* TOTAL ROW */}
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell colSpan={5} align="right" sx={{ fontWeight: "bold" }}>
                        TOTAL
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        ₹ {totalAmount.toLocaleString()}
                      </TableCell>
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
                    <TableCell colSpan={9} align="center">
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

export default Distubuted;