import React, { useState, useEffect, useCallback } from "react";
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
  Stack,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Payments as PaymentsIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import { AppDatePicker, DROPDOWN_MENU_PROPS } from "src/components/ui";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: 0,
    backgroundColor: "#ffffff",
  },
  "& .MuiInputLabel-root": {
    fontWeight: 700,
  },
};

const Cashbook = () => {
  const theme = useTheme();
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

  const getAuthHeader = useCallback(
    () => ({
      Authorization: `Bearer ${getSession("token") || ""}`,
      "Content-Type": "application/json",
    }),
    []
  );

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

  const loadPersonOptions = useCallback(
    async (query = "") => {
      if (!masterCode || !code) {
        setPersonOptions([]);
        return;
      }

      const searchText = query.trim();
      if (searchText.length === 1) {
        setPersonOptions([]);
        return;
      }

      setLoadingPersons(true);
      try {
        const res = await axios.post(
          `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCodeAndMasterCode?q=${encodeURIComponent(searchText)}`,
          { masterCode, code },
          { headers: getAuthHeader() }
        );
        const options = (res.data || []).map((p) => ({
          label: `${p.id || ""} ${p.firstname || ""} ${p.lastname || ""}`.trim(),
          value: `${p.id || ""} ${p.firstname || ""} ${p.lastname || ""}`.trim(),
          data: p,
        }));
        setPersonOptions(options);
      } catch (err) {
        console.error("Person search failed:", err);
        setPersonOptions([]);
      } finally {
        setLoadingPersons(false);
      }
    },
    [masterCode, code, getAuthHeader]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => loadPersonOptions(name), 300);
    return () => clearTimeout(timeoutId);
  }, [name, loadPersonOptions]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!masterCode || !code) return errorToast("Please select Account Group and Code");
      if (!name.trim()) return errorToast("Please enter Name");
      if (!transactionType) return errorToast("Please select Transaction Type");
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        return errorToast("Please enter valid amount");
      }

      setSubmitting(true);

      const payload = {
        transactionDate,
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
    },
    [masterCode, code, name, transactionType, amount, transactionDate, particulars, selectedPerson, getAuthHeader]
  );

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",

        display: "flex",
    
      }}
    >
      <Paper
        className="enterprise-card"
        elevation={0}
        sx={{
          width: "100%",
       
          overflow: "hidden",
          borderRadius: 0,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
          boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.25,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: alpha(theme.palette.primary.main, 0.045),
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "primary.main",
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                }}
              >
                <PaymentsIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "text.white", lineHeight: 1.15 }}>
                  New Transaction / Payment
                </Typography>
            
              </Box>
            </Stack>
            <Box
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 0,
                fontSize: 13,
                fontWeight: 800,
                color: "primary.dark",
                backgroundColor: "#ffffff",
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.2),
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            >
              {dayjs(transactionDate).format("DD-MMM-YYYY")}
            </Box>
          </Stack>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} >
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <AppDatePicker
                label="Transaction Date"
                value={transactionDate}
                onChange={setTransactionDate}
                sx={{ width: "100%", ...fieldSx }}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <FormControl fullWidth sx={fieldSx} disabled={loadingMaster}>
                <InputLabel>Account Group</InputLabel>
                <Select
                  value={masterCode}
                  label="Account Group"
                  MenuProps={DROPDOWN_MENU_PROPS}
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
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <FormControl fullWidth sx={fieldSx} disabled={!masterCode || loadingCodes}>
                <InputLabel>Account Code</InputLabel>
                <Select
                  value={code}
                  label="Account Code"
                  MenuProps={DROPDOWN_MENU_PROPS}
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
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Autocomplete
                fullWidth
                openOnFocus
                filterOptions={(x) => x}
                freeSolo
                value={name}
                inputValue={name}
                onInputChange={(e, val) => setName(val)}
                onOpen={() => loadPersonOptions(name)}
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
                loading={loadingPersons}
                slotProps={{
                  paper: { sx: { maxHeight: 320 } },
                  listbox: { sx: { maxHeight: 300 } },
                }}
                getOptionLabel={(o) => (typeof o === "string" ? o : o.label || "")}
                forcePopupIcon
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Name"
                    sx={fieldSx}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingPersons && <CircularProgress size={18} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <TextField
                fullWidth
                label="Particulars"
                value={particulars}
                onChange={(e) => setParticulars(e.target.value)}
                sx={fieldSx}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <TextField
                fullWidth
                label="Amount"
                value={amount ? Number(amount).toLocaleString("en-IN") : ""}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                sx={fieldSx}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                }}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <FormControl fullWidth sx={fieldSx} disabled={!code || loadingTypes}>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={transactionType}
                  label="Transaction Type"
                  MenuProps={DROPDOWN_MENU_PROPS}
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
            <Grid
              sx={{ display: "flex", alignItems: "stretch" }}
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting}
                sx={{
                  minHeight: 48,
                  fontWeight: 900,
                  boxShadow: "none",
                }}
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <PaymentsIcon />}
              >
                {submitting ? "Recording..." : "Record Transaction"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Cashbook;
