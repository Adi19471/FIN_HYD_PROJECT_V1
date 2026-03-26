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
  TableRow,
  TableHead,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import LoadingSpinner from "src/LoadingSpinner";

const BusinessOverview = () => {
  const [filterType, setFilterType] = useState("ALL");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // API CALL
  const fetchData = async () => {
    try {
      setLoading(true);

      let url = "";

      if (filterType === "ALL") {
        url = `${API_BASE}/disbursedList`;
      } else {
        if (!fromDate || !toDate) {
          alert("Select both dates");
          return;
        }

        url = `${API_BASE}/disbursedList/${dayjs(fromDate).format(
          "YYYY-MM-DD"
        )}/${dayjs(toDate).format("YYYY-MM-DD")}`;
      }

      const res = await axios.get(url);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // TOTALS
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.amount += item.amount || 0;
        acc.paid += item.amountPaid || 0;
        acc.due += item.installmentDue || 0;
        return acc;
      },
      { amount: 0, paid: 0, due: 0 }
    );
  }, [data]);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Business Overview
      </Typography>

      {/* FILTER */}
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item>
          <RadioGroup
            row
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel
              value="RANGE"
              control={<Radio />}
              label="Date Range"
            />
          </RadioGroup>
        </Grid>

        {filterType === "RANGE" && (
          <>
            <Grid item>
              <TextField
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={
                  fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : ""
                }
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Grid>

            <Grid item>
              <TextField
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={toDate ? dayjs(toDate).format("YYYY-MM-DD") : ""}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Grid>
          </>
        )}

        <Grid item>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={
              filterType === "RANGE" && (!fromDate || !toDate)
            }
          >
            Generate
          </Button>
        </Grid>
      </Grid>

      {/* TABLE */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            {/* HEADER */}
            <TableHead>
              <TableRow sx={{ background: "#e0e0e0" }}>
                <TableCell>S.No</TableCell>
                <TableCell>Loan ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Guarantor</TableCell>
                <TableCell>Partner</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Paid</TableCell>
                <TableCell align="right">Due</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            {/* BODY */}
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.sno}</TableCell>
                  <TableCell>{row.loanId}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.guarentorName}</TableCell>
                  <TableCell>{row.partnerName}</TableCell>
                  <TableCell>
                    {dayjs(row.startDate).format("DD-MMM-YYYY")}
                  </TableCell>
                  <TableCell>
                    {dayjs(row.endDate).format("DD-MMM-YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    {row.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {row.amountPaid?.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {row.installmentDue?.toLocaleString()}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}

              {/* TOTAL ROW */}
              {data.length > 0 && (
                <TableRow sx={{ background: "#bbdefb" }}>
                  <TableCell colSpan={7}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.amount.toLocaleString()}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.paid.toLocaleString()}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totals.due.toLocaleString()}</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BusinessOverview;