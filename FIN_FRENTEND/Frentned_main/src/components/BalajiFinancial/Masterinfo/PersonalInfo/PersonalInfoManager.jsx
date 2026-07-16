import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  ContentCopyRounded,
  EditRounded,
  RefreshRounded,
  SaveRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { errorToast, successToast } from "toastify";
import { getSession } from "src/utils/session";
import { DataTable, ProfilePhotoBox } from "src/components/ui";

const TYPE_LABELS = {
  CUSTOMER: "Customer",
  EMPLOYEE: "Employee",
  PARTNER: "Partner",
  VENDOR: "Vendor",
};

const blankForm = (personType) => ({
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

const DetailItem = ({ label, value, xs = 12, sm = 6, md = 4 }) => (
  <Grid
    size={{
      xs: xs,
      sm: sm,
      md: md
    }}>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontWeight: 800 }}>
      {label}
    </Typography>
    <Typography sx={{ mt: 0.25, wordBreak: "break-word" }}>{value || "-"}</Typography>
  </Grid>
);

const PersonalInfoManager = ({ personType = "CUSTOMER" }) => {
  const label = TYPE_LABELS[personType] || "Person";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState(blankForm(personType));
  const [errors, setErrors] = useState({});

  const getAuthHeaders = () => {
    const token = getSession("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/findAll`, {
        headers: getAuthHeaders(),
      });
      const data = (Array.isArray(res.data) ? res.data : []).filter((p) => p.category === personType);
      setRows(data.map((item, i) => ({ ...item, id: item.id || `BALAJI-${i}-${Date.now()}` })));
    } catch {
      errorToast("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [personType]);

  const openAddForm = () => {
    setForm(blankForm(personType));
    setErrors({});
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditForm = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/findPersonalInfoById/${id}`, {
        headers: getAuthHeaders(),
      });
      setForm({ ...blankForm(personType), ...res.data });
      setErrors({});
      setIsEdit(true);
      setModalOpen(true);
    } catch {
      errorToast("Failed to load record");
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/findPersonalInfoById/${id}`, {
        headers: getAuthHeaders(),
      });
      setSelectedRecord(res.data);
      setViewModalOpen(true);
    } catch {
      errorToast("Failed to load record");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    let nextValue = value;
    if (["mobile", "mobile2", "phone"].includes(field)) {
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    }
    if (field === "age") {
      nextValue = value === "" ? "" : Math.max(0, parseInt(value, 10) || 0).toString();
    }
    setForm((prev) => ({ ...prev, [field]: nextValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstname?.trim()) newErrors.firstname = "First name required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await axios.post(`${API_BASE}/PersonalInfo/updatePersonalInfo/${personType}`, {
        ...form,
        category: personType,
      }, {
        headers: getAuthHeaders(),
      });
      successToast(isEdit ? "Updated!" : "Added!");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      errorToast(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(form.id || "");
    successToast("ID copied");
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<VisibilityRounded />} onClick={() => openViewModal(params.row.id)}>
            View
          </Button>
          <Button size="small" variant="contained" startIcon={<EditRounded />} onClick={() => openEditForm(params.row.id)}>
            Edit
          </Button>
        </Stack>
      ),
    },
    { field: "id", headerName: "ID", width: 100 },
    { field: "firstname", headerName: "First Name", minWidth: 140, flex: 1 },
    { field: "lastname", headerName: "Last Name", minWidth: 140, flex: 1 },
    { field: "mobile", headerName: "Mobile", width: 120 },
    { field: "occupation", headerName: "Occupation", minWidth: 130, flex: 0.8 },
    { field: "address", headerName: "Address", minWidth: 220, flex: 1.6 },
  ];

  return (
    <Box>
      <DataTable
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        height="calc(100vh - 170px)"
        title={`${label}s`}
        actions={
          <>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshRounded />}
              onClick={fetchData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddRounded />}
              onClick={openAddForm}
              disabled={loading}
            >
              Add {label}
            </Button>
          </>
        }
      />
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? "Edit" : "Add New"} {label}</DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {form.id && (
            <Paper className="enterprise-card" elevation={0} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <ProfilePhotoBox
                  personalInfoId={form.id}
                  editable
                  width={72}
                  height={80}
                  disabledHint="Photo unavailable"
                />
                <TextField
                  fullWidth
                  size="small"
                  label="ID"
                  value={form.id}
                  disabled
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button size="small" onClick={copyId} startIcon={<ContentCopyRounded />}>
                          Copy
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>
          )}
          {!isEdit && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Photo upload is available after saving — save this record, then Edit it to add a photo.
            </Typography>
          )}

          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth required size="small" label="First Name" value={form.firstname} onChange={(e) => handleChange("firstname", e.target.value)} error={!!errors.firstname} helperText={errors.firstname} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Last Name" value={form.lastname} onChange={(e) => handleChange("lastname", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Father Name" value={form.fathername} onChange={(e) => handleChange("fathername", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Spouse Name" value={form.spouse} onChange={(e) => handleChange("spouse", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField select fullWidth size="small" label="Gender" value={form.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Age" type="number" value={form.age} onChange={(e) => handleChange("age", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Occupation" value={form.occupation} onChange={(e) => handleChange("occupation", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField select fullWidth size="small" label="ID Proof Type" value={form.idprooftype} onChange={(e) => handleChange("idprooftype", e.target.value)}>
                <MenuItem value="Aadhaar Card">Aadhaar Card</MenuItem>
                <MenuItem value="PAN Card">PAN Card</MenuItem>
                <MenuItem value="Voter ID">Voter ID</MenuItem>
                <MenuItem value="Driving License">Driving License</MenuItem>
                <MenuItem value="Passport">Passport</MenuItem>
              </TextField>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="ID Number" value={form.idproof} onChange={(e) => handleChange("idproof", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField fullWidth multiline rows={2} size="small" label="Residential Address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <TextField fullWidth multiline rows={2} size="small" label="Office Address" value={form.address2} onChange={(e) => handleChange("address2", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth required size="small" label="Mobile No" value={form.mobile} onChange={(e) => handleChange("mobile", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Mobile No 2" value={form.mobile2} onChange={(e) => handleChange("mobile2", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Office Phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4
              }}>
              <TextField fullWidth size="small" label="Reference" value={form.reference} onChange={(e) => handleChange("reference", e.target.value)} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={saving ? <CircularProgress size={18} /> : <SaveRounded />} onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{label} Details - {selectedRecord?.id || "-"}</DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <Grid container spacing={2.25}>
              <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
                <ProfilePhotoBox
                  personalInfoId={selectedRecord.id}
                  editable={false}
                  width={90}
                  height={100}
                />
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle1" fontWeight={800}>Personal Information</Typography>
              </Grid>
              <DetailItem label="Full Name" value={`${selectedRecord.firstname || ""} ${selectedRecord.lastname || ""}`.trim()} />
              <DetailItem label="Father Name" value={selectedRecord.fathername} />
              <DetailItem label="Spouse Name" value={selectedRecord.spouse} />
              <DetailItem label="Gender" value={selectedRecord.gender} />
              <DetailItem label="Age" value={selectedRecord.age} />
              <DetailItem label="Occupation" value={selectedRecord.occupation} />
              <Grid size={12}><Divider /></Grid>
              <DetailItem label="ID Proof Type" value={selectedRecord.idprooftype} />
              <DetailItem label="ID Number" value={selectedRecord.idproof} />
              <DetailItem label="Mobile No" value={selectedRecord.mobile} />
              <DetailItem label="Mobile No 2" value={selectedRecord.mobile2} />
              <DetailItem label="Office Phone" value={selectedRecord.phone} />
              <DetailItem label="Reference" value={selectedRecord.reference} />
              <DetailItem label="Residential Address" value={selectedRecord.address} md={6} />
              <DetailItem label="Office Address" value={selectedRecord.address2} md={6} />
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => { setViewModalOpen(false); openEditForm(selectedRecord?.id); }}>
            Edit Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonalInfoManager;
