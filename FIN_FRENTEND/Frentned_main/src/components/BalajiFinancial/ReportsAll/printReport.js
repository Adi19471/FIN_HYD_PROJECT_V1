export const printReport = (tableId) => {
  const content =
    document.getElementById(tableId);

  const printWindow =
    window.open("", "", "width=900,height=650");

  printWindow.document.write(
    content.outerHTML
  );

  printWindow.document.close();
  printWindow.print();
};