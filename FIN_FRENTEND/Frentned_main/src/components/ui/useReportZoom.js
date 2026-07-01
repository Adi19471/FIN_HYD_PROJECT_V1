import React from "react";

const MIN = 0.6;
const MAX = 1.8;
const STEP = 0.1;
const clamp = (value) => Math.min(MAX, Math.max(MIN, Number(value.toFixed(2))));

/**
 * useReportZoom - zoom + fullscreen behaviour for a report content area.
 * Pass the returned `targetRef` to the element that should zoom / go fullscreen.
 */
export default function useReportZoom() {
  const targetRef = React.useRef(null);
  const [zoom, setZoom] = React.useState(1);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const apply = React.useCallback((value) => {
    const next = clamp(value);
    setZoom(next);
    if (targetRef.current) targetRef.current.style.zoom = next;
  }, []);

  const zoomIn = React.useCallback(() => apply(zoom + STEP), [apply, zoom]);
  const zoomOut = React.useCallback(() => apply(zoom - STEP), [apply, zoom]);
  const resetZoom = React.useCallback(() => apply(1), [apply]);

  const toggleFullscreen = React.useCallback(() => {
    const node = targetRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      node.requestFullscreen?.();
    }
  }, []);

  React.useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return { targetRef, zoom, zoomIn, zoomOut, resetZoom, toggleFullscreen, isFullscreen };
}
