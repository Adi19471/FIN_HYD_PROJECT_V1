import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField, Button, Checkbox,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, InputAdornment, Alert, Chip, LinearProgress,
} from '@mui/material';
import { DeleteForever as DeleteIcon } from "@mui/icons-material";
import { actionIcons, navIcons } from "src/lib/icons";
import axios from 'axios';
import { API_BASE } from 'lib/config';
import { getSession } from 'src/utils/session';
import { AppDatePicker, EmptyState, ScreenHeader } from 'src/components/ui';

const SearchIcon = actionIcons.search;
const RefreshIcon = actionIcons.refresh;

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

  const selectedCount = getAllSelectedTransactionIds().length;
  const groupCount = new Set(filteredRows.map(r => r.groupKey)).size;

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.deleteTransaction}
        tone="danger"
        title="Delete Transaction"
        subtitle="Pick the day, tick the entries and give a reason. Entries posted together are deleted together."
      >
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchTransactions} disabled={loading}>
          Refresh
        </Button>
      </ScreenHeader>

      <section className="scr-card scr-card-flush">
        {/* which day, live entries or already-deleted ones, and a search */}
        <div className="scr-toolbar scr-pad">
          <div className="scr-toolbar-date">
            <AppDatePicker label="Transaction Date" value={date} onChange={setDate} />
          </div>
          <div className="scr-seg" role="group" aria-label="Which transactions to show">
            <button type="button" aria-pressed={!showDeleted} onClick={() => setShowDeleted(false)}>
              Active
            </button>
            <button type="button" aria-pressed={showDeleted} onClick={() => setShowDeleted(true)}>
              Deleted
            </button>
          </div>
          <TextField
            className="scr-grow"
            size="small"
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, account, type, particulars..."
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
        </div>

        {/* the reason and the button sit together: one cannot be used without the other */}
        {!showDeleted && (
          <div className="scr-danger-bar scr-pad">
            <TextField
              className="scr-grow"
              size="small"
              label="Comments (Required)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Reason for deletion"
            />
            <span className="scr-selected">
              {selectedCount
                ? `${selectedCount} transaction${selectedCount === 1 ? "" : "s"} in ${selectedGroups.size} group${selectedGroups.size === 1 ? "" : "s"} selected`
                : "Nothing selected"}
            </span>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={selectedGroups.size === 0 || loading}
            >
              Delete ({selectedCount})
            </Button>
          </div>
        )}

        {(success || error) && (
          <div className="scr-pad" style={{ paddingTop: 0 }}>
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error" sx={{ mt: success ? 1 : 0 }}>{error}</Alert>}
          </div>
        )}

        {loading && <LinearProgress />}

        {!loading && filteredRows.length === 0 ? (
          <div className="scr-pad">
            <EmptyState icon={navIcons.deleteTransaction} title={showDeleted ? "No deleted transactions" : "No transactions"}>
              {search
                ? "Nothing on this day matches the search."
                : showDeleted
                ? "Nothing has been deleted on this day."
                : "Nothing was posted on this day. Pick another date above."}
            </EmptyState>
          </div>
        ) : (
          <TableContainer sx={{ maxHeight: { xs: 420, sm: 520, md: 620, lg: 700 }, overflow: "auto" }}>
            <Table stickyHeader size="small" className="scr-table">
              <TableHead>
                <TableRow>
                  {!showDeleted && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedGroups.size > 0 && selectedGroups.size < groupCount}
                        checked={selectedGroups.size === groupCount && selectedGroups.size > 0}
                        onChange={handleSelectAll}
                        inputProps={{ "aria-label": "Select every entry" }}
                      />
                    </TableCell>
                  )}
                  <TableCell>Trans ID</TableCell>
                  <TableCell>Payment Ref ID</TableCell>
                  <TableCell>Account No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Trans Type</TableCell>
                  <TableCell>Particulars</TableCell>
                  <TableCell align="right">Credit</TableCell>
                  <TableCell align="right">Debit</TableCell>
                  <TableCell>Status</TableCell>
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
                  const groupSelected = isGroupSelected(row.groupKey);
                  const isDeleted = !!row.deleted;
                  const showCheckbox = row.isFirstInGroup;

                  return (
                    <TableRow
                      key={row.transactionId}
                      hover={!isDeleted}
                      className={row.isFirstInGroup ? "scr-group-start" : ""}
                      sx={{
                        bgcolor: groupSelected ? 'action.selected' : (isDeleted ? 'action.disabledBackground' : 'inherit'),
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
        )}

        <TablePagination
          rowsPerPageOptions={[10, 15, 25, 50]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </section>
    </div>
  );
};

export default DeleteTransactions;
