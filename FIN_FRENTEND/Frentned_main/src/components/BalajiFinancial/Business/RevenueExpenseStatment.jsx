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
  TextField,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import LoadingSpinner from "src/LoadingSpinner";

const RevenueExpenseStatement = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // API CALL
  const fetchData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/revenueExpenseStatement/${dayjs(fromDate).format(
          "YYYY-MM-DD"
        )}/${dayjs(toDate).format("YYYY-MM-DD")}`
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // GROUP DATA BY TYPE
  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach((item) => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }
      groups[item.type].push(item);
    });
    return groups;
  }, [data]);

  // TOTAL PER GROUP
  const getTotal = (items) =>
    items.reduce((sum, item) => sum + item.amount, 0);

  // GRAND TOTAL
  const grandTotal = useMemo(() => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }, [data]);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Revenue & Expense Statement
      </Typography>

      {/* DATE FILTER */}
      <Grid container spacing={2} mb={2}>
        <Grid item>
          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : ""}
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

        <Grid item>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={!fromDate || !toDate}
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
          <Table>
            <TableBody>
              {Object.keys(groupedData).map((type) => {
                const items = groupedData[type];
                const total = getTotal(items);

                return (
                  <React.Fragment key={type}>
                    {/* SECTION HEADER */}
                    <TableRow sx={{ background: "#bbdefb" }}>
                      <TableCell colSpan={2}>
                        <strong>{type}</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{total.toLocaleString()}</strong>
                      </TableCell>
                    </TableRow>

                    {/* ROWS */}
                    {items.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell width="50px">{index + 1}</TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell align="right">
                          {row.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}

              {/* GRAND TOTAL */}
              {data.length > 0 && (
                <TableRow sx={{ background: "#e0e0e0" }}>
                  <TableCell colSpan={2}>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{grandTotal.toLocaleString()}</strong>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RevenueExpenseStatement;