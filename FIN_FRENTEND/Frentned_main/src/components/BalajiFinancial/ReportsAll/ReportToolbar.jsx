import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportToolbar = ({
  data = [],
  columns = [],
  fileName = "Report",
  tableId = "reportTable",
}) => {

  // =========================
  // EXCEL DOWNLOAD
  // =========================
  const handleExcel = () => {

    if (!data || data.length === 0) {
      alert("No Data Available");
      return;
    }

    const exportData = data.map((row) => {

      let obj = {};

      columns.forEach((col) => {

        obj[
          col
            .replace(/([A-Z])/g, " $1")
            .toUpperCase()
        ] = row[col];

      });

      return obj;
    });

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Report"
    );

    XLSX.writeFile(
      workbook,
      `${fileName}.xlsx`
    );
  };

  // =========================
  // PDF DOWNLOAD
  // =========================
  const handlePDF = () => {

    if (!data || data.length === 0) {
      alert("No Data Available");
      return;
    }

    // PORTRAIT PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // HEADER
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38);

    doc.text(
      "SRI BALAJI FINANCE",
      14,
      15
    );

    doc.setFontSize(11);
    doc.setTextColor(90);

    doc.text(
      "Yellareddy Guda Branch, Ameerpet - 500073",
      14,
      22
    );

    // TITLE
    doc.setFontSize(16);
    doc.setTextColor(0);

    doc.text(
      fileName,
      80,
      15
    );

    autoTable(doc, {

      startY: 32,

      head: [
        columns.map((col) =>
          col
            .replace(/([A-Z])/g, " $1")
            .toUpperCase()
        ),
      ],

      body: data.map((row) =>
        columns.map((col) =>
          row[col] !== null &&
          row[col] !== undefined
            ? row[col].toString()
            : ""
        )
      ),

      // COLUMN WIDTHS
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 45 },
        2: { cellWidth: 40 },
        3: { cellWidth: 45 },
        4: { cellWidth: 35 },
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: "linebreak",
        valign: "middle",
      },

      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },

      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },

      margin: {
        top: 30,
        left: 10,
        right: 10,
      },

      didDrawPage: () => {

        doc.setFontSize(9);

        doc.text(
          `Generated: ${new Date().toLocaleString()}`,
          130,
          10
        );
      },
    });

    doc.save(`${fileName}.pdf`);
  };

  // =========================
  // WORD DOWNLOAD
  // =========================
  const handleWord = () => {

    if (!data || data.length === 0) {
      alert("No Data Available");
      return;
    }

    let tableRows = "";

    data.forEach((row) => {

      tableRows += `
        <tr>

          ${columns.map((col) => `
            <td>
              ${row[col] || ""}
            </td>
          `).join("")}

        </tr>
      `;
    });

    const htmlContent = `

      <html>

      <head>

        <meta charset="utf-8">

        <style>

          body{
            font-family: Arial;
            padding:20px;
          }

          h1{
            color:#dc2626;
            text-align:center;
          }

          h3{
            text-align:center;
          }

          table{
            width:100%;
            border-collapse: collapse;
            margin-top:20px;
          }

          th, td{
            border:1px solid #ccc;
            padding:10px;
            font-size:13px;
            text-align:left;
          }

          th{
            background:#2563eb;
            color:white;
          }

          tr:nth-child(even){
            background:#f5f5f5;
          }

        </style>

      </head>

      <body>

        <h1>SRI BALAJI FINANCE</h1>

        <h3>${fileName}</h3>

        <table>

          <thead>

            <tr>

              ${columns.map((col) => `
                <th>
                  ${col
                    .replace(/([A-Z])/g, " $1")
                    .toUpperCase()}
                </th>
              `).join("")}

            </tr>

          </thead>

          <tbody>

            ${tableRows}

          </tbody>

        </table>

      </body>

      </html>
    `;

    const blob = new Blob(
      ['\ufeff', htmlContent],
      {
        type:
          "application/msword",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${fileName}.doc`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {

    if (!data || data.length === 0) {
      alert("No Data Available");
      return;
    }

    const printContent =
      document.getElementById(tableId);

    if (!printContent) {
      alert("Table Not Found");
      return;
    }

    const newWindow = window.open(
      "",
      "",
      "width=1200,height=700"
    );

    newWindow.document.write(`

      <html>

      <head>

        <title>${fileName}</title>

        <style>

          body{
            font-family: Arial;
            padding:20px;
          }

          h1{
            text-align:center;
            color:#dc2626;
          }

          h2{
            text-align:center;
          }

          table{
            width:100%;
            border-collapse: collapse;
          }

          th, td{
            border:1px solid #ccc;
            padding:10px;
            font-size:13px;
          }

          th{
            background:#2563eb;
            color:white;
          }

        </style>

      </head>

      <body>

        <h1>SRI BALAJI FINANCE</h1>

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

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "15px",
        flexWrap: "wrap",
      }}
    >

      {/* EXCEL */}
      <button
        onClick={handleExcel}
        style={{
          background: "#22c55e",
          color: "#fff",
          border: "none",
          padding: "8px 18px",
          borderRadius: "7px",
          cursor: "pointer",
        }}
      >
        📗 Excel
      </button>

      {/* PDF */}
      <button
        onClick={handlePDF}
        style={{
          background: "#ef4444",
          color: "#fff",
          border: "none",
          padding: "8px 18px",
          borderRadius: "7px",
          cursor: "pointer",
        }}
      >
        📕 PDF
      </button>

      {/* WORD */}
      <button
        onClick={handleWord}
        style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "8px 18px",
          borderRadius: "7px",
          cursor: "pointer",
        }}
      >
        📘 Word
      </button>

      {/* PRINT */}
      <button
        onClick={handlePrint}
        style={{
          background: "#9333ea",
          color: "#fff",
          border: "none",
          padding: "8px 18px",
          borderRadius: "7px",
          cursor: "pointer",
        }}
      >
        🖨 Print
      </button>

    </div>
  );
};

export default ReportToolbar;