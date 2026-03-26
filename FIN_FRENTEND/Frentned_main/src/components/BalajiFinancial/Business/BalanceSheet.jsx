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

const BalanceSheet = () => {
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // API CALL
  const fetchData = async () => {
    if (!toDate) {
      alert("Please select date");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/balanceSheet/${dayjs(toDate).format("YYYY-MM-DD")}`
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // GROUP BY TYPE (ASSETS / LIABILITIES)
  const groupedData = useMemo(() => {
    const result = {};

    data.forEach((item) => {
      if (!result[item.type]) {
        result[item.type] = {};
      }

      if (!result[item.type][item.masterCode]) {
        result[item.type][item.masterCode] = [];
      }

      result[item.type][item.masterCode].push(item);
    });

    return result;
  }, [data]);

  // TOTAL CALCULATIONS
  const getSubTotal = (items) =>
    items.reduce((sum, i) => sum + i.amount, 0);

  const getMainTotal = (group) =>
    Object.values(group)
      .flat()
      .reduce((sum, i) => sum + i.amount, 0);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Balance Sheet
      </Typography>

      {/* DATE FILTER */}
      <Grid container spacing={2} mb={2}>
        <Grid item>
          <TextField
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={toDate ? dayjs(toDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={!toDate}
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
                const mainGroup = groupedData[type];
                const mainTotal = getMainTotal(mainGroup);

                return (
                  <React.Fragment key={type}>
                    {/* MAIN HEADER (ASSETS / LIABILITIES) */}
                    <TableRow sx={{ background: "#e0e0e0" }}>
                      <TableCell colSpan={2}>
                        <strong>{type}</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Total: {mainTotal.toLocaleString()}</strong>
                      </TableCell>
                    </TableRow>

                    {/* SUB GROUPS */}
                    {Object.keys(mainGroup).map((sub) => {
                      const items = mainGroup[sub];
                      const subTotal = getSubTotal(items);

                      return (
                        <React.Fragment key={sub}>
                          {/* SUB HEADER */}
                          <TableRow sx={{ background: "#90caf9" }}>
                            <TableCell colSpan={2}>
                              <strong>{sub}</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>{subTotal.toLocaleString()}</strong>
                            </TableCell>
                          </TableRow>

                          {/* ROWS */}
                          {items.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell width="50px">
                                {index + 1}
                              </TableCell>
                              <TableCell>{row.code}</TableCell>
                              <TableCell align="right">
                                {row.amount.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BalanceSheet;