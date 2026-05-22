import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import {
  Payments as PaymentsIcon,
} from "@mui/icons-material";

import dayjs from 'dayjs';

import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import { AppDatePicker } from "src/components/ui";

const compactMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 320,
      minWidth: 260,
    },
  },
};

// Optimized with memo and useCallback
const Cashbook = () => {
  const getCurrentDateTime = useCallback(() => dayjs().format("YYYY-MM-DD"), []);

  const [transactionDate, setTransactionDate] = useState(getCurrentDateTime);
  const [masterCode, setMasterCode] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [particulars, setParticulars] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");

  const [masterCodes, setMasterCodes] = useState([]);
  const [codes, setCodes] = useState([]);
  const [personOptions, setPersonOptions] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);

  const [loadingMaster, setLoadingMaster] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [loadingPersons, setLoadingPersons] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getAuthHeader = useCallback(() => ({
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  }), []);

  // Optimized: Load initial data in parallel
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingMaster(true);
      try {
        const res = await axios.get(
          `${API_BASE}/account-master-usage/findAllMasterCodes`,
          { headers: getAuthHeader() }
        );
        const data = res.data || [];
        setMasterCodes(data);
        if (data.length > 0) setMasterCode(data[0]);
      } catch (err) {
        errorToast("Failed to load account groups");
      } finally {
        setLoadingMaster(false);
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, [getAuthHeader]);

  // Optimized: Load codes and transaction types in parallel when masterCode changes
  useEffect(() => {
    if (!masterCode) {
      setCodes([]);
      setCode("");
      setPersonOptions([]);
      setTransactionTypes([]);
      setTransactionType("");
      return;
    }

    const fetchCodes = async () => {
      setLoadingCodes(true);
      try {
        const res = await axios.get(
          `${API_BASE}/account-master-usage/findAllCodesByMasterCode/${encodeURIComponent(masterCode)}`,
          { headers: getAuthHeader() }
        );
        const data = res.data || [];
        setCodes(data);
        if (data.length === 1) setCode(data[0]);
      } catch (err) {
        errorToast("Failed to load account codes");
      } finally {
        setLoadingCodes(false);
      }
    };

    fetchCodes();
  }, [masterCode, getAuthHeader]);

  // Optimized: Load transaction types when code changes
  useEffect(() => {
    if (!masterCode || !code) {
      setTransactionTypes([]);
      setTransactionType("");
      return;
    }
    const fetchTransactionTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await axios.post(
          `${API_BASE}/account-master-usage/findTransactionTypeBy`,
          { masterCode, code },
          { headers: getAuthHeader() }
        );
        const types = res.data || [];
        setTransactionTypes(types);
        if (types.length > 0) setTransactionType(types[0]);
      } catch (err) {
        errorToast("Failed to load transaction types");
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTransactionTypes();
  }, [masterCode, code, getAuthHeader]);

  // Person Autocomplete Search - Optimized with debounce
  useEffect(() => {
    if (!masterCode || !code || name.trim().length < 2) {
      setPersonOptions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoadingPersons(true);
      try {
        const res = await axios.post(
          `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCodeAndMasterCode?q=${encodeURIComponent(name.trim())}`,
          { masterCode, code },
          { headers: getAuthHeader() }
        );
        const options = res.data.map((p) => ({
          label: `${p.id || ""} ${p.firstname || ""} ${p.lastname || ""}`.trim(),
          value: `${p.id || ""} ${p.firstname || ""} ${p.lastname || ""}`.trim(),
          data: p,
        }));
        setPersonOptions(options);
      } catch (err) {
        console.error("Person search failed:", err);
      } finally {
        setLoadingPersons(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [name, masterCode, code, getAuthHeader]);

  // Optimized submit handler with useCallback
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!masterCode || !code) return errorToast("Please select Account Group and Code");
    if (!name.trim()) return errorToast("Please enter Name");
    if (!transactionType) return errorToast("Please select Transaction Type");
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return errorToast("Please enter valid amount");

    setSubmitting(true);

    const payload = {
      transactionDate: transactionDate,
      accountMasterCode: masterCode,
      accountCode: code,
      customerId: selectedPerson?.id || name.trim(),
      particulars: particulars.trim() || "Other Payment",
      transaction: transactionType,
      amount: Number(amount),
    };

    try {
      await axios.post(`${API_BASE}/saveOtherPayments`, payload, {
        headers: getAuthHeader(),
      });
      successToast("Transaction recorded successfully!");

      // Reset form
      setTransactionDate(transactionDate);
      setMasterCode("");
      setCode("");
      setName("");
      setSelectedPerson(null);
      setPersonOptions([]);
      setTransactionTypes([]);
      setTransactionType("");
      setParticulars("");
      setAmount("");
    } catch (err) {
      console.error("Save failed:", err);
      errorToast(err.response?.data?.message || "Failed to save transaction");
    } finally {
      setSubmitting(false);
    }
  }, [masterCode, code, name, transactionType, amount, transactionDate, particulars, selectedPerson, getAuthHeader, getCurrentDateTime]);

  // Show initial loading spinner
  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 3, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 1200,
          borderRadius: 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 4, fontWeight: 600 }}
          color="primary"
        >
          New Transaction / Payment
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} justifyContent="center">

            {/* Date */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <AppDatePicker
                label="Transaction Date"
                value={transactionDate}
                onChange={setTransactionDate}
                sx={{ width: 300 }}
              />
            </Grid>

            {/* Account Group + Code */}
            <Grid item>
              <FormControl sx={{ width: 220 }}>
                <InputLabel>Account Group</InputLabel>
                <Select
                  value={masterCode}
                  label="Account Group"
                  MenuProps={compactMenuProps}
                  onChange={(e) => setMasterCode(e.target.value)}
                >
                  {masterCodes.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl sx={{ width: 220 }}>
                <InputLabel>Account Code</InputLabel>
                <Select
                  value={code}
                  label="Account Code"
                  MenuProps={compactMenuProps}
                  onChange={(e) => setCode(e.target.value)}
                >
                  {codes.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Name + Particulars */}
            <Grid item>
              <Autocomplete
                sx={{ width: 280 }}
                freeSolo
                value={name}
                inputValue={name}
                onInputChange={(e, val) => setName(val)}
                onChange={(e, val) => {
                  if (typeof val === "string") {
                    setName(val);
                    setSelectedPerson(null);
                  } else {
                    setName(val?.label || "");
                    setSelectedPerson(val?.data || null);
                  }
                }}
                options={personOptions}
                slotProps={{
                  paper: { sx: { maxHeight: 320 } },
                  listbox: { sx: { maxHeight: 300 } },
                }}
                getOptionLabel={(o) =>
                  typeof o === "string" ? o : o.label || ""
                }
                forcePopupIcon={true} 
                renderInput={(params) => (
                  <TextField {...params} label="Name" />
                )}
              />
            </Grid>

            <Grid item>
              <TextField
                label="Particulars"
                value={particulars}
                onChange={(e) => setParticulars(e.target.value)}
                sx={{ width: 280 }}
              />
            </Grid>

            {/* Amount + Transaction Type (LAST ROW) */}
            <Grid item>
              <TextField
                label="Amount"
                value={
                  amount ? Number(amount).toLocaleString("en-IN") : ""
                }
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^0-9]/g, ""))
                }
                sx={{ width: 180 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item>
              <FormControl sx={{ width: 220 }}>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={transactionType}
                  label="Transaction Type"
                  MenuProps={compactMenuProps}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  {transactionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
            
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{
                    px: 6,
                    py: 1.3,
                    borderRadius: 0,
                    fontWeight: 600,
                  }}
                  startIcon={<PaymentsIcon />}
                >
                  Record Transaction
                </Button>
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Cashbook;
