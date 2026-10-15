import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Alert, Autocomplete, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { navIcons } from "src/lib/icons";
import { DataTable, EmptyState, ScreenHeader, formatReportDate } from "src/components/ui";

// Dates arrive as ISO strings; the reports print them the house way.
const formatDate = (value) => (value ? formatReportDate(value) : "");

// Printed money carries separators. Excel is unaffected - it exports the raw
// number so the columns stay summable.
const formatMoney = (value) =>
  value === null || value === undefined || value === ""
    ? ""
    : Number(value).toLocaleString("en-IN");

// One definition drives the grid on screen and every download / print of it.
const columns = [
  { field: "sNo", headerName: "S.No", width: 70, align: "right", headerAlign: "right" },
  { field: "loanId", headerName: "Loan ID", width: 120 },
  { field: "customerName", headerName: "Customer Name", minWidth: 180, flex: 1 },
  { field: "guarentorName", headerName: "Guarantor Name", minWidth: 170, flex: 1 },
  { field: "partnerName", headerName: "Partner Name", minWidth: 150, flex: 0.8 },
  { field: "startDate", headerName: "Start Date", width: 115, align: "center", headerAlign: "center", valueGetter: (value) => formatDate(value) },
  { field: "endDate", headerName: "End Date", width: 115, align: "center", headerAlign: "center", valueGetter: (value) => formatDate(value) },
  { field: "amount", headerName: "Loan Amount", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatMoney(value) },
  { field: "totalInstallmentAmountPaid", headerName: "Installment Paid", width: 145, align: "right", headerAlign: "right", valueFormatter: (value) => formatMoney(value) },
  { field: "installmentAmountPending", headerName: "Installment Due", width: 140, align: "right", headerAlign: "right", cellClassName: "cell-due", valueFormatter: (value) => formatMoney(value) },
  { field: "dueDate", headerName: "Due Date", width: 115, align: "center", headerAlign: "center", valueGetter: (value) => formatDate(value) },
  { field: "remarks", headerName: "Remarks", minWidth: 140, flex: 0.8 },
];

const TOTAL_FIELDS = ["amount", "totalInstallmentAmountPaid", "installmentAmountPending"];
const TOTAL_LABEL_CELL = { partnerName: "TOTAL" };

const Customer_Dues = () => {
  const [customerInput, setCustomerInput] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [options, setOptions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [duesData, setDuesData] = useState([]);
  const [loadingDues, setLoadingDues] = useState(false);
  const [error, setError] = useState(null);

  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Search function (no minimum 2 letters)
  const searchMembers = useCallback(
    async (query = "") => {
      setLoadingSearch(true);
      try {
        const res = await axios.get(`${API_BASE}/PersonalInfo/autocomplete`, {
          headers,
          params: { q: query.trim() },
        });

        const list = (Array.isArray(res.data) ? res.data : []).map((item) => ({
          id: item.id,
          label: `${item.id || ""} ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"}`,
          original: item,
        }));

        setOptions(list);
      } catch (err) {
        console.error("Search failed:", err);
        setOptions([]);
      } finally {
        setLoadingSearch(false);
      }
    },
    [headers]
  );

  // Debounced search + load on focus
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMembers(customerInput);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [customerInput, searchMembers]);

  const fetchCustomerDues = useCallback(async (custId) => {
    if (!custId) return;

    setLoadingDues(true);
    setError(null);
    setDuesData([]); // Clear old data to avoid flash of old content

    try {
      const response = await axios.get(
        `${API_BASE}/customerDues/${custId}`,
        { headers }
      );
      setDuesData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Dues fetch error:", err);
      setError("Failed to load customer dues.");
      setDuesData([]);
    } finally {
      setLoadingDues(false);
    }
  }, [headers]);

  const handleCustomerSelect = (event, newValue) => {
    setSelectedCustomer(newValue);
    if (newValue?.id) {
      setCustomerInput(newValue.label);
      fetchCustomerDues(newValue.id);
    } else {
      setDuesData([]);
    }
  };

  // The serial number is a report column, not an API field, so it is numbered here.
  const rows = useMemo(
    // the grid needs a unique id per row; the position in the list is always one
    () => duesData.map((row, index) => ({ ...row, id: index + 1, sNo: index + 1 })),
    [duesData]
  );

  // The customer line printed under the date on every download.
  const reportMeta = useMemo(
    () => (selectedCustomer?.label ? [{ label: "Customer", value: selectedCustomer.label }] : []),
    [selectedCustomer]
  );

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.customerDues}
        title="Customer Dues"
        subtitle="What a customer still owes, loan by loan."
      />

      <section className="scr-card">
        <div className="scr-toolbar">
          <div className="scr-grow scr-search">
            <Autocomplete
              openOnFocus
              freeSolo
              options={options}
              loading={loadingSearch}
              value={selectedCustomer}
              inputValue={customerInput}
              onInputChange={(e, newValue) => setCustomerInput(newValue)}
              onChange={handleCustomerSelect}
              onOpen={() => searchMembers("")} // Show list immediately on click
              getOptionLabel={(option) => (typeof option === "string" ? option : option.label || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Customer"
                  placeholder="Type customer name or ID"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingSearch && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => <li {...props}>{option.label}</li>}
              filterOptions={(x) => x}
            />
          </div>
          <Button
            variant="contained"
            size="large"
            onClick={() => selectedCustomer?.id && fetchCustomerDues(selectedCustomer.id)}
            disabled={loadingDues || !selectedCustomer}
          >
            Show Dues
          </Button>
        </div>
      </section>

      {error && <Alert severity="error">{error}</Alert>}

      {selectedCustomer?.id ? (
        <DataTable
          title="Customer Dues"
          subtitle={`Customer: ${selectedCustomer.label}`}
          fileName="Customer_Dues"
          rows={rows}
          columns={columns}
          loading={loadingDues}
          pageSize={10}
          totalFields={TOTAL_FIELDS}
          totalLabelCell={TOTAL_LABEL_CELL}
          reportMeta={reportMeta}
        />
      ) : (
        <EmptyState icon={navIcons.customerDues} title="No customer selected">
          Search for a customer above to see their loans, what has been paid and what is due.
        </EmptyState>
      )}
    </div>
  );
};

export default Customer_Dues;
