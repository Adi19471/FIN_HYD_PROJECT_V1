import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  DeleteForever as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE } from 'lib/config';
import { getSession } from 'src/utils/session';

const DeleteTransactions = () => {
  const [date, setDate] = useState('2026-01-07');
  const [showDeleted, setShowDeleted] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]); // Will store transactionId (numbers)
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = getSession("token");
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token || ""}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!date) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.get(
        `${API_BASE}/loadAllDayWiseTransactions/${date}`,
        { headers }
      );
      // Ensure we always have an array
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [date]);

  // Client-side filtering
  const filteredTransactions = transactions.filter((tx) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      tx.name?.toLowerCase().includes(searchLower) ||
      tx.transactionId?.toString().includes(search) ||
      tx.accountNumber?.toLowerCase().includes(searchLower) ||
      tx.transactionType?.toLowerCase().includes(searchLower) ||
      tx.particulars?.toLowerCase().includes(searchLower);

    // If backend doesn't send 'deleted' flag, assume all are active
    // Or add it later when backend supports soft delete
    const isDeleted = tx.deleted || false;
    const matchesDeleted = showDeleted || !isDeleted;

    return matchesSearch && matchesDeleted;
  });

  // Selection handlers - using transactionId as unique key
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredTransactions
        .filter((tx) => !(tx.deleted || false)) // not deleted
        .map((tx) => tx.transactionId);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (transactionId) => {
    setSelected((prev) => {
      if (prev.includes(transactionId)) {
        return prev.filter((id) => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  const isSelected = (transactionId) => selected.includes(transactionId);

  // Delete handler
  const handleDelete = async () => {
    if (selected.length === 0) {
      setError('Please select at least one transaction');
      return;
    }
    if (!comments.trim()) {
      setError('Comments are required for deletion');
      return;
    }

    if (!window.confirm(`Delete ${selected.length} selected transaction(s)?`)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `${API_BASE}/deleteCashBookRecords`,
        {
          transactionId: selected, // Already numbers, no need to map again
          comments: comments.trim(),
        },
        { headers }
      );

      setSuccess(`Successfully deleted ${selected.length} transaction(s).`);
      setSelected([]);
      setComments('');
      fetchTransactions(); // Refresh data
    } catch (err) {
      setError('Failed to delete transactions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Delete Transactions
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end' }}>
          <TextField
            label="Transaction Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ViewIcon />}
              onClick={fetchTransactions}
              disabled={loading}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={selected.length === 0 || loading}
            >
              Delete ({selected.length})
            </Button>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
              />
            }
            label="Show Deleted Transactions"
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, account, type..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Comments (Required for Deletion)"
            multiline
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter reason for deletion..."
            error={!!error && error.includes('Comments')}
            helperText={error.includes('Comments') ? error : ''}
          />
        </Box>
      </Paper>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={2}>
        {loading ? (
          <Box sx={{ p: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < filteredTransactions.filter(t => !(t.deleted || false)).length
                        }
                        checked={
                          filteredTransactions.length > 0 &&
                          selected.length === filteredTransactions.filter(t => !(t.deleted || false)).length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell><strong>Trans ID</strong></TableCell>
                    <TableCell><strong>Account No</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Trans Type</strong></TableCell>
                    <TableCell><strong>Particulars</strong></TableCell>
                    <TableCell align="right"><strong>Credit</strong></TableCell>
                    <TableCell align="right"><strong>Debit</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isItemSelected = isSelected(row.transactionId);

                      return (
                        <TableRow
                          key={row.transactionId}
                          hover
                          selected={isItemSelected}
                          sx={{
                            opacity: row.deleted ? 0.6 : 1,
                            textDecoration: row.deleted ? 'line-through' : 'none',
                            bgcolor: row.deleted ? 'action.disabledBackground' : 'inherit',
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={() => handleSelect(row.transactionId)}
                              disabled={!!row.deleted || loading}
                            />
                          </TableCell>
                          <TableCell>{row.transactionId}</TableCell>
                          <TableCell>{row.accountNumber}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.transactionType}</TableCell>
                          <TableCell>{row.particulars}</TableCell>
                          <TableCell align="right">
                            {row.credit > 0 ? row.credit.toLocaleString('en-IN') : '-'}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'medium', color: 'error.main' }}>
                            {row.debit > 0 ? row.debit.toLocaleString('en-IN') : '-'}
                          </TableCell>
                          <TableCell>
                            {row.deleted ? (
                              <Chip label="Deleted" color="error" size="small" />
                            ) : (
                              <Chip label="Active" color="success" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </Paper>

      {!loading && filteredTransactions.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No transactions found for the selected date.
        </Alert>
      )}
    </Box>
  );
};

export default DeleteTransactions;