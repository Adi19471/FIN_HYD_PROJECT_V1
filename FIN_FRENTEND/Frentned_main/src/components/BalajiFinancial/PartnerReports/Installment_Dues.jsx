import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { actionIcons, navIcons } from "src/lib/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { useThemeProvider } from "src/utils/ThemeContext";
import { errorToast } from "toastify";
import {
  DataTable,
  isTotalRow,
  
  printReport,
  ReportToolbar,
  TableExportMenu,
  useReportZoom,
} from "src/components/ui";

const PrintRounded = actionIcons.print;
const ExpandMoreRounded = actionIcons.expand;

// Whole rupees - no decimal point on the printed report.
const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// Passes unparseable text straight through so the TOTAL caption sitting in the
// End Date cell prints as "TOTAL" instead of "Invalid Date".
const formatDate = (value) => {
  if (!value) return "-";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD-MMM-YYYY") : String(value);
};

// The money columns the old dues ledger totals at the foot of the report.
const TOTAL_FIELDS = ["amount", "totalAmountPaid", "balanceAmount", "installmentDue", "lateFee"];

// TOTAL caption sits in the Start/End Date cell, immediately before the Amount
// column, exactly where the old report puts it.
const TOTAL_LABEL_CELL = { startDate: "TOTAL" };

// Installments covered by the outstanding due, e.g. 13,800 due / 13,800 per
// installment = 1 - the figure the old report prints under Inst. Dues.
const duesCount = (row) => {
  const perInstallment = Number(row.installmentAmount || 0);
  if (!perInstallment) return 0;
  return Math.round(Number(row.installmentDue || 0) / perInstallment);
};

// The old report prints one table per loan type: DF first, then MF. loanType
// arrives as DAILY_FINANCE / MONTHLY_FINANCE; the loan id prefix (DF26-001 /
// MF25-003) is the fallback when it comes back blank.
const sectionOf = (row) => {
  const type = String(row.loanType || "").toUpperCase();
  if (type.includes("DAILY")) return "DF";
  if (type.includes("MONTHLY")) return "MF";
  return String(row.loanId || "").toUpperCase().startsWith("DF") ? "DF" : "MF";
};

const SECTIONS = [
  { key: "DF", title: "DF - Installment Dues", subtitle: "Daily Finance" },
  { key: "MF", title: "MF - Installment Dues", subtitle: "Monthly Finance" },
];

const sumTotals = (rows) =>
  TOTAL_FIELDS.reduce((acc, field) => {
    acc[field] = rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);
    return acc;
  }, {});

// One table per loan type, each with its own S.No sequence starting at 1 -
// for the whole report, or for one partner's loans when grouped.
const splitByLoanType = (rows) => {
  const grouped = { DF: [], MF: [] };
  rows.forEach((row) => grouped[sectionOf(row)].push(row));

  return SECTIONS.map((section) => ({
    ...section,
    rows: grouped[section.key].map((row, index) => ({ ...row, sno: index + 1 })),
  })).filter((section) => section.rows.length > 0);
};

// The partner a loan is booked under. The dues query returns the partner's
// first name only, so that is what the old ledger's partner heading groups on.
const partnerOf = (row) => String(row.partnerName || "").trim() || "No Partner";

// A section as the download prints it: a DF / MF band, the loans, and that
// section's TOTAL. `prefix` keeps the band ids unique across partners.
const sectionExportRows = (section, prefix = "") => [
  { id: `${prefix}${section.key}-band`, __isTotal: true, __band: true, loanId: section.key, customerName: section.subtitle },
  ...section.rows,
  { id: `${prefix}${section.key}-total`, __isTotal: true, startDate: `${section.key} TOTAL`, ...sumTotals(section.rows) },
];

// Rendered sizes per Settings > Table density, at this screen's rowHeight of
// 58 - used to size each partner's tables to their rows. `chrome` is the
// title, toolbar, column heading, pager and scrollbar around the rows (the
// heading grows with density), with a few px of headroom.
const TABLE_PX = {
  compact: { row: 40, chrome: 264 },
  standard: { row: 58, chrome: 275 },
  spacious: { row: 75, chrome: 298 },
};
const GROUP_PAGE_SIZE = 25;

// Days the installment is past due, floored at 0 - the "(3)" under Due Date.
const daysOverdue = (value) => {
  if (!value) return 0;
  const due = dayjs(value);
  if (!due.isValid()) return 0;
  return Math.max(0, dayjs().startOf("day").diff(due.startOf("day"), "day"));
};

// The old ledger prints two figures per cell, the second under the first.
const TwoLine = ({ top, bottom, align = "left" }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      textAlign: align,
      lineHeight: 1.3,
    }}
  >
    <Box sx={{ fontSize: 13 }}>{top}</Box>
    <Box sx={{ fontSize: 12, color: "text.secondary" }}>{bottom}</Box>
  </Box>
);

/**
 * One of the old ledger's paired columns. `field` stays the underlying money /
 * date field so the grid's TOTAL row and the exports keep working on real
 * values; `top` and `bottom` build the two printed lines. The TOTAL row has no
 * companion figure, so it renders the top line only.
 */
const pairedColumn = ({ field, headerName, width, align = "right", top, bottom }) => ({
  field,
  headerName,
  width,
  align,
  headerAlign: align,
  sortable: false,
  // PDF / Word / CSV / print read valueGetter, so they get "top / bottom" in
  // one cell. Excel keeps the raw number from the field and stays summable.
  valueGetter: (value, row) => {
    if (!isTotalRow(row)) return `${top(row)} / ${bottom(row)}`;
    // Columns the report does not total (dates) stay blank on the TOTAL row.
    return value === null || value === undefined || value === "" ? "" : top(row);
  },
  renderCell: (params) => {
    if (!isTotalRow(params.row)) {
      return <TwoLine align={align} top={top(params.row)} bottom={bottom(params.row)} />;
    }
    const value = params.row[field];
    return value === null || value === undefined || value === "" ? "" : top(params.row);
  },
});

const Installment_Dues = () => {
  const zoom = useReportZoom();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [reportType, setReportType] = useState("all");
  const [activeLoans, setActiveLoans] = useState(true);
  const [lateFee, setLateFee] = useState(false);
  // The report type the rows on screen were generated for. Switching the
  // dropdown does not regroup a report until it is generated again.
  const [generatedType, setGeneratedType] = useState(null);
  // Partners whose band is folded shut; every partner opens expanded.
  const [collapsed, setCollapsed] = useState(() => new Set());
  const { settings } = useThemeProvider();

  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadPartners = async (query = "") => {
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`, {
        headers,
        params: { q: query.trim() },
      });

      setPartners(
        (res.data || []).map((item) => ({
          id: item.id,
          label: `${item.id || ""} - ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"}`,
          firstname: item.firstname,
          lastname: item.lastname,
          mobile: item.mobile,
        }))
      );
    } catch (error) {
      console.error("Partner Load Error : ", error);
    }
  };

  useEffect(() => {
    loadPartners("");
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      let url = "";

      if (reportType === "individual") {
        if (!selectedPartner?.id) {
          errorToast("Please select partner");
          return;
        }
        url = `${API_BASE}/gurantorInstallmentDues/by-guarantor/${selectedPartner.id}/${activeLoans}/${lateFee}`;
      } else {
        url = `${API_BASE}/gurantorInstallmentDues/all/${activeLoans}/${lateFee}`;
      }

      const res = await axios.get(url, { headers });
      setRows((res.data || []).map((row, index) => ({ id: row.loanId || index + 1, sno: index + 1, ...row })));
      setGeneratedType(reportType);
      setCollapsed(new Set());
    } catch (error) {
      console.error("Generate Report Error : ", error);
      errorToast("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  // Paired layout of the old dues ledger: Start/End Date, Amount over
  // Duration/Installment, and each figure over its installment count.
  const columns = [
    { field: "sno", headerName: "S.No", width: 70 },
    { field: "loanId", headerName: "Loan ID", width: 110 },
    { field: "customerName", headerName: "Customer Name", minWidth: 200, flex: 1 },
    { field: "guarantorName", headerName: "Guarantor Name", minWidth: 200, flex: 1 },
    { field: "partnerName", headerName: "Partner Name", minWidth: 200, flex: 1 },

    pairedColumn({
      field: "startDate",
      headerName: "Start/End Date",
      width: 140,
      align: "left",
      top: (row) => formatDate(row.startDate),
      bottom: (row) => formatDate(row.endDate),
    }),
    pairedColumn({
      field: "amount",
      headerName: "Amount Dur/Inst.",
      width: 150,
      top: (row) => formatAmount(row.amount),
      bottom: (row) => `${row.duration || 0}/${formatAmount(row.installmentAmount)}`,
    }),
    pairedColumn({
      field: "totalAmountPaid",
      headerName: "Inst. Paid",
      width: 130,
      top: (row) => formatAmount(row.totalAmountPaid),
      bottom: (row) => `${row.noOfInstallmentsPaid || 0}`,
    }),
    pairedColumn({
      field: "balanceAmount",
      headerName: "Inst. Bal",
      width: 130,
      top: (row) => formatAmount(row.balanceAmount),
      bottom: (row) => `${row.noOfInstallmentsPending || 0}`,
    }),
    pairedColumn({
      field: "installmentDue",
      headerName: "Inst. Dues",
      width: 130,
      top: (row) => formatAmount(row.installmentDue),
      bottom: (row) => `${duesCount(row)}`,
    }),
    pairedColumn({
      field: "dueDate",
      headerName: "Due Date",
      width: 130,
      align: "left",
      top: (row) => formatDate(row.dueDate),
      bottom: (row) => `(${daysOverdue(row.dueDate)})`,
    }),
    {
      field: "lateFee",
      headerName: "Late Fee",
      width: 110,
      align: "right",
      headerAlign: "right",
      // Partner and DF / MF bands in the download carry no late fee - blank, not 0.
      valueFormatter: (value, row) => (row?.__band ? "" : formatAmount(value)),
    },
  ];

  // One table per loan type, each with its own S.No sequence starting at 1 and
  // its own TOTAL row, exactly as the old report lays it out.
  const sections = useMemo(() => splitByLoanType(rows), [rows]);

  // All Partners groups the way the old dues ledger does: a heading per
  // partner, then that partner's DF and MF tables, each with its own TOTAL.
  // Partners keep the order the API sends them in - their sequence, ascending.
  const partnerGroups = useMemo(() => {
    if (generatedType !== "all") return [];
    const byPartner = new Map();
    rows.forEach((row) => {
      const name = partnerOf(row);
      const key = name.toUpperCase();
      if (!byPartner.has(key)) byPartner.set(key, { key, name, rows: [] });
      byPartner.get(key).rows.push(row);
    });

    return [...byPartner.values()]
      .map((group) => ({ ...group, sections: splitByLoanType(group.rows), totals: sumTotals(group.rows) }));
  }, [rows, generatedType]);
  const grouped = partnerGroups.length > 0;

  // The partner heading already names the partner, so its column comes off the
  // download and starts hidden on screen (Columns brings it back).
  const exportColumns = grouped ? columns.filter((column) => column.field !== "partnerName") : columns;

  // The screen shows several grids, but the report downloads as one document:
  // each section banded and totalled - under its partner's band when grouped -
  // the way the old report prints it. That keeps a single Download for the
  // whole screen instead of one menu per table.
  const exportRows = useMemo(
    () =>
      grouped
        ? partnerGroups.flatMap((group) => [
            { id: `${group.key}-partner`, __isTotal: true, __band: true, loanId: "Partner", customerName: group.name },
            ...group.sections.flatMap((section) => sectionExportRows(section, `${group.key}-`)),
          ])
        : sections.flatMap((section) => sectionExportRows(section)),
    [grouped, partnerGroups, sections]
  );

  // Sized to one page of the table's own rows (TOTAL included) so a partner
  // with two loans is not a mostly blank grid, and a long one reads down the
  // page like the old ledger instead of scrolling inside a box.
  const groupTableHeight = (count) => {
    const size = TABLE_PX[settings.tableDensity] || TABLE_PX.compact;
    return size.chrome + Math.min(count + 1, GROUP_PAGE_SIZE) * size.row;
  };

  const allExpanded = collapsed.size === 0;
  const toggleAll = () =>
    setCollapsed(allExpanded ? new Set(partnerGroups.map((group) => group.key)) : new Set());
  const togglePartner = (key) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  // Filter lines printed under the company banner on every download.
  const reportOptions = useMemo(
    () => ({
      meta: [
        { label: "Report Type", value: reportType === "individual" ? "Individual Partner" : "All Partners" },
        ...(reportType === "individual" && selectedPartner ? [{ label: "Partner", value: selectedPartner.label }] : []),
        { label: "Active Loans", value: activeLoans ? "Yes" : "No" },
        { label: "Late Fee", value: lateFee ? "Yes" : "No" },
      ],
      orientation: "landscape",
    }),
    [reportType, selectedPartner, activeLoans, lateFee]
  );

  return (
    <Stack spacing={1.5}>
      <ReportToolbar
        icon={navIcons.partnerInstallmentDues}
        title="Installment Dues"
        subtitle="Installments due, for all partners or one."
        onRefresh={generateReport}
        loading={loading}
        zoom={zoom}
      >
        {/* One download for the whole report - DF and MF in a single document. */}
        <TableExportMenu
          rows={exportRows}
          columns={exportColumns}
          fileName="Installment-Dues"
          reportOptions={reportOptions}
        />
        {/* Print is in the Download menu too, but it is the button people reach
            for on a report screen, so it also stands on its own. */}
        <Button
          size="small"
          variant="outlined"
          startIcon={<PrintRounded />}
          onClick={() => printReport(exportRows, exportColumns, "Installment-Dues", reportOptions)}
          disabled={!exportRows.length}
        >
          Print
        </Button>
      </ReportToolbar>
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <TextField select label="Report Type" size="small" fullWidth value={reportType} onChange={(event) => setReportType(event.target.value)}>
              <MenuItem value="all">All Partners</MenuItem>
              <MenuItem value="individual">Individual Partner</MenuItem>
            </TextField>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Autocomplete
              openOnFocus
              filterOptions={(x) => x}
              options={partners || []}
              value={selectedPartner}
              onChange={(_, newValue) => setSelectedPartner(newValue)}
              onOpen={() => loadPartners("")}
              onInputChange={(_, value) => loadPartners(value)}
              fullWidth
              size="small"
              disabled={reportType !== "individual"}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Select Partner" placeholder="Search Partner" />}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <FormControlLabel control={<Checkbox checked={activeLoans} onChange={(event) => setActiveLoans(event.target.checked)} />} label="Active Loans" />
            <FormControlLabel control={<Checkbox checked={lateFee} onChange={(event) => setLateFee(event.target.checked)} />} label="Late Fee" />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <Button variant="contained" onClick={generateReport} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box ref={zoom.targetRef} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {grouped ? (
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 0.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                {partnerGroups.length} partners · {rows.length} loans
              </Typography>
              <Button size="small" onClick={toggleAll}>
                {allExpanded ? "Collapse all" : "Expand all"}
              </Button>
            </Stack>

            {partnerGroups.map((group) => (
              <Accordion
                key={group.key}
                className="enterprise-card"
                elevation={0}
                disableGutters
                expanded={!collapsed.has(group.key)}
                onChange={() => togglePartner(group.key)}
                // A folded partner's grids leave the page instead of rendering hidden.
                slotProps={{ transition: { unmountOnExit: true } }}
                sx={{ "&::before": { display: "none" }, overflow: "hidden" }}
              >
                {/* The old ledger's partner heading, with the partner's figures
                    across DF and MF so a folded band still reads. */}
                <AccordionSummary
                  expandIcon={<ExpandMoreRounded />}
                  sx={{
                    px: 2.5,
                    minHeight: 56,
                    backgroundColor: "var(--surface-2)",
                    borderLeft: "4px solid var(--brand-primary)",
                    "& .MuiAccordionSummary-content": { my: 1.25, minWidth: 0 },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={{ xs: 0.75, md: 2 }}
                    sx={{ width: "100%", minWidth: 0, pr: 1 }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: "uppercase", flex: 1, minWidth: 0 }} noWrap>
                      {group.name}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip size="small" variant="outlined" color="primary" label={`${group.rows.length} ${group.rows.length === 1 ? "loan" : "loans"}`} />
                      <Chip size="small" variant="outlined" label={`Amount ${formatAmount(group.totals.amount)}`} />
                      <Chip size="small" variant="outlined" label={`Inst. Bal ${formatAmount(group.totals.balanceAmount)}`} />
                      <Chip
                        size="small"
                        variant="outlined"
                        color={group.totals.installmentDue > 0 ? "error" : "default"}
                        label={`Inst. Dues ${formatAmount(group.totals.installmentDue)}`}
                      />
                    </Stack>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {group.sections.map((section) => (
                    <DataTable
                      key={section.key}
                      rows={section.rows}
                      columns={columns}
                      loading={loading}
                      title={section.key}
                      subtitle={section.subtitle}
                      height={groupTableHeight(section.rows.length)}
                      minHeight={0}
                      pageSize={GROUP_PAGE_SIZE}
                      rowHeight={58}
                      totalFields={TOTAL_FIELDS}
                      totalLabelCell={TOTAL_LABEL_CELL}
                      initialState={{ columns: { columnVisibilityModel: { partnerName: false } } }}
                      showExport={false}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        ) : (sections.length
          ? sections
          : [{ key: "empty", title: "Installment Dues Ledger", subtitle: "Generate the report to load dues.", rows: [] }]
        ).map((section) => (
          <DataTable
            key={section.key}
            rows={section.rows}
            columns={columns}
            loading={loading}
            title={section.title}
            subtitle={section.subtitle}
            height={460}
            pageSize={25}
            rowHeight={58}
            totalFields={TOTAL_FIELDS}
            totalLabelCell={TOTAL_LABEL_CELL}
            // Downloads live on the single toolbar menu above, not per table.
            showExport={false}
          />
        ))}
      </Box>
    </Stack>
  );
};

export default Installment_Dues;
