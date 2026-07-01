import React from "react";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ArticleRounded,
  DescriptionRounded,
  FileDownloadRounded,
  GridOnRounded,
  PrintRounded,
  TableViewRounded,
} from "@mui/icons-material";
import {
  exportCsv,
  exportExcel,
  exportPdf,
  exportWord,
  printReport,
} from "./reportExport";

/**
 * ExportButtons - one menu with Excel / PDF / Word / CSV / Print actions.
 * Reusable across every report; shares logic with reportExport.js.
 * @param {Array} rows
 * @param {Array} columns
 * @param {string} fileName
 */
const ExportButtons = ({
  rows = [],
  columns = [],
  fileName = "report",
  buttonLabel = "Export",
  size = "small",
  variant = "outlined",
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const close = () => setAnchorEl(null);
  const hasData = rows.length > 0;

  const run = (fn) => () => {
    close();
    if (hasData) fn(rows, columns, fileName);
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        startIcon={<FileDownloadRounded />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        disabled={!hasData}
      >
        {buttonLabel}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
        <MenuItem onClick={run(exportExcel)}>
          <ListItemIcon><TableViewRounded fontSize="small" color="success" /></ListItemIcon>
          <ListItemText primary="Excel" secondary=".xlsx" />
        </MenuItem>
        <MenuItem onClick={run(exportPdf)}>
          <ListItemIcon><DescriptionRounded fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="PDF" secondary=".pdf" />
        </MenuItem>
        <MenuItem onClick={run(exportWord)}>
          <ListItemIcon><ArticleRounded fontSize="small" color="primary" /></ListItemIcon>
          <ListItemText primary="Word" secondary=".doc" />
        </MenuItem>
        <MenuItem onClick={run(exportCsv)}>
          <ListItemIcon><GridOnRounded fontSize="small" color="action" /></ListItemIcon>
          <ListItemText primary="CSV" secondary=".csv" />
        </MenuItem>
        <MenuItem onClick={run(printReport)}>
          <ListItemIcon><PrintRounded fontSize="small" /></ListItemIcon>
          <ListItemText primary="Print" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButtons;
