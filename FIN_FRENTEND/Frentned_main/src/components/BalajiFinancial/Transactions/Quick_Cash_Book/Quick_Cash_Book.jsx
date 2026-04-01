import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { Save, Delete, Add } from "@mui/icons-material";
import { Autocomplete as MuiAutocomplete } from "@mui/material";

const QuickCashBook = () => {
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [rows, setRows] = useState([]);
  const [accountSuggestions, setAccountSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAccount, setFetchingAccount] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ text: "", severity: "info" });
  const [isAddingRow, setIsAddingRow] = useState(false);   // ← Protection flag

  const token = getSession("token");
  const inputRefs = useRef({});

  // Get list of already used account numbers
  const usedAccounts = useMemo(() => {
    return new Set(rows.map(r => r.accountNo?.trim()).filter(Boolean));
  }, [rows]);

  // Initialize with exactly ONE row
  useEffect(() => {
    if (rows.length === 0) {
      const initialRow = {
        id: Date.now(),
        accountNo: "",
        name: "",
        installment: 0,
        dueAmount: 0,
        lateFee: 0,
        paidAmount: 0,
        paidLateFee: 0,
      };
      setRows([initialRow]);

      setTimeout(() => inputRefs.current[initialRow.id]?.focus(), 200);
    }
  }, []);

  const addNewRowWithPrefix = (basePrefix = "") => {
    if (isAddingRow) return;   // Prevent multiple calls

    setIsAddingRow(true);

    const newRow = {
      id: Date.now(),
      accountNo: basePrefix,
      name: "",
      installment: 0,
      dueAmount: 0,
      lateFee: 0,
      paidAmount: 0,
      paidLateFee: 0,
    };

    setRows((prev) => [...prev, newRow]);

    setTimeout(() => {
      inputRefs.current[newRow.id]?.focus();
      setIsAddingRow(false);
    }, 150);
  };

  /* Fetch Suggestions */
  const fetchSuggestions = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 2) return setAccountSuggestions([]);
    try {
      const res = await axios.get(`${API_BASE}/BusinessMember/allLoanDetailsAutoComplete`, {
        params: { q: searchText },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        // Filter out already used accounts
        const filtered = res.data.filter(option => {
          const accNo = option.loanId || option.displayString || "";
          return !usedAccounts.has(accNo.trim());
        });
        setAccountSuggestions(filtered);
      }
    } catch { }
  }, [token, usedAccounts]);

  /* Fetch Record */
  const fetchAccountRecord = async (loanId, rowId) => {
    console.log("🔥 FETCH API CALLED for:", loanId);

    if (!loanId?.trim()) return;

    setFetchingAccount(loanId);

    try {
      const res = await axios.get(
        `${API_BASE}/retriveQuickCashBookRecord/${loanId.trim()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === rowId
              ? {
                ...row,
                accountNo: loanId.trim(),
                name: res.data.name || "Unknown",
                installment: Number(res.data.installment || 0),
                dueAmount: Number(res.data.dueAmount || 0),
                lateFee: Number(res.data.lateFee || 0),
                paidAmount: 0,
                paidLateFee: 0,
              }
              : row
          )
        );

       

        // Add only ONE row
        // setTimeout(() => addNewRowWithPrefix(basePrefix), 250);
      }
    } catch (err) {
      console.error(err);
      setAlertMsg({ text: `No record found for ${loanId}`, severity: "warning" });
    } finally {
      setFetchingAccount(null);
    }
  };

  const handleAccountCommit = (rowId, value) => {
    const finalValue = value?.trim();
    if (!finalValue) return;

    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, accountNo: finalValue } : row))
    );

    fetchAccountRecord(finalValue, rowId);
  };

  const updateRow = (rowId, field, newValue) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: newValue } : row))
    );
  };

  const deleteRow = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleSaveAll = async () => {
    const rowsToSave = rows.filter((r) => r.accountNo?.trim());
    if (!rowsToSave.length) return errorToast("No valid records to save");

    setLoading(true);
    try {
      const payload = {
        transactionDate: transactionDate.format("YYYY-MM-DD HH:mm:ss"),
        quickCashBookRows: rowsToSave.filter(
          (r) =>
            Number(r.paidAmount || 0) > 0 ||
            Number(r.paidLateFee || 0) > 0
        ).map((r) => ({
          accountNo: r.accountNo,
          name: r.name,
          installment: Number(r.installment || 0),
          dueAmount: Number(r.dueAmount || 0),
          lateFee: Number(r.lateFee || 0),
          paidAmount: Number(r.paidAmount || 0),
          paidLateFee: Number(r.paidLateFee || 0),
        })),
      };

      await axios.post(`${API_BASE}/saveQuickCashBookRecords`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      successToast("Saved successfully");
      setRows([]);
    } catch {
      errorToast("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const totalCollected = useMemo(() => rows.reduce((sum, r) => sum + Number(r.paidAmount || 0), 0), [rows]);
  const formatNumber = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    return Number(val).toLocaleString("en-IN");
  };

  const parseNumber = (val) => {
    return val.replace(/,/g, "");
  };
  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          Quick Business Cash Book
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField label="Date" type="date" value={transactionDate.format("YYYY-MM-DD")} onChange={(e) => setTransactionDate(dayjs(e.target.value))} size="small" sx={{ width: 150 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Time" type="time" value={transactionDate.format("HH:mm")} onChange={(e) => {
            const [h, m] = e.target.value.split(":");
            setTransactionDate((prev) => prev.hour(parseInt(h) || 0).minute(parseInt(m) || 0));
          }} size="small" sx={{ width: 120 }} InputLabelProps={{ shrink: true }} />
        </Stack>

        <Button variant="contained" color="success" startIcon={<Save />} onClick={handleSaveAll} disabled={loading}>
          {loading ? "Saving..." : "Save All"}
        </Button>
      </Paper>

      <Divider sx={{ my: 2 }} />
      {alertMsg.text && <Alert severity={alertMsg.severity}>{alertMsg.text}</Alert>}

      <Paper sx={{ mt: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Action</strong></TableCell>
                <TableCell><strong>Loan / A/c</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Installment</strong></TableCell>
                <TableCell><strong>Due</strong></TableCell>
                <TableCell><strong>Late Fee</strong></TableCell>
                <TableCell><strong>Paid Amount</strong></TableCell>
                <TableCell><strong>Paid Late Fee</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>

                  <TableCell align="center">
                    <IconButton color="error" onClick={() => deleteRow(row.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>


                  <TableCell sx={{ width: 220 }}>
                    <MuiAutocomplete
                      freeSolo
                      fullWidth
                      size="small"
                      options={accountSuggestions}
                      value={row.accountNo || null}
                      inputValue={row.accountNo || ""}
                      getOptionLabel={(option) => typeof option === "string" ? option : option.displayString || option.loanId || ""}
                      onInputChange={(e, newInput) => {
                        fetchSuggestions(newInput);
                        updateRow(row.id, "accountNo", newInput);
                      }}
                      onChange={(e, newValue) => {
                        let selected = typeof newValue === "string" ? newValue : newValue?.loanId || newValue || "";
                        handleAccountCommit(row.id, selected);
                      }}
                      onBlur={() => handleAccountCommit(row.id, row.accountNo)}
                      onKeyDown={(e) => e.key === "Enter" && handleAccountCommit(row.id, row.accountNo)}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Enter Account No" inputRef={(el) => (inputRefs.current[row.id] = el)} variant="outlined" size="small" />
                      )}
                    />
                  </TableCell>

                  <TableCell>{row.name || "-"}</TableCell>
                  <TableCell>{row.installment}</TableCell>
                  <TableCell>{row.dueAmount}</TableCell>
                  <TableCell>{row.lateFee}</TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      type="text"
                      value={formatNumber(row.paidAmount)}
                      onFocus={() => {
                        if (row.paidAmount === 0) {
                          updateRow(row.id, "paidAmount", "");
                        }
                      }}
                      onChange={(e) => {
                        let val = e.target.value;

                        // remove commas
                        val = parseNumber(val);

                        // allow only numbers
                        if (!/^\d*$/.test(val)) return;

                        updateRow(row.id, "paidAmount", val === "" ? "" : Number(val));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          updateRow(row.id, "paidAmount", 0);
                        }
                      }}


                      fullWidth
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      type="text"
                      value={formatNumber(row.paidLateFee)}
                      onFocus={() => {
                        if (row.paidLateFee === 0) {
                          updateRow(row.id, "paidLateFee", "");
                        }
                      }}
                      onChange={(e) => {
                        let val = e.target.value;

                        val = parseNumber(val);

                        if (!/^\d*$/.test(val)) return;

                        updateRow(row.id, "paidLateFee", val === "" ? "" : Number(val));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          updateRow(row.id, "paidLateFee", 0);
                        }
                      }}

                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === "Tab") && !e.shiftKey) {
                          if (Number(row.paidAmount || 0) > 0) {
                            e.preventDefault(); // prevents weird double triggers
                             const basePrefix = row.accountNo.trim().replace(/\d+$/, "");
                            addNewRowWithPrefix(basePrefix)
                          }
                        }
                      }}
                      fullWidth
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Button variant="outlined" startIcon={<Add />} onClick={() => addNewRowWithPrefix("")} sx={{ mt: 2 }}>
        Add New Row
      </Button>

      <Typography mt={2} fontWeight="bold" fontSize="1.1rem">
        Total Collected: ₹{totalCollected.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default QuickCashBook;