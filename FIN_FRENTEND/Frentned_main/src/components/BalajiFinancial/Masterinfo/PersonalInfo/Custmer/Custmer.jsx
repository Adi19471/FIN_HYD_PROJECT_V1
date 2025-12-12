// src/components/BalajiFinancial/PersonalInfo/Custmer/Custmer.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Grid,
  TextField,
  Paper,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import {
  FiUserPlus,
  FiSearch,
  FiCopy,
  FiSave,
  FiEdit,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";

import { MdClose } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { getSession } from "src/utils/session";
import { API_BASE } from "lib/config";

const TYPE_LABELS = {
  CUSTOMER: "Customer",
  EMPLOYEE: "Employee",
  PARTNER: "Partner",
  VENDOR: "Vendor",
};

const Custmer = ({ personType = "CUSTOMER" }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState("");

  /* FULL JSON FORM WITH ID INCLUDED */
  const [form, setForm] = useState({
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
  });

  const [errors, setErrors] = useState({});

  const getAuthHeaders = () => {
    const token = getSession("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /* FETCH ALL DATA */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/findAll`, {
        headers: getAuthHeaders(),
      });

      const data = (Array.isArray(res.data) ? res.data : []).filter(
        (p) => p.category === personType
      );

      setRows(
        data.map((item, i) => ({
          ...item,
          id: item.id || `BALAJI-${i}-${Date.now()}`,
        }))
      );
    } catch {
      errorToast("Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [personType]);

  useEffect(() => {
    setFilteredRows(
      rows.filter(
        (r) =>
          (r.firstname || "").toLowerCase().includes(search.toLowerCase()) ||
          (r.mobile || "").includes(search) ||
          (r.id || "").includes(search)
      )
    );
  }, [rows, search]);

  /* OPEN ADD NEW FORM */
  const openAddForm = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/createNewPersonalInfoTemplate/${personType}`,
        { headers: getAuthHeaders() }
      );

      // const newId = res.data?.id || "" // <-- FIXED

      setForm({
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
      });

      setIsEdit(false);
      setDrawerOpen(true);
    } catch {
      errorToast("Failed to get new template");
    }

    setLoading(false);
  };

  /* INPUT CHANGE */
  const handleChange = (field, value) => {
    if (["mobile", "mobile2", "phone"].includes(field)) {
      value = value.replace(/\D/g, "").slice(0, 10); // numeric only
    }

    if (field === "age") {
      value = value === "" ? "" : Math.max(0, parseInt(value) || 0).toString();
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ONLY FIRST NAME VALIDATION */
  const validateForm = () => {
    const newErrors = {};

    if (!form.firstname?.trim()) newErrors.firstname = "First name required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* SUBMIT / SAVE */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      const payload = { ...form, category: personType };

      // NO MORE ID DELETION !!

      await axios.post(
        `${API_BASE}/PersonalInfo/updatePersonalInfo/${personType}`,
        payload,
        { headers: getAuthHeaders() }
      );

      successToast(isEdit ? "Updated!" : "Added!");
      setDrawerOpen(false);
      fetchData();
    } catch (err) {
      errorToast(err.response?.data?.message || "Save failed");
    }

    setSaving(false);
  };

  /* OPEN EDIT FORM */
  const openEditForm = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/findPersonalInfoById/${id}`,
        { headers: getAuthHeaders() }
      );

      setForm({
        ...res.data,
        // id: res.data?.id || "", // ensure id always present
      });

      setIsEdit(true);
      setDrawerOpen(true);
    } catch {
      errorToast("Failed to load record");
    }
    setLoading(false);
  };

  /* DELETE */
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE}/PersonalInfo/deletePersonalInfo/${toDeleteId}`,
        { headers: getAuthHeaders() }
      );
      successToast("Deleted");
      fetchData();
    } catch {
      errorToast("Delete failed");
    }
    setDeleteDialogOpen(false);
  };

  const copyId = () => {
    navigator.clipboard.writeText(form.id || "");
    successToast("ID Copied!");
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiEdit />}
            onClick={() => openEditForm(params.row.id)}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<FiTrash2 />}
            onClick={() => {
              setToDeleteId(params.row.id);
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
    { field: "id", headerName: "ID", width: 160 },
    { field: "firstname", headerName: "First Name", width: 160 },
    { field: "lastname", headerName: "Last Name", width: 160 },
    { field: "mobile", headerName: "Mobile", width: 140 },
    { field: "address", headerName: "Address", flex: 1 },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">{TYPE_LABELS[personType]}s</Typography>

        <Typography>Total: {filteredRows.length}</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <FiSearch style={{ marginRight: 8 }} />,
            }}
          />

          <Button
            variant="contained"
            startIcon={<FiUserPlus />}
            onClick={openAddForm}
          >
            Add {TYPE_LABELS[personType]}
          </Button>
        </Box>
      </Box>

      {/* DataGrid */}
      <Paper sx={{ height: 680 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(r) => r.id}
          loading={loading}
          pagination
        />
      </Paper>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 550, p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5">
              {isEdit ? "Edit" : "Add New"} {TYPE_LABELS[personType]}
            </Typography>
            <MdClose size={28} onClick={() => setDrawerOpen(false)} />
          </Box>

          {isEdit && (
            <Paper sx={{ p: 2, my: 2 }}>
              <TextField
                fullWidth
                label="Customer ID"
                value={form.id}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={copyId}
                        startIcon={<FiCopy />}
                      >
                        Copy
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          )}

          {/* FORM UI */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                required
                size="small"
                label="First Name"
                value={form.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
                error={!!errors.firstname}
                helperText={errors.firstname}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                required     size="small"
                label="Last Name"
                value={form.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                required     size="small"
                label="Father Name"
                value={form.fathername}
                onChange={(e) => handleChange("fathername", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth     size="small"
                label="Spouse Name"
                value={form.spouse}
                onChange={(e) => handleChange("spouse", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                select
                fullWidth     size="small"
                sx={{ width: "220px" }}
                label="Gender"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth               sx={{ width: "220px" }}  size="small"
                label="Occupation"
                value={form.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth     size="small"
                label="Age"
                type="number" 
                value={form.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                      sx={{ width: "220px" }}
                select     size="small"
                fullWidth
                label="ID Proof Type"
                value={form.idprooftype}
                onChange={(e) => handleChange("idprooftype", e.target.value)}
              >
                <MenuItem value="Aadhaar Card">Aadhaar Card</MenuItem>
                <MenuItem value="PAN Card">PAN Card</MenuItem>
                <MenuItem value="Voter ID">Voter ID</MenuItem>
                <MenuItem value="Driving License">Driving License</MenuItem>
                <MenuItem value="Passport">Passport</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth     size="small"
                label="ID Number"
                value={form.idproof}
                onChange={(e) => handleChange("idproof", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                multiline
                required     size="small"           sx={{ width: "220px" }}
          
                label="Res.Address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth     size="small"
                  sx={{ width: "220px" }}
                multiline
                label="Off Address"
                value={form.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth     size="small"
                required
                label="Mobile No "
                value={form.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField     size="small"
                fullWidth
                label="Res.No"
                value={form.reference}
                onChange={(e) => handleChange("reference", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField     size="small"
                fullWidth
                label="Mobile No 2"
                value={form.mobile2}
                onChange={(e) => handleChange("mobile2", e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Off No"     size="small"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Grid>
          </Grid>

          {/* SAVE BUTTONS */}
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<FiXCircle />}
              onClick={() => setDrawerOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={saving ? <CircularProgress size={20} /> : <FiSave />}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : isEdit ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* DELETE CONFIRM */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Custmer;
