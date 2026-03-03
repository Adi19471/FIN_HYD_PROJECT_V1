import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Drawer,
  Typography,
  Paper,
  Tooltip,
  Grid,
  MenuItem,
  CircularProgress,
  Select,
  Checkbox,
  ListItemText,
  Chip,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  AccountTree as AccountTreeIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

/* ---------------- CONSTANTS ---------------- */
const PERSON_TYPES = ["CUSTOMER", "PARTNER", "EMPLOYEE", "VENDOR"];
const TRANS_TYPES = ["CREDIT", "DEBIT"];

const DRAWER_WIDTH = 400;

const AccountMasterSetup = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: 0,
    type: "",
    masterCode: "",
    code: "",
    visibility: true,
    masterIcon: "",
    personType: [],
    transType: [],
  });

  /* ---------------- HEADERS ---------------- */
  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${
        getSession()?.token || getSession("token") || ""
      }`,
      "Content-Type": "application/json",
    },
  });

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/account-master-setup/findAll`,
        getHeaders()
      );
      setAccounts(res.data || []);
    } catch {
      toast.error("Failed to load account masters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- OPEN / CLOSE ---------------- */
  const handleOpen = (row = null) => {
    if (row) {
      setIsEdit(true);
      setForm({
        ...row,
        personType: row.personType?.split(",") || [],
        transType: row.transType?.split(",") || [],
      });
    } else {
      setIsEdit(false);
      setForm({
        id: 0,
        type: "",
        masterCode: "",
        code: "",
        visibility: true,
        masterIcon: "",
        personType: [],
        transType: [],
      });
    }
    setDrawerOpen(true);
  };

  const handleClose = () => setDrawerOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- SAVE ---------------- */
  const handleSubmit = async () => {
    if (!form.type || !form.masterCode || !form.code) {
      toast.warn("Type, Master Code and Code are required");
      return;
    }

    const payload = {
      ...form,
      personType: form.personType.join(","),
      transType: form.transType.join(","),
    };

    try {
      const url = isEdit
        ? "/account-master-setup/UpdateAccountMaster"
        : "/account-master-setup/saveAccountMaster";

      await axios.post(`${API_BASE}${url}`, payload, getHeaders());
      toast.success(isEdit ? "Updated successfully" : "Created successfully");
      handleClose();
      fetchData();
    } catch {
      toast.error("Save failed");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.get(
        `${API_BASE}/account-master-setup/deleteAccountMasterById/${id}`,
        getHeaders()
      );
      toast.success("Deleted successfully");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- GRID ---------------- */
  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 70, 
      align: "center", 
      headerAlign: "center",
      headerClassName: "header-cell" 
    },
    { 
      field: "type", 
      headerName: "Type", 
      flex: 1,
      minWidth: 120,
      headerClassName: "header-cell" 
    },
    { 
      field: "masterCode", 
      headerName: "Master Code", 
      width: 150,
      headerClassName: "header-cell" 
    },
    { 
      field: "code", 
      headerName: "Code", 
      width: 120,
      headerClassName: "header-cell" 
    },
    { 
      field: "personType", 
      headerName: "Person Type", 
      width: 220,
      headerClassName: "header-cell",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value?.split(",").map((pt, i) => (
            <Chip 
              key={i} 
              label={pt} 
              size="small" 
              sx={{ fontSize: "0.7rem", height: 20 }} 
              color="primary" 
              variant="outlined"
            />
          ))}
        </Box>
      )
    },
    { 
      field: "transType", 
      headerName: "Transaction", 
      width: 160,
      headerClassName: "header-cell",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {params.value?.split(",").map((tt, i) => (
            <Chip 
              key={i} 
              label={tt} 
              size="small" 
              sx={{ fontSize: "0.7rem", height: 20 }}
              color={tt === "CREDIT" ? "success" : "error"}
            />
          ))}
        </Box>
      )
    },
    {
      field: "visibility",
      headerName: "Visible",
      width: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "header-cell",
      renderCell: ({ value }) => (
        value ? 
          <Visibility sx={{ color: "success.main" }} /> : 
          <VisibilityOff sx={{ color: "text.disabled" }} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      headerClassName: "header-cell",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton 
              onClick={() => handleOpen(row)}
              size="small"
              sx={{ 
                color: "primary.main",
                "&:hover": { backgroundColor: "primary.light", color: "primary.contrastText" }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              color="error" 
              onClick={() => handleDelete(row.id)}
              size="small"
              sx={{ "&:hover": { backgroundColor: "error.light", color: "error.contrastText" } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  /* ---------------- UI ---------------- */
  return (
    <Box p={3}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2, 
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #f8f9fa 0%, #fff 100%)"
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AccountTreeIcon sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
              Account Master Setup
            </Typography>
          </Box>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            onClick={() => handleOpen()}
            sx={{ 
              borderRadius: 2,
              textTransform: "none",
              px: 2,
              boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)"
            }}
          >
            Add New
          </Button>
        </Box>
      </Paper>

      <Paper 
        elevation={0}
        sx={{ 
          height: 600, 
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden"
        }}
      >
        {loading ? (
          <Box height="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={accounts}
            columns={columns}
            getRowId={(r) => r.id}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            showCellVerticalBorder
            showColumnVerticalBorder
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "black",
                borderBottom: "2px solid primary.dark",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "2px solid primary.light",
              },
              "& .header-cell": {
                fontWeight: 600,
              },
            }}
          />
        )}
      </Paper>

      {/* ---------------- DRAWER ---------------- */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: DRAWER_WIDTH },
            borderRadius: { xs: 0, sm: "16px 0 0 16px" },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
              {isEdit ? "Edit Account Master" : "Create Account Master"}
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form Content */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
            <Grid container spacing={2}>
              {/* Row 1: Type + Master Code */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Master Code"
                  name="masterCode"
                  value={form.masterCode}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Grid>

              {/* Row 2: Code + Master Icon */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Master Icon"
                  name="masterIcon"
                  value={form.masterIcon}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Grid>

              {/* Row 3: Person Type */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ bgcolor: "background.paper", px: 1 }}>
                    Person Type
                  </InputLabel>
                  <Select
                    multiple
                    value={form.personType}
                    label="Person Type"
                    onChange={(e) =>
                      setForm((p) => ({ ...p, personType: e.target.value }))
                    }
                    sx={{ borderRadius: 1.5 }}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((v) => (
                          <Chip 
                            key={v} 
                            label={v} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {PERSON_TYPES.map((p) => (
                      <MenuItem key={p} value={p}>
                        <Checkbox checked={form.personType.includes(p)} />
                        <ListItemText primary={p} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Row 4: Transaction Type */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ bgcolor: "background.paper", px: 1 }}>
                    Transaction Type
                  </InputLabel>
                  <Select
                    multiple
                    value={form.transType}
                    label="Transaction Type"
                    onChange={(e) =>
                      setForm((p) => ({ ...p, transType: e.target.value }))
                    }
                    sx={{ borderRadius: 1.5 }}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((v) => (
                          <Chip
                            key={v}
                            label={v}
                            size="small"
                            color={v === "CREDIT" ? "success" : "error"}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {TRANS_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>
                        <Checkbox checked={form.transType.includes(t)} />
                        <ListItemText primary={t} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Row 5: Visibility Toggle */}
              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 1.5,
                    bgcolor: form.visibility ? "success.light" : "grey.100",
                    transition: "all 0.3s"
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.visibility}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, visibility: e.target.checked }))
                        }
                        color="success"
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {form.visibility ? "Visible" : "Hidden"}
                      </Typography>
                    }
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              bgcolor: "background.paper",
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ 
                borderRadius: 1.5,
                textTransform: "none",
                px: 3
              }}
            >
              Cancel
            </Button>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={handleSubmit}
              sx={{ 
                borderRadius: 1.5,
                textTransform: "none",
                px: 3,
                boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)"
              }}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AccountMasterSetup;
