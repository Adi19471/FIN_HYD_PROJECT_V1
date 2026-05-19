import React from "react";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArticleRounded,
  DescriptionRounded,
  ExpandMoreRounded,
  FileDownloadRounded,
  PrintRounded,
  TableViewRounded,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import { errorToast } from "toastify";

const labelFor = (col) => col.replace(/([A-Z])/g, " $1").replace(/_/g, " ").toUpperCase();

const ReportToolbar = ({
  data = [],
  columns = [],
  fileName = "Report",
  tableId = "reportTable",
}) => {
  const hasData = data?.length > 0;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const ensureData = () => {
    if (hasData) return true;
    errorToast("No data available");
    return false;
  };

  const handleExcel = () => {
    if (!ensureData()) return;
    setAnchorEl(null);

    const exportData = data.map((row) =>
      columns.reduce((acc, col) => {
        acc[labelFor(col)] = row[col];
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handlePDF = () => {
    if (!ensureData()) return;
    setAnchorEl(null);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38);
    doc.text(COMPANY_NAME, 14, 15);

    doc.setFontSize(11);
    doc.setTextColor(90);
    doc.text(COMPANY_ADDRESS, 14, 22);

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(fileName, 80, 15);

    autoTable(doc, {
      startY: 32,
      head: [columns.map(labelFor)],
      body: data.map((row) =>
        columns.map((col) => (row[col] !== null && row[col] !== undefined ? row[col].toString() : ""))
      ),
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [15, 98, 254],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 251],
      },
      margin: {
        top: 30,
        left: 10,
        right: 10,
      },
      didDrawPage: () => {
        doc.setFontSize(9);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 130, 10);
      },
    });

    doc.save(`${fileName}.pdf`);
  };

  const handleWord = () => {
    if (!ensureData()) return;
    setAnchorEl(null);

    const tableRows = data
      .map(
        (row) => `
          <tr>
            ${columns.map((col) => `<td>${row[col] || ""}</td>`).join("")}
          </tr>
        `
      )
      .join("");

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #dc2626; text-align: center; }
            h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; font-size: 13px; text-align: left; }
            th { background: #0f62fe; color: white; }
            tr:nth-child(even) { background: #f5f7fb; }
          </style>
        </head>
        <body>
          <h1>${COMPANY_NAME}</h1>
          <p>${COMPANY_ADDRESS}</p>
          <h3>${fileName}</h3>
          <table>
            <thead><tr>${columns.map((col) => `<th>${labelFor(col)}</th>`).join("")}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!ensureData()) return;
    setAnchorEl(null);

    const printContent = document.getElementById(tableId);
    if (!printContent) {
      errorToast("Table not found");
      return;
    }

    const newWindow = window.open("", "", "width=1200,height=700");
    newWindow.document.write(`
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { text-align: center; color: #dc2626; }
            h2 { text-align: center; }
            p { text-align: center; margin-top: -8px; color: #555; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 10px; font-size: 13px; }
            th { background: #0f62fe; color: white; }
          </style>
        </head>
        <body>
          <h1>${COMPANY_NAME}</h1>
          <p>${COMPANY_ADDRESS}</p>
          <h2>${fileName}</h2>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();

    setTimeout(() => {
      newWindow.focus();
      newWindow.print();
    }, 500);
  };

  return (
    <Paper
      className="enterprise-card"
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        mb: 2,
        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: 1.5,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Stack spacing={0.25}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          Report actions
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.length} filtered rows ready for export, print, and archive.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          size="small"
          variant="outlined"
          startIcon={<FileDownloadRounded />}
          endIcon={<ExpandMoreRounded />}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          Download
        </Button>
        <Button size="small" variant="contained" startIcon={<PrintRounded />} onClick={handlePrint}>
          Print
        </Button>
      </Stack>

      <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleExcel}>
          <ListItemIcon>
            <TableViewRounded fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText primary="Excel workbook" secondary=".xlsx" />
        </MenuItem>
        <MenuItem onClick={handlePDF}>
          <ListItemIcon>
            <DescriptionRounded fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="PDF report" secondary=".pdf" />
        </MenuItem>
        <MenuItem onClick={handleWord}>
          <ListItemIcon>
            <ArticleRounded fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Word document" secondary=".doc" />
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ReportToolbar;
