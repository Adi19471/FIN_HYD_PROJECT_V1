import React, { useEffect, useRef, useState } from "react";
import { Button, Drawer, IconButton, MenuItem, Slider, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import {
  CheckRounded,
  DarkModeRounded,
  LightModeRounded,
  PaletteRounded,
  RestartAltRounded,
  UploadRounded,
} from "@mui/icons-material";
import { actionIcons } from "src/lib/icons";
import { warningToast } from "toastify";
import { useBranding, useThemeProvider } from "../utils/ThemeContext";
import { contrastText } from "src/lib/themeTokens";
import {
  COLOR_THEMES,
  FONT_OPTIONS,
  LOGIN_STYLES,
  LOGO_TYPES,
  MAX_LOGO_BYTES,
  NAV_LAYOUTS,
  QUICK_ACCENTS,
  SURFACE_OPTIONS,
  TABLE_HEADER_OPTIONS,
  THEME_PRESETS,
  isHexColor,
} from "src/lib/themeOptions";
import { COMPANY_ADDRESS, COMPANY_APP_NAME } from "src/lib/company";
import "./EnterpriseThemePanel.css";

const CloseIcon = actionIcons.close;

const TABS = ["Theme", "Layout", "Colors", "Branding"];

const NAVBAR_STYLES = [
  { value: "glass", label: "Glass" },
  { value: "solid", label: "Solid" },
  { value: "rounded", label: "Rounded" },
  { value: "compact", label: "Compact" },
  { value: "accent", label: "Accent line" },
];

const DENSITIES = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

const TABLE_STYLES = [
  { value: "striped", label: "Striped" },
  { value: "bordered", label: "Bordered" },
  { value: "clean", label: "Clean" },
];

const TABLE_DENSITIES = [
  { value: "compact", label: "Fast" },
  { value: "standard", label: "Standard" },
  { value: "spacious", label: "Review" },
];

const FORM_STYLES = [
  { value: "filled", label: "Filled" },
  { value: "outlined", label: "Outlined" },
  { value: "minimal", label: "Minimal" },
];

const ICON_STYLES = [
  { value: "rounded", label: "Rounded" },
  { value: "soft", label: "Soft fill" },
  { value: "sharp", label: "Sharp" },
  { value: "pulse", label: "Pulse" },
];

const LOADING_STYLES = [
  { value: "pulse", label: "Pulse" },
  { value: "bar", label: "Progress bar" },
  { value: "spinner", label: "Spinner" },
];

const ZOOM_OPTIONS = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5];

const percent = (value) => `${Math.round(Number(value) * 100)}%`;

/* ---- building blocks (module level, so a re-render of the panel never
   remounts them - the colour well inside one would lose its drag) ---- */

const Section = ({ title, hint, children }) => (
  <section className="tp-section">
    <div className="tp-section-head">
      <span className="tp-section-title">{title}</span>
      {hint && <span className="tp-section-hint">{hint}</span>}
    </div>
    {children}
  </section>
);

const SubHead = ({ children }) => <div className="tp-subhead">{children}</div>;

const Segmented = ({ label, options, value, onChange }) => (
  <div className="tp-seg" role="group" aria-label={label}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={`tp-seg-btn ${value === option.value ? "is-active" : ""}`}
        aria-pressed={value === option.value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

/** How one colour choice is drawn as a chip. Choices without a colour of their own get a class instead. */
const swatchLook = (option) => {
  if (option.bg) return { style: { background: option.bg, color: contrastText(option.bg) } };
  return { className: `tp-swatch-${option.value}` };
};

const Swatches = ({ label, options, value, onChange }) => (
  <div className="tp-swatches" role="group" aria-label={label}>
    {options.map((option) => {
      const look = swatchLook(option);
      const active = value === option.value;
      return (
        <Tooltip key={option.value} title={option.label} arrow>
          <button
            type="button"
            className={`tp-swatch ${look.className || ""} ${active ? "is-active" : ""}`}
            style={look.style}
            aria-label={option.label}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            {active && <CheckRounded />}
          </button>
        </Tooltip>
      );
    })}
  </div>
);

/** Miniature of a menu layout, drawn from spans (.tp-nav-prev-<layout> in the stylesheet). */
const NavPreview = ({ layout }) => (
  <span className={`tp-nav-prev tp-nav-prev-${layout}`} aria-hidden="true">
    <span className="tp-nav-prev-rail">
      <span />
      <span />
      <span />
    </span>
    <span className="tp-nav-prev-body" />
  </span>
);

/**
 * Any colour as the accent: a colour well, the hex beside it, and a few quick
 * picks. Dragging in the well reports every pixel, and a new accent repaints
 * the whole application, so those are passed on a beat apart.
 */
const AccentPicker = ({ value, fallback, onPick, onReset }) => {
  const [text, setText] = useState(value ? value.toUpperCase() : "");
  const timer = useRef(null);

  useEffect(() => {
    setText(value ? value.toUpperCase() : "");
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const pickSoon = (hex) => {
    setText(hex.toUpperCase());
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onPick(hex), 90);
  };

  const typeHex = (raw) => {
    const typed = raw.trim();
    setText(typed);
    const hex = typed.startsWith("#") ? typed : `#${typed}`;
    if (isHexColor(hex)) onPick(hex.toLowerCase());
  };

  return (
    <>
      <div className="tp-accent">
        <input
          type="color"
          className="tp-accent-well"
          value={value || fallback}
          onChange={(event) => pickSoon(event.target.value)}
          aria-label="Pick a custom accent colour"
        />
        <input
          type="text"
          className="tp-accent-hex"
          value={text}
          placeholder="Not set"
          maxLength={7}
          spellCheck={false}
          onChange={(event) => typeHex(event.target.value)}
          aria-label="Custom accent as a hex colour"
        />
        {value && (
          <Tooltip title="Back to the theme colour" arrow>
            <IconButton size="small" onClick={onReset} aria-label="Remove the custom accent">
              <RestartAltRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Swatches
        label="Quick accent colours"
        options={QUICK_ACCENTS.map((hex) => ({ value: hex, label: hex.toUpperCase(), bg: hex }))}
        value={value || ""}
        onChange={onPick}
      />
    </>
  );
};

export default function EnterpriseThemePanel({ open, onClose }) {
  const { currentTheme, settings, changeCurrentTheme, updateThemeSetting, applyThemeSettings, resetThemeSettings } =
    useThemeProvider();
  const branding = useBranding();
  const [tab, setTab] = useState(0);
  const logoInput = useRef(null);
  const body = useRef(null);

  // Each tab starts at its top, not wherever the last one was scrolled to.
  const changeTab = (next) => {
    setTab(next);
    if (body.current) body.current.scrollTop = 0;
  };

  const set = (key) => (value) => updateThemeSetting(key, value);

  const namedAccent = (COLOR_THEMES[settings.colorTheme] || COLOR_THEMES.trust).primary;
  const menuIntegrated = settings.sidebarColor === "integrate";

  const presetActive = (preset) =>
    !settings.customAccent &&
    settings.mode === preset.mode &&
    settings.colorTheme === preset.colorTheme &&
    settings.sidebarColor === preset.sidebarColor &&
    settings.navbarColor === preset.navbarColor;

  // A preset or a named colour should win outright, so both drop a custom accent.
  const applyPreset = (preset) =>
    applyThemeSettings({
      mode: preset.mode,
      colorTheme: preset.colorTheme,
      sidebarColor: preset.sidebarColor,
      navbarColor: preset.navbarColor,
      customAccent: null,
    });

  const handleLogoFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!LOGO_TYPES.includes(file.type)) {
      warningToast("Use a PNG, JPG, WEBP or SVG image for the logo.");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      warningToast(`That image is too large. The logo can be up to ${Math.round(MAX_LOGO_BYTES / 1024)} KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateThemeSetting("brandLogo", String(reader.result || ""));
    reader.onerror = () => warningToast("That image could not be read. Try another file.");
    reader.readAsDataURL(file);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ className: "tp-paper" }}>
      <div className="tp-head">
        <span className="tp-head-icon">
          <PaletteRounded />
        </span>
        <div className="tp-head-text">
          <div className="tp-title">Theme settings</div>
          <div className="tp-sub">Every screen, the menu, the top bar and sign-in</div>
        </div>
        <IconButton onClick={onClose} aria-label="Close theme settings">
          <CloseIcon />
        </IconButton>
      </div>

      <Tabs value={tab} onChange={(_, next) => changeTab(next)} variant="fullWidth" className="tp-tabs">
        {TABS.map((name) => (
          <Tab key={name} label={name} />
        ))}
      </Tabs>

      <div className="tp-body" ref={body}>
        {/* ---------------- Theme ---------------- */}
        {tab === 0 && (
          <>
            <Section title="Mode">
              <div className="tp-mode-grid">
                {["light", "dark"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`tp-mode-card ${currentTheme === mode ? "is-active" : ""}`}
                    aria-pressed={currentTheme === mode}
                    onClick={() => changeCurrentTheme(mode)}
                  >
                    <span className={`tp-mode-preview tp-mode-preview-${mode}`} aria-hidden="true">
                      <span className="tp-mode-preview-rail" />
                      <span className="tp-mode-preview-body">
                        <span />
                        <span />
                        <span />
                      </span>
                    </span>
                    <span className="tp-mode-label">
                      {mode === "light" ? <LightModeRounded /> : <DarkModeRounded />}
                      {mode === "light" ? "Light" : "Dark"}
                    </span>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Presets" hint="Mode, colour and menu together">
              <div className="tp-presets">
                {THEME_PRESETS.map((preset) => (
                  <button key={preset.key} type="button" className="tp-preset" onClick={() => applyPreset(preset)}>
                    <span className="tp-preset-info">
                      <span className="tp-preset-name">{preset.name}</span>
                      <span className="tp-preset-desc">{preset.desc}</span>
                      <span className="tp-preset-dots">
                        {preset.dots.map((dot, index) => (
                          <span key={index} style={{ background: dot }} />
                        ))}
                      </span>
                    </span>
                    {presetActive(preset) && <CheckRounded className="tp-preset-check" />}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Theme colour">
              <Swatches
                label="Theme colour"
                options={Object.entries(COLOR_THEMES).map(([value, theme]) => ({ value, label: theme.label, bg: theme.primary }))}
                value={settings.customAccent ? "" : settings.colorTheme}
                onChange={(colorTheme) => applyThemeSettings({ colorTheme, customAccent: null })}
              />
            </Section>

            <Section title="Custom accent" hint="Any colour - overrides the theme colour">
              <AccentPicker
                value={settings.customAccent}
                fallback={namedAccent}
                onPick={set("customAccent")}
                onReset={() => updateThemeSetting("customAccent", null)}
              />
            </Section>
          </>
        )}

        {/* ---------------- Layout ---------------- */}
        {tab === 1 && (
          <>
            <Section
              title="Nav"
              hint={`${NAV_LAYOUTS.find((layout) => layout.value === settings.navLayout)?.label} · ${menuIntegrated ? "Integrate" : "Apparent"}`}
            >
              <SubHead>Layout</SubHead>
              <div className="tp-nav-tiles">
                {NAV_LAYOUTS.map((layout) => (
                  <button
                    key={layout.value}
                    type="button"
                    className={`tp-nav-tile ${settings.navLayout === layout.value ? "is-active" : ""}`}
                    aria-pressed={settings.navLayout === layout.value}
                    onClick={() => updateThemeSetting("navLayout", layout.value)}
                  >
                    <NavPreview layout={layout.value} />
                    <span className="tp-nav-tile-label">{layout.label}</span>
                  </button>
                ))}
              </div>

              <SubHead>Color</SubHead>
              <div className="tp-nav-colors">
                <button
                  type="button"
                  className={`tp-nav-color ${menuIntegrated ? "is-active" : ""}`}
                  aria-pressed={menuIntegrated}
                  onClick={() => updateThemeSetting("sidebarColor", "integrate")}
                >
                  <span className="tp-nav-color-icon" aria-hidden="true" />
                  Integrate
                </button>
                {/* any other menu colour counts as apparent; leaving Integrate goes back to the default plate */}
                <button
                  type="button"
                  className={`tp-nav-color tp-nav-color-apparent ${menuIntegrated ? "" : "is-active"}`}
                  aria-pressed={!menuIntegrated}
                  onClick={() => menuIntegrated && updateThemeSetting("sidebarColor", "default")}
                >
                  <span className="tp-nav-color-icon" aria-hidden="true" />
                  Apparent
                </button>
              </div>
              <p className="tp-note">
                Integrate blends the menu into the page. Apparent keeps it a solid colour - choose which one under Colors.
                On a phone the menu is always a drawer.
              </p>
            </Section>

            <Section title="Top bar">
              <Segmented label="Top bar style" options={NAVBAR_STYLES} value={settings.navbarStyle} onChange={set("navbarStyle")} />
            </Section>

            <Section
              title="Font"
              hint={`${FONT_OPTIONS.find((font) => font.value === settings.fontFamily)?.label} · ${percent(settings.fontScale)}`}
            >
              <SubHead>Family</SubHead>
              <div className="tp-font-grid">
                {FONT_OPTIONS.map((font) => {
                  const active = settings.fontFamily === font.value;
                  return (
                    <button
                      key={font.value}
                      type="button"
                      className={`tp-font-card ${active ? "is-active" : ""}`}
                      style={{ fontFamily: font.stack }}
                      aria-pressed={active}
                      onClick={() => updateThemeSetting("fontFamily", font.value)}
                    >
                      <span className="tp-font-sample" aria-hidden="true">
                        A<span>a</span>
                      </span>
                      <span className="tp-font-name">{font.label}</span>
                    </button>
                  );
                })}
              </div>

              <SubHead>Size</SubHead>
              <div className="tp-slider">
                <Slider
                  min={1}
                  max={1.28}
                  step={0.02}
                  value={Number(settings.fontScale)}
                  onChange={(_, value) => updateThemeSetting("fontScale", value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={percent}
                  aria-label="Text size"
                />
              </div>
            </Section>

            <Section title="Screen">
              <SubHead>Zoom</SubHead>
              <TextField
                select
                fullWidth
                size="small"
                value={Number(settings.screenScale || 1)}
                onChange={(event) => updateThemeSetting("screenScale", Number(event.target.value))}
                inputProps={{ "aria-label": "Screen zoom" }}
              >
                {ZOOM_OPTIONS.map((zoom) => (
                  <MenuItem value={zoom} key={zoom}>
                    {percent(zoom)}
                  </MenuItem>
                ))}
              </TextField>

              <SubHead>Density</SubHead>
              <Segmented label="Density" options={DENSITIES} value={settings.density} onChange={set("density")} />

              <SubHead>Corner radius</SubHead>
              <div className="tp-slider">
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={Number(settings.radius)}
                  onChange={(_, value) => updateThemeSetting("radius", value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                  aria-label="Corner radius"
                />
              </div>
            </Section>

            <Section title="Icons and loading">
              <SubHead>Icon style</SubHead>
              <Segmented label="Icon style" options={ICON_STYLES} value={settings.iconStyle} onChange={set("iconStyle")} />
              <SubHead>Loading style</SubHead>
              <Segmented label="Loading style" options={LOADING_STYLES} value={settings.loadingStyle} onChange={set("loadingStyle")} />
            </Section>
          </>
        )}

        {/* ---------------- Colors ---------------- */}
        {tab === 2 && (
          <>
            <Section title="Menu" hint={SURFACE_OPTIONS.find((option) => option.value === settings.sidebarColor)?.label}>
              <Swatches label="Menu colour" options={SURFACE_OPTIONS} value={settings.sidebarColor} onChange={set("sidebarColor")} />
            </Section>

            <Section title="Top bar" hint={SURFACE_OPTIONS.find((option) => option.value === settings.navbarColor)?.label}>
              <Swatches label="Top bar colour" options={SURFACE_OPTIONS} value={settings.navbarColor} onChange={set("navbarColor")} />
            </Section>

            <Section title="Table header" hint="On screen and in exports">
              <Swatches label="Table header colour" options={TABLE_HEADER_OPTIONS} value={settings.tableHeader} onChange={set("tableHeader")} />
            </Section>

            <Section title="Tables">
              <SubHead>Format</SubHead>
              <Segmented label="Table format" options={TABLE_STYLES} value={settings.tableStyle} onChange={set("tableStyle")} />
              <SubHead>Rows</SubHead>
              <Segmented label="Table rows" options={TABLE_DENSITIES} value={settings.tableDensity} onChange={set("tableDensity")} />

              <div className={`tp-table-preview tp-table-preview-${settings.tableStyle} tp-table-preview-${settings.tableDensity}`} aria-hidden="true">
                {["Account", "Due", "Status", "Balaji Traders", "12,450", "Open", "Sri Lakshmi Stores", "8,200", "Paid"].map((cell, index) => (
                  <span key={`${cell}-${index}`} className={index < 3 ? "is-head" : index > 5 ? "is-alt" : ""}>
                    {cell}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="Forms">
              <Segmented label="Form style" options={FORM_STYLES} value={settings.formStyle} onChange={set("formStyle")} />
            </Section>

            <Section title="Sign-in page" hint={LOGIN_STYLES.find((style) => style.value === settings.loginStyle)?.label}>
              <div className="tp-login-tiles">
                {LOGIN_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    className={`tp-login-tile ${settings.loginStyle === style.value ? "is-active" : ""}`}
                    aria-pressed={settings.loginStyle === style.value}
                    onClick={() => updateThemeSetting("loginStyle", style.value)}
                  >
                    {/* the page in miniature: form on the left, picture side on the right */}
                    <span className={`tp-login-prev tp-login-prev-${style.value}`} aria-hidden="true">
                      <span className="tp-login-prev-form">
                        <span />
                        <span />
                        <span />
                      </span>
                      <span className="tp-login-prev-art" />
                    </span>
                    <span className="tp-nav-tile-label">{style.label}</span>
                  </button>
                ))}
              </div>
              <p className="tp-note">The picture side of the sign-in page. Its colours follow the theme colour above.</p>
            </Section>
          </>
        )}

        {/* ---------------- Branding ---------------- */}
        {tab === 3 && (
          <>
            <Section title="Name" hint="Menu, top bar and sign-in">
              <div className="tp-fields">
                <TextField
                  fullWidth
                  size="small"
                  label="App name"
                  value={settings.brandName}
                  placeholder={COMPANY_APP_NAME}
                  onChange={(event) => updateThemeSetting("brandName", event.target.value)}
                  inputProps={{ maxLength: 40 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Line under the name"
                  value={settings.brandTagline}
                  placeholder={COMPANY_ADDRESS}
                  onChange={(event) => updateThemeSetting("brandTagline", event.target.value)}
                  inputProps={{ maxLength: 60 }}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </Section>

            <Section title="Logo">
              <div className="tp-brand-row">
                <img className="tp-brand-preview" src={branding.logo} alt="Current logo" />
                <div className="tp-brand-info">
                  <span className="tp-brand-label">{branding.appName}</span>
                  <span className="tp-brand-hint">{branding.hasCustomLogo ? "Custom image" : "Default image"}</span>
                </div>
                <Tooltip title="Upload a logo" arrow>
                  <IconButton onClick={() => logoInput.current?.click()} aria-label="Upload a logo">
                    <UploadRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Back to the default logo" arrow>
                  <span>
                    <IconButton
                      onClick={() => updateThemeSetting("brandLogo", "")}
                      disabled={!branding.hasCustomLogo}
                      aria-label="Remove the custom logo"
                    >
                      <RestartAltRounded />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
              <input ref={logoInput} type="file" accept={LOGO_TYPES.join(",")} hidden onChange={handleLogoFile} />
              <p className="tp-note">
                PNG, JPG, WEBP or SVG, up to {Math.round(MAX_LOGO_BYTES / 1024)} KB. Reports and exports keep the registered
                company name.
              </p>
            </Section>
          </>
        )}
      </div>

      <div className="tp-foot">
        <span className="tp-foot-note">Saved on this device as you change it</span>
        <Button variant="outlined" color="inherit" size="small" startIcon={<RestartAltRounded />} onClick={resetThemeSettings}>
          Reset
        </Button>
        <Button variant="contained" size="small" onClick={onClose}>
          Done
        </Button>
      </div>
    </Drawer>
  );
}
