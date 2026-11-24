import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ApartmentRounded, PlaceRounded, TagRounded } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "lib/config";
import { actionIcons, navIcons } from "src/lib/icons";
import { DataTable, ScreenHeader } from "src/components/ui";

const AddIcon = actionIcons.add;
const CloseIcon = actionIcons.close;
const EditIcon = actionIcons.edit;
const SaveIcon = actionIcons.save;
const SearchIcon = actionIcons.search;

const emptyForm = { code: "", name: "", location: "", sortOrder: "", active: true, isNew: true };

// Same rule the server applies: capitals, digits and _ (e.g. KUKATPALLY).
const toCode = (value) =>
  String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);

/**
 * Branch Master - the offices of the company.
 *
 * The company's branches - all equal, no main or sub branch. A branch's code is its
 * permanent key: it is stamped on every customer, loan and cash book entry
 * made there, so it is set once and never edited. Name, location and order
 * can change; a branch that closes is switched off (Active) rather than
 * deleted, so its history stays. Whoever has this screen (menu permission
 * "Branch Master") can add and change branches; the server checks it too.
 */
const Branch_Master = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [codeTouched, setCodeTouched] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/branches`);
      setRows((Array.isArray(res.data) ? res.data : []).map((branch) => ({ ...branch, id: branch.code })));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      [row.code, row.name, row.location].filter(Boolean).some((value) => value.toLowerCase().includes(term))
    );
  }, [rows, search]);

  const openNew = () => {
    setForm({ ...emptyForm, sortOrder: rows.length });
    setCodeTouched(false);
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      code: row.code,
      name: row.name || "",
      location: row.location || "",
      sortOrder: row.sortOrder ?? "",
      active: Boolean(row.active),
      isNew: false,
    });
    setCodeTouched(true);
    setOpen(true);
  };

  const close = () => {
    if (saving) return;
    setOpen(false);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.warning("Branch name is required");
      return;
    }
    const code = toCode(form.code || form.name);
    if (form.isNew && !code) {
      toast.warning("Enter a branch code (letters or digits)");
      return;
    }
    const payload = {
      code: form.isNew ? code : form.code,
      name: form.name.trim(),
      location: form.location.trim(),
      sortOrder: form.sortOrder === "" ? null : Number(form.sortOrder),
      active: form.active,
    };

    setSaving(true);
    try {
      if (form.isNew) await axios.post(`${API_BASE}/branches`, payload);
      else await axios.put(`${API_BASE}/branches`, payload);
      toast.success(form.isNew ? `Branch ${payload.name} created` : "Branch updated");
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      sortable: false,
      filterable: false,
      disableExport: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title="Edit">
          <IconButton size="small" color="primary" onClick={() => openEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    { field: "code", headerName: "Code", width: 150 },
    {
      field: "name",
      headerName: "Branch Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ApartmentRounded sx={{ color: "primary.main", fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { field: "location", headerName: "Location", flex: 1, minWidth: 180 },
    { field: "sortOrder", headerName: "Order", width: 90, align: "right", headerAlign: "right" },
    {
      field: "active",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => (value ? "Active" : "Closed"),
      renderCell: (params) => (
        <Chip
          size="small"
          color={params.value ? "success" : "default"}
          variant={params.value ? "filled" : "outlined"}
          label={params.value ? "Active" : "Closed"}
        />
      ),
    },
  ];

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.branchMaster}
        title="Branch Master"
        subtitle="The company's branches. Users are given branches on the User Registration screen."
      >
        <TextField
          className="scr-head-search"
          size="small"
          placeholder="Search code, name or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew} disabled={loading || saving}>
          Add Branch
        </Button>
      </ScreenHeader>

      <DataTable
        rows={filtered}
        columns={columns}
        getRowId={(row) => row.code}
        loading={loading}
        title="Branches"
        subtitle="A closed branch keeps its history; its users can no longer open it."
        fileName="Branch_Master"
        pageSize={25}
        disableRowSelectionOnClick
      />

      <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography component="span" variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {form.isNew ? "Add Branch" : `Edit ${form.name || "Branch"}`}
          </Typography>
          <IconButton onClick={close} sx={{ color: "text.secondary" }} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                required
                autoFocus
                label="Branch Name"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({ ...prev, name, code: prev.isNew && !codeTouched ? toCode(name) : prev.code }));
                }}
                placeholder="e.g. Kukatpally"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ApartmentRounded color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField
                fullWidth
                label="Branch Code"
                value={form.code}
                disabled={!form.isNew}
                onChange={(e) => {
                  setCodeTouched(true);
                  setForm((prev) => ({ ...prev, code: toCode(e.target.value) }));
                }}
                helperText={form.isNew ? "Permanent key, cannot be changed later" : "Codes never change"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TagRounded color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                type="number"
                label="Order"
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                helperText="Position in branch lists"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Location / Address"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. KPHB Colony, Hyderabad"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceRounded color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {!form.isNew && (
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.active}
                      onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                    />
                  }
                  label={form.active ? "Active" : "Closed - its users can no longer open it"}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button onClick={close} variant="outlined" startIcon={<CloseIcon />} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} startIcon={<SaveIcon />} disabled={saving}>
            {saving ? "Saving..." : form.isNew ? "Create Branch" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Branch_Master;
