import React from "react";
import { Box, Chip, Divider, Tooltip, IconButton } from "@mui/material";
import {
  FullscreenRounded,
  FullscreenExitRounded,
  RestartAltRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from "@mui/icons-material";

/**
 * ZoomControls - presentational zoom + fullscreen button group.
 * Wire it to the values returned by useReportZoom().
 */
const ZoomControls = ({
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onReset,
  onFullscreen,
  isFullscreen = false,
  showFullscreen = true,
}) => (
  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
    <Tooltip title="Zoom out">
      <span>
        <IconButton size="small" onClick={onZoomOut} disabled={zoom <= 0.6}>
          <ZoomOutRounded fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
    <Chip size="small" label={`${Math.round(zoom * 100)}%`} variant="outlined" sx={{ minWidth: 56, fontWeight: 700 }} />
    <Tooltip title="Zoom in">
      <span>
        <IconButton size="small" onClick={onZoomIn} disabled={zoom >= 1.8}>
          <ZoomInRounded fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
    <Tooltip title="Reset zoom">
      <IconButton size="small" onClick={onReset}>
        <RestartAltRounded fontSize="small" />
      </IconButton>
    </Tooltip>
    {showFullscreen && (
      <>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title={isFullscreen ? "Exit full screen" : "Full screen"}>
          <IconButton size="small" onClick={onFullscreen}>
            {isFullscreen ? <FullscreenExitRounded fontSize="small" /> : <FullscreenRounded fontSize="small" />}
          </IconButton>
        </Tooltip>
      </>
    )}
  </Box>
);

export default ZoomControls;
