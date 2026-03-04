import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const Cashbook = () => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const [transactionDate, setTransactionDate] = useState(getCurrentDateTime());
  const [masterCode, setMasterCode] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null); // ← New: stores full person object
  const [particulars, setParticulars] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");

  const [masterCodes, setMasterCodes] = useState([]);
  const [codes, setCodes] = useState([]);
  const [personOptions, setPersonOptions] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);

  const [loadingMaster, setLoadingMaster] = useState(false);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [loadingPersons, setLoadingPersons] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getAuthHeader = () => ({
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  });

  // Load Master Codes
  useEffect(() => {
    const fetchMasterCodes = async () => {
      setLoadingMaster(true);
      try {
        const res = await axios.get(
          `${API_BASE}/account-master-usage/findAllMasterCodes`,
          {
            headers: getAuthHeader(),
          }
        );
        const data = res.data || [];
        setMasterCodes(data);
        if (data.length > 0) setMasterCode(data[0]);
      } catch (err) {
        errorToast("Failed to load account groups");
      } finally {
        setLoadingMaster(false);
      }
    };
    fetchMasterCodes();
  }, []);

  // Load Account Codes
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
          `${API_BASE}/account-master-usage/findAllCodesByMasterCode/${encodeURIComponent(
            masterCode
          )}`,
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
  }, [masterCode]);

  // Load Transaction Types
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
  }, [masterCode, code]);

  // Person Autocomplete Search
  useEffect(() => {
    if (!masterCode || !code || name.trim().length < 2) {
      setPersonOptions([]);
      return;
    }

    const fetchPersons = async () => {
      setLoadingPersons(true);
      try {
        const res = await axios.post(
          `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCodeAndMasterCode?q=${encodeURIComponent(
            name.trim()
          )}`,
          { masterCode, code },
          { headers: getAuthHeader() }
        );

        const options = res.data.map((p) => ({
          label: `${p.firstname || ""} ${p.lastname || ""}`.trim(),
          value: `${p.firstname || ""} ${p.lastname || ""}`.trim(),
          data: p, // ← store full person object (including id)
        }));

        setPersonOptions(options);
      } catch (err) {
        console.error("Person search failed:", err);
      } finally {
        setLoadingPersons(false);
      }
    };

    fetchPersons();
  }, [name, masterCode, code]);

  // Save Transaction
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!masterCode || !code)
      return errorToast("Please select Account Group and Code");
    if (!name.trim()) return errorToast("Please enter Name");
    if (!transactionType) return errorToast("Please select Transaction Type");
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return errorToast("Please enter valid amount");

    setSubmitting(true);

    const payload = {
      transactionDate: transactionDate, // already in "yyyy-MM-dd HH:mm:ss"
      accountCode: code,
      customerId: selectedPerson?.id || name.trim(), // ← Use id if selected, fallback to name
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
  };

  return (
    <Box
      
    >
     
    
        <Typography variant="h5" color="primary" gutterBottom sx={{ mb: 4 }}>
          New Transaction / Payment
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Date & Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Date & Time"
                placeholder="yyyy-MM-dd HH:mm:ss"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                variant="outlined"
                disabled={submitting}
                helperText="Format: 2026-01-10 14:30:00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon color="action" />
                    </InputAdornment>
                  ),
                }}
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
                  sx={{width:180,}}
                  endAdornment={
                    loadingMaster ? (
                      <CircularProgress size={20} sx={{ mr: 2 }} />
                    ) : null
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
                  label="Account Code"      sx={{width:180,}}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loadingCodes || !masterCode || submitting}
                  endAdornment={
                    loadingCodes ? (
                      <CircularProgress size={20} sx={{ mr: 2 }} />
                    ) : null
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

            {/* Name Autocomplete - now saves id */}
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                freeSolo
                disableClearable
                value={name}      sx={{width:180,}}
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
                  // If user types manually, clear selected person
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
                 sx={{width:180,}}
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
                disabled={
                  loadingTypes || submitting || transactionTypes.length === 0
                }
              >
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Transaction Type{" "}
                  {loadingTypes && (
                    <CircularProgress size={16} sx={{ ml: 2 }} />
                  )}
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
                            color={
                              type.toLowerCase().includes("credit")
                                ? "success"
                                : "error"
                            }
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
                      <Typography
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
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
                  sx={{ 
                    px: 6, 
                    py: 1.5, 
                    minWidth: 250,
                    fontWeight: 600,
                  }}
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
