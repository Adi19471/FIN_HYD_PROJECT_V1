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
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import { AppDatePicker } from "src/components/ui";


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
  <Box sx={{ p: 3 }}>

    {/* HEADER */}
    <Typography variant="h6" fontWeight={700} mb={3}>
      Balance Sheet
    </Typography>

    {/* FILTER */}
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">

        <Grid item xs={12} md={4}>
          <AppDatePicker label="As On Date" value={toDate} onChange={setToDate} />
        </Grid>

        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={fetchData}
            disabled={!toDate || loading}
          >
            {loading ? "Generating..." : "Generate Balance Sheet"}
          </Button>
        </Grid>

      </Grid>
    </Paper>

    {/* CONTENT */}
    {loading ? (
      <LoadingSpinner />
    ) : data.length === 0 ? (
      <Paper sx={{ p: 5, textAlign: "center" }}>
        <Typography color="text.secondary">
          No data available. Please select a date.
        </Typography>
      </Paper>
    ) : (
      <>
        {/* TOTAL CARDS */}
        <Grid container spacing={2} mb={3}>
          {["Assets", "Liabilities"].map((type) => {
            const total = getMainTotal(groupedData[type] || {});
            return (
              <Grid item xs={12} md={6} key={type}>
                <Paper
                  sx={{
                    p: 2,
                    borderLeft: `5px solid ${
                      type === "Assets" ? "green" : "red"
                    }`,
                  }}
                >
                  <Typography variant="subtitle2">{type}</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    ₹ {total.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* SIDE BY SIDE */}
        <Grid container spacing={2}>

          {/* ASSETS */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={2} color="green">
                Assets
              </Typography>

              {Object.entries(groupedData["Assets"] || {}).map(
                ([sub, items]) => (
                  <Box key={sub} mb={2}>
                    <Typography fontWeight={600}>
                      {sub} (₹ {getSubTotal(items).toLocaleString()})
                    </Typography>

                    {items.map((row, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.5,
                          borderBottom: "1px dashed #ddd",
                        }}
                      >
                        <Typography variant="body2">
                          {row.description}
                        </Typography>
                        <Typography variant="body2">
                          ₹ {row.amount?.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )
              )}
            </Paper>
          </Grid>

          {/* LIABILITIES */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} mb={2} color="red">
                Liabilities
              </Typography>

              {Object.entries(groupedData["Liabilities"] || {}).map(
                ([sub, items]) => (
                  <Box key={sub} mb={2}>
                    <Typography fontWeight={600}>
                      {sub} (₹ {getSubTotal(items).toLocaleString()})
                    </Typography>

                    {items.map((row, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.5,
                          borderBottom: "1px dashed #ddd",
                        }}
                      >
                        <Typography variant="body2">
                          {row.description}
                        </Typography>
                        <Typography variant="body2">
                          ₹ {row.amount?.toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )
              )}
            </Paper>
          </Grid>

        </Grid>

        {/* BALANCE CHECK */}
        <Box mt={3} textAlign="center">
          <Paper sx={{ p: 2 }}>
            <Typography fontWeight={700}>
              Balance Check:
              {" "}
              ₹{" "}
              {(
                getMainTotal(groupedData["Assets"] || {}) -
                getMainTotal(groupedData["Liabilities"] || {})
              ).toLocaleString()}
            </Typography>
          </Paper>
        </Box>

      </>
    )}

  </Box>
);
};

export default BalanceSheet;
