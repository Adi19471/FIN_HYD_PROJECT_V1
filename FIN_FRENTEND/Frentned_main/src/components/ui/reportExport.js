// Shared report export helpers used by ExportButtons / ReportToolbar / DataTable.
// All helpers accept the same (rows, columns, fileName) signature so every
// report screen exports identically across Excel, PDF, Word, CSV and Print.
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";

export const reportDateLabel = () =>
  new Date()
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "-");

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

// Resolve a single cell's display value, honouring valueGetter / valueFormatter.
export const cellValue = (row, column) => {
  const field = typeof column === "string" ? column : column.field;
  const raw = row[field];
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

const matrix = (rows, columns) =>
  rows.map((row) => columns.map((column) => String(cellValue(row, column) ?? "")));

export const exportExcel = (rows = [], columns = [], fileName = "report") => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const exportRows = rows.map((row) =>
    cols.reduce((acc, column) => {
      acc[labelFor(column)] = cellValue(row, column);
      return acc;
    }, {})
  );
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportCsv = (rows = [], columns = [], fileName = "report") => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const header = cols.map(labelFor);
  const escape = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const csv = [header.map(escape).join(",")]
    .concat(rows.map((row) => cols.map((column) => escape(cellValue(row, column))).join(",")))
    .join("\n");
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportPdf = (rows = [], columns = [], fileName = "report") => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFontSize(18);
  doc.text(COMPANY_NAME, 14, 14);
  doc.setFontSize(10);
  doc.text(COMPANY_ADDRESS, 14, 20);
  doc.text(`Date: ${reportDateLabel()}`, 14, 26);
  doc.setFontSize(13);
  doc.text(fileName, 14, 34);
  autoTable(doc, {
    startY: 40,
    head: [cols.map(labelFor)],
    body: matrix(rows, cols),
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 251] },
  });
  doc.save(`${fileName}.pdf`);
};

const reportHtml = (rows, cols, fileName) => {
  const head = cols.map((column) => `<th>${labelFor(column)}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${cols.map((column) => `<td>${cellValue(row, column)}</td>`).join("")}</tr>`
    )
    .join("");
  return `<h1>${COMPANY_NAME}</h1><p>${COMPANY_ADDRESS}</p><p><strong>Date:</strong> ${reportDateLabel()}</p><h2>${fileName}</h2>
    <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
};

const tableStyles = `
  body{font-family:Inter,'Segoe UI',Roboto,Arial,sans-serif;padding:20px;color:#111827}
  h1{font-size:22px;margin:0;text-align:center} p{text-align:center;margin:4px 0;color:#475569}
  h2{text-align:center;margin:18px 0 14px}
  table{width:100%;border-collapse:collapse;border:2px solid #cbd5e1}
  th,td{border:1px solid #cbd5e1;padding:8px;font-size:12px;text-align:left}
  th{background:#4f46e5;color:#fff;border-bottom:2px solid #3730a3} tr:nth-child(even){background:#f8fafc}`;

export const exportWord = (rows = [], columns = [], fileName = "report") => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const html = `<html><head><meta charset="utf-8"><style>${tableStyles}</style></head><body>${reportHtml(
    rows,
    cols,
    fileName
  )}</body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.doc`;
  link.click();
  URL.revokeObjectURL(url);
};

export const printReport = (rows = [], columns = [], fileName = "report") => {
  const cols = exportableColumns(columns);
  if (!rows.length) return;
  const printWindow = window.open("", "", "width=1200,height=760");
  if (!printWindow) return;
  printWindow.document.write(
    `<html><head><title>${fileName}</title><style>${tableStyles}</style></head><body>${reportHtml(
      rows,
      cols,
      fileName
    )}</body></html>`
  );
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
