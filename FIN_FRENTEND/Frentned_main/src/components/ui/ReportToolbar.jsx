import React from "react";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { PlayArrowRounded, RefreshRounded } from "@mui/icons-material";
import ZoomControls from "./ZoomControls";

/**
 * ReportToolbar - the common action bar on every report screen:
 * Generate, Refresh, and Zoom In / Out / Reset / Full Screen.
 *
 * Downloads (Excel / PDF / Word / Print) are intentionally NOT here - each
 * table owns a single Export menu in its own toolbar, so there is exactly one
 * download entry point per report and no duplicate buttons.
 *
 * @param {string}   title         Optional toolbar label.
 * @param {function} onGenerate    Generate handler. Shows the Generate button when set.
 * @param {string}   generateLabel Default "Generate".
 * @param {function} onRefresh     Refresh handler. Shows Refresh when set.
 * @param {boolean}  loading       Disables Generate/Refresh while busy.
 * @param {object}   zoom          Result of useReportZoom() - enables zoom controls.
 * @param {node}     children      Extra actions rendered inline.
 */
const ReportToolbar = ({
  title,
  onGenerate,
  generateLabel = "Generate",
  onRefresh,
  loading = false,
  zoom,
  children,
}) => {
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
      {title && (
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mr: 1 }}>
          {title}
        </Typography>
      )}

      {onGenerate && (
        <Button
          size="small"
          variant="contained"
          startIcon={<PlayArrowRounded />}
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
          startIcon={<RefreshRounded />}
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      )}

      {children}

      {zoom && (
        <>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: "none", sm: "block" } }} />
          <Stack direction="row" sx={{ ml: { xs: 0, sm: "auto" } }}>
            <ZoomControls
              zoom={zoom.zoom}
              onZoomIn={zoom.zoomIn}
              onZoomOut={zoom.zoomOut}
              onReset={zoom.resetZoom}
              onFullscreen={zoom.toggleFullscreen}
              isFullscreen={zoom.isFullscreen}
            />
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default ReportToolbar;
