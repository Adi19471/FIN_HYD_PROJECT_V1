import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";

/**
 * FormGrid - Consistent responsive grid for forms
 * @param {Array} fields - Array of field objects
 * @param {object} form - Form state object
 * @param {function} onChange - Change handler
 * @param {object} errors - Error state object
 * @param {number} columns - Number of columns (default: 2)
 */
const FormGrid = ({
  fields = [],
  form = {},
  onChange,
  errors = {},
  columns = 2,
}) => {
  // Calculate responsive breakpoints based on columns
  const getGridSize = () => {
    switch (columns) {
      case 1:
        return { xs: 12 };
      case 2:
        return { xs: 12, sm: 6 };
      case 3:
        return { xs: 12, sm: 6, md: 4 };
      case 4:
        return { xs: 12, sm: 6, md: 3 };
      default:
        return { xs: 12, sm: 6 };
    }
  };

  const gridSize = getGridSize();

  return (
    <Grid container spacing={2}>
      {fields.map((field, index) => {
        const {
          name,
          label,
          type = "text",
          required = false,
          select = false,
          options = [],
          multiline = false,
          rows = 3,
          disabled = false,
          fullWidth = true,
          InputProps,
          InputLabelProps,
          helperText,
          onChange: fieldOnChange,
          ...fieldProps
        } = field;

        const handleChange = (e) => {
          const value = e.target.value;
          if (onChange) {
            onChange(name, value);
          }
          if (fieldOnChange) {
            fieldOnChange(e);
          }
        };

        return (
          <Grid item key={name || index} {...gridSize}>
            <field.component
              name={name}
              label={label}
              type={type}
              value={form[name] || ""}
              onChange={handleChange}
              error={!!errors[name]}
              helperText={errors[name] || helperText}
              required={required}
              select={select}
              options={options}
              multiline={multiline}
              rows={rows}
              disabled={disabled}
              fullWidth={fullWidth}
              InputProps={InputProps}
              InputLabelProps={InputLabelProps}
              size="small"
              {...fieldProps}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

/**
 * FormRow - Single row with multiple fields
 */
export const FormRow = ({ children, spacing = 2 }) => {
  return (
    <Grid container spacing={spacing}>
      {React.Children.map(children, (child) => (
        <Grid item xs={12} sm={6}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * FormSection - Group related fields
 */
export const FormSection = ({ title, children, spacing = 2 }) => {
  return (
    <Paper className="enterprise-card" elevation={0} sx={{ mb: 3, p: { xs: 2, md: 2.5 } }}>
      {title && (
        <Box
          sx={{
            mb: 2,
            pb: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1">{title}</Typography>
        </Box>
      )}
      <Grid container spacing={spacing}>
        {children}
      </Grid>
    </Paper>
  );
};

export default FormGrid;

