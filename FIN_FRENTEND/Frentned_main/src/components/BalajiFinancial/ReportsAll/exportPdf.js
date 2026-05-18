import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPdf = (
  columns,
  data,
  fileName
) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [columns],
    body: data.map((row) =>
      columns.map((col) => row[col])
    ),
  });

  doc.save(`${fileName}.pdf`);
};