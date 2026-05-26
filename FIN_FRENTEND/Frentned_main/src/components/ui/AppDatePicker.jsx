import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const toDayjs = (value) => {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const dateRangeEventName = "app-date-range-from-change";
const isFromDateLabel = (label = "") => /^from(\s+date)?$/i.test(String(label).trim());
const isToDateLabel = (label = "") => /^to(\s+date)?$/i.test(String(label).trim());

export default function AppDatePicker({
  label,
  value,
  onChange,
  size = "small",
  fullWidth = true,
  disabled = false,
  sx,
  textFieldProps = {},
}) {
  const shouldAutoUpdateToDate = isToDateLabel(label) && !disabled;

  React.useEffect(() => {
    if (!shouldAutoUpdateToDate) return undefined;

    const handleFromDateChange = (event) => {
      const nextValue = event.detail?.nextMonthDate;
      if (nextValue) onChange?.(nextValue);
    };

    window.addEventListener(dateRangeEventName, handleFromDateChange);
    return () => window.removeEventListener(dateRangeEventName, handleFromDateChange);
  }, [onChange, shouldAutoUpdateToDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={toDayjs(value)}
        disabled={disabled}
        format="DD-MMM-YYYY"
        onChange={(newValue) => {
          const selectedDate = newValue?.isValid?.() ? newValue : null;
          const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
          onChange?.(formattedDate);

          if (selectedDate && isFromDateLabel(label)) {
            window.dispatchEvent(
              new CustomEvent(dateRangeEventName, {
                detail: {
                  fromDate: formattedDate,
                  nextMonthDate: selectedDate.add(1, "month").format("YYYY-MM-DD"),
                },
              })
            );
          }
        }}
        slotProps={{
          textField: {
            size,
            fullWidth,
            sx,
            ...textFieldProps,
          },
        }}
      />
    </LocalizationProvider>
  );
}
