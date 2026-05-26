import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Divider,
  Autocomplete,
  CircularProgress,
  TablePagination,
  Skeleton,
  TextField,           // Added for smooth loading
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import { ReportCompanyHeader, TableExportMenu } from "src/components/ui";

const Customer_Dues = () => {
  const [customerInput, setCustomerInput] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [options, setOptions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [duesData, setDuesData] = useState([]);
  const [loadingDues, setLoadingDues] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]); // ← Fixed: stable headers

  // Search function (no minimum 2 letters)
  const searchMembers = useCallback(
    async (query = "") => {
      setLoadingSearch(true);
      try {
        const res = await axios.get(`${API_BASE}/PersonalInfo/autocomplete`, {
          headers,
          params: { q: query.trim() },
        });

        const list = (res.data || []).map((item) => ({
          id: item.id,
          label: `${item.id || ""} ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"}`,
          original: item,
        }));

        setOptions(list);
      } catch (err) {
        console.error("Search failed:", err);
        setOptions([]);
      } finally {
        setLoadingSearch(false);
      }
    },
    [headers]
  );

  // Debounced search + load on focus
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMembers(customerInput);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [customerInput, searchMembers]);

  const fetchCustomerDues = useCallback(async (custId) => {
    if (!custId) return;

    setLoadingDues(true);
    setError(null);
    setDuesData([]); // Clear old data to avoid flash of old content

    try {
      const response = await axios.get(
        `${API_BASE}/customerDues/${custId}`,
        { headers }
      );
      setDuesData(response.data || []);
      setPage(0);
    } catch (err) {
      console.error("Dues fetch error:", err);
      setError("Failed to load customer dues.");
      setDuesData([]);
    } finally {
      setLoadingDues(false);
    }
  }, [headers]);

  const handleCustomerSelect = (event, newValue) => {
    setSelectedCustomer(newValue);
    if (newValue?.id) {
      setCustomerInput(newValue.label);
      fetchCustomerDues(newValue.id);
    } else {
      setDuesData([]);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totals = useMemo(() => {
    const totalAmount = duesData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalPaid = duesData.reduce((sum, item) => sum + (item.totalInstallmentAmountPaid || 0), 0);
    const totalDue = duesData.reduce((sum, item) => sum + (item.installmentAmountPending || 0), 0);
    return { totalAmount, totalPaid, totalDue };
  }, [duesData]);

  const exportColumns = [
    "loanId",
    "customerName",
    "guarentorName",
    "partnerName",
    "startDate",
    "endDate",
    "amount",
    "totalInstallmentAmountPaid",
    "installmentAmountPending",
    "dueDate",
    "remarks",
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Autocomplete
              openOnFocus
              freeSolo
              options={options}
              loading={loadingSearch}
              value={selectedCustomer}
              inputValue={customerInput} sx={{width:"220px"}}
              onInputChange={(e, newValue) => setCustomerInput(newValue)}
              onChange={handleCustomerSelect}
              onOpen={() => searchMembers("")}   // Show list immediately on click
              getOptionLabel={(option) => (typeof option === "string" ? option : option.label || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Customer"
                  placeholder="Type customer name or ID"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingSearch && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => <li {...props}>{option.label}</li>}
              filterOptions={(x) => x}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => selectedCustomer?.id && fetchCustomerDues(selectedCustomer.id)}
              disabled={loadingDues || !selectedCustomer}
            >
              Show Dues
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <TableExportMenu rows={duesData} columns={exportColumns} fileName="Customer_Dues" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <ReportCompanyHeader
        title="Customer Dues"
        subtitle={selectedCustomer?.label ? `Customer: ${selectedCustomer.label}` : "Search and select a customer to view dues"}
        date={dayjs()}
      />

      {loadingDues ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error" align="center" sx={{ my: 4 }}>{error}</Typography>
      ) : duesData.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ my: 4 }}>
          Search and select a customer to view dues
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ border: "1px solid #ddd" }}>
            <Table sx={{ minWidth: 950, borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  {["S.No", "Loan ID", "Customer Name", "Guarantor Name", "Partner Name", "Start/End Date", "Amount", "Inst. Paid", "Inst. Dues", "Due Date", "Remarks"].map((head, i) => (
                    <TableCell
                      key={i}
                      align={["Amount", "Inst. Paid", "Inst. Dues"].includes(head) ? "right" : head.includes("Date") ? "center" : "left"}
                      sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {duesData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.loanId || index}>
                      <TableCell sx={{ border: "1px solid #ccc" }}>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>{row.loanId}</TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>{row.customerName}</TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>{row.guarentorName || "-"}</TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>{row.partnerName || "-"}</TableCell>
                      <TableCell align="center" sx={{ border: "1px solid #ccc" }}>
                        {dayjs(row.startDate).format("DD/MM/YY")} - {dayjs(row.endDate).format("DD/MM/YY")}
                      </TableCell>
                      <TableCell align="right" sx={{ border: "1px solid #ccc" }}>{Number(row.amount || 0).toLocaleString("en-IN")}</TableCell>
                      <TableCell align="right" sx={{ border: "1px solid #ccc" }}>{Number(row.totalInstallmentAmountPaid || 0).toLocaleString("en-IN")}</TableCell>
                      <TableCell align="right" sx={{ border: "1px solid #ccc", color: "#d32f2f", fontWeight: "bold" }}>
                        {Number(row.installmentAmountPending || 0).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell align="center" sx={{ border: "1px solid #ccc" }}>{dayjs(row.dueDate).format("DD/MM/YY")}</TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}>{row.remarks || "-"}</TableCell>
                    </TableRow>
                  ))}

                {/* Total Row */}
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell colSpan={6} align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>Total</TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>{totals.totalAmount.toLocaleString("en-IN")}</TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>{totals.totalPaid.toLocaleString("en-IN")}</TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ccc", color: "#d32f2f", fontWeight: "bold" }}>{totals.totalDue.toLocaleString("en-IN")}</TableCell>
                  <TableCell colSpan={2} sx={{ border: "1px solid #ccc" }} />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={duesData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </>
      )}
    </Box>
  );
};

export default Customer_Dues;
