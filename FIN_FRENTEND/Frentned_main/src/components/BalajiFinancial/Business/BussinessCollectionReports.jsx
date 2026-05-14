import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const BussinessCollectionReports = () => {
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );

  const [toDate, setToDate] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  // Token
  const token = getSession()?.token || getSession("token") || "";

  // Stable headers
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchReport = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE}/businessCollectionsReport/${fromDate}/${toDate}`,
        {
          headers,
        }
      );

      setReportData(response.data || []);
    } catch (error) {
      console.error("Business Collection Report Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const groupedData = useMemo(() => {
    const result = {
      DAILY_FINANCE: {
        ACTIVE: null,
        MATURED: null,
      },
      MONTHLY_FINANCE: {
        ACTIVE: null,
        MATURED: null,
      },
    };

    reportData.forEach((item) => {
      if (!result[item.loanType]) {
        result[item.loanType] = {};
      }

      result[item.loanType][item.loanStatus] = item;
    });

    return result;
  }, [reportData]);

  const renderSection = (title, data) => (
    <Box mb={4}>
      <Box
        sx={{
          backgroundColor: "#d9d9d9",
          border: "1px solid #777",
          px: 1,
          py: 0.5,
          mb: 2,
        }}
      >
        <Typography fontWeight="bold">{title}</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Active Loans */}
        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold" mb={1}>
            Active Loans :
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Target Collections :</TableCell>
                <TableCell align="right">
                  {data?.ACTIVE?.targetCollections?.toLocaleString() || 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Received Collections :</TableCell>
                <TableCell align="right">
                  {data?.ACTIVE?.receivedCollections?.toLocaleString() || 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Collections Balance :</TableCell>
                <TableCell align="right">
                  {data?.ACTIVE?.balanceCollections?.toLocaleString() || 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        {/* Matured Loans */}
        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold" mb={1}>
            Matured Loans :
          </Typography>

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Target Collections :</TableCell>
                <TableCell align="right">
                  {data?.MATURED?.targetCollections?.toLocaleString() || 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Received Collections :</TableCell>
                <TableCell align="right">
                  {data?.MATURED?.receivedCollections?.toLocaleString() || 0}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Collections Balance :</TableCell>
                <TableCell align="right">
                  {data?.MATURED?.balanceCollections?.toLocaleString() || 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box p={2}>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              type="date"
              label="From Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              type="date"
              label="To Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={fetchReport}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Generate"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Report */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          minHeight: "70vh",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            SRI BALAJI ENTERPRISES
          </Typography>

          <Typography variant="h6">
            YellaReddy Guda, Hyderabad.
          </Typography>

          <Typography mt={3} fontWeight="bold">
            Business Collections Report From{" "}
            {dayjs(fromDate).format("DD-MMM-YYYY")} To{" "}
            {dayjs(toDate).format("DD-MMM-YYYY")}
          </Typography>

          <Typography mt={1}>
            Date : {dayjs().format("DD-MMM-YYYY")}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Loading */}
        {loading ? (
          <Box textAlign="center" mt={10}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderSection("DF", groupedData.DAILY_FINANCE)}
            {renderSection("MF", groupedData.MONTHLY_FINANCE)}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default BussinessCollectionReports;