import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  Checkbox,
  Chip,
  Grid,
  InputLabel,
  FormControl,
  Switch,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { DROPDOWN_MENU_PROPS } from "src/components/ui";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { TableExportMenu } from "src/components/ui";

const PERSON_TYPES = ["Customer", "Partner", "Employee", "Vendor"];
const TRANS_TYPES = ["CREDIT", "DEBIT"];

const AccountMasterSetup = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState(""); // ✅ FIXED

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [dialogOpen, setDialogOpen] = useState(false);
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

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/account-master-setup/findAll`,
        {
          headers,
        }
      );
      setAccounts(res.data || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ RESET PAGE ON SEARCH
  useEffect(() => {
    setPage(0);
  }, [search]);

  // ✅ FILTERED DATA
  const filteredAccounts = accounts.filter((row) => {
    const s = search.toLowerCase().trim();

    return (
      row.type?.toLowerCase().includes(s) ||
      row.masterCode?.toLowerCase().includes(s) ||
      row.code?.toLowerCase().includes(s) ||
      row.personType?.toLowerCase().includes(s) ||
      row.transType?.toLowerCase().includes(s)
    );
  });
  const exportColumns = ["id", "type", "masterCode", "code", "personType", "transType", "visibility"];

  const handleOpen = (row = null) => {
    if (row) {
      setIsEdit(true);
      setForm({
        ...row,
        personType: row.personType ? row.personType.split(",") : [],
        transType: row.transType ? row.transType.split(",") : [],
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

    try {
      await axios.post(`${API_BASE}${url}`, payload, {
        headers,
      });
      toast.success(isEdit ? "Updated successfully" : "Saved successfully");
      handleClose();
      fetchData();
    } catch {
      toast.error("Error saving data");
    }
  };

  return (
    <Box p={3}>
      {/* HEADER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" gap={1} flexWrap="wrap">
          <Typography variant="h5">Account Master Setup</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
          <TableExportMenu rows={filteredAccounts} columns={exportColumns} fileName="Account_Master_Setup" />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add
          </Button>
          </Box>
        </Box>
      </Paper>

      {/* TABLE */}
      <Paper>
        {loading ? (
          <Box p={5} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* SEARCH */}
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
              />
            </Box>

            <TableContainer sx={{ maxHeight: { xs: 360, sm: 420, md: 500 }, overflow: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "ID",
                      "Type",
                      "Master Code",
                      "Code",
                      "Person Type",
                      "Transaction",
                      "Visible",
                      "Actions",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredAccounts
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.masterCode}</TableCell>
                        <TableCell>{row.code}</TableCell>

                        <TableCell>
                          {row.personType?.split(",").map((p, i) => (
                            <Chip
                              key={i}
                              label={p}
                              size="small"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </TableCell>

                        <TableCell>
                          {row.transType?.split(",").map((t, i) => (
                            <Chip
                              key={i}
                              label={t}
                              size="small"
                              color={t === "CREDIT" ? "success" : "error"}
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </TableCell>

                        <TableCell>
                          {row.visibility ? (
                            <Visibility color="success" />
                          ) : (
                            <VisibilityOff />
                          )}
                        </TableCell>

                        <TableCell>
                          <IconButton onClick={() => handleOpen(row)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* PAGINATION */}
            <TablePagination
              component="div"
              count={filteredAccounts.length} // ✅ FIXED
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </>
        )}
      </Paper>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEdit ? "Edit Account Master" : "Add Account Master"}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
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
                onChange={(e) =>
                  setForm({ ...form, masterCode: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Code"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
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

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  multiple
                  value={form.transType}
                  label="Transaction Type"
                  MenuProps={DROPDOWN_MENU_PROPS}
                  onChange={(e) =>
                    setForm({ ...form, transType: e.target.value })
                  }
                  renderValue={(selected) => selected.join(", ")}
                >
                  {TRANS_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={form.transType.includes(type)} />
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
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  {form.visibility ? "Visible" : "Hidden"}
                </Typography>
                <Switch
                  checked={form.visibility}
                  onChange={(e) =>
                    setForm({ ...form, visibility: e.target.checked })
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountMasterSetup;
