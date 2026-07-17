import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import LoadingSpinner from "src/LoadingSpinner";
import { getSession } from "src/utils/session";
import { CircularProgress } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Autocomplete,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Paper,
  Stack,
  Toolbar,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  SearchRounded,
  TuneRounded,
  RestartAltRounded,
} from "@mui/icons-material";

import dayjs from "dayjs";
import { AppDatePicker, TableExportMenu, ProfilePhotoBox } from "src/components/ui";
import LoanDetailsDialog from "../LoanDetailsDialog";

const LOAN_TYPE = { DAILY_FINANCE: "DAILY_FINANCE" };
const FIXED_DURATION_DAYS = 100;
const BASE_PROCESSING_FEE = 200;
const BASE_INTEREST_RATE = 3;


const DailyFinance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLoanId, setCurrentLoanId] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [globalSearch, setGlobalSearch] = useState("");
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewAccountNo, setViewAccountNo] = useState(null);
  const [viewCustomerId, setViewCustomerId] = useState(null);

  const handleViewLoan = (row) => {
    setViewAccountNo(row.id);
    setViewCustomerId(row.customerId);
    setViewOpen(true);
  };


  const [filters, setFilters] = useState({
    id: "",
    customerName: "",
    amount: "",
    interestRate: "",
    installment: "",
    interest: "",
    processingFee: "",
    duration: "",
    startDate: "",
    endDate: "",
    g1Name: "",
    g2Name: "",
    g3Name: "",
    partnerId: ""
  });

  const filteredRows = rows.filter((row) =>
    Object.keys(filters).every((key) => {
      const value = row[key] ?? ""; // 🔥 handle null
      return value
        .toString()
        .toLowerCase()
        .includes(filters[key].toLowerCase());
    })
  );

  const searchedRows = filteredRows.filter((row) => {
    const searchText = globalSearch.trim().toLowerCase();
    if (!searchText) return true;
    return Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(searchText));
  });

  useEffect(() => {
    setPaginationModel((model) => ({ ...model, page: 0 }));
  }, [searchedRows.length]);

  const getHeader = (label, field) => (
    <Box sx={{ width: "100%", pt: 0.25 }}>
      <Box sx={{ fontWeight: 900, fontSize: 12, lineHeight: 1.2, mb: showColumnFilters ? 0.5 : 0 }}>
        {label}
      </Box>
      {showColumnFilters && (
        <TextField
          variant="outlined"
          size="small"
          value={filters[field]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              [field]: e.target.value,
            }))
          }
          placeholder="Filter"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 28,
              fontSize: "12px",
              bgcolor: "#fff",
            },
            "& .MuiOutlinedInput-input": {
              padding: "4px 8px",
            }
          }}
        />
      )}
    </Box>
  );



  const clearFilters = () => {
    setFilters({
      id: "",
      customerName: "",
      amount: "",
      interestRate: "",
      installment: "",
      interest: "",
      processingFee: "",
      duration: "",
      startDate: "",
      endDate: "",
      g1Name: "",
      g2Name: "",
      g3Name: "",
      partnerId: ""
    });
    setGlobalSearch("");
  };

  // ------------------------------
  // FORM STATE (with Interest default = 3%)
  // ------------------------------
  const [formData, setFormData] = useState({
    id: null,
    customerId: null,
    guarantor1: null,
    guarantor2: null,
    guarantor3: null,
    partnerId: null,
    startDate: dayjs(),
    endDate: dayjs().add(FIXED_DURATION_DAYS, "day"),
    amount: "",
    interestRate: BASE_INTEREST_RATE,
    interestAmountForAllDays: 0,
    installment: "",
    processingFee: BASE_PROCESSING_FEE,
    security: "",
  });

  const [options, setOptions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
  };

  // LOAD ALL LOANS
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/BusinessMember/findAll/${LOAN_TYPE.DAILY_FINANCE}`,
        { headers }
      );

      const loans = Array.isArray(res.data) ? res.data : [];

      const memberIds = new Set();
      loans.forEach((l) => {
        if (l.customerId) memberIds.add(l.customerId);
        [l.guarantor1, l.guarantor2, l.guarantor3].forEach(
          (g) => g && memberIds.add(g)
        );
      });

      const memberMap = {};

      if (memberIds.size > 0) {
        const mRes = await axios.get(`${API_BASE}/PersonalInfo/byIds`, {
          headers,
          params: { ids: Array.from(memberIds).join(",") },
        });

        mRes.data.forEach((m) => {
          memberMap[m.id] =
            `${m.id || ""} ${m.firstname || ""} ${m.lastname || ""}`.trim() ||
            `ID: ${m.id}`;
        });
      }

      //  DEFINE HERE (AFTER memberMap)
      const getMemberName = (id, label = "ID") => {
        if (!id) return "-";
        return memberMap[id] || `${label}: ${id}`;
      };

      //  USE HERE
      const enriched = loans.map((loan) => ({
        id: loan?.id ?? "N/A",
        customerId: loan?.customerId ?? null,

        customerName: getMemberName(loan?.customerId),

        g1Name: getMemberName(loan?.guarantor1, "G1"),
        g2Name: getMemberName(loan?.guarantor2, "G2"),
        g3Name: getMemberName(loan?.guarantor3, "G3"),

        partnerId: getMemberName(loan?.partnerId, "G4"),

        amount: Number(loan?.amount) || 0,
        duration: loan?.duration ?? 0,
        interest: Number(loan?.interest) || 0,
        interestRate: Number(loan?.interestRate) || 0,
        installment: Number(loan?.installment) || 0,
        processingFee: Number(loan?.processingFee) || 0,

        startDate: loan?.startDate ?? null,
        endDate: loan?.endDate ?? null,
      }));

      setRows(enriched);
    } catch (e) {
      console.error("Error fetching loans:", e);
      errorToast("Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // UPDATE END DATE ON START DATE CHANGE
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      endDate: formData.startDate.add(FIXED_DURATION_DAYS, "day"),
    }));
  }, [formData.startDate]);

  useEffect(() => {
    const amount = Number(formData.amount);
    const monthlyRate = Number(formData.interestRate);

    let installment = "";
    let interestAmountForAllDays = "";
    let processingFee = BASE_PROCESSING_FEE;

    //  DAILY INTEREST CALCULATION
    if (amount > 0 && monthlyRate > 0) {
      const monthlyInterestRate = monthlyRate / 100;
      const dailyInterestRate = monthlyInterestRate / 30;

      const totalInterest =
        amount * dailyInterestRate * FIXED_DURATION_DAYS;

      const dailyInstallment = Math.round(
        amount / FIXED_DURATION_DAYS
      );

      installment = dailyInstallment.toString();
      interestAmountForAllDays = totalInterest.toFixed(2);
    }

    //  PROCESSING FEE CALCULATION
    if (amount > 20000) {
      const extraFee =
        Math.ceil((amount - 20000) / 10000) * 100;

      processingFee = BASE_PROCESSING_FEE + extraFee;
    }

    //  SINGLE STATE UPDATE (CRITICAL)
    setFormData((prev) => ({
      ...prev,
      installment,
      interestAmountForAllDays,
      processingFee,
    }));
  }, [formData.amount, formData.interestRate]);


  // MEMBER AUTOCOMPLETE SEARCH
  const searchMembers = useCallback(
    async (query = "") => {
      const searchText = query.trim();
      if (searchText.length === 1) {
        setOptions([]);
        return;
      }
      setLoadingSearch(true);
      try {
        const res = await axios.get(`${API_BASE}/PersonalInfo/autocomplete`, {
          headers,
          params: { q: searchText },
        });

        const list = (res.data || []).map((item) => ({
          id: item.id,
          label: `${item.id || ""} ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"
            }`,
        }));

        setOptions(list);
      } catch (err) {
        errorToast("Search failed");
        setOptions([]);
      } finally {
        setLoadingSearch(false);
      }
    },
    [headers]
  );

  const resetForm = () => {
    setFormData({
      id: null,
      customerId: null,
      guarantor1: null,
      guarantor2: null,
      guarantor3: null,
      partnerId: null,
      startDate: dayjs(),
      endDate: dayjs().add(FIXED_DURATION_DAYS, "day"),
      amount: "",
      interestRate: BASE_INTEREST_RATE,
      interestAmountForAllDays: 0,
      installment: "",
      processingFee: BASE_PROCESSING_FEE,
      security: "",
    });
    setIsEditMode(false);
    setCurrentLoanId(null);
  };



  const handleNewButton = async () => {
    try {
      const res = await axios.get(`${API_BASE}/BusinessMember/createLoan/${LOAN_TYPE.DAILY_FINANCE}`, {
        headers,
      });

      const l = res.data;

      setFormData({
        id: l.id,
        customerId: null,
        guarantor1: null,
        guarantor2: null,
        guarantor3: null,
        partnerId: null,
        startDate: dayjs(),
        endDate: dayjs().add(FIXED_DURATION_DAYS, "day"),
        amount: "",
        interestRate: BASE_INTEREST_RATE,
        interestAmountForAllDays: 0,
        installment: "",
        processingFee: BASE_PROCESSING_FEE,
        security: "",
      });

      setCurrentLoanId(l.id);
      setIsEditMode(false);
      setOpen(true);

    } catch (err) {
      errorToast("Failed to load loan");
    }
  };

  // EDIT LOAN
  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/BusinessMember/findById/${id}`, {
        headers,
      });

      const l = res.data;

      // Fetch labels for customer & guarantors
      const idsToFetch = [
        l.customerId,
        l.guarantor1,
        l.guarantor2,
        l.guarantor3,
      ].filter(Boolean);

      const map = {};
      if (idsToFetch.length > 0) {
        const mRes = await axios.get(`${API_BASE}/PersonalInfo/byIds`, {
          headers,
          params: { ids: idsToFetch.join(",") },
        });

        mRes.data.forEach((m) => {
          map[m.id] = {
            id: m.id,
            label: `${m.id || ""} ${m.firstname || ""} ${m.lastname || ""} - ${m.mobile || ""
              }`,
          };
        });
      }

      setFormData({

        id: l.id,
        customerId: map[l.customerId] || null,
        guarantor1: map[l.guarantor1] || null,
        guarantor2: map[l.guarantor2] || null,
        guarantor3: map[l.guarantor3] || null,

        partnerId: map[l.partnerId] || null,

        startDate: l.startDate ? dayjs(l.startDate) : dayjs(),
        endDate: l.endDate ? dayjs(l.endDate) : dayjs().add(FIXED_DURATION_DAYS, "month"),

        amount: l.amount?.toString() || "",

        interestRate: l.interestRate?.toString() || BASE_INTEREST_RATE,

        interestAmount: l.interest?.toString() || "",

        installment: l.installment?.toString() || "",

        processingFee: l.processingFee?.toString() || BASE_PROCESSING_FEE,

        security: l.security || "",

      });

      setCurrentLoanId(id);
      setIsEditMode(true);
      setOpen(true);
    } catch (err) {
      console.log(err);
      errorToast("Failed to load loan");
    }
  };

  // SAVE / UPDATE LOAN
  const handleSave = async () => {
    if (!formData.customerId?.id) return errorToast("Customer is required");

    const payload = {
      id: formData.id,
      customerId: formData.customerId.id,
      guarantor1: formData.guarantor1?.id || "",
      guarantor2: formData.guarantor2?.id || "",
      guarantor3: formData.guarantor3?.id || "",
      partnerId: formData.partnerId?.id || "",
      startDate: formData.startDate.format("YYYY-MM-DD"),
      endDate: formData.endDate.format("YYYY-MM-DD"),
      amount: Number(formData.amount),
      interest: Number(formData.interestAmountForAllDays),
      interestRate: Number(formData.interestRate),
      processingFee: Number(formData.processingFee) || 0,
      installment: Number(formData.installment),
      security: formData.security,
      duration: FIXED_DURATION_DAYS,
    };

    try {
      setLoading(true); // 🔥 START LOADING

      try {
        const response = await axios.post(
          `${API_BASE}/BusinessMember/update/${LOAN_TYPE.DAILY_FINANCE}`,
          payload,
          { headers }
        );

        successToast(response.data || "Loan updated successfully!");

      } catch (error) {

        const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Something went wrong";

        errorToast(message);
      }

      setOpen(false);
      fetchData();
      resetForm();
    } catch (err) {
      errorToast(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false); // 🔥 STOP LOADING (VERY IMPORTANT)
    }
  };

  const handleClose = () => {
    if (loading) return; // prevent close during API
    setOpen(false);
    resetForm();
  };


  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleEdit(params.row.id)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },

    // 🔹 Basic Info
    {
      field: "id",
      width: 170,
      renderHeader: () => getHeader("Acc No", "id"),
      renderCell: (params) => (
        <Box
          component="span"
          onClick={() => handleViewLoan(params.row)}
          sx={{
            color: "primary.main",
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "customerName",
      width: 240,
      renderHeader: () => getHeader("Customer", "customerName"), // ✅ FIXED
    },

    // 🔹 Financials
    {
      field: "amount",
      width: 150,
      renderHeader: () => getHeader("Amount", "amount"),
    },
    {
      field: "interestRate",
      width: 130,
      renderHeader: () => getHeader("Interest %", "interestRate"),
    },
    {
      field: "interest",
      width: 170,
      renderHeader: () => getHeader("Total Interest", "interest"),
    },
    {
      field: "installment",
      width: 150,
      renderHeader: () => getHeader("Daily EMI", "installment"),
    },
    {
      field: "processingFee",
      width: 170,
      renderHeader: () => getHeader("Processing Fee", "processingFee"),
    },

    // 🔹 Duration
    {
      field: "duration",
      width: 160,
      renderHeader: () => getHeader("Duration (Days)", "duration"),
    },

    // 🔹 Dates
    {
      field: "startDate",
      width: 160,
      renderHeader: () => getHeader("Start Date", "startDate"),
    },
    {
      field: "endDate",
      width: 160,
      renderHeader: () => getHeader("End Date", "endDate"),
    },

    // 🔹 Guarantors & Partner
    {
      field: "g1Name",
      width: 200,
      renderHeader: () => getHeader("Guarantor 1", "g1Name"),
    },
    // {
    //   field: "g2Name",
    //   width: 200,
    //   renderHeader: () => getHeader("Guarantor 2", "g2Name"),
    // },
    // {
    //   field: "g3Name",
    //   width: 200,
    //   renderHeader: () => getHeader("Guarantor 3", "g3Name"),
    // },
    // {
    //   field: "partnerId",
    //   width: 180,
    //   renderHeader: () => getHeader("Partner", "partnerId"),
    // },
  ];

  const exportColumns = [
    "id",
    "customerName",
    "amount",
    "interestRate",
    "interest",
    "installment",
    "processingFee",
    "duration",
    "startDate",
    "endDate",
    "g1Name",
    "g2Name",
    "g3Name",
    "partnerId",
  ];

  return (
    <>
      {/* MAIN PAGE */}
      <Box >
        <Paper
          elevation={0}
          className="enterprise-card"
          sx={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "min(720px, calc(100vh - 200px))",
            minHeight: 500,
          }}
        >
          {/* Header toolbar */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
           
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ alignItems: "center" }}>
              <TextField
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                placeholder="Search account, customer, amount, date..."
                size="small"
                sx={{ width: { xs: "100%", sm: 360, md: 460 } }}
                InputProps={{
                  startAdornment: <SearchRounded fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
              <Button
                variant={showColumnFilters ? "contained" : "outlined"}
                startIcon={<TuneRounded />}
                onClick={() => setShowColumnFilters((value) => !value)}
              >
                Filter
              </Button>
              <Button variant="outlined" startIcon={<RestartAltRounded />} onClick={clearFilters}>
                Clear
              </Button>

                <Typography variant="body2" color="text.secondary">
                {searchedRows.length} of {rows.length} loans
              </Typography>
              
              <TableExportMenu rows={searchedRows} columns={exportColumns} fileName="Daily_Finance_Report" />
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleNewButton}>
                New Loan
              </Button>

             
            </Stack>
          </Box>

          {/* Table */}
          <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
            <DataGrid
              rows={searchedRows}
              columns={columns}
              loading={loading}
              getRowId={(r) => r.id}
              autosizeOnMount
              autosizeOptions={{ includeHeaders: true, includeOutliers: true, expand: true }}
              pageSizeOptions={[10, 25, 50, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pagination
              disableRowSelectionOnClick
              rowHeight={52}
              columnHeaderHeight={showColumnFilters ? 76 : 48}
              sx={{
                height: "100%",
                border: "none",
                bgcolor: "#fff",
                "& .MuiDataGrid-cell": { fontWeight: 700 },
                "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 900 },
                "& .MuiDataGrid-virtualScroller": { overflowAnchor: "none" },
              }}
            />
          </Box>
        </Paper>
      </Box>
      {/* Loading Spinner Overlay */ }
      {
        loading && rows.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <LoadingSpinner />
          </Box>
        )
      }
      {/* DIALOG MODAL */ }
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <AppBar position="relative" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
              {isEditMode ? "Edit Loan" : "New Daily Finance Loan"}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {`Account No: ${currentLoanId}`}
          </Typography>

          {/* BASIC INFO */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid
              sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "center" } }}
              size={{
                xs: 12,
                sm: 2
              }}>
              <ProfilePhotoBox
                personalInfoId={formData.customerId?.id}
                editable
                width={90}
                height={100}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
                sm: 4
              }}>
              <Autocomplete
                fullWidth
                sx={{ width: "100%", minWidth: { md: 320 } }}
                openOnFocus
                filterOptions={(x) => x}
                options={options}
                loading={loadingSearch}
                value={formData.customerId}
                onOpen={() => searchMembers("")}
                onInputChange={(e, v) => searchMembers(v)}
                onChange={(e, v) =>
                  setFormData((p) => ({ ...p, customerId: v }))
                }
                getOptionLabel={(o) => o?.label || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Customer *" />
                )}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <AppDatePicker
                label="Loan Date"
                value={formData.startDate}
                onChange={(value) => setFormData((p) => ({ ...p, startDate: dayjs(value) }))}
                size="medium"
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <AppDatePicker
                label="Maturity Date"
                value={formData.endDate}
                onChange={() => {}}
                disabled
                size="medium"
              />
            </Grid>
          </Grid>

          {/* LOAN DETAILS */}
          <Box sx={{ mt: 4 }}>
            <Chip
              label="LOAN DETAILS"
              sx={{ bgcolor: "#14b8a6", color: "white", fontWeight: 600 }}
            />
          </Box>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                fullWidth
                label="Loan Amount *"
                type="text"                    // Changed to text for better control
                value={formData.amount
                  ? Number(formData.amount).toLocaleString('en-IN')
                  : ""
                }
                onChange={(e) => {
                  // Remove commas and non-numeric characters
                  const rawValue = e.target.value.replace(/[^0-9]/g, '');
                  setFormData((p) => ({
                    ...p,
                    amount: rawValue
                  }));
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
                }}
                placeholder="0"
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                fullWidth
                label="Interest %"
                type="number"
                value={formData.interestRate}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    interestRate: e.target.value,
                  }))
                }
              />
            </Grid>


            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                fullWidth
                label="Total Interest Amount (100 Days)"
                type="text"                    // Changed from number to text for better formatting
                value={
                  formData.interestAmountForAllDays
                    ? `${Number(formData.interestAmountForAllDays).toLocaleString("en-IN")}`
                    : ""
                }
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>
                  )
                }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                fullWidth
                label="Daily Installment"
                value={
                  formData.installment
                    ? `₹${Number(formData.installment).toLocaleString("en-IN")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                fullWidth
                label="Duration"
                value="100 Days Fixed"
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField
                fullWidth
                label="Processing Fee"
                type="text"
                value={
                  formData.processingFee
                    ? Number(formData.processingFee).toLocaleString("en-IN")
                    : ""
                }
                onChange={(e) => {
                  // Remove commas before saving
                  const rawValue = e.target.value.replace(/,/g, "");

                  // Allow only numbers
                  if (!isNaN(rawValue)) {
                    setFormData((p) => ({
                      ...p,
                      processingFee: rawValue,
                    }));
                  }
                }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 12
              }}>
              <TextField
                fullWidth
                label="Security / Remarks"
                value={formData.security}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, security: e.target.value }))
                }
              />
            </Grid>
          </Grid>

          {/* Guarantors */}
          <Box sx={{ mt: 4 }}>
            <Chip
              label="GUARANTORS"
              sx={{ bgcolor: "#8b5cf6", color: "white", fontWeight: 600 }}
            />
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {["guarantor1", "guarantor2", "guarantor3"].map((field, idx) => (
              <Grid
                key={field}
                size={{
                  xs: 12,
                  md: 6
                }}>
                <Autocomplete
                  fullWidth
                  sx={{ width: "100%", minWidth: { md: 320 } }}
                  openOnFocus
                  filterOptions={(x) => x}
                  options={options}
                  value={formData[field]}
                  onOpen={() => searchMembers("")}
                  onInputChange={(e, v) => searchMembers(v)}
                  onChange={(e, v) =>
                    setFormData((p) => ({ ...p, [field]: v }))
                  }
                  getOptionLabel={(o) => o?.label || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={`Guarantor ${idx + 1}${idx === 0 ? " *" : ""}`}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>

          {/* PARTNER */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Autocomplete
                fullWidth
                sx={{ width: "100%", minWidth: { md: 320 } }}
                openOnFocus
                filterOptions={(x) => x}
                options={options}
                loading={loadingSearch}
                value={formData.partnerId}
                onOpen={() => searchMembers("")}
                onInputChange={(e, v) => searchMembers(v)}
                onChange={(e, v) =>
                  setFormData((p) => ({ ...p, partnerId: v }))
                }
                getOptionLabel={(o) => o?.label || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Partner / Agent *" fullWidth />
                )}
              />
            </Grid>
          </Grid>

        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading
              ? "Processing..."
              : isEditMode
                ? "Update Loan"
                : "Create Loan"}
          </Button>
        </DialogActions>
      </Dialog>
      <LoanDetailsDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        accountNo={viewAccountNo}
        personalInfoId={viewCustomerId}
        loadEndpoint="loadDFLoanInformation"
      />
    </>
  );
};

export default DailyFinance;
