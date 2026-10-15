import React, { useState, useEffect, useMemo } from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { actionIcons, navIcons } from "src/lib/icons";
import { AppDatePicker, DataTable, ScreenHeader } from "src/components/ui";

const GenerateIcon = actionIcons.generate;

const formatMoney = (value) =>
  value === null || value === undefined || value === "" ? "" : Number(value).toLocaleString("en-IN");

// One definition drives the grid on screen and every download / print of it.
const columns = [
  { field: "sNo", headerName: "S.No", width: 80, align: "right", headerAlign: "right" },
  { field: "customerId", headerName: "Customer ID", width: 130 },
  { field: "customerName", headerName: "Customer Name", minWidth: 200, flex: 1 },
  { field: "noOfLoans", headerName: "Loans", width: 100, align: "center", headerAlign: "center" },
  { field: "totalLoansAmount", headerName: "Total Loans Amount", width: 165, align: "right", headerAlign: "right", valueFormatter: (value) => formatMoney(value) },
  { field: "totalPaidAmount", headerName: "Total Paid Amount", width: 155, align: "right", headerAlign: "right", valueFormatter: (value) => formatMoney(value) },
  { field: "balanceOutstanding", headerName: "Balance Outstanding", width: 170, align: "right", headerAlign: "right", cellClassName: "cell-due", valueFormatter: (value) => formatMoney(value) },
  { field: "dueDateOutstanding", headerName: "Due Date Outstanding", width: 175, align: "right", headerAlign: "right", valueFormatter: (value) => formatMoney(value) },
];

const TOTAL_FIELDS = ["noOfLoans", "totalLoansAmount", "totalPaidAmount", "balanceOutstanding", "dueDateOutstanding"];
const TOTAL_LABEL_CELL = { customerName: "TOTAL" };

const CustomerOutstanding = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs("2026-04-08"));
  const [mfChecked, setMfChecked] = useState(true);
  const [dfChecked, setDfChecked] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOutstanding = async () => {
    setLoading(true);
    try {
      // read at call time: a token read once when the file loads goes stale after a new sign-in
      const token = getSession()?.token || getSession("token") || "";
      const response = await axios.post(
        `${API_BASE}/customerOutstanding`,
        {
          selectedDate: selectedDate.format("YYYY-MM-DD"),
          loadMonthlyFinanceTransactions: mfChecked,
          loadDailyFinanceTransactions: dfChecked,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching customer outstanding:", error);
      errorToast("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutstanding();
  }, [selectedDate, mfChecked, dfChecked]);

  // the grid needs a unique id per row; the position in the list is always one
  const rows = useMemo(() => data.map((row, index) => ({ ...row, id: index + 1, sNo: row.sNo ?? index + 1 })), [data]);

  const loanTypes = `${mfChecked ? "MF" : ""}${mfChecked && dfChecked ? " and " : ""}${dfChecked ? "DF" : ""} Loans`;
  const reportMeta = useMemo(
    () => [
      { label: "As on", value: selectedDate.format("DD-MMM-YYYY") },
      { label: "Loans", value: loanTypes },
    ],
    [selectedDate, loanTypes]
  );

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.customerOutstanding}
        title="Customer Outstanding"
        subtitle="Loans, amount paid and balance for every customer, as on a date."
      />

      <section className="scr-card">
        <div className="scr-toolbar">
          <div className="scr-toolbar-date">
            <AppDatePicker label="Date" value={selectedDate} onChange={(value) => setSelectedDate(dayjs(value))} />
          </div>
          <FormControlLabel
            control={<Checkbox checked={mfChecked} onChange={(e) => setMfChecked(e.target.checked)} />}
            label="MF"
          />
          <FormControlLabel
            control={<Checkbox checked={dfChecked} onChange={(e) => setDfChecked(e.target.checked)} />}
            label="DF"
          />
          <Button variant="contained" startIcon={<GenerateIcon />} onClick={fetchOutstanding} disabled={loading}>
            Generate
          </Button>
        </div>
      </section>

      <DataTable
        title={`Customer Outstanding As On ${selectedDate.format("DD-MMM-YYYY")}`}
        subtitle={loanTypes}
        fileName="Customer_Outstanding"
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={10}
        totalFields={TOTAL_FIELDS}
        totalLabelCell={TOTAL_LABEL_CELL}
        reportMeta={reportMeta}
      />
    </div>
  );
};

export default CustomerOutstanding;
