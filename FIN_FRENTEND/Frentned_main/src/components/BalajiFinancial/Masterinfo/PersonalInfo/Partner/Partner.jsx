<<<<<<< Updated upstream
// src/components/BalajiFinancial/PersonalInfo/Partner/Partner.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Paper,
  Typography,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Tooltip,
  Autocomplete,
  IconButton,
  Fade,
  Skeleton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { getSession } from "src/utils/session";
import { FiUserPlus, FiSearch, FiCopy, FiSave, FiEdit, FiXCircle, FiEye, FiUser, FiPhone, FiMapPin, FiShield, FiUsers } from "react-icons/fi";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import LoadingSpinner from "src/LoadingSpinner";

/* ─── Constants ─────────────────────────────────────────────── */
const TYPE_LABELS = {
  CUSTOMER: "Customer",
  PARTNER: "Partner",
  VENDOR: "Vendor",
};

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const ID_PROOF_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Driving License", "Passport"];

const EMPTY_FORM = (personType) => ({
  id: "",
  firstname: "",
  lastname: "",
  fathername: "",
  spouse: "",
  gender: "Male",
  age: "",
  occupation: "",
  address: "",
  address2: "",
  mobile: "",
  mobile2: "",
  phone: "",
  reference: "",
  idproof: "",
  idprooftype: "",
  category: personType,
  personalInfoManagerId: "",
});

/* ─── Styles ─────────────────────────────────────────────────── */
const STYLES = {
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 2,
    pb: 1,
    borderBottom: "2px solid",
    borderColor: "primary.main",
  },
  fieldLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "text.secondary",
    mb: 0.5,
  },
  viewValue: {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "text.primary",
  },
  chip: (color) => ({
    fontWeight: 600,
    fontSize: "0.72rem",
    height: 24,
    bgcolor: `${color}.50`,
    color: `${color}.800`,
    border: `1px solid`,
    borderColor: `${color}.200`,
  }),
};

/* ─── Sub-component: SectionTitle ───────────────────────────── */
const SectionTitle = ({ icon: Icon, label }) => (
  <Box sx={STYLES.sectionHeader}>
    <Icon size={16} style={{ color: "var(--mui-palette-primary-main, #1976d2)" }} />
    <Typography variant="subtitle2" fontWeight={700} color="primary">
      {label}
    </Typography>
  </Box>
);

/* ─── Sub-component: ViewField ──────────────────────────────── */
const ViewField = ({ label, value }) => (
  <Box>
    <Typography sx={STYLES.fieldLabel}>{label}</Typography>
    <Typography sx={STYLES.viewValue}>{value || "—"}</Typography>
  </Box>
);

/* ─── Pure helpers (outside component — never recreated) ─────── */
const getInitials = (row) => {
  const f = (row.firstname || "")[0] || "";
  const l = (row.lastname || "")[0] || "";
  return (f + l).toUpperCase() || "?";
};

const AVATAR_COLORS = ["#e53935", "#8e24aa", "#1e88e5", "#00897b", "#f4511e", "#6d4c41"];
const avatarColor = (id) => {
  let hash = 0;
  for (let i = 0; i < (id || "x").length; i++) hash = (id || "x").charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

/* ─── Main Component ─────────────────────────────────────────── */
const Partner = ({ personType = "CUSTOMER" }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM(personType));
  const [errors, setErrors] = useState({});

  // Manager autocomplete state
  const [managerOptions, setManagerOptions] = useState([]);
  const [managerInputValue, setManagerInputValue] = useState("");
  const [managerValue, setManagerValue] = useState(null);
  const [loadingManager, setLoadingManager] = useState(false);
  const managerDebounceRef = useRef(null);

  /* ── Auth headers (stable reference) ── */
  const headers = useMemo(() => {
    const token = getSession("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  /* ── Fetch all records ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/findAll`, { headers });
      const data = (Array.isArray(res.data) ? res.data : []).filter(
        (p) => p.category === personType
      );
      setRows(data.map((item, i) => ({
        ...item,
        id: item.id || `tmp-${i}-${Date.now()}`,
      })));
    } catch (err) {
      console.error(err);
      errorToast("Failed to load data");
    }
    setLoading(false);
  }, [headers, personType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Filter rows on search ── */
  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredRows(
      rows.filter(
        (r) =>
          (r.firstname || "").toLowerCase().includes(q) ||
          (r.lastname || "").toLowerCase().includes(q) ||
          (r.mobile || "").includes(q) ||
          (r.id || "").toLowerCase().includes(q)
      )
    );
  }, [rows, search]);

  /* ── Manager search (debounced, excludes self) ── */
  const searchManagers = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setManagerOptions([]);
      return;
    }
    setLoadingManager(true);
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`,
        { headers, params: { q: query.trim() } }
      );

      const currentId = form.id; // exclude self from manager options

      const list = (res.data || [])
        .filter((item) => item.id !== currentId) // ← self-exclusion
        .map((item) => ({
          id: item.id,
          label: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
          sub: `${item.id} · ${item.mobile || "No Mobile"}`,
        }));

      setManagerOptions(list);
    } catch (err) {
      console.error(err);
      errorToast("Manager search failed");
      setManagerOptions([]);
    } finally {
      setLoadingManager(false);
    }
  }, [headers, form.id]);

  const handleManagerInputChange = (_, value) => {
    setManagerInputValue(value);
    clearTimeout(managerDebounceRef.current);
    managerDebounceRef.current = setTimeout(() => searchManagers(value), 350);
  };

  const handleManagerChange = (_, option) => {
    setManagerValue(option);
    setForm((prev) => ({ ...prev, personalInfoManagerId: option?.id || "" }));
  };

  /* ── Open Add form ── */
  const openAddForm = async () => {
    setLoading(true);
    try {
      await axios.get(
        `${API_BASE}/PersonalInfo/createNewPersonalInfoTemplate/${personType}`,
        { headers }
      );
    } catch (err) {
      console.error(err);
      errorToast("Failed to initialize template");
      setLoading(false);
      return;
    }
    setForm(EMPTY_FORM(personType));
    setManagerValue(null);
    setManagerInputValue("");
    setManagerOptions([]);
    setErrors({});
    setIsEdit(false);
    setModalOpen(true);
    setLoading(false);
  };

  /* ── Input change handler ── */
  const handleChange = (field, value) => {
    if (["mobile", "mobile2", "phone"].includes(field)) {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    if (field === "age") {
      value = value === "" ? "" : String(Math.max(0, parseInt(value) || 0));
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /* ── Validation ── */
  const validateForm = () => {
    const errs = {};
    if (!form.firstname?.trim()) errs.firstname = "First name is required";
    if (form.mobile && form.mobile.length !== 10) errs.mobile = "Enter a valid 10-digit mobile number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        category: personType,
        age: form.age ? parseInt(form.age) : null,
        personalInfoManagerId: form.personalInfoManagerId || null,
      };
      await axios.post(
        `${API_BASE}/PersonalInfo/updatePersonalInfo/${personType}`,
        payload,
        { headers }
      );
      successToast(isEdit ? "Record updated!" : "Record added!");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || "Save failed");
    }
    setSaving(false);
  };

  /* ── Open Edit form ── */
  const openEditForm = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/findPersonalInfoById/${id}`,
        { headers }
      );
      setForm({ ...res.data });

      // Rehydrate manager dropdown if manager was previously set
      if (res.data.personalInfoManagerId) {
        try {
          const mRes = await axios.get(
            `${API_BASE}/PersonalInfo/findPersonalInfoById/${res.data.personalInfoManagerId}`,
            { headers }
          );
          const mgr = mRes.data;
          setManagerValue({
            id: mgr.id,
            label: `${mgr.firstname || ""} ${mgr.lastname || ""}`.trim(),
            sub: `${mgr.id} · ${mgr.mobile || "No Mobile"}`,
          });
          setManagerInputValue(`${mgr.firstname || ""} ${mgr.lastname || ""}`.trim());
        } catch {
          setManagerValue(null);
          setManagerInputValue("");
        }
      } else {
        setManagerValue(null);
        setManagerInputValue("");
      }

      setManagerOptions([]);
      setErrors({});
      setIsEdit(true);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      errorToast("Failed to load record");
    }
    setLoading(false);
  }, [headers]);

  /* ── Copy ID ── */
  const copyId = () => {
    navigator.clipboard.writeText(form.id || "");
    successToast("ID copied to clipboard");
  };

  /* ── Open View modal ── */
  const openViewModal = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/findPersonalInfoById/${id}`,
        { headers }
      );
      setSelectedRecord(res.data);
      setViewModalOpen(true);
    } catch (err) {
      console.error(err);
      errorToast("Failed to load record");
    }
    setLoading(false);
  }, [headers]);

  /* ── Columns ── */
  const columns = useMemo(() => [
    {
      field: "avatar",
      headerName: "",
      width: 56,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          sx={{
            width: 34, height: 34,
            bgcolor: avatarColor(params.row.id),
            fontSize: "0.75rem", fontWeight: 700,
          }}
        >
          {getInitials(params.row)}
        </Avatar>
      ),
    },
    { field: "id", headerName: "ID", width: 160 },
    {
      field: "fullname",
      headerName: "Name",
      width: 180,
      renderCell: (p) => (
        <Typography fontWeight={500}>
          {[p.row.firstname, p.row.lastname].filter(Boolean).join(" ")}
        </Typography>
      ),
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 140,
      renderCell: (p) => p.row.mobile
        ? <Chip label={p.row.mobile} size="small" variant="outlined" icon={<FiPhone size={12} />} />
        : <Typography color="text.disabled" fontSize="0.8rem">—</Typography>,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (p) => p.row.gender
        ? <Chip
            label={p.row.gender}
            size="small"
            sx={STYLES.chip(p.row.gender === "Male" ? "blue" : p.row.gender === "Female" ? "pink" : "purple")}
          />
        : "—",
    },
    {
      field: "personalInfoManagerId",
      headerName: "Manager ID",
      width: 160,
      renderCell: (p) => p.row.personalInfoManagerId
        ? <Chip
            icon={<FiUsers size={11} />}
            label={p.row.personalInfoManagerId}
            size="small"
            sx={STYLES.chip("green")}
          />
        : <Typography color="text.disabled" fontSize="0.8rem">No Manager</Typography>,
    },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 210,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
          <Tooltip title="View details">
            <Button
              size="small"
              variant="outlined"
              sx={{ minWidth: 0, px: 1.25, py: 0.5, borderRadius: 1.5 }}
              onClick={() => openViewModal(params.row.id)}
            >
              <FiEye size={14} />
            </Button>
          </Tooltip>
          <Tooltip title="Edit record">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              sx={{ minWidth: 0, px: 1.25, py: 0.5, borderRadius: 1.5 }}
              onClick={() => openEditForm(params.row.id)}
            >
              <FiEdit size={14} />
            </Button>
          </Tooltip>

        </Box>
      ),
    },
  ], [openViewModal, openEditForm]);

  const label = TYPE_LABELS[personType] || personType;

  return (
    <Box sx={{ mt: 2 }}>

      {/* ── Header bar ── */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5, mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>{label}s</Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredRows.length} record{filteredRows.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder={`Search ${label.toLowerCase()}s…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 240 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch size={15} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            startIcon={<FiUserPlus size={16} />}
            onClick={openAddForm}
            disabled={loading}
            sx={{ borderRadius: 1.5, px: 2.5, fontWeight: 600, textTransform: "none" }}
          >
            Add {label}
          </Button>
        </Box>
      </Paper>

      {/* ── Data Grid ── */}
      {loading && rows.length === 0 ? (
        <Box>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1, borderRadius: 1 }} />
          ))}
        </Box>
      ) : (
        <Paper sx={{ height: 660, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(r) => r.id}
            loading={loading}
            rowHeight={52}
            pagination
            slots={{ toolbar: GridToolbar }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": { bgcolor: "grey.50", fontWeight: 700 },
              "& .MuiDataGrid-row:hover": { bgcolor: "primary.50" },
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-cell:focus-within": { outline: "none" },
            }}
          />
        </Paper>
      )}

      {/* ── ADD / EDIT MODAL ── */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? `Edit ${label}` : `Add New ${label}`}
          </Typography>
          {isEdit && (
            <Typography variant="body2" color="text.secondary">
              ID: {form.id}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>

          {/* ID row (edit only) */}
          {isEdit && (
            <Paper variant="outlined" sx={{ p: 1.5, mb: 3, borderRadius: 1.5, bgcolor: "grey.50" }}>
              <TextField
                fullWidth size="small" label="Record ID"
                value={form.id} disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy ID">
                        <IconButton size="small" onClick={copyId}>
                          <FiCopy size={14} />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          )}

          {/* ── Section: Personal ── */}
          <SectionTitle icon={FiUser} label="Personal Information" />
          <Grid container spacing={2} sx={{ mb: 3 }}>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth required size="small" label="First Name"
                value={form.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
                error={!!errors.firstname} helperText={errors.firstname}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Last Name"
                value={form.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Father's Name"
                value={form.fathername}
                onChange={(e) => handleChange("fathername", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Spouse Name"
                value={form.spouse}
                onChange={(e) => handleChange("spouse", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select fullWidth size="small" label="Gender"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                {GENDER_OPTIONS.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Age" type="number"
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
                inputProps={{ min: 0, max: 120 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Occupation"
                value={form.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
              />
            </Grid>

          </Grid>

          {/* ── Section: Manager ── */}
          <SectionTitle icon={FiUsers} label="Manager Assignment" />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={managerOptions}
                getOptionLabel={(o) => o.label || ""}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                value={managerValue}
                inputValue={managerInputValue}
                onInputChange={handleManagerInputChange}
                onChange={handleManagerChange}
                loading={loadingManager}
                filterOptions={(x) => x} // server-side filtering
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ py: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 30, height: 30, mr: 1.5,
                        bgcolor: avatarColor(option.id),
                        fontSize: "0.7rem", fontWeight: 700,
                      }}
                    >
                      {(option.label[0] || "?").toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{option.sub}</Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Assign Manager"
                    placeholder="Type to search partners…"
                    helperText={
                      isEdit
                        ? "Current partner is excluded from manager options"
                        : "Search by name or mobile number"
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <FiUsers size={15} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          {loadingManager && <CircularProgress size={16} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                noOptionsText={
                  managerInputValue.length < 2
                    ? "Type at least 2 characters to search"
                    : "No matching partners found"
                }
                clearOnEscape
                clearText="Clear manager"
              />
            </Grid>

            {/* Show selected manager chip */}
            {managerValue && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">Selected:</Typography>
                  <Chip
                    avatar={
                      <Avatar sx={{ bgcolor: avatarColor(managerValue.id), fontSize: "0.6rem" }}>
                        {(managerValue.label[0] || "?").toUpperCase()}
                      </Avatar>
                    }
                    label={`${managerValue.label} (${managerValue.id})`}
                    onDelete={() => { setManagerValue(null); setManagerInputValue(""); setForm(p => ({ ...p, personalInfoManagerId: "" })); }}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Grid>
            )}
          </Grid>

          {/* ── Section: ID Proof ── */}
          <SectionTitle icon={FiShield} label="Identification" />
          <Grid container spacing={2} sx={{ mb: 3 }}>

            <Grid item xs={12} sm={6}>
              <TextField
                select fullWidth size="small" label="ID Proof Type"
                value={form.idprooftype}
                onChange={(e) => handleChange("idprooftype", e.target.value)}
              >
                <MenuItem value=""><em>Select type</em></MenuItem>
                {ID_PROOF_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="ID Number"
                value={form.idproof}
                onChange={(e) => handleChange("idproof", e.target.value)}
              />
            </Grid>

          </Grid>

          {/* ── Section: Contact ── */}
          <SectionTitle icon={FiPhone} label="Contact Information" />
          <Grid container spacing={2} sx={{ mb: 3 }}>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Mobile No" required
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                error={!!errors.mobile} helperText={errors.mobile || "10 digits"}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Mobile No 2"
                value={form.mobile2}
                onChange={(e) => handleChange("mobile2", e.target.value)}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth size="small" label="Office Phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth multiline rows={2} size="small" label="Residential Address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth multiline rows={2} size="small" label="Office Address"
                value={form.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
              />
            </Grid>

          </Grid>

          {/* ── Section: Other ── */}
          <SectionTitle icon={FiMapPin} label="Other Details" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth size="small" label="Reference"
                value={form.reference}
                onChange={(e) => handleChange("reference", e.target.value)}
              />
            </Grid>
          </Grid>

        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            variant="outlined" size="large"
            startIcon={<FiXCircle size={16} />}
            onClick={() => setModalOpen(false)}
            sx={{ borderRadius: 1.5, textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained" size="large"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <FiSave size={16} />}
            onClick={handleSubmit}
            disabled={saving}
            sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 600, minWidth: 120 }}
          >
            {saving ? "Saving…" : isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── VIEW MODAL ── */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md" fullWidth
        TransitionComponent={Fade}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {selectedRecord && (
                <Avatar
                  sx={{
                    width: 48, height: 48,
                    bgcolor: avatarColor(selectedRecord.id),
                    fontSize: "1rem", fontWeight: 700,
                  }}
                >
                  {getInitials(selectedRecord)}
                </Avatar>
              )}
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {[selectedRecord?.firstname, selectedRecord?.lastname].filter(Boolean).join(" ") || "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary">ID: {selectedRecord?.id || "—"}</Typography>
              </Box>
            </Box>
            {selectedRecord?.personalInfoManagerId && (
              <Chip
                icon={<FiUsers size={12} />}
                label={`Manager: ${selectedRecord.personalInfoManagerId}`}
                size="small"
                sx={STYLES.chip("green")}
              />
            )}
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          {selectedRecord && (
            <Grid container spacing={3}>

              {/* Personal */}
              <Grid item xs={12}>
                <SectionTitle icon={FiUser} label="Personal Information" />
              </Grid>
              <Grid item xs={6} sm={4}><ViewField label="Father's Name" value={selectedRecord.fathername} /></Grid>
              <Grid item xs={6} sm={4}><ViewField label="Spouse Name" value={selectedRecord.spouse} /></Grid>
              <Grid item xs={6} sm={4}><ViewField label="Gender" value={selectedRecord.gender} /></Grid>
              <Grid item xs={6} sm={4}><ViewField label="Age" value={selectedRecord.age} /></Grid>
              <Grid item xs={6} sm={4}><ViewField label="Occupation" value={selectedRecord.occupation} /></Grid>

              {/* Identification */}
              <Grid item xs={12}><Divider /><Box sx={{ mt: 2 }}><SectionTitle icon={FiShield} label="Identification" /></Box></Grid>
              <Grid item xs={6}><ViewField label="ID Proof Type" value={selectedRecord.idprooftype} /></Grid>
              <Grid item xs={6}><ViewField label="ID Number" value={selectedRecord.idproof} /></Grid>

              {/* Contact */}
              <Grid item xs={12}><Divider /><Box sx={{ mt: 2 }}><SectionTitle icon={FiPhone} label="Contact Information" /></Box></Grid>
              <Grid item xs={6} sm={4}><ViewField label="Mobile No" value={selectedRecord.mobile} /></Grid>
              <Grid item xs={6} sm={4}><ViewField label="Mobile No 2" value={selectedRecord.mobile2} /></Grid>
              <Grid item xs={6} sm={4}><ViewField label="Office Phone" value={selectedRecord.phone} /></Grid>
              <Grid item xs={12} sm={6}><ViewField label="Residential Address" value={selectedRecord.address} /></Grid>
              <Grid item xs={12} sm={6}><ViewField label="Office Address" value={selectedRecord.address2} /></Grid>

              {/* Other */}
              <Grid item xs={12}><Divider /><Box sx={{ mt: 2 }}><SectionTitle icon={FiMapPin} label="Other Details" /></Box></Grid>
              <Grid item xs={6}><ViewField label="Reference" value={selectedRecord.reference} /></Grid>
              <Grid item xs={6}>
                <Typography sx={STYLES.fieldLabel}>Manager</Typography>
                {selectedRecord.personalInfoManagerId ? (
                  <Chip
                    icon={<FiUsers size={12} />}
                    label={selectedRecord.personalInfoManagerId}
                    size="small"
                    sx={STYLES.chip("green")}
                  />
                ) : (
                  <Typography sx={STYLES.viewValue}>—</Typography>
                )}
              </Grid>

            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={() => setViewModalOpen(false)}
            sx={{ textTransform: "none", borderRadius: 1.5 }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<FiEdit size={14} />}
            onClick={() => { setViewModalOpen(false); openEditForm(selectedRecord?.id); }}
            sx={{ textTransform: "none", borderRadius: 1.5, fontWeight: 600 }}
          >
            Edit Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
=======
import PersonalInfoManager from "../PersonalInfoManager";

const Partner = () => <PersonalInfoManager personType="PARTNER" />;
>>>>>>> Stashed changes

export default Partner;
