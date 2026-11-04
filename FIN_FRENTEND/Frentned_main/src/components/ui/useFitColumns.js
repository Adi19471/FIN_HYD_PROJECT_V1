import React from "react";
import { useThemeProvider } from "src/utils/ThemeContext";
import { TEXT_WEIGHT_LEVELS } from "src/lib/themeOptions";

/**
 * useFitColumns - sizes a grid's columns to the space the screen actually has.
 *
 * Every column gets the width its own content needs - the widest value on any
 * row (the TOTAL row included, which is usually the widest number) or its
 * heading, whichever is wider. Then:
 *   - room to spare: the columns share it out in proportion, so the grid fills
 *     the card with no empty strip on the right;
 *   - too little room: text columns (names, remarks) give up width first and
 *     wrap onto a second line, headings wrap onto two lines, and figures keep
 *     the width their digits need - a number is never cut to "1,30,2...".
 *     Only when even that does not fit does the grid scroll sideways.
 *
 * It is pure arithmetic on the text (canvas measureText), so nothing on screen
 * jumps while it works and it follows the card's width as the window, the
 * sidebar or Settings > Screen Zoom change it.
 *
 * A column the screen draws as stacked lines (amount over count) can pass
 * fitLines: (row) => [line1, line2] so its width is that of its longest line.
 *
 * @returns {{ columns: Array, wrap: boolean }} the columns to hand the grid,
 *   and whether any text column is narrower than its text (then rows must grow
 *   to fit the wrapped lines: getRowHeight = () => "auto").
 */

// Cell padding (10px a side) plus the cell's own border.
const CELL_PAD = 22;
// Heading padding plus room for the sort arrow / column menu.
const HEADER_PAD = 46;
// Below this a wrapping text column stops giving up width.
const TEXT_FLOOR = 80;
// How many rows are read to find a column's widest value.
const SAMPLE_ROWS = 2000;

const FIXED_TYPES = new Set(["number", "date", "dateTime", "boolean", "actions", "singleSelect"]);

let canvas;
const widthCache = new Map();
const textWidth = (text, font) => {
  const key = `${font}|${text}`;
  const cached = widthCache.get(key);
  if (cached !== undefined) return cached;
  if (!canvas) canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  const width = ctx.measureText(text).width;
  if (widthCache.size > 50000) widthCache.clear();
  widthCache.set(key, width);
  return width;
};

// A column whose text may wrap: left-aligned words. Figures (right-aligned),
// centred marks, dates, actions and the serial number keep their width.
const isWrappable = (col) =>
  !FIXED_TYPES.has(col.type) &&
  col.align !== "right" &&
  col.align !== "center" &&
  !/^(sno|s_no|sNo|id|actions)$/i.test(col.field);

// The text a cell shows, as the grid would format it.
const cellText = (col, row, api) => {
  try {
    let value = row[col.field];
    if (col.valueGetter) value = col.valueGetter(value, row, col, api);
    if (col.valueFormatter) value = col.valueFormatter(value, row, col, api);
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return value instanceof Date ? value.toLocaleDateString() : "";
    return String(value);
  } catch {
    return "";
  }
};

const longestLine = (text, font) =>
  String(text)
    .split("\n")
    .reduce((max, line) => Math.max(max, textWidth(line, font)), 0);

export default function useFitColumns({
  columns,
  rows,
  containerRef,
  enabled = true,
  hidden = {},
  headerScale = 0.875,
  apiRef,
}) {
  const { settings } = useThemeProvider();
  const [available, setAvailable] = React.useState(0);

  // Follow the card's width.
  React.useLayoutEffect(() => {
    const el = containerRef?.current;
    if (!enabled || !el || typeof ResizeObserver === "undefined") return undefined;
    const update = () => setAvailable(Math.floor(el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, enabled]);

  return React.useMemo(() => {
    if (!enabled || !columns?.length) return { columns, wrap: false };

    const fontScale = Number(settings?.fontScale || 1);
    const tableScale =
      settings?.tableDensity === "compact" ? 0.92 : settings?.tableDensity === "spacious" ? 1.08 : 1;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const family = getComputedStyle(containerRef?.current || document.body).fontFamily || "sans-serif";
    // Measured at the weights on screen - Settings > Font > Text weight.
    const W = TEXT_WEIGHT_LEVELS[settings?.textWeight] || TEXT_WEIGHT_LEVELS.normal;
    const cellFont = `${W.regular} ${(0.875 * fontScale * tableScale * rem).toFixed(2)}px ${family}`;
    const boldFont = `${W.semibold} ${(0.875 * fontScale * tableScale * rem).toFixed(2)}px ${family}`;
    const headFont = `${W.semibold} ${(headerScale * fontScale * tableScale * rem).toFixed(2)}px ${family}`;

    const sample = (rows || []).slice(0, SAMPLE_ROWS);
    const api = apiRef?.current;

    const plan = [];
    columns.forEach((col) => {
      if (hidden[col.field] === false) return;
      const label = String(col.headerName ?? col.field ?? "");
      const headerOneLine = Math.ceil(textWidth(label, headFont) + HEADER_PAD);
      const words = label.split(/\s+/).filter(Boolean);
      const longestWord = words.reduce((max, word) => Math.max(max, textWidth(word, headFont)), 0);
      // Two lines: at least the longest word, and about half the heading.
      const headerTwoLines = Math.ceil(Math.max(longestWord, textWidth(label, headFont) / 2 + 6) + HEADER_PAD - 26);

      let content = 0;
      sample.forEach((row) => {
        const font = row?.__isTotal || row?.id === "total" ? boldFont : cellFont;
        // A cell drawn as stacked lines says so with fitLines(row) -> [lines].
        if (col.fitLines && !(row?.__isTotal || row?.id === "total")) {
          let lines = [];
          try {
            lines = col.fitLines(row) || [];
          } catch {
            lines = [];
          }
          lines.forEach((line) => {
            content = Math.max(content, textWidth(String(line ?? ""), font));
          });
          return;
        }
        const text = cellText(col, row, api);
        if (!text) return;
        content = Math.max(content, longestLine(text, font));
      });
      content = content ? Math.ceil(content + CELL_PAD) : 0;

      const declared = col.width ?? col.minWidth;
      const wrappable = isWrappable(col);
      // A cell the screen draws itself (icons, chips, two lines in one cell)
      // can show a little more than its value: it is offered the width the
      // screen gave it when there is room, and gives up width only down to
      // its value plus a margin. One with no value at all (an actions column)
      // keeps its width.
      const drawn = Boolean(col.renderCell) || col.type === "actions";
      const cell = drawn ? Math.max(content, declared || 0) : content;
      const need = Math.min(Math.max(cell, headerOneLine, 48), col.maxWidth ?? Infinity);
      const contentFloor = drawn ? (content ? Math.ceil(content * 1.08) : declared || 0) : cell;
      const cellFloor = wrappable
        ? Math.min(contentFloor, Math.max(TEXT_FLOOR, Math.round(contentFloor * 0.5)))
        : contentFloor;
      const floor = Math.min(need, Math.max(cellFloor, headerTwoLines, 40));
      plan.push({ col, need, floor, text: content || cell, wrappable });
    });

    const total = plan.reduce((sum, p) => sum + p.need, 0);
    // Leave room for the grid's own vertical scrollbar and border.
    const room = Math.max(0, available - 18);
    const targets = new Map();
    if (!room || total <= room) {
      plan.forEach((p) => targets.set(p.col.field, p.need));
    } else {
      const floorTotal = plan.reduce((sum, p) => sum + p.floor, 0);
      const slack = total - floorTotal;
      const deficit = total - room;
      plan.forEach((p) => {
        const target = slack <= 0 || deficit >= slack ? p.floor : p.need - ((p.need - p.floor) * deficit) / slack;
        targets.set(p.col.field, target);
      });
    }

    const wrap = plan.some((p) => p.wrappable && targets.get(p.col.field) < p.text - 1);

    const fitted = columns.map((col) => {
      const p = plan.find((entry) => entry.col === col);
      if (!p) return col;
      const target = targets.get(col.field);
      // Flex in proportion to the target, so the grid hands out the exact
      // width it has (scrollbar or not); minWidth holds the floor.
      // eslint-disable-next-line no-unused-vars
      const { width, ...rest } = col;
      return {
        ...rest,
        flex: Math.max(1, Math.round(target)),
        minWidth: Math.max(40, Math.floor(Math.min(p.floor, target))),
      };
    });

    return { columns: fitted, wrap };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, columns, rows, available, hidden, headerScale, settings?.fontScale, settings?.tableDensity, settings?.fontFamily, settings?.textWeight]);
}
