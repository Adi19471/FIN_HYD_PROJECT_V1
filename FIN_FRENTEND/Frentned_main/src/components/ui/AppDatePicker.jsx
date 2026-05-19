import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, isValid, parseISO } from "date-fns";

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return isValid(date) ? date : null;
  }
  const parsed = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(parsed) ? parsed : null;
};

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
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={toDate(value)}
        disabled={disabled}
        format="dd-MMM-yyyy"
        onChange={(newValue) => {
          onChange?.(newValue && isValid(newValue) ? format(newValue, "yyyy-MM-dd") : "");
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
