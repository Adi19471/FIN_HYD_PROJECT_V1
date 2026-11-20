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
import { COMPANY_ADDRESS, COMPANY_APP_NAME, COMPANY_NAME } from "src/lib/company";
import { breadcrumbTrail } from "src/lib/breadcrumbs";
import { reportPalette } from "src/lib/reportTheme";

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

// Words that must not be title-cased letter by letter. Without this a field
// name like `loanId` prints as "Loan Id" instead of "Loan ID".
const ACRONYMS = new Set([
  "ID", "EMI", "GST", "PAN", "TDS", "ROI", "NPA", "IFSC", "KYC", "CIF",
  "NEFT", "RTGS", "UPI", "CR", "DR", "OD", "PCT", "YTD", "MTD",
]);

// Whole field names whose house spelling no rule would arrive at.
const FIELD_LABELS = { sno: "S.No", srno: "S.No", slno: "S.No" };

// Small words that stay lower case inside a label ("Date of Birth").
const MINOR_WORDS = new Set(["of", "to", "for", "and", "in", "on", "at", "by", "per"]);

/**
 * `customerName` -> "Customer Name", `loanId` -> "Loan ID".
 *
 * The old version only inserted spaces before capitals, which left the first
 * word lower case — that is where the "customer Name" / "guarantor Name"
 * headings in the printed reports came from.
 */
export const humaniseField = (field = "") => {
  const key = String(field).replace(/[\s_-]+/g, "").toLowerCase();
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];

  return String(field)
    // camelCase and PascalCase boundaries, including ALLCAPS runs (GSTNumber).
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) return upper;
      if (index > 0 && MINOR_WORDS.has(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

// Build a human label from a column definition or a plain string field name.
// An explicit `headerName` always wins — a screen that names its columns keeps
// exactly the wording it chose.
export const labelFor = (column) => {
  if (typeof column === "string") return humaniseField(column);
  return column.headerName || humaniseField(column.field || "");
};

const fieldOf = (column) => (typeof column === "string" ? column : column.field);

// Raw, unformatted cell content - Excel keeps numbers numeric so the columns
// right-align and stay summable instead of landing as left-aligned text.
export const rawValue = (row, column) =>
  typeof column !== "string" && typeof column.exportRaw === "function"
    ? column.exportRaw(row)
    : row[fieldOf(column)];

/**
 * Stacked cells. A column may declare `exportParts: [{ header, value(row) }]`
 * for a cell that shows two figures one over the other (Start over End date,
 * Customer over Mobile). Print, Word and PDF then put each part on its own line
 * inside the one cell, and Excel / CSV give each part its own column with its
 * own heading, so the sheet stays sortable and the dates are not glued
 * together with a "/". Columns without exportParts are untouched.
 */
const partsOf = (column) =>
  typeof column !== "string" && Array.isArray(column.exportParts) && column.exportParts.length
    ? column.exportParts
    : null;

const partText = (value) => {
  if (value == null) return "";
  return typeof value === "number" ? String(roundAmount(value)) : String(value);
};

// The printed lines of a stacked cell as [{ text, nowrap }], or null for an
// ordinary column. A part marked `print: false` is an Excel/CSV-only column
// (its figure is already inside another part's `format`). A total row prints
// the column's own formatted value on a single line.
const stackedLines = (row, column) => {
  const parts = partsOf(column);
  if (!parts || isTotalRow(row)) return null;
  return parts
    .filter((part) => part.print !== false)
    .map((part) => {
      let text = "";
      try {
        text = part.format ? String(part.format(part.value(row), row) ?? "") : partText(part.value(row));
      } catch {
        text = "";
      }
      return { text, nowrap: Boolean(part.nowrap) };
    });
};

// Excel / CSV: one sheet column per part.
const flattenParts = (cols) =>
  cols.flatMap((column) => {
    const parts = partsOf(column);
    if (!parts) return [column];
    return parts.map((part, index) => ({
      field: `${column.field}__part${index}`,
      headerName: part.header,
      width: part.width || Math.max(90, Math.round(columnWidth(column) / parts.length)),
      align: part.align,
      exportRaw: (row) => {
        // The total row has no per-part figures except the column's own sum,
        // which goes under the first part.
        if (isTotalRow(row)) return index === 0 ? row[column.field] ?? "" : "";
        try {
          return part.value(row) ?? "";
        } catch {
          return "";
        }
      },
    }));
  });

// Resolve a single cell's display value, honouring valueGetter / valueFormatter.
export const cellValue = (row, column) => {
  const raw = rawValue(row, column);
  // A summed float would otherwise print its full binary expansion.
  const clean = (value) => (typeof value === "number" ? roundAmount(value) : value);
  if (typeof column === "string") return clean(raw) ?? "";
  if (column.valueGetter) {
    try {
      return column.valueGetter(raw, row, column) ?? "";
    } catch {
      return clean(raw) ?? "";
    }
  }
  if (column.valueFormatter) {
    try {
      return column.valueFormatter(raw, row, column) ?? "";
    } catch {
      return clean(raw) ?? "";
    }
  }
  return clean(raw) ?? "";
};

// Keep only exportable columns (skip action columns flagged disableExport).
export const exportableColumns = (columns = []) =>
  columns.filter((column) =>
    typeof column === "string" ? column : column.field && !column.disableExport
  );

/**
 * Snap a money figure back to two decimals.
 *
 * Summing currency in binary floating point drifts: adding a column of paise
 * produced 500000.0199999999 in the totals row, and a balance that should have
 * been zero came out as -0.020000000004074536. Every derived figure goes
 * through here so the grid, the totals row and every export agree.
 */
export const roundAmount = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const rounded = Math.round((n + Number.EPSILON) * 100) / 100;
  // -0 prints as "-0.00"; normalise it away.
  return Object.is(rounded, -0) ? 0 : rounded;
};

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

/**
 * A4 portrait is the house paper, but a wide grid squeezed onto it is what
 * makes headings wrap to one letter per line. So portrait is the default only
 * while the report is narrow enough to carry it: from seven columns up the
 * sheet turns landscape on its own. An explicit `options.orientation` still
 * wins, and the print preview lets the user flip it either way.
 */
export const LANDSCAPE_COLUMN_THRESHOLD = 7;

export const resolveOrientation = (options = {}, columns = []) => {
  if (options.orientation) return options.orientation;
  return exportableColumns(columns).length >= LANDSCAPE_COLUMN_THRESHOLD
    ? "landscape"
    : "portrait";
};

/**
 * Type size for the printed grid, stepped down as columns are added so a wide
 * report stays on the page. Held inside the 8-10px band a printed statement
 * needs to stay readable.
 */
export const printFontSize = (columnCount = 0) => {
  if (columnCount <= 8) return 10;
  if (columnCount <= 12) return 9;
  return 8;
};

/**
 * Heading printed over the grid. Defaults to the download file name, which is
 * how every screen has always driven it, but `options.title` lets a screen
 * print "Customer Dues" while the file still downloads as Customer_Dues.xlsx.
 * File names are written both ways (Customer_Dues, Partner-Performance), and a
 * heading reads as words either way.
 */
export const reportTitle = (fileName = "", options = {}) =>
  options.title || String(fileName).replace(/[_-]+/g, " ").trim();

/**
 * The application band that sits above the company banner: the product name
 * and the same breadcrumb trail the on-screen header shows, so a printed page
 * says which screen produced it. `options.breadcrumb` overrides the trail;
 * `options.appName` overrides the product name.
 */
export const appHeader = (options = {}) => ({
  name: options.appName || COMPANY_APP_NAME,
  trail:
    typeof options.breadcrumb === "string"
      ? options.breadcrumb
      : breadcrumbTrail(options.breadcrumb),
});

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
  const credits = roundAmount(data.reduce((sum, row) => sum + Number(row[creditField] || 0), 0));
  const debits = roundAmount(data.reduce((sum, row) => sum + Number(row[debitField] || 0), 0));
  return [
    { label: "Credits", value: credits },
    { label: "Debits", value: debits },
    { label: "Balance", value: roundAmount(credits - debits) },
  ];
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const matrix = (rows, columns) =>
  rows.map((row) =>
    columns.map((column) => {
      const lines = stackedLines(row, column);
      return lines ? lines.map((line) => line.text).join("\n") : String(cellValue(row, column) ?? "");
    })
  );

export const exportExcel = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = flattenParts(exportableColumns(columns));
  if (!rows.length) return;
  const lines = metaLines(options);

  // Company banner + report period sit above the header row, mirroring the
  // printed report, then the grid itself.
  const app = appHeader(options);
  const banner = [
    [app.trail ? `${app.name} | ${app.trail}` : app.name],
    [COMPANY_NAME],
    [COMPANY_ADDRESS],
    [`Date: ${reportDateLabel()}`],
    ...lines.map((line) => [`${line.label}: ${line.value}`]),
    [reportTitle(fileName, options)],
    [],
  ];
  const dataRows = rows.map((row) =>
    cols.map((column) => {
      const raw = rawValue(row, column);
      return typeof raw === "number" ? roundAmount(raw) : cellValue(row, column);
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

  // Thousands separators on the numeric cells so Excel right-aligns them. A
  // column carrying paise anywhere gets two decimals throughout, so a rounded
  // total is never displayed as a whole number that disagrees with the report.
  const columnHasDecimals = cols.map((column) =>
    rows.some((row) => {
      const raw = rawValue(row, column);
      return typeof raw === "number" && !Number.isInteger(roundAmount(raw));
    })
  );
  rows.forEach((row, rowIndex) => {
    cols.forEach((column, colIndex) => {
      if (typeof rawValue(row, column) !== "number") return;
      const address = XLSX.utils.encode_cell({ r: headerRowIndex + 1 + rowIndex, c: colIndex });
      if (worksheet[address]) worksheet[address].z = columnHasDecimals[colIndex] ? "#,##0.00" : "#,##0";
    });
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportCsv = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = flattenParts(exportableColumns(columns));
  if (!rows.length) return;
  const escape = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = metaLines(options);
  const app = appHeader(options);
  const csv = [
    escape(app.trail ? `${app.name} | ${app.trail}` : app.name),
    escape(COMPANY_NAME),
    escape(COMPANY_ADDRESS),
    escape(`Date: ${reportDateLabel()}`),
    ...lines.map((line) => escape(`${line.label}: ${line.value}`)),
    escape(reportTitle(fileName, options)),
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
  const orientation = resolveOrientation(options, cols);
  // Resolved once per document so every page uses the same accent.
  const palette = reportPalette();
  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const centre = pageWidth / 2;

  // Application band first - product name and the screen's breadcrumb - then
  // the company banner, matching the on-screen hierarchy.
  const app = appHeader(options);
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...palette.headerRuleRgb);
  doc.text(app.trail ? `${app.name}  |  ${app.trail}` : app.name, centre, 9, { align: "center" });
  doc.setTextColor(17, 24, 39);
  doc.setDrawColor(226, 232, 240);
  doc.line(10, 11.5, pageWidth - 10, 11.5);

  doc.setFontSize(16);
  doc.text(COMPANY_NAME, centre, 19, { align: "center" });
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(COMPANY_ADDRESS, centre, 25, { align: "center" });

  let y = 31;
  doc.text(`Date: ${reportDateLabel()}`, pageWidth - 14, y, { align: "right" });
  metaLines(options).forEach((line) => {
    doc.text(`${line.label} : ${line.value}`, 14, y);
    y += 6;
  });
  y = Math.max(y, 37);
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(reportTitle(fileName, options), centre, y, { align: "center" });
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
    // jsPDF measures in points; the CSS band is px, so step the same way.
    styles: {
      fontSize: printFontSize(cols.length) - 1.5,
      cellPadding: 2.2,
      overflow: "linebreak",
      valign: "middle",
      // Wrap headings and long values between words, never mid-word.
      minCellWidth: 12,
    },
    // A deeper head band gives a two-line heading room to breathe instead of
    // clipping it against the first data row.
    headStyles: {
      fillColor: palette.headerBgRgb,
      // Same ink as the printed header. A fixed white vanished on a light
      // header band (the default light-blue one).
      textColor: palette.headerTextRgb,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      cellPadding: { top: 3.2, bottom: 3.2, left: 2, right: 2 },
      minCellHeight: 11,
      lineWidth: 0.1,
    },
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
        data.cell.styles.fillColor = palette.totalBgRgb;
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

/**
 * Normalise `options.details` into sections. A detail block is the facts a
 * statement carries above its grid - account, partner, loan figures - which a
 * plain list report does not have. A flat [{ label, value }] array is treated
 * as one untitled section so a simple caller can skip the nesting.
 *   details: [{ title, color, columns, fields: [{ label, value }] }]
 */
export const detailSections = ({ details } = {}) => {
  if (!details || !details.length) return [];
  const sections = Array.isArray(details[0]?.fields) ? details : [{ fields: details }];
  return sections
    .map((section) => ({
      title: section.title || "",
      // Only a plain colour literal reaches the inline style below.
      color: /^#[0-9a-f]{3,8}$/i.test(section.color || "") ? section.color : reportPalette().headerBg,
      columns: section.columns || 4,
      fields: (section.fields || []).filter((field) => field && field.label),
    }))
    .filter((section) => section.fields.length);
};

// Customer photo, printed beside the detail block. Only an inline image is
// accepted - a remote URL would not have loaded by the time print fires.
const photoSrc = (options = {}) =>
  typeof options.photo === "string" && /^(data:image\/|blob:)/.test(options.photo)
    ? options.photo
    : "";

// The detail block itself: a titled band per section over a fixed grid of
// label/value cells, laid out with tables so Word renders it like the browser.
const detailsHtml = (options = {}) => {
  const sections = detailSections(options);
  const photo = photoSrc(options);
  if (!sections.length) return "";

  const blocks = sections
    .map((section) => {
      const cells = section.fields.map((field) => {
        const value = field.value === "" || field.value == null ? "-" : field.value;
        return (
          `<td><span class="dl">${escapeHtml(field.label)}</span>` +
          `<span class="dv">${escapeHtml(value)}</span></td>`
        );
      });
      // Pad the last row so every cell keeps the same width.
      while (cells.length % section.columns) cells.push("<td></td>");
      const rows = [];
      for (let i = 0; i < cells.length; i += section.columns) {
        rows.push(`<tr>${cells.slice(i, i + section.columns).join("")}</tr>`);
      }
      const title = section.title
        ? `<p class="detail-title" style="background:${section.color}">${escapeHtml(section.title)}</p>`
        : "";
      return `${title}<table class="detail-table">${rows.join("")}</table>`;
    })
    .join("");

  const inner = photo
    ? `<table class="detail-wrap"><tr><td class="detail-main">${blocks}</td>` +
      `<td class="detail-photo"><img src="${escapeHtml(photo)}" alt="" /></td></tr></table>`
    : blocks;
  return `<div class="report-details">${inner}</div>`;
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
        .map((column, index) => {
          const lines = stackedLines(row, column);
          // A part flagged nowrap (a date) never breaks at its hyphens.
          const content = lines
            ? lines
                .map((line, i) => {
                  const cls = [i > 0 ? "sub" : "", line.nowrap ? "nw" : ""].filter(Boolean).join(" ");
                  return cls ? `<span class="${cls}">${escapeHtml(line.text)}</span>` : escapeHtml(line.text);
                })
                .join("<br>")
            : typeof column !== "string" && column.nowrap && !isTotalRow(row)
              ? `<span class="nw">${escapeHtml(cellValue(row, column))}</span>`
              : escapeHtml(cellValue(row, column));
          return `<td style="text-align:${aligns[index]}">${content}</td>`;
        })
        .join("");
      return `<tr${isTotalRow(row) ? ' class="total-row"' : ""}>${cells}</tr>`;
    })
    .join("");
  const lines = metaLines(options)
    .map((line) => `<p class="meta"><strong>${escapeHtml(line.label)} :</strong> ${escapeHtml(line.value)}</p>`)
    .join("");
  // The application band repeats what the on-screen header shows, so a printed
  // page still says which product and which screen it came from.
  const app = appHeader(options);
  const appBand = `<div class="report-app">
      <span class="report-app-name">${escapeHtml(app.name)}</span>
      ${app.trail ? `<span class="report-app-trail">${escapeHtml(app.trail)}</span>` : ""}
    </div>`;
  return `<div class="report-head">
      ${appBand}
      <h1>${escapeHtml(COMPANY_NAME)}</h1>
      <p>${escapeHtml(COMPANY_ADDRESS)}</p>
      <p class="report-date"><strong>Date:</strong> ${reportDateLabel()}</p>
      ${lines}
      <h2>${escapeHtml(reportTitle(fileName, options))}</h2>
    </div>
    ${detailsHtml(options)}
    <table class="report-table">${colGroup}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
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
// spilling columns off the right edge of the sheet. `columnCount` steps the
// grid's type down as columns are added, keeping it inside the 8-10px band.
const tableStyles = (orientation, columnCount = 0) => {
  const fontSize = printFontSize(columnCount);
  // Accent comes from the live theme; the paper stays white with dark ink so a
  // dark application theme never produces a dark printed report.
  const palette = reportPalette();
  return `
  @page{size:A4 ${orientation};margin:10mm}
  body{font-family:Inter,'Segoe UI',Roboto,Arial,sans-serif;padding:12px;color:#111827}
  h1{font-size:20px;margin:0;text-align:center;letter-spacing:.4px}
  h2{text-align:center;margin:12px 0 10px;font-size:15px}
  p{text-align:center;margin:3px 0;color:#475569;font-size:12px}
  p.meta{text-align:left;color:#111827;margin:2px 0}
  p.report-date{text-align:right;margin-top:-14px}
  .report-head{margin-bottom:8px}
  /* Application band - product name over the breadcrumb of the screen that
     produced the report, so the printed page keeps the on-screen hierarchy. */
  .report-app{display:flex;align-items:baseline;justify-content:center;gap:8px;
    flex-wrap:wrap;padding-bottom:6px;margin-bottom:8px;border-bottom:1px solid #e2e8f0}
  .report-app-name{font-size:12px;font-weight:800;color:${palette.headerRule};letter-spacing:.3px}
  .report-app-trail{font-size:11px;font-weight:600;color:#64748b}
  .report-app-trail:before{content:"|";margin-right:8px;color:#cbd5e1}
  table{width:100%;border-collapse:collapse;border:1.5px solid #94a3b8;table-layout:fixed}
  th,td{border:1px solid #cbd5e1;padding:5px 7px;font-size:${fontSize}px;vertical-align:middle}
  /* Cells may wrap, but only between words - break-word on its own was
     splitting names mid-letter ("guaranto r") once a column got narrow. */
  td{overflow-wrap:break-word;word-break:normal;hyphens:none}
  /* Stacked cells: the second line is the companion figure, set a shade
     lighter; .nw keeps a date whole instead of breaking at its hyphens. */
  td .sub{color:#475569}
  td .nw{white-space:nowrap}
  /* A heading never breaks inside a word: it wraps at spaces or not at all,
     which is what keeps "Installment Pending" readable in a tight column. */
  th{background:${palette.headerBg};color:${palette.headerText};border-bottom:2px solid ${palette.headerRule};
    padding:8px 7px;height:auto;min-height:26px;line-height:1.25;
    white-space:normal;overflow-wrap:normal;word-break:keep-all;hyphens:none}
  tbody tr:nth-child(even){background:#f8fafc}
  tr.total-row td{font-weight:700;background:${palette.totalBg};border-top:2px solid ${palette.headerBg}}
  /* Credits / Debits / Balance block, right aligned under the table. */
  table.report-summary{width:auto;margin:10px 0 0 auto;border:none}
  table.report-summary th,table.report-summary td{border:none;padding:2px 6px;font-size:12px}
  table.report-summary th{background:none;color:#111827;text-align:right;font-weight:700}
  table.report-summary td{text-align:right;min-width:110px;font-weight:700}
  table.report-summary tr.summary-final th,table.report-summary tr.summary-final td{
    border-top:1px solid #94a3b8;padding-top:4px}
  /* Statement detail block - the titled bands of label/value cells above the
     grid, plus the customer photo. Printed on the first page only. */
  .report-details{margin:0 0 8px}
  .report-details table{border:none;table-layout:auto}
  .report-details table.detail-wrap{width:100%}
  .report-details table.detail-wrap>tbody>tr>td{border:none;padding:0;vertical-align:top}
  .report-details .detail-photo{width:26mm;padding-left:8px}
  .report-details .detail-photo img{width:24mm;height:28mm;object-fit:cover;
    border:1px solid #cbd5e1;border-radius:4px}
  p.detail-title{display:inline-block;text-align:left;margin:6px 0 4px;padding:2px 12px;
    border-radius:10px;background:${palette.headerBg};color:${palette.headerText};font-size:10px;font-weight:700;letter-spacing:.5px}
  table.detail-table{width:100%;border:1px solid #cbd5e1;table-layout:fixed}
  table.detail-table td{border:1px solid #e2e8f0;padding:4px 7px;vertical-align:top}
  .detail-table .dl{display:block;font-size:9px;color:#64748b;letter-spacing:.3px;text-transform:uppercase}
  .detail-table .dv{display:block;font-size:12px;font-weight:700;color:#111827}
  /* Repeat the column headings on every printed page and never split a row. */
  thead{display:table-header-group}
  tr{page-break-inside:avoid;break-inside:avoid}
  @media print{body{padding:0} tr.total-row td{background:#e2e8f0 !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    th{background:${palette.headerBg} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    p.detail-title{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`;
};

export const exportWord = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const orientation = resolveOrientation(options, cols);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">
    <style>${tableStyles(orientation, cols.length)}
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

const viewerStyles = () => {
  // The viewer's own chrome follows the accent too. Resolved here rather than
  // borrowed from tableStyles — these are two independent stylesheets.
  const palette = reportPalette();
  return `
  html,body{height:100%}
  body{margin:0;padding:0;display:flex;flex-direction:column;background:#525659}
  .toolbar{flex:0 0 auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap;
    padding:8px 14px;background:${palette.headerRule};color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.35)}
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
    font-size:10px;line-height:14px;color:#475569}
  /* Off-screen copy of one printed page that the script fills to find out
     what fits. It has the print geometry below - no padding, the footer in
     the flow, every margin counted inside it. */
  .sheet.measure{position:absolute;left:-10000px;top:0;visibility:hidden;
    height:auto;padding:0;overflow:visible;box-shadow:none;display:flow-root}
  .sheet.measure .sheet-foot{position:static;margin-top:6px}
  @media print{
    body{display:block;height:auto;background:#fff}
    .toolbar{display:none}
    .viewport{overflow:visible;padding:0}
    #sheets{display:block;zoom:1 !important}
    .sheet{width:auto;height:auto;padding:0;box-shadow:none;overflow:visible;display:flow-root;
      page-break-after:always;break-after:page}
    .sheet:last-child{page-break-after:auto;break-after:auto}
    .sheet-foot{position:static;margin-top:6px}
  }`;
};

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
    var table=src.content.querySelector('table.report-table');
    var details=src.content.querySelector('.report-details');
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

    // Fill one page into el: banner, the detail block on the first page only,
    // the grid with the given rows (none for a summary-only page) and the
    // footer. Used both for the off-screen measuring copy and the real sheets.
    function fillSheet(el,pageNo,indexes,withSummary){
      el.innerHTML='';
      el.appendChild(head.cloneNode(true));
      // A statement's detail block belongs to the first page only; the pages
      // after it carry the company banner and the schedule's own headings.
      if(details&&pageNo===0)el.appendChild(details.cloneNode(true));
      var body=null;
      if(indexes){
        var t=table.cloneNode(false);
        var colgroup=table.querySelector('colgroup');
        if(colgroup)t.appendChild(colgroup.cloneNode(true));
        t.appendChild(table.querySelector('thead').cloneNode(true));
        body=document.createElement('tbody');
        for(var i=0;i<indexes.length;i++){body.appendChild(srcRows[indexes[i]].cloneNode(true));}
        t.appendChild(body);
        el.appendChild(t);
      }
      if(withSummary)el.appendChild(summary.cloneNode(true));
      var foot=document.createElement('div');foot.className='sheet-foot';
      foot.textContent='Page 1 of 1';
      el.appendChild(foot);
      return body;
    }

    function range(from,count){var out=[];for(var i=0;i<count;i++){out.push(from+i);}return out;}

    // Lay the report out on the given paper: resize the sheets, work out what
    // fits on each printed page, then rebuild the pages. Called again whenever
    // the paper changes.
    function layout(orientation){
      var size=SIZES[orientation];
      document.documentElement.style.setProperty('--sheet-w',size.w+'mm');
      document.documentElement.style.setProperty('--sheet-h',size.h+'mm');
      pageRule.textContent='@page{size:A4 '+orientation+';margin:10mm}';
      sheets.innerHTML='';

      // Pages are filled on an off-screen copy of one printed page - A4 less
      // the 10mm margins, footer in the flow - and every page is checked
      // there before it is kept. The old row-height sum left out the
      // banner's bottom margin and the footer line, and Windows display
      // scaling makes rows measure shorter on screen than they print (at
      // 125% a row came out 1.4px short), so pages took too many rows and
      // every printed sheet pushed its last row and footer onto a page of
      // their own. Zooming the copy by 1/devicePixelRatio lays it out one CSS
      // pixel to one device pixel, the way the page prints; RESERVE absorbs
      // what is left of the screen / print difference.
      var MM=96/25.4, RESERVE=4*MM;
      var areaW=(size.w-20)*MM, limit=(size.h-20)*MM-RESERVE;
      var meas=document.createElement('div');
      meas.className='sheet measure';
      meas.style.width=areaW+'px';
      meas.style.zoom=String(1/(window.devicePixelRatio||1));
      document.body.appendChild(meas);
      var scale=meas.getBoundingClientRect().width/areaW||1;
      function measured(){return meas.getBoundingClientRect().height/scale;}

      // Row heights from one pass over the whole grid give each page a first
      // guess; the guess is then corrected against the real page.
      var n=srcRows.length, rowH=[];
      var allBody=fillSheet(meas,1,range(0,n),false);
      for(var r=0;r<n;r++){rowH.push(allBody.rows[r].getBoundingClientRect().height/scale);}
      fillSheet(meas,0,[],false);
      var base0=measured();
      fillSheet(meas,1,[],false);
      var base1=measured();

      var pages=[],start=0;
      while(start<n){
        var pageNo=pages.length,k=0,used=pageNo===0?base0:base1;
        while(start+k<n&&(k===0||used+rowH[start+k]<=limit)){used+=rowH[start+k];k++;}
        var mBody=fillSheet(meas,pageNo,range(start,k),false);
        // Too tall: hand rows on to the next page (a page always keeps one).
        while(k>1&&measured()>limit){mBody.removeChild(mBody.lastElementChild);k--;}
        // Room left: take further rows while they still fit.
        while(start+k<n){
          mBody.appendChild(srcRows[start+k].cloneNode(true));
          if(measured()>limit){mBody.removeChild(mBody.lastElementChild);break;}
          k++;
        }
        pages.push(range(start,k));
        start+=k;
      }
      if(!pages.length)pages.push([]);

      // The Credits / Debits / Balance block belongs under the last page's
      // table; if it no longer fits there it gets a continuation page.
      var lastNo=pages.length-1, summaryPage=false;
      if(summary){
        fillSheet(meas,lastNo,pages[lastNo],true);
        summaryPage=measured()>limit;
      }
      document.body.removeChild(meas);

      var count=pages.length+(summaryPage?1:0);
      pages.forEach(function(indexes,pageNo){
        var sheet=document.createElement('div');sheet.className='sheet';
        fillSheet(sheet,pageNo,indexes,!!summary&&!summaryPage&&pageNo===lastNo);
        sheets.appendChild(sheet);
      });
      if(summaryPage){
        var extra=document.createElement('div');extra.className='sheet';
        fillSheet(extra,count-1,null,true);
        sheets.appendChild(extra);
      }
      var feet=sheets.querySelectorAll('.sheet-foot');
      for(var f=0;f<feet.length;f++){feet[f].textContent='Page '+(f+1)+' of '+feet.length;}

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

/**
 * Full-screen preview inside the current page.
 *
 * The preview used to live only in a popup window, so whenever the browser's
 * popup blocker stopped it — the common case, since most people never allow
 * popups — Print appeared to do nothing at all. An overlay cannot be blocked,
 * so this is the fallback whenever window.open comes back empty.
 */
const openOverlayPreview = (html, title) => {
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", title);
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483000;background:#525659;display:flex;flex-direction:column;";

  const bar = document.createElement("div");
  bar.style.cssText =
    "flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:6px 12px;" +
    "background:#1e293b;color:#fff;font:600 13px/1.4 Inter,'Segoe UI',Roboto,Arial,sans-serif;";
  const label = document.createElement("span");
  label.textContent = title;
  label.style.cssText = "margin-right:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close preview";
  close.style.cssText =
    "border:0;border-radius:6px;padding:6px 14px;cursor:pointer;background:#e2e8f0;color:#0f172a;font:inherit;";
  bar.appendChild(label);
  bar.appendChild(close);

  const frame = document.createElement("iframe");
  frame.title = title;
  frame.style.cssText = "flex:1 1 auto;width:100%;border:0;background:#525659;";

  overlay.appendChild(bar);
  overlay.appendChild(frame);
  document.body.appendChild(overlay);

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const dismiss = () => {
    document.body.style.overflow = previousOverflow;
    if (overlay.parentNode) document.body.removeChild(overlay);
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (event) => {
    if (event.key === "Escape") dismiss();
  };
  close.addEventListener("click", dismiss);
  document.addEventListener("keydown", onKey);

  const doc = frame.contentDocument;
  doc.open();
  doc.write(html);
  doc.close();
  frame.contentWindow?.focus();
};

export const printReport = (rows = [], columns = [], fileName = "report", options = {}) => {
  const cols = exportableColumns(columns);
  // A statement stands on its detail block alone - a loan with no payments yet
  // still prints - so an empty grid only blocks a report that has nothing else.
  if (!rows.length && !detailSections(options).length) return;
  const orientation = resolveOrientation(options, cols);
  const title = reportTitle(fileName, options);

  const html = `<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
      <style>${tableStyles(orientation, cols.length)}${viewerStyles()}</style>
      <style id="page-rule">@page{size:A4 ${orientation};margin:10mm}</style></head>
      <body>${toolbarHtml(title, orientation)}
      <div class="viewport"><div id="sheets"></div></div>
      <template id="report-source">${reportHtml(rows, cols, fileName, options)}</template>
      <script>${viewerScript}<\/script></body></html>`;

  // A separate window is still the nicer place for a long report, so try it
  // first — but never let a blocked popup end as silence.
  let printWindow = null;
  try {
    printWindow = window.open("", "", "width=1280,height=880");
  } catch {
    printWindow = null;
  }

  if (!printWindow) {
    openOverlayPreview(html, title);
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
};
