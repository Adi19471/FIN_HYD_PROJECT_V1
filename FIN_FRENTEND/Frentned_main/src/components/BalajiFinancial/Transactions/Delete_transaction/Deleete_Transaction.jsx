import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Paper, TextField, Button, Checkbox, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, InputAdornment, Alert, CircularProgress, Chip, Grid,
} from '@mui/material';
import {
  DeleteForever as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE } from 'lib/config';
import { getSession } from 'src/utils/session';
import { AppDatePicker } from 'src/components/ui';

const DeleteTransactions = () => {
  const [date, setDate] = useState('2026-01-07');
  const [showDeleted, setShowDeleted] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGroups, setSelectedGroups] = useState(new Set());
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const token = getSession("token");
  const headers = useMemo(() => ({
    Authorization: `Bearer ${token || ""}`,
    'Content-Type': 'application/json',
  }), [token]);

  const fetchTransactions = async () => {
    if (!date) return;
    setLoading(true);
    setError('');
    setSuccess('');
    setSelectedGroups(new Set());

    try {
      const endpoint = showDeleted
        ? `${API_BASE}/loadAllDayWiseDeletedTransactions/${date}`
        : `${API_BASE}/loadAllDayWiseTransactions/${date}`;

      const res = await axios.get(endpoint, { headers });
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load transactions.');
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [date, showDeleted]);

  // Group transactions by paymentRefId
  const groupedData = useMemo(() => {
    const groups = {};
    transactions.forEach(tx => {
      const key = tx.paymentRefId || `single-${tx.transactionId}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return groups;
  }, [transactions]);

  // Prepare flat rows with group info
  const tableRows = useMemo(() => {
    const rows = [];
    Object.keys(groupedData).forEach(key => {
      const group = groupedData[key];
      group.forEach((tx, index) => {
        rows.push({
          ...tx,
          groupKey: key,
          isFirstInGroup: index === 0,
          groupSize: group.length,
        });
      });
    });
    return rows.sort((a, b) => a.groupKey.localeCompare(b.groupKey));
  }, [groupedData]);

  const filteredRows = tableRows.filter(row =>
    (row.name?.toLowerCase().includes(search.toLowerCase())) ||
    row.transactionId?.toString().includes(search) ||
    (row.accountNumber?.toLowerCase().includes(search.toLowerCase())) ||
    (row.transactionType?.toLowerCase().includes(search.toLowerCase())) ||
    (row.particulars?.toLowerCase().includes(search.toLowerCase()))
  );

  // Check if a group is selected
  const isGroupSelected = (groupKey) => selectedGroups.has(groupKey);

  const handleGroupSelect = (groupKey) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const uniqueGroups = [...new Set(filteredRows.map(r => r.groupKey))];
      setSelectedGroups(new Set(uniqueGroups));
    } else {
      setSelectedGroups(new Set());
    }
  };

  const getAllSelectedTransactionIds = () => {
    return tableRows
      .filter(row => selectedGroups.has(row.groupKey))
      .map(row => row.transactionId);
  };

  const handleDelete = async () => {
    const selectedIds = getAllSelectedTransactionIds();
    if (selectedIds.length === 0) return setError('Please select at least one group');
    if (!comments.trim()) return setError('Comments are required for deletion');

    if (!window.confirm(`Delete ${selectedIds.length} transaction(s) from ${selectedGroups.size} group(s)?`)) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/deleteCashBookRecords`, {
        transactionId: selectedIds,
        comments: comments.trim(),
      }, { headers });

      setSuccess(`Successfully deleted ${selectedIds.length} transaction(s).`);
      setSelectedGroups(new Set());
      setComments('');
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transactions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <Box sx={{ width: 210 }}>
          <AppDatePicker label="Transaction Date" value={date} onChange={setDate} />
        </Box>

        <FormControlLabel control={<Checkbox checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />} label="Show Deleted Transactions" />

        <Button variant="contained" startIcon={<ViewIcon />} onClick={fetchTransactions} disabled={loading}>Refresh</Button>

        {!showDeleted && (
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} disabled={selectedGroups.size === 0 || loading}>
            Delete ({getAllSelectedTransactionIds().length})
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." InputProps={{ startAdornment: <SearchIcon /> }} />
        </Grid>
        {!showDeleted && (
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Comments (Required)" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Reason for deletion" />
          </Grid>
        )}
      </Grid>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3}>
        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {!showDeleted && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedGroups.size > 0 && selectedGroups.size < new Set(filteredRows.map(r => r.groupKey)).size}
                      checked={selectedGroups.size === new Set(filteredRows.map(r => r.groupKey)).size && selectedGroups.size > 0}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                <TableCell><strong>Trans ID</strong></TableCell>
                <TableCell><strong>Payment Ref ID</strong></TableCell>
                <TableCell><strong>Account No</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Trans Type</strong></TableCell>
                <TableCell><strong>Particulars</strong></TableCell>
                <TableCell align="right"><strong>Credit</strong></TableCell>
                <TableCell align="right"><strong>Debit</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                {showDeleted && (
                  <>
                    <TableCell>Deleted On</TableCell>
                    <TableCell>Deleted By</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const groupSelected = isGroupSelected(row.groupKey);   // ← Fixed here
                const isDeleted = !!row.deleted;
                const showCheckbox = row.isFirstInGroup;

                return (
                  <TableRow
                    key={row.transactionId}
                    hover={!isDeleted}
                    sx={{
                      bgcolor: groupSelected ? 'action.selected' : (isDeleted ? 'action.disabledBackground' : 'inherit'),
                      borderLeft: row.isFirstInGroup ? '4px solid #1976d2' : 'none',
                    }}
                  >
                    {!showDeleted && (
                      <TableCell padding="checkbox">
                        {showCheckbox && (
                          <Checkbox
                            checked={groupSelected}
                            onChange={() => handleGroupSelect(row.groupKey)}
                            disabled={isDeleted}
                          />
                        )}
                      </TableCell>
                    )}

                    <TableCell>{row.transactionId}</TableCell>
                    <TableCell>
                      {row.paymentRefId || '-'}
                      {row.groupSize > 1 && <Chip size="small" label={row.groupSize} sx={{ ml: 1 }} />}
                    </TableCell>
                    <TableCell>{row.accountNumber}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.transactionType}</TableCell>
                    <TableCell>{row.particulars}</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      {row.credit > 0 ? `₹${Number(row.credit).toLocaleString('en-IN')}` : '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'error.main' }}>
                      {row.debit > 0 ? `₹${Number(row.debit).toLocaleString('en-IN')}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip label={isDeleted ? 'Deleted' : 'Active'} color={isDeleted ? 'error' : 'success'} size="small" />
                    </TableCell>
                    {showDeleted && (
                      <>
                        <TableCell>{row.deletedDate || '-'}</TableCell>
                        <TableCell>{row.deletedByUser || '-'}</TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 15, 25, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>
    </Box>
  );
};

export default DeleteTransactions;
