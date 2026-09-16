import React from "react";
import { TableExportMenu } from "./DataTable";

/**
 * ExportButtons - the Download menu for screens that are not built on
 * DataTable.
 *
 * It used to be a second copy of the same menu with its own labels and its own
 * layout, which is how the app ended up with two different-looking Download
 * dropdowns. It now delegates to TableExportMenu, so there is exactly one
 * Download menu implementation in the app: same items, same order, same icons.
 *
 * @param {Array} rows
 * @param {Array} columns
 * @param {string} fileName
 * @param {object} reportOptions  title / breadcrumb / period / meta / summary
 */
const ExportButtons = ({
  rows = [],
  columns = [],
  fileName = "report",
  buttonLabel = "Download",
  reportOptions = {},
  className,
}) => (
  <TableExportMenu
    rows={rows}
    columns={columns}
    fileName={fileName}
    buttonLabel={buttonLabel}
    reportOptions={reportOptions}
    className={className}
  />
);

export default ExportButtons;
