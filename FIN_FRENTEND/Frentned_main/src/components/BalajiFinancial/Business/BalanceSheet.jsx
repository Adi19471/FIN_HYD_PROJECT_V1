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
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";


const BalanceSheet = () => {
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get token
  const token = getSession()?.token || getSession("token") || "";

  // API CALL with Token
  const fetchData = async () => {
    if (!toDate) {
      alert("Please select a date");
      return;
    }

    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/balanceSheet/${dayjs(toDate).format("YYYY-MM-DD")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setData(res.data || []);
    } catch (err) {
      console.error("Error fetching balance sheet:", err);
      alert(err.response?.data?.message || "Failed to fetch balance sheet");
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
    items.reduce((sum, i) => sum + (i.amount || 0), 0);

  const getMainTotal = (group) =>
    Object.values(group)
      .flat()
      .reduce((sum, i) => sum + (i.amount || 0), 0);

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
            label="As On Date"
            InputLabelProps={{ shrink: true }}
            value={toDate ? dayjs(toDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={!toDate || loading}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </Grid>
      </Grid>

      {/* TABLE */}
      {loading ? (
        <LoadingSpinner />
      ) : data.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" py={4}>
          No data available. Please select a date and click Generate.
        </Typography>
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
                    <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableCell colSpan={3}>
                        <strong>{type.toUpperCase()}</strong>
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
                          <TableRow sx={{ backgroundColor: "#90caf9" }}>
                            <TableCell colSpan={3}>
                              <strong>{sub}</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>{subTotal.toLocaleString()}</strong>
                            </TableCell>
                          </TableRow>

                          {/* DETAIL ROWS */}
                          {items.map((row, index) => (
                            <TableRow key={index} hover>
                              <TableCell width="50px" align="center">
                                {index + 1}
                              </TableCell>
                              <TableCell>{row.code}</TableCell>
                              <TableCell>{row.description || ""}</TableCell>
                              <TableCell align="right">
                                {row.amount?.toLocaleString() || "0"}
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