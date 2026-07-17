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

export default function AppDatePicker({
  label,
  value,
  onChange,
  size = "small",
  fullWidth = true,
  disabled = false,
  minDate,
  maxDate,
  sx,
  textFieldProps = {},
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={toDayjs(value)}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        format="DD-MMM-YYYY"
        onChange={(newValue) => {
          const selectedDate = newValue?.isValid?.() ? newValue : null;
          const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";
          onChange?.(formattedDate);
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
