import React from "react";
import dayjs from "dayjs";

const toDayjs = (value) => {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const format = (value) => value.format("YYYY-MM-DD");

/**
 * useDateRange - a From/To date pair.
 *
 * Picking a From date fills To with today's date, so the default range is
 * "From ... up to date" instead of being snapped to the end of From's month.
 * A To date the user already picked is left alone (it is only replaced when it
 * would fall before the new From), and To's calendar is open-ended so a range
 * can span months - e.g. 01-Jan to today, or a future maturity/due date.
 */
export default function useDateRange(initialFrom = "", initialTo = "") {
  const [fromDate, setFromDateRaw] = React.useState(initialFrom);
  const [toDate, setToDate] = React.useState(initialTo);

  const setFromDate = React.useCallback((nextFrom) => {
    setFromDateRaw(nextFrom);
    const from = toDayjs(nextFrom);
    if (!from) return;

    setToDate((currentTo) => {
      const to = toDayjs(currentTo);
      // Keep the user's own To date as long as it is still on/after From.
      if (to && !to.isBefore(from, "day")) return currentTo;
      // Default to today; a From in the future would make today invalid, so
      // fall back to From itself in that case.
      const today = dayjs();
      return format(today.isBefore(from, "day") ? from : today);
    });
  }, []);

  const fromDayjs = React.useMemo(() => toDayjs(fromDate), [fromDate]);
  const toDateMin = React.useMemo(() => fromDayjs ?? undefined, [fromDayjs]);
  // No upper bound - To is a free "up to date" selection, not a month boundary.
  const toDateMax = undefined;

  return { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax };
}
