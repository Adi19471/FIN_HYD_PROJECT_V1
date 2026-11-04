import React from "react";
import { Button, Divider, Paper, Stack } from "@mui/material";
import { actionIcons } from "src/lib/icons";
import ZoomControls from "./ZoomControls";
import { HeaderExportButtons } from "./DataTable";

const GenerateIcon = actionIcons.generate;
const RefreshIcon = actionIcons.refresh;

/**
 * ReportToolbar - the common action bar on every report screen:
 * Generate, Refresh, and Zoom In / Out / Reset / Full Screen.
 *
 * Given a `title`, it is also the screen's header: the screen's icon, name and
 * one line on what the report shows on the left, the same actions on the
 * right - the look the entry screens get from ScreenHeader, so a report and a
 * form open the same way. Without a title it is the plain bar it always was.
 *
 * As the screen header (with a `title`) it also carries Download and Print for
 * the screen's report - its main table, or what the screen registered with
 * useScreenExport (screenExport.jsx). `exports={false}` leaves them out.
 *
 * @param {Component} icon        The screen's icon (src/lib/icons.js navIcons).
 * @param {string}   title         The screen's name. Turns the bar into the screen header.
 * @param {string}   subtitle      One line on what the report shows.
 * @param {function} onGenerate    Generate handler. Shows the Generate button when set.
 * @param {string}   generateLabel Default "Generate".
 * @param {function} onRefresh     Refresh handler. Shows Refresh when set.
 * @param {boolean}  loading       Disables Generate/Refresh while busy.
 * @param {object}   zoom          Result of useReportZoom() - enables zoom controls.
 * @param {node}     children      Extra actions rendered inline.
 */
const ReportToolbar = ({
  icon: Icon,
  title,
  subtitle,
  onGenerate,
  generateLabel = "Generate",
  onRefresh,
  loading = false,
  zoom,
  exports = true,
  children,
}) => {
  const actions = (
    <>
      {onGenerate && (
        <Button
          size="small"
          variant="contained"
          startIcon={<GenerateIcon />}
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? "Loading..." : generateLabel}
        </Button>
      )}

      {onRefresh && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      )}

      {children}
    </>
  );

  const zoomControls = zoom && (
    <ZoomControls
      zoom={zoom.zoom}
      onZoomIn={zoom.zoomIn}
      onZoomOut={zoom.zoomOut}
      onReset={zoom.resetZoom}
      onFullscreen={zoom.toggleFullscreen}
      isFullscreen={zoom.isFullscreen}
    />
  );

  if (title) {
    return (
      <header className="scr-head scr-report-head">
        {Icon && (
          <span className="scr-head-icon" aria-hidden="true">
            <Icon />
          </span>
        )}
        <div className="scr-head-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="scr-head-actions">
          {actions}
          <HeaderExportButtons enabled={exports} />
          {zoomControls}
        </div>
      </header>
    );
  }

  return (
    <Paper
      className="enterprise-card"
      elevation={0}
      sx={{
        p: 1.25,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1.25,
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      {actions}

      {zoom && (
        <>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: "none", sm: "block" } }} />
          <Stack direction="row" sx={{ ml: { xs: 0, sm: "auto" } }}>
            {zoomControls}
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default ReportToolbar;
