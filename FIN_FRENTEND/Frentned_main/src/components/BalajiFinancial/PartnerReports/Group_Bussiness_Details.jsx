import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast } from "toastify";
import {
  AppDatePicker,
  DataTable,
  ReportToolbar,
  useReportZoom,
  useDateRange,
} from "src/components/ui";
import { navIcons } from "src/lib/icons";

// Whole rupees - no decimal point on any figure in this report.
const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// Shares are held in halves, so 0.5 keeps its decimal while a whole share
// prints as "1", not "1.0".
const formatDecimal = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// Every figure the ledger adds up, totalled under its own column. The caption
// sits in the Name cell, right before the numbers start.
const TOTAL_FIELDS = [
  "noOfShares",
  "capital",
  "balanceOutStandingWithInterest",
  "balanceOutStandingWithOutInterest",
  "installmentDuesOutStanding",
];
const TOTAL_LABEL_CELL = { name: "TOTAL" };

const GroupBusinessDetails = () => {
  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const zoom = useReportZoom();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [balancesOnly, setBalancesOnly] = useState(false);
  // Partner group (the group's manager) - searched from the partner master.
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partnerInput, setPartnerInput] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchTimer = useRef(null);
  const searchSeq = useRef(0);
  // What the rows on screen were generated for. It is printed on every
  // download, so the page still says which filters produced it after one is
  // changed on screen.
  const [applied, setApplied] = useState(null);
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange(
    dayjs().startOf("year").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  );

  const searchPartners = useCallback(async (searchText = "") => {
    // Only the latest search may fill the list - a slow earlier reply must not
    // overwrite the results for what is typed now.
    const seq = ++searchSeq.current;
    setLoadingSearch(true);
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`,
        {
          headers,
          params: { q: searchText.trim() }, // maps to @RequestParam String q
        }
      );
      if (seq !== searchSeq.current) return;

      const list = (res.data || []).map((item) => ({
        id: item.id,
        name: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
        label: `${item.id || ""} ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"
          }`,
      }));

      setPartnerOptions(list);
    } catch (err) {
      if (seq !== searchSeq.current) return;
      errorToast("Search failed");
      setPartnerOptions([]);
    } finally {
      if (seq === searchSeq.current) setLoadingSearch(false);
    }
  }, [headers]);

  const handlePartnerInput = (_, value, reason) => {
    setPartnerInput(value);
    // Only typing (or clearing) is a search. Picking an option writes its label
    // into the box ("selectOption" / "reset"), and blur restores it.
    if (reason !== "input" && reason !== "clear") return;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => searchPartners(value), 300);
  };

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const fetchReport = async () => {
    if (!selectedPartner?.id) {
      errorToast("Please select a partner group");
      return;
    }
    const managerId = selectedPartner.id;
    try {
      setLoading(true);
      const url = dateFilter
        ? `${API_BASE}/group-business-details/${managerId}/${fromDate}/${toDate}`
        : `${API_BASE}/group-business-details/${managerId}`;

      const response = await axios.get(url, { headers });
      let data = response?.data || [];

      if (balancesOnly) {
        data = data.filter((item) => Number(item.balanceOutStandingWithInterest || 0) > 0);
      }

      setRows(
        data.map((row, index) => ({
          id: row.partnerId || index + 1,
          sno: index + 1,
          ...row,
        }))
      );
      setApplied({
        ...(dateFilter ? { fromDate, toDate } : {}),
        balancesOnly,
        group: selectedPartner.name ? `${managerId} - ${selectedPartner.name}` : managerId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, item) => {
        acc.shares += Number(item.noOfShares || 0);
        acc.capital += Number(item.capital || 0);
        acc.balanceWithInterest += Number(item.balanceOutStandingWithInterest || 0);
        acc.balanceWithoutInterest += Number(item.balanceOutStandingWithOutInterest || 0);
        acc.installmentDues += Number(item.installmentDuesOutStanding || 0);
        return acc;
      },
      {
        shares: 0,
        capital: 0,
        balanceWithInterest: 0,
        balanceWithoutInterest: 0,
        installmentDues: 0,
      }
    );
  }, [rows]);

  const columns = [
    { field: "sno", headerName: "S.No", width: 80, align: "center", headerAlign: "center" },
    { field: "partnerId", headerName: "Partner ID", width: 130 },
    { field: "name", headerName: "Name", minWidth: 240, flex: 1 },
    { field: "noOfShares", headerName: "Shares", width: 120, align: "right", headerAlign: "right", valueFormatter: (value) => formatDecimal(value) },
    { field: "capital", headerName: "Capital", width: 150, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "balanceOutStandingWithInterest", headerName: "Balance O/S With Int.", width: 210, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "balanceOutStandingWithOutInterest", headerName: "Balance O/S Without Int.", width: 230, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "installmentDuesOutStanding", headerName: "Installment Dues O/S", width: 210, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
  ];

  const period = useMemo(
    () =>
      applied?.fromDate
        ? { label: "Group Business Period", fromDate: applied.fromDate, toDate: applied.toDate }
        : undefined,
    [applied]
  );
  const reportMeta = useMemo(
    () =>
      applied
        ? [
            { label: "Group", value: applied.group },
            ...(applied.fromDate ? [] : [{ label: "Period", value: "All Dates" }]),
            ...(applied.balancesOnly ? [{ label: "Showing", value: "Partners with a balance only" }] : []),
          ]
        : [],
    [applied]
  );

  const totalRows = [
    { label: "Shares", value: formatDecimal(totals.shares) },
    { label: "Capital", value: formatAmount(totals.capital) },
    { label: "Balance O/S With Int.", value: formatAmount(totals.balanceWithInterest) },
    { label: "Balance O/S Without Int.", value: formatAmount(totals.balanceWithoutInterest) },
    { label: "Installment Dues O/S", value: formatAmount(totals.installmentDues) },
  ];

  return (
    <Stack spacing={2.5}>
      <ReportToolbar
        icon={navIcons.groupBusinessDetails}
        title="Group Business Details"
        subtitle="The partners in one group and their business."
        onRefresh={fetchReport}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Group-Business-Details"
        zoom={zoom}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Autocomplete
              openOnFocus
              fullWidth
              size="small"
              options={partnerOptions}
              value={selectedPartner}
              inputValue={partnerInput}
              onChange={(_, option) => setSelectedPartner(option)}
              onInputChange={handlePartnerInput}
              onOpen={() => searchPartners("")}
              loading={loadingSearch}
              filterOptions={(x) => x} // server-side filtering
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText={loadingSearch ? "Searching…" : "No partners found"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Partner Group"
                  placeholder="Search partner"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingSearch && <CircularProgress size={16} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <FormControlLabel control={<Checkbox checked={dateFilter} onChange={(event) => setDateFilter(event.target.checked)} />} label="Date Range" />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <AppDatePicker label="From" value={fromDate} disabled={!dateFilter} onChange={setFromDate} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <AppDatePicker label="To" value={toDate} disabled={!dateFilter} onChange={setToDate} minDate={toDateMin} maxDate={toDateMax} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <FormControlLabel control={<Checkbox checked={balancesOnly} onChange={(event) => setBalancesOnly(event.target.checked)} />} label="Balances only" />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 1
            }}>
            <Button fullWidth variant="contained" onClick={fetchReport} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box ref={zoom.targetRef} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        fileName="Group-Business-Details"
        subtitle={`${applied?.group || "Selected partner group"} / ${dayjs().format("DD-MMM-YYYY")}`}
        period={period}
        reportMeta={reportMeta}
        totalFields={TOTAL_FIELDS}
        totalLabelCell={TOTAL_LABEL_CELL}
        height={640}
        pageSize={25}
      />

      <DataTable
        rows={totalRows.map((row, index) => ({ id: index + 1, ...row }))}
        columns={[
          { field: "label", headerName: "Total Field", flex: 1, minWidth: 220 },
          { field: "value", headerName: "Total Value", flex: 1, minWidth: 180, align: "right", headerAlign: "right" },
        ]}
        title="Total Summary"
        subtitle={`${rows.length} records included in totals`}
        height={380}
        pageSize={25}
        hideFooter
        showExport={false}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
      </Box>
    </Stack>
  );
};

export default GroupBusinessDetails;
