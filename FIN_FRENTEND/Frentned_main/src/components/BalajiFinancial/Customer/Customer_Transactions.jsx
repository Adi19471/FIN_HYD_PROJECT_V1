import React, { useState, useEffect, useMemo } from "react";
import { Autocomplete, Button, CircularProgress, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { errorToast, warningToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { actionIcons, navIcons } from "src/lib/icons";
import { AppDatePicker, DataTable, EmptyState, ScreenHeader, useDateRange } from "src/components/ui";

const GenerateIcon = actionIcons.generate;

// read at call time: a token read once when the file loads goes stale after a new sign-in
const authHeader = () => ({ Authorization: `Bearer ${getSession()?.token || getSession("token") || ""}` });

const formatAmount = (value) =>
  value === null || value === undefined || value === "" ? "" : Number(value || 0).toLocaleString("en-IN");

const customerLabel = (opt) =>
  `${opt.id ? opt.id + " - " : ""}${opt.firstname} ${opt.lastname} ${opt.mobile ? "- " + opt.mobile : ""}`;

// One definition drives the grid on screen and every download / print of it.
const columns = [
  { field: "sno", headerName: "S.No", width: 80, align: "right", headerAlign: "right" },
  { field: "transactionId", headerName: "Trans ID", width: 120 },
  { field: "transactionDate", headerName: "Date", width: 130, valueGetter: (value) => (value ? dayjs(value).format("DD-MMM-YYYY") : "") },
  { field: "accountNumber", headerName: "Account No", width: 150 },
  { field: "transactionName", headerName: "Transaction Name", minWidth: 190, flex: 1 },
  { field: "particulars", headerName: "Particulars", minWidth: 200, flex: 1.2 },
  { field: "credit", headerName: "Credit", width: 150, align: "right", headerAlign: "right", cellClassName: "cell-credit", valueFormatter: (value) => formatAmount(value) },
  { field: "debit", headerName: "Debit", width: 150, align: "right", headerAlign: "right", cellClassName: "cell-debit", valueFormatter: (value) => formatAmount(value) },
];

const TOTAL_FIELDS = ["credit", "debit"];
const TOTAL_LABEL_CELL = { particulars: "TOTAL" };

const CustomerTransactions = () => {
  const [masterCodes, setMasterCodes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAccountCode, setSelectedAccountCode] = useState(null);
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [dateMode, setDateMode] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  // What the rows on screen were generated for - the ledger's heading and the
  // lines printed on a download describe that, not a filter changed since.
  const [generated, setGenerated] = useState(null);

  // Fetch Master Codes (Account Names)
  const fetchMasterCodes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/account-master-droddown/findAllMasterCodes`, { headers: authHeader() });
      setMasterCodes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching master codes:", err);
    }
  };

  // Fetch Customers for Autocomplete
  const fetchCustomers = async (query = "") => {
    const searchText = query.trim();
    if (searchText.length === 1) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/autocompleteAllCategory?q=${encodeURIComponent(searchText)}`, {
        headers: authHeader(),
      });
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch Transactions
  const fetchTransactions = async () => {
    if (!selectedAccountCode || !selectedCustomer?.id) {
      warningToast("Please select both Account Name and Customer");
      return;
    }

    if (dateMode === "range" && (!fromDate || !toDate)) {
      warningToast("Please select both From and To dates");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/CustomerTransaction`,
        {
          accountCode: selectedAccountCode,
          customerId: selectedCustomer.id,
          fromDate: dateMode === "range" ? fromDate : null,
          toDate: dateMode === "range" ? toDate : null,
        },
        { headers: { ...authHeader(), "Content-Type": "application/json" } }
      );
      setTransactions(Array.isArray(res.data) ? res.data : []);
      setGenerated({
        account: selectedAccountCode,
        customer: customerLabel(selectedCustomer),
        period: dateMode === "range" ? { fromDate, toDate } : null,
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      errorToast("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterCodes();
  }, []);

  // Calculate Totals
  const totals = useMemo(() => {
    const credit = transactions.reduce((sum, t) => sum + (parseFloat(t.credit) || 0), 0);
    const debit = transactions.reduce((sum, t) => sum + (parseFloat(t.debit) || 0), 0);
    return { credit, debit, balance: credit - debit };
  }, [transactions]);

  const rows = useMemo(
    // the grid needs a unique id per row; the position in the list is always one
    () => transactions.map((row, index) => ({ ...row, id: index + 1, sno: row.sno || index + 1 })),
    [transactions]
  );

  // Credits / Debits / Balance under the grid, and on every download.
  const summary = useMemo(
    () => [
      { label: "Credits", value: totals.credit },
      { label: "Debits", value: totals.debit },
      { label: "Balance", value: totals.balance },
    ],
    [totals]
  );

  const reportMeta = useMemo(
    () =>
      generated
        ? [
            { label: "Account", value: generated.account },
            { label: "Customer", value: generated.customer },
          ]
        : [],
    [generated]
  );

  const period = useMemo(
    () => (generated?.period ? { label: "Transactions From", ...generated.period } : undefined),
    [generated]
  );

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.customerTransactions}
        title="Customer Transactions"
        subtitle="One customer's ledger under one account, for all dates or a range."
      />

      <section className="scr-card">
        <div className="scr-filters">
          <Autocomplete
            openOnFocus
            options={masterCodes}
            value={selectedAccountCode}
            onChange={(e, val) => setSelectedAccountCode(val)}
            renderInput={(params) => <TextField {...params} label="Account Name" size="small" fullWidth />}
          />
          <Autocomplete
            // a customer reads as "id - name - mobile": twice the room of the other filters
            className="scr-span-2"
            openOnFocus
            filterOptions={(x) => x}
            options={customers}
            getOptionLabel={customerLabel}
            value={selectedCustomer}
            onChange={(e, val) => setSelectedCustomer(val)}
            onOpen={() => fetchCustomers("")}
            onInputChange={(e, value) => fetchCustomers(value || "")}
            loading={searchLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer Name"
                size="small"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: searchLoading ? <CircularProgress size={20} /> : params.InputProps.endAdornment,
                }}
              />
            )}
          />
          <RadioGroup row value={dateMode} onChange={(event) => setDateMode(event.target.value)}>
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="range" control={<Radio />} label="Date Range" />
          </RadioGroup>
          <AppDatePicker label="From" value={fromDate} onChange={setFromDate} disabled={dateMode === "all"} />
          <AppDatePicker
            label="To"
            value={toDate}
            onChange={setToDate}
            disabled={dateMode === "all"}
            minDate={toDateMin}
            maxDate={toDateMax}
          />
          <Button
            variant="contained"
            onClick={fetchTransactions}
            disabled={loading || !selectedAccountCode || !selectedCustomer}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <GenerateIcon />}
          >
            Generate
          </Button>
        </div>
      </section>

      {generated ? (
        <DataTable
          title={generated.customer}
          subtitle={`Account: ${generated.account}`}
          fileName="Customer_Transactions"
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={10}
          totalFields={TOTAL_FIELDS}
          totalLabelCell={TOTAL_LABEL_CELL}
          summary={rows.length ? summary : undefined}
          reportMeta={reportMeta}
          period={period}
        />
      ) : (
        <EmptyState icon={navIcons.customerTransactions} title="No ledger generated yet">
          Choose an account and a customer above, then press Generate.
        </EmptyState>
      )}
    </div>
  );
};

export default CustomerTransactions;
