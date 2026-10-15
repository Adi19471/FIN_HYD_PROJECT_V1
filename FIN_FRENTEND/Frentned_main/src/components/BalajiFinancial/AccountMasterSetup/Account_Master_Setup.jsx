import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { actionIcons, navIcons } from "src/lib/icons";
import { DROPDOWN_MENU_PROPS, DataTable, ScreenHeader } from "src/components/ui";

const AddIcon = actionIcons.add;
const EditIcon = actionIcons.edit;
const SaveIcon = actionIcons.save;
const CloseIcon = actionIcons.close;
const SearchIcon = actionIcons.search;
const VisibleIcon = actionIcons.view;
const HiddenIcon = actionIcons.hide;

const PERSON_TYPES = ["Customer", "Partner", "Employee", "Vendor"];
const TRANS_TYPES = ["CREDIT", "DEBIT"];

const emptyForm = {
  id: 0,
  type: "",
  masterCode: "",
  code: "",
  visibility: true,
  masterIcon: "",
  personType: [],
  transType: [],
};

// "Customer,Partner" is how the API stores a multiple choice.
const splitList = (value) => (value ? String(value).split(",").filter(Boolean) : []);

const AccountMasterSetup = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // read at call time: a token read once goes stale after a new sign-in
  const authHeaders = () => ({
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/account-master-setup/findAll`, { headers: authHeaders() });
      setAccounts(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return accounts;
    return accounts.filter((row) =>
      [row.type, row.masterCode, row.code, row.personType, row.transType].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [accounts, search]);

  const handleOpen = (row = null) => {
    setIsEdit(Boolean(row));
    setForm(
      row
        ? { ...row, personType: splitList(row.personType), transType: splitList(row.transType) }
        : emptyForm
    );
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSubmit = async () => {
    const payload = {
      ...form,
      personType: form.personType.join(","),
      transType: form.transType.join(","),
    };

    const url = isEdit
      ? "/account-master-setup/UpdateAccountMaster"
      : "/account-master-setup/saveAccountMaster";

    setSaving(true);
    try {
      await axios.post(`${API_BASE}${url}`, payload, { headers: authHeaders() });
      toast.success(isEdit ? "Updated successfully" : "Saved successfully");
      handleClose();
      fetchData();
    } catch {
      toast.error("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  // One definition drives the grid on screen and every download / print of it:
  // renderCell is what the screen shows, valueFormatter what a page prints.
  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 96,
      sortable: false,
      filterable: false,
      disableExport: true,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Tooltip title="Edit">
          <IconButton size="small" color="primary" onClick={() => handleOpen(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "type", headerName: "Type", minWidth: 160, flex: 1 },
    { field: "masterCode", headerName: "Master Code", minWidth: 180, flex: 1 },
    { field: "code", headerName: "Code", minWidth: 120, flex: 0.7 },
    {
      field: "personType",
      headerName: "Person Type",
      minWidth: 200,
      flex: 1,
      valueFormatter: (value) => splitList(value).join(", "),
      renderCell: ({ value }) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center", height: "100%" }}>
          {splitList(value).map((person) => (
            <Chip key={person} label={person} size="small" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      field: "transType",
      headerName: "Transaction",
      width: 180,
      valueFormatter: (value) => splitList(value).join(", "),
      renderCell: ({ value }) => (
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", height: "100%" }}>
          {splitList(value).map((trans) => (
            <Chip
              key={trans}
              label={trans}
              size="small"
              variant="outlined"
              color={trans === "CREDIT" ? "success" : "error"}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "visibility",
      headerName: "Visible",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => (value ? "Yes" : "No"),
      renderCell: ({ value }) => (
        <Tooltip title={value ? "Visible" : "Hidden"}>
          <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
            {value ? <VisibleIcon color="success" fontSize="small" /> : <HiddenIcon color="disabled" fontSize="small" />}
          </Box>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.accountSetup}
        title="Account Setup"
        subtitle="Account heads: who they apply to and whether they take credits or debits."
      >
        <TextField
          className="scr-head-search"
          size="small"
          placeholder="Search type, code, person..."
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Account
        </Button>
      </ScreenHeader>

      <DataTable
        title="Account heads"
        subtitle={search.trim() ? `Matching "${search.trim()}"` : "Every account head set up in the books."}
        fileName="Account_Master_Setup"
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={25}
        disableRowSelectionOnClick
      />

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          {/* a span: the dialog title is already the heading */}
          <Typography component="span" variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {isEdit ? "Edit Account Head" : "Add Account Head"}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Master Code"
                value={form.masterCode}
                onChange={(e) => setForm({ ...form, masterCode: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Person Type</InputLabel>
                <Select
                  multiple
                  value={form.personType || []}
                  label="Person Type"
                  MenuProps={DROPDOWN_MENU_PROPS}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({
                      ...form,
                      personType: typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {PERSON_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={(form.personType || []).includes(type)} />
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  multiple
                  value={form.transType || []}
                  label="Transaction Type"
                  MenuProps={DROPDOWN_MENU_PROPS}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({
                      ...form,
                      transType: typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {TRANS_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={(form.transType || []).includes(type)} />
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  px: 2,
                  py: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{form.visibility ? "Visible" : "Hidden"}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    A hidden account head is kept, but left out of the account lists.
                  </Typography>
                </Box>
                <Switch
                  checked={Boolean(form.visibility)}
                  onChange={(e) => setForm({ ...form, visibility: e.target.checked })}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button variant="outlined" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountMasterSetup;
