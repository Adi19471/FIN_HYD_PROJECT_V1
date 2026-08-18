// Shared report export helpers used by ExportButtons / ReportToolbar / DataTable.
// Every helper takes the same (rows, columns, fileName, options) signature so a
// report looks identical across Excel, PDF, Word, CSV and Print.
//
// `options` carries the report context the old Word/print reports always showed
// and the screens were dropping on the floor:
//   period : { fromDate, toDate, label } -> "Installments Dues From : 01-Aug-2026 - 31-Aug-2026"
//   meta   : [{ label, value }]          -> extra filter lines (Loan Type, Order By, ...)
//   orientation: "landscape" | "portrait"
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";

export const reportDateLabel = () =>
  new Date()
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "-");

// "2026-08-01" / Date / dayjs -> "01-Aug-2026". Unparseable input is passed
// through untouched so a pre-formatted label still prints as the caller wrote it.
export const formatReportDate = (value) => {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD-MMM-YYYY") : String(value);
};

// Build a human label from a column definition or a plain string field name.
export const labelFor = (column) => {
  if (typeof column === "string") {
    return column.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
  }
  return (
    column.headerName ||
    column.field?.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim() ||
    ""
  );
};

const fieldOf = (column) => (typeof column === "string" ? column : column.field);

// Raw, unformatted cell content - Excel keeps numbers numeric so the columns
// right-align and stay summable instead of landing as left-aligned text.
export const rawValue = (row, column) => row[fieldOf(column)];

// Resolve a single cell's display value, honouring valueGetter / valueFormatter.
export const cellValue = (row, column) => {
  const raw = rawValue(row, column);
  if (typeof column === "string") return raw ?? "";
  if (column.valueGetter) {
    try {
      return column.valueGetter(raw, row, column) ?? "";
    } catch {
      return raw ?? "";
    }
  }
  if (column.valueFormatter) {
    try {
      return column.valueFormatter(raw, row, column) ?? "";
    } catch {
      return raw ?? "";
    }
  }
  return raw ?? "";
};

// Keep only exportable columns (skip action columns flagged disableExport).
export const exportableColumns = (columns = []) =>
  columns.filter((column) =>
    typeof column === "string" ? column : column.field && !column.disableExport
  );

// A totals row is flagged by the screen (__isTotal) or uses the id convention
// the existing report screens already follow.
export const isTotalRow = (row) =>
  Boolean(row && (row.__isTotal === true || row.id === "total" || row.id === "TOTAL"));

/**
 * Column alignment for the exported document. Uses the grid's own `align` when
 * the screen set one, otherwise infers it: a column whose values are numbers
 * right-aligns, everything else stays left. Without this every money column
 * exported left-aligned no matter how it looked on screen.
 */
export const alignFor = (column, rows = []) => {
  if (typeof column !== "string" && column.align) return column.align;
  const sample = rows.find((row) => !isTotalRow(row) && rawValue(row, column) != null && rawValue(row, column) !== "");
  return typeof rawValue(sample || {}, column) === "number" ? "right" : "left";
};

// "Installments Dues From : 01-Aug-2026 - 31-Aug-2026" plus any filter lines.
export const metaLines = ({ period, meta } = {}) => {
  const lines = [];
  if (period?.fromDate || period?.toDate) {
    const from = formatReportDate(period.fromDate);
    const to = formatReportDate(period.toDate);
    lines.push({
      label: period.label || "Period",
      value: from && to ? `${from} - ${to}` : from || to,
    });
  }
  (meta || []).forEach((entry) => {
    if (entry && entry.label && entry.value !== "" && entry.value != null) lines.push(entry);
  });
  return lines;
};

// A4 portrait is the house paper - every report prints portrait unless the
// caller asks otherwise, or the user flips it in the print preview.
export const resolveOrientation = (options = {}) => options.orientation || "portrait";

// The grid's own column width, used to size the exported columns. Without it an
// intentionally blank column (e.g. Remarks, filled in by hand after download)
// collapses to nothing and long text columns squeeze the numeric ones.
export const columnWidth = (column) =>
  typeof column === "string" ? 120 : column.width || column.minWidth || 120;

// Ledger-style figure: 42000 -> "42,000.00". Strings pass through so a caller
// can supply its own wording.
export const summaryValue = (value) =>
  typeof value === "number"
    ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : String(value ?? "");

// The Credits / Debits / Balance block printed under the table, as on the
// legacy ledger reports.
export const summaryLines = ({ summary } = {}) =>
  (summary || [])
    .filter((line) => line && line.label && line.value !== null && line.value !== undefined)
    .map((line) => ({ label: line.label, value: summaryValue(line.value) }));

/**
 * Build the standard Credits / Debits / Balance summary from ledger rows.
 * Totals ignore any TOTAL row so figures are not double counted.
 */
export const creditDebitSummary = (rows = [], { creditField = "credit", debitField = "debit" } = {}) => {
  const data = rows.filter((row) => !isTotalRow(row));
  const credits = data.reduce((sum, row) => sum + Number(row[creditField] || 0), 0);
  const debits = data.reduce((sum, row) => sum + Number(row[debitField] || 0), 0);
  return [
    { label: "Credits", value: credits },
    { label: "Debits", value: debits },
    { label: "Balance", value: credits - debits },
  ];
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const matrix = (rows, columns) =>
  rows.map((row) => columns.map((column) => String(cellValue(row, column) ?? "")));

export const exportExcel = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const lines = metaLines(options);

  // Company banner + report period sit above the header row, mirroring the
  // printed report, then the grid itself.
  const banner = [
    [COMPANY_NAME],
    [COMPANY_ADDRESS],
    [`Date: ${reportDateLabel()}`],
    ...lines.map((line) => [`${line.label}: ${line.value}`]),
    [fileName],
    [],
  ];
  const dataRows = rows.map((row) =>
    cols.map((column) => {
      const raw = rawValue(row, column);
      return typeof raw === "number" ? raw : cellValue(row, column);
    })
  );
  // Credits / Debits / Balance, in the last two columns so they line up under
  // the figures they summarise.
  const summary = summaryLines(options);
  const summaryRows = summary.length
    ? [[]].concat(
        summary.map((line) => {
          const cells = new Array(Math.max(cols.length, 2)).fill("");
          cells[cols.length - 2] = `${line.label} :`;
          cells[cols.length - 1] = line.value;
          return cells;
        })
      )
    : [];

  // Index of the column-heading row - the number formats below are offset from
  // it, so it must not be derived from the total sheet length.
  const headerRowIndex = banner.length;
  const sheetRows = [...banner, cols.map(labelFor), ...dataRows, ...summaryRows];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);
  worksheet["!cols"] = cols.map((column) => ({
    wch: Math.min(
      42,
      Math.max(
        12,
        labelFor(column).length + 2,
        Math.round(columnWidth(column) / 8),
        ...rows.map((row) => String(cellValue(row, column) ?? "").length + 2)
      )
    ),
  }));

  // Thousands separators on the numeric cells so Excel right-aligns them.
  rows.forEach((row, rowIndex) => {
    cols.forEach((column, colIndex) => {
      if (typeof rawValue(row, column) !== "number") return;
      const address = XLSX.utils.encode_cell({ r: headerRowIndex + 1 + rowIndex, c: colIndex });
      if (worksheet[address]) worksheet[address].z = "#,##0";
    });
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportCsv = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const escape = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = metaLines(options);
  const csv = [
    escape(COMPANY_NAME),
    escape(COMPANY_ADDRESS),
    escape(`Date: ${reportDateLabel()}`),
    ...lines.map((line) => escape(`${line.label}: ${line.value}`)),
    escape(fileName),
    "",
    cols.map(labelFor).map(escape).join(","),
  ]
    .concat(rows.map((row) => cols.map((column) => escape(cellValue(row, column))).join(",")))
    .concat(
      summaryLines(options).length
        ? [""].concat(summaryLines(options).map((line) => escape(`${line.label} :`) + "," + escape(line.value)))
        : []
    )
    .join("\n");
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportPdf = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const orientation = resolveOrientation(options);
  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const centre = pageWidth / 2;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text(COMPANY_NAME, centre, 14, { align: "center" });
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(COMPANY_ADDRESS, centre, 20, { align: "center" });

  let y = 26;
  doc.text(`Date: ${reportDateLabel()}`, pageWidth - 14, y, { align: "right" });
  metaLines(options).forEach((line) => {
    doc.text(`${line.label} : ${line.value}`, 14, y);
    y += 6;
  });
  y = Math.max(y, 32);
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(fileName, centre, y, { align: "center" });
  doc.setFont(undefined, "normal");

  const aligns = cols.map((column) => alignFor(column, rows));
  // Share the printable width in the same proportions the grid uses, so a blank
  // column (Remarks) keeps its space instead of collapsing.
  const usableWidth = pageWidth - 20;
  const totalWidth = cols.reduce((sum, column) => sum + columnWidth(column), 0);

  autoTable(doc, {
    startY: y + 6,
    head: [cols.map(labelFor)],
    body: matrix(rows, cols),
    styles: { fontSize: 8, cellPadding: 2.2, overflow: "linebreak", valign: "middle" },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold", halign: "center" },
    alternateRowStyles: { fillColor: [245, 247, 251] },
    columnStyles: cols.reduce(
      (acc, column, index) => ({
        ...acc,
        [index]: {
          halign: aligns[index],
          cellWidth: (columnWidth(column) / totalWidth) * usableWidth,
        },
      }),
      {}
    ),
    // The head repeats on every page; a totals row prints bold on a tinted band.
    willDrawCell: (data) => {
      if (data.section === "body" && isTotalRow(rows[data.row.index])) {
        doc.setFont(undefined, "bold");
        data.cell.styles.fillColor = [226, 232, 240];
        data.cell.styles.fontStyle = "bold";
      }
    },
    didDrawPage: () => {
      const page = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${page}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 6, {
        align: "right",
      });
    },
    margin: { top: 14, left: 10, right: 10, bottom: 12 },
  });

  // Credits / Debits / Balance under the table, right aligned.
  const lines = summaryLines(options);
  if (lines.length) {
    let y = (doc.lastAutoTable?.finalY || 40) + 8;
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    lines.forEach((line) => {
      if (y > doc.internal.pageSize.getHeight() - 14) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${line.label} :`, pageWidth - 60, y, { align: "right" });
      doc.text(line.value, pageWidth - 14, y, { align: "right" });
      y += 6;
    });
    doc.setFont(undefined, "normal");
  }

  doc.save(`${fileName}.pdf`);
};

const reportHtml = (rows, cols, fileName, options) => {
  const aligns = cols.map((column) => alignFor(column, rows));
  // Fixed layout + a colgroup keeps the printed columns in the same proportions
  // as the grid, so a blank Remarks column stays writable and long customer
  // names wrap instead of crushing the money columns.
  const totalWidth = cols.reduce((sum, column) => sum + columnWidth(column), 0);
  const colGroup = `<colgroup>${cols
    .map((column) => `<col style="width:${((columnWidth(column) / totalWidth) * 100).toFixed(2)}%">`)
    .join("")}</colgroup>`;
  const head = cols
    .map((column, index) => `<th style="text-align:${aligns[index]}">${escapeHtml(labelFor(column))}</th>`)
    .join("");
  const body = rows
    .map((row) => {
      const cells = cols
        .map(
          (column, index) =>
            `<td style="text-align:${aligns[index]}">${escapeHtml(cellValue(row, column))}</td>`
        )
        .join("");
      return `<tr${isTotalRow(row) ? ' class="total-row"' : ""}>${cells}</tr>`;
    })
    .join("");
  const lines = metaLines(options)
    .map((line) => `<p class="meta"><strong>${escapeHtml(line.label)} :</strong> ${escapeHtml(line.value)}</p>`)
    .join("");
  return `<div class="report-head">
      <h1>${escapeHtml(COMPANY_NAME)}</h1>
      <p>${escapeHtml(COMPANY_ADDRESS)}</p>
      <p class="report-date"><strong>Date:</strong> ${reportDateLabel()}</p>
      ${lines}
      <h2>${escapeHtml(fileName)}</h2>
    </div>
    <table>${colGroup}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    ${summaryHtml(options)}`;
};

// Right-aligned Credits / Debits / Balance block that sits under the table.
const summaryHtml = (options) => {
  const lines = summaryLines(options);
  if (!lines.length) return "";
  const rows = lines
    .map(
      (line, index) =>
        `<tr${index === lines.length - 1 ? ' class="summary-final"' : ""}>` +
        `<th>${escapeHtml(line.label)} :</th><td>${escapeHtml(line.value)}</td></tr>`
    )
    .join("");
  return `<table class="report-summary">${rows}</table>`;
};

// `size` is filled per call so a wide grid prints landscape instead of
// spilling columns off the right edge of the sheet.
const tableStyles = (orientation) => `
  @page{size:A4 ${orientation};margin:10mm}
  body{font-family:Inter,'Segoe UI',Roboto,Arial,sans-serif;padding:12px;color:#111827}
  h1{font-size:20px;margin:0;text-align:center;letter-spacing:.4px}
  h2{text-align:center;margin:12px 0 10px;font-size:15px}
  p{text-align:center;margin:3px 0;color:#475569;font-size:12px}
  p.meta{text-align:left;color:#111827;margin:2px 0}
  p.report-date{text-align:right;margin-top:-14px}
  .report-head{margin-bottom:8px}
  table{width:100%;border-collapse:collapse;border:1.5px solid #94a3b8;table-layout:fixed}
  th,td{border:1px solid #cbd5e1;padding:5px 7px;font-size:11px;vertical-align:middle;word-wrap:break-word;overflow-wrap:break-word}
  th{background:#4f46e5;color:#fff;border-bottom:2px solid #3730a3}
  tbody tr:nth-child(even){background:#f8fafc}
  tr.total-row td{font-weight:700;background:#e2e8f0;border-top:2px solid #4f46e5}
  /* Credits / Debits / Balance block, right aligned under the table. */
  table.report-summary{width:auto;margin:10px 0 0 auto;border:none}
  table.report-summary th,table.report-summary td{border:none;padding:2px 6px;font-size:12px}
  table.report-summary th{background:none;color:#111827;text-align:right;font-weight:700}
  table.report-summary td{text-align:right;min-width:110px;font-weight:700}
  table.report-summary tr.summary-final th,table.report-summary tr.summary-final td{
    border-top:1px solid #94a3b8;padding-top:4px}
  /* Repeat the column headings on every printed page and never split a row. */
  thead{display:table-header-group}
  tr{page-break-inside:avoid;break-inside:avoid}
  @media print{body{padding:0} tr.total-row td{background:#e2e8f0 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    th{background:#4f46e5 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;

export const exportWord = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const orientation = resolveOrientation(options);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">
    <style>${tableStyles(orientation)}
    /* Word reads page setup from @page WordSection1. */
    @page WordSection1{size:${orientation === "landscape" ? "841.9pt 595.3pt" : "595.3pt 841.9pt"};margin:1cm}
    div.WordSection1{page:WordSection1}</style></head>
    <body><div class="WordSection1">${reportHtml(rows, cols, fileName, options)}</div></body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.doc`;
  link.click();
  URL.revokeObjectURL(url);
};

// ---------------------------------------------------------------------------
// Print preview
//
// Print opens a viewer instead of firing the print dialog straight away: the
// report is laid out as real A4 sheets the user can page through and zoom,
// with a single Print button (Excel / Word / CSV stay on the grid's Download
// menu). Sheets are measured and filled row by row so nothing is ever cut in
// half by a page break.
// ---------------------------------------------------------------------------

const viewerStyles = () => `
  html,body{height:100%}
  body{margin:0;padding:0;display:flex;flex-direction:column;background:#525659}
  .toolbar{flex:0 0 auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
    padding:8px 14px;background:#3730a3;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.35)}
  .toolbar .title{font-weight:700;font-size:14px;margin-right:auto;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:38%}
  .toolbar button,.toolbar select{font-family:inherit;font-size:13px;border:0;border-radius:6px;
    padding:6px 10px;cursor:pointer;background:#eef2ff;color:#1e1b4b}
  .toolbar button:hover:not(:disabled){background:#fff}
  .toolbar button:disabled{opacity:.4;cursor:default}
  .toolbar .print{background:#facc15;font-weight:700;padding:6px 16px}
  .toolbar .grp{display:flex;align-items:center;gap:6px;padding-left:10px;
    border-left:1px solid rgba(255,255,255,.28)}
  .toolbar .grp>label{font-size:12px;display:flex;align-items:center;gap:5px}
  .toolbar .pill{min-width:86px;text-align:center;font-size:13px;font-weight:600}
  .viewport{flex:1 1 auto;overflow:auto;padding:18px 0 40px}
  #sheets{display:flex;flex-direction:column;align-items:center;gap:18px}
  /* Driven by JS so the orientation switch can resize and re-paginate live. */
  .sheet{width:var(--sheet-w);height:var(--sheet-h);padding:10mm;box-sizing:border-box;
    background:#fff;box-shadow:0 6px 20px rgba(0,0,0,.45);position:relative;overflow:hidden}
  .sheet-foot{position:absolute;left:10mm;right:10mm;bottom:4mm;text-align:right;
    font-size:10px;color:#475569}
  @media print{
    body{display:block;height:auto;background:#fff}
    .toolbar{display:none}
    .viewport{overflow:visible;padding:0}
    #sheets{display:block;zoom:1 !important}
    .sheet{width:auto;height:auto;padding:0;box-shadow:none;overflow:visible;
      page-break-after:always;break-after:page}
    .sheet:last-child{page-break-after:auto;break-after:auto}
    .sheet-foot{position:static;margin-top:6px}
  }`;

const toolbarHtml = (fileName, orientation) => `<div class="toolbar">
  <span class="title">${escapeHtml(fileName)}</span>
  <div class="grp">
    <button id="zoomOut" title="Zoom out">&minus;</button>
    <span class="pill" id="zoomLabel">100%</span>
    <button id="zoomIn" title="Zoom in">+</button>
  </div>
  <div class="grp">
    <label>View
      <select id="view">
        <option value="100">100%</option>
        <option value="width">Fit Width</option>
        <option value="page">Fit Page</option>
      </select>
    </label>
  </div>
  <div class="grp">
    <label>Paper
      <select id="paper">
        <option value="portrait"${orientation === "portrait" ? " selected" : ""}>A4 Portrait</option>
        <option value="landscape"${orientation === "landscape" ? " selected" : ""}>A4 Landscape</option>
      </select>
    </label>
  </div>
  <div class="grp">
    <button id="prev">&#8249; Prev</button>
    <span class="pill" id="pageLabel">Page 1 of 1</span>
    <button id="next">Next &#8250;</button>
  </div>
  <div class="grp"><button class="print" id="printBtn">Print</button></div>
</div>`;

// Runs inside the preview window. Plain ES5 string concatenation - no template
// literals, so it survives being embedded in one.
const viewerScript = `
(function(){
  function boot(){
    var src=document.getElementById('report-source');
    var head=src.content.querySelector('.report-head');
    var table=src.content.querySelector('table:not(.report-summary)');
    var summary=src.content.querySelector('table.report-summary');
    var sheets=document.getElementById('sheets');
    var viewport=document.querySelector('.viewport');
    var pageRule=document.getElementById('page-rule');
    var srcRows=table.querySelectorAll('tbody tr');
    var SIZES={portrait:{w:210,h:297},landscape:{w:297,h:210}};

    var sheetEls=[],total=1,page=0,zoom=1;
    var pageLabel=document.getElementById('pageLabel');
    var zoomLabel=document.getElementById('zoomLabel');
    var prev=document.getElementById('prev'),next=document.getElementById('next');

    // Lay the report out on the given paper: resize the sheets, measure how
    // much fits, then rebuild the pages. Called again whenever paper changes.
    function layout(orientation){
      var size=SIZES[orientation];
      document.documentElement.style.setProperty('--sheet-w',size.w+'mm');
      document.documentElement.style.setProperty('--sheet-h',size.h+'mm');
      pageRule.textContent='@page{size:A4 '+orientation+';margin:10mm}';
      sheets.innerHTML='';

      var probe=document.createElement('div');
      probe.className='sheet';
      probe.style.position='absolute';probe.style.left='-10000px';probe.style.visibility='hidden';
      var headProbe=head.cloneNode(true), tableProbe=table.cloneNode(true);
      probe.appendChild(headProbe);probe.appendChild(tableProbe);
      document.body.appendChild(probe);
      var cs=getComputedStyle(probe);
      var usable=probe.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-24;
      var headH=headProbe.getBoundingClientRect().height;
      var theadH=tableProbe.querySelector('thead').getBoundingClientRect().height;
      var probeRows=tableProbe.querySelectorAll('tbody tr');
      var heights=[];
      for(var i=0;i<probeRows.length;i++){heights.push(probeRows[i].getBoundingClientRect().height);}
      document.body.removeChild(probe);

      var pages=[],current=[],used=headH+theadH;
      for(var j=0;j<heights.length;j++){
        if(current.length&&used+heights[j]>usable){pages.push(current);current=[];used=headH+theadH;}
        current.push(j);used+=heights[j];
      }
      if(current.length)pages.push(current);
      if(!pages.length)pages.push([]);

      pages.forEach(function(indexes,pageNo){
        var sheet=document.createElement('div');sheet.className='sheet';
        sheet.appendChild(head.cloneNode(true));
        var t=table.cloneNode(true);
        var body=t.querySelector('tbody');body.innerHTML='';
        indexes.forEach(function(i){body.appendChild(srcRows[i].cloneNode(true));});
        sheet.appendChild(t);
        var foot=document.createElement('div');foot.className='sheet-foot';
        foot.textContent='Page '+(pageNo+1)+' of '+pages.length;
        sheet.appendChild(foot);
        sheets.appendChild(sheet);
      });

      // The Credits / Debits / Balance block belongs under the last page's
      // table; if it no longer fits there it gets a continuation page.
      if(summary){
        var last=sheets.lastElementChild;
        var foot=last.querySelector('.sheet-foot');
        last.insertBefore(summary.cloneNode(true),foot);
        if(last.scrollHeight>last.clientHeight){
          last.removeChild(last.querySelector('table.report-summary'));
          var extra=document.createElement('div');extra.className='sheet';
          extra.appendChild(head.cloneNode(true));
          extra.appendChild(summary.cloneNode(true));
          var extraFoot=document.createElement('div');extraFoot.className='sheet-foot';
          extra.appendChild(extraFoot);
          sheets.appendChild(extra);
          // Renumber now that a page was added.
          var feet=sheets.querySelectorAll('.sheet-foot');
          for(var f=0;f<feet.length;f++){feet[f].textContent='Page '+(f+1)+' of '+feet.length;}
        }
      }

      sheetEls=sheets.querySelectorAll('.sheet');
      total=sheetEls.length;
      page=Math.min(page,total-1);
      sync();
    }

    function applyZoom(){sheets.style.zoom=String(zoom);zoomLabel.textContent=Math.round(zoom*100)+'%';}
    function sync(){pageLabel.textContent='Page '+(page+1)+' of '+total;
      prev.disabled=page<=0;next.disabled=page>=total-1;}
    function go(n){page=Math.max(0,Math.min(total-1,n));
      sheetEls[page].scrollIntoView({behavior:'smooth',block:'start'});sync();}

    document.getElementById('zoomIn').onclick=function(){zoom=Math.min(2.5,zoom+0.1);applyZoom();};
    document.getElementById('zoomOut').onclick=function(){zoom=Math.max(0.3,zoom-0.1);applyZoom();};
    document.getElementById('view').onchange=function(e){
      var box=sheetEls[0].getBoundingClientRect();
      var sheetW=box.width/zoom,sheetH=box.height/zoom;
      if(e.target.value==='width')zoom=(viewport.clientWidth-60)/sheetW;
      else if(e.target.value==='page')zoom=Math.min((viewport.clientWidth-60)/sheetW,(viewport.clientHeight-40)/sheetH);
      else zoom=1;
      applyZoom();
    };
    prev.onclick=function(){go(page-1);};
    next.onclick=function(){go(page+1);};
    document.getElementById('paper').onchange=function(e){
      layout(e.target.value);
      if(sheetEls[page])sheetEls[page].scrollIntoView({block:'start'});
    };
    document.getElementById('printBtn').onclick=function(){window.print();};

    viewport.addEventListener('scroll',function(){
      var top=viewport.getBoundingClientRect().top;
      for(var k=0;k<total;k++){
        if(sheetEls[k].getBoundingClientRect().bottom>top+40){page=k;break;}
      }
      sync();
    });
    window.addEventListener('keydown',function(e){
      if(e.key==='PageDown'||e.key==='ArrowRight'){e.preventDefault();go(page+1);}
      if(e.key==='PageUp'||e.key==='ArrowLeft'){e.preventDefault();go(page-1);}
    });

    layout(document.getElementById('paper').value);
    applyZoom();
  }
  if(document.readyState==='complete')boot();
  else window.addEventListener('load',boot);
})();`;

export const printReport = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const orientation = resolveOrientation(options);
  const printWindow = window.open("", "", "width=1280,height=880");
  if (!printWindow) return;
  printWindow.document.write(
    `<html><head><meta charset="utf-8"><title>${escapeHtml(fileName)}</title>
      <style>${tableStyles(orientation)}${viewerStyles()}</style>
      <style id="page-rule">@page{size:A4 ${orientation};margin:10mm}</style></head>
      <body>${toolbarHtml(fileName, orientation)}
      <div class="viewport"><div id="sheets"></div></div>
      <template id="report-source">${reportHtml(rows, cols, fileName, options)}</template>
      <script>${viewerScript}<\/script></body></html>`
  );
  printWindow.document.close();
  printWindow.focus();
};
