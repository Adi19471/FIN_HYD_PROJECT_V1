import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  Divider,
  CircularProgress,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Payments as PaymentsIcon,
} from "@mui/icons-material";

import dayjs from 'dayjs';

import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";


// Optimized with memo and useCallback
const Cashbook = () => {
  const getCurrentDateTime = useCallback(() => dayjs().format("YYYY-MM-DD HH:mm:ss"), []);

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
          label: `${p.firstname || ""} ${p.lastname || ""}`.trim(),
          value: `${p.firstname || ""} ${p.lastname || ""}`.trim(),
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
      setTransactionDate(getCurrentDateTime());
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
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 4 }}>
        New Transaction / Payment
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Date & Time - using dayjs with native date/time inputs */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              value={dayjs(transactionDate).format("YYYY-MM-DD")}
              onChange={(e) => setTransactionDate(dayjs(e.target.value).format("YYYY-MM-DD HH:mm:ss"))}
              disabled={submitting}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time"
              type="time"
              value={dayjs(transactionDate).format("HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":");
                setTransactionDate(dayjs().hour(parseInt(hours) || 0).minute(parseInt(minutes) || 0).format("YYYY-MM-DD HH:mm:ss"));
              }}
              disabled={submitting}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Account Group */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel>Account Group</InputLabel>
              <Select
                value={masterCode}
                label="Account Group"
                onChange={(e) => setMasterCode(e.target.value)}
                disabled={loadingMaster || submitting}
                sx={{ width: 180 }}
                endAdornment={
                  loadingMaster ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null
                }
              >
                {masterCodes.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Account Code */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required variant="outlined">
              <InputLabel>Account Code</InputLabel>
              <Select
                value={code}
                label="Account Code"
                onChange={(e) => setCode(e.target.value)}
                disabled={loadingCodes || !masterCode || submitting}
                sx={{ width: 180 }}
                endAdornment={
                  loadingCodes ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null
                }
              >
                {codes.map((accCode) => (
                  <MenuItem key={accCode} value={accCode}>
                    {accCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Name Autocomplete */}
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              freeSolo
              disableClearable
              value={name}
              sx={{ width: 180 }}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setName(newValue);
                  setSelectedPerson(null);
                } else {
                  setName(newValue?.label || "");
                  setSelectedPerson(newValue?.data || null);
                }
              }}
              inputValue={name}
              onInputChange={(event, newInputValue) => {
                setName(newInputValue);
                if (newInputValue !== name) setSelectedPerson(null);
              }}
              options={personOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.label || ""
              }
              loading={loadingPersons}
              disabled={submitting || !masterCode || !code}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Name (Payer/Receiver)"
                  placeholder="Search or type manually..."
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingPersons ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Particulars */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              sx={{ width: 180 }}
              label="Particulars / Description"
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
              variant="outlined"
              disabled={submitting}
            />
          </Grid>

          {/* Transaction Type */}
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              disabled={loadingTypes || submitting || transactionTypes.length === 0}
            >
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Transaction Type{" "}
                {loadingTypes && <CircularProgress size={16} sx={{ ml: 2 }} />}
              </FormLabel>
              {transactionTypes.length === 0 && !loadingTypes ? (
                <Typography variant="body2" color="text.secondary">
                  Select Account Group & Code to see available types
                </Typography>
              ) : (
                <RadioGroup
                  row
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  {transactionTypes.map((type) => (
                    <FormControlLabel
                      key={type}
                      value={type}
                      control={
                        <Radio
                          color={type.toLowerCase().includes("credit") ? "success" : "error"}
                        />
                      }
                      label={type}
                    />
                  ))}
                </RadioGroup>
              )}
            </FormControl>
          </Grid>

          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              variant="outlined"
              disabled={submitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                      ₹
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <PaymentsIcon />
                  )
                }
                sx={{ px: 6, py: 1.5, minWidth: 250, fontWeight: 600 }}
              >
                {submitting ? "Saving..." : "Record Transaction"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Cashbook;