import React from "react";
import dayjs from "dayjs";

const toDayjs = (value) => {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

/**
 * useDateRange - a From/To date pair where picking a From date auto-fills
 * To with the last day of that month, and constrains To's calendar so it
 * can't go past it (via the returned toDateMin/toDateMax).
 */
export default function useDateRange(initialFrom = "", initialTo = "") {
  const [fromDate, setFromDateRaw] = React.useState(initialFrom);
  const [toDate, setToDate] = React.useState(initialTo);

  const setFromDate = React.useCallback((nextFrom) => {
    setFromDateRaw(nextFrom);
    const parsed = toDayjs(nextFrom);
    if (parsed) setToDate(parsed.endOf("month").format("YYYY-MM-DD"));
  }, []);

  const fromDayjs = React.useMemo(() => toDayjs(fromDate), [fromDate]);
  const toDateMin = React.useMemo(() => fromDayjs ?? undefined, [fromDayjs]);
  const toDateMax = React.useMemo(
    () => (fromDayjs ? fromDayjs.endOf("month") : undefined),
    [fromDayjs]
  );

  return { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax };
}
