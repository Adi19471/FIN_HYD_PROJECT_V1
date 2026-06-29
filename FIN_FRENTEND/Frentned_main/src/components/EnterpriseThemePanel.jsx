import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { PaletteRounded, RestartAltRounded } from "@mui/icons-material";
import { useThemeProvider } from "../utils/ThemeContext";

const colorOptions = [
  { value: "trust", label: "Trust Blue", color: "#0f62fe" },
  { value: "emerald", label: "Finance Green", color: "#047857" },
  { value: "executive", label: "Executive Slate", color: "#334155" },
  { value: "royal", label: "Royal Indigo", color: "#4338ca" },
  { value: "sunrise", label: "Sunrise Gold", color: "#b45309" },
  { value: "steel", label: "Steel Teal", color: "#0f766e" },
  { value: "graphite", label: "Graphite", color: "#18181b" },
];

const fontOptions = [
  "Inter",
  "Roboto",
  "Poppins",
  "Manrope",
  "Open Sans",
  "Lato",
  "Nunito",
  "System",
];

const zoomOptions = [
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
  { value: 1.25, label: "125%" },
  { value: 1.5, label: "150%" },
];

export default function EnterpriseThemePanel({ open, onClose }) {
  const { currentTheme, settings, changeCurrentTheme, updateThemeSetting, resetThemeSettings } =
    useThemeProvider();

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 420 } } }}>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <PaletteRounded color="primary" />
          <Typography variant="h6">Interface Settings</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Customize the finance workspace and keep preferences saved on this device.
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Appearance
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={currentTheme}
            onChange={(_, value) => value && changeCurrentTheme(value)}
            size="small"
          >
            <ToggleButton value="light">Light</ToggleButton>
            <ToggleButton value="dark">Dark</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel>Color Theme</InputLabel>
          <Select
            label="Color Theme"
            value={settings.colorTheme}
            onChange={(event) => updateThemeSetting("colorTheme", event.target.value)}
          >
            {colorOptions.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: option.color }} />
                  <span>{option.label}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Font Family</InputLabel>
          <Select
            label="Font Family"
            value={settings.fontFamily}
            onChange={(event) => updateThemeSetting("fontFamily", event.target.value)}
          >
            {fontOptions.map((font) => (
              <MenuItem value={font} key={font} sx={{ fontFamily: font === "System" ? "system-ui" : font }}>
                {font === "System" ? "System UI" : font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle2">Font Size</Typography>
          <Slider
            min={1}
            max={1.28}
            step={0.02}
            value={Number(settings.fontScale)}
            onChange={(_, value) => updateThemeSetting("fontScale", value)}
            valueLabelDisplay="auto"
          />
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel>Screen Zoom</InputLabel>
          <Select
            label="Screen Zoom"
            value={Number(settings.screenScale || 1)}
            onChange={(event) => updateThemeSetting("screenScale", Number(event.target.value))}
          >
            {zoomOptions.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Density
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={settings.density}
            onChange={(_, value) => value && updateThemeSetting("density", value)}
            size="small"
          >
            <ToggleButton value="compact">Compact</ToggleButton>
            <ToggleButton value="comfortable">Comfortable</ToggleButton>
            <ToggleButton value="spacious">Spacious</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Table Format
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={settings.tableStyle}
            onChange={(_, value) => value && updateThemeSetting("tableStyle", value)}
            size="small"
          >
            <ToggleButton value="striped">Striped</ToggleButton>
            <ToggleButton value="bordered">Bordered</ToggleButton>
            <ToggleButton value="clean">Clean</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={settings.tableDensity}
            onChange={(_, value) => value && updateThemeSetting("tableDensity", value)}
            size="small"
            sx={{ mt: 1 }}
          >
            <ToggleButton value="compact">Fast</ToggleButton>
            <ToggleButton value="standard">Standard</ToggleButton>
            <ToggleButton value="spacious">Review</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Forms
          </Typography>
          <ToggleButtonGroup
            exclusive
            fullWidth
            value={settings.formStyle}
            onChange={(_, value) => value && updateThemeSetting("formStyle", value)}
            size="small"
          >
            <ToggleButton value="filled">Filled</ToggleButton>
            <ToggleButton value="outlined">Outlined</ToggleButton>
            <ToggleButton value="minimal">Minimal</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="subtitle2">Border Radius</Typography>
          <Slider
            min={6}
            max={20}
            step={1}
            value={Number(settings.radius)}
            onChange={(_, value) => updateThemeSetting("radius", value)}
            valueLabelDisplay="auto"
          />
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel>Navbar Style</InputLabel>
          <Select
            label="Navbar Style"
            value={settings.navbarStyle}
            onChange={(event) => updateThemeSetting("navbarStyle", event.target.value)}
          >
            <MenuItem value="glass">Glass</MenuItem>
            <MenuItem value="solid">Solid</MenuItem>
            <MenuItem value="rounded">Rounded</MenuItem>
            <MenuItem value="compact">Compact</MenuItem>
            <MenuItem value="accent">Accent Line</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Icon Style</InputLabel>
          <Select
            label="Icon Style"
            value={settings.iconStyle}
            onChange={(event) => updateThemeSetting("iconStyle", event.target.value)}
          >
            <MenuItem value="rounded">Rounded</MenuItem>
            <MenuItem value="soft">Soft Fill</MenuItem>
            <MenuItem value="sharp">Sharp</MenuItem>
            <MenuItem value="pulse">Pulse</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Loading Style</InputLabel>
          <Select
            label="Loading Style"
            value={settings.loadingStyle}
            onChange={(event) => updateThemeSetting("loadingStyle", event.target.value)}
          >
            <MenuItem value="pulse">Pulse</MenuItem>
            <MenuItem value="bar">Progress Bar</MenuItem>
            <MenuItem value="spinner">Spinner</MenuItem>
          </Select>
        </FormControl>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
          <Typography variant="subtitle2">Preview</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
            <Button size="small" variant="contained">Save</Button>
            <Button size="small" variant="outlined">Export</Button>
            <Button size="small" color="success" variant="contained">Posted</Button>
          </Stack>
          <Stack spacing={0.75} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={settings.tableStyle} color="primary" variant="outlined" />
              <Typography variant="body2">Table rows, buttons, menus, forms, and tabs follow this scale.</Typography>
            </Stack>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                fontSize: "0.82rem",
              }}
            >
              {["Account", "Due", "Status", "Balaji Traders", "12,450", "Open"].map((cell, index) => (
                <Box
                  key={`${cell}-${index}`}
                  sx={{
                    px: 1,
                    py: settings.tableDensity === "compact" ? 0.65 : settings.tableDensity === "spacious" ? 1.25 : 0.9,
                    fontWeight: index < 3 ? 900 : 650,
                    bgcolor: index < 3 ? "action.hover" : index > 2 && settings.tableStyle === "striped" ? "background.paper" : "transparent",
                    borderRight: index % 3 !== 2 ? 1 : 0,
                    borderBottom: index < 3 ? 1 : 0,
                    borderColor: "divider",
                  }}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          </Stack>
        </Paper>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RestartAltRounded />}
          onClick={resetThemeSettings}
        >
          Reset Preferences
        </Button>
      </Stack>
    </Drawer>
  );
}
