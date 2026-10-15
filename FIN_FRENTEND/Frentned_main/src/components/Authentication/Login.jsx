import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/authStore";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { ArrowForwardRounded, LockRounded, PersonRounded, VerifiedUserRounded } from "@mui/icons-material";
import { actionIcons, navIcons } from "src/lib/icons";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { setSession } from "src/utils/session";
import { setAuthToken, setRefreshToken } from "src/utils/authToken";
import { getDefaultAuthorizedPath, normalizePermissionCodes, normalizeRoles } from "src/utils/permissions";
import ThemeToggle from "../ThemeToggle";
import EnterpriseThemePanel from "../EnterpriseThemePanel";
import { useBranding } from "src/utils/ThemeContext";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import "./Login.css";

const Visibility = actionIcons.view;
const VisibilityOff = actionIcons.hide;
const SettingsIcon = actionIcons.settings;

// Devotional portrait shown on the picture side. Drop the picture at
// public/images/venkateswara.jpg (or .png and change this path) and it appears
// on its own; until then the panel simply goes without it.
const DEITY_IMAGE = "/images/venkateswara.jpg";

/**
 * What is inside, shown on the picture side. These are the application's own
 * sections, with the icons the menu gives them (src/lib/icons.js) - names
 * only: what a user may open is decided after sign-in, by their permissions.
 */
const MODULES = [
  { label: "Cash Book", note: "Receipts & payments", icon: navIcons.businessCashBook },
  { label: "Daily Book", note: "Each day's postings", icon: navIcons.dailyBook },
  { label: "Ledgers", note: "Accounts & receipts", icon: navIcons.accountLedger },
  { label: "Loans", note: "Monthly and daily", icon: navIcons.loan },
  { label: "Instalment Dues", note: "Due and overdue", icon: navIcons.instalmentDues },
  { label: "Reports", note: "Customers & partners", icon: navIcons.collectionReports },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { appName, tagline, logo, hasCustomLogo } = useBranding();
  // The same Theme settings as inside the app: this page is drawn from the
  // same accent, mode and font, so a change shows here straight away.
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe] = useState(true);
  // Caps Lock is the single commonest reason a correct password is rejected,
  // so the field says so rather than letting the server answer for it.
  const [capsLock, setCapsLock] = useState(false);
  // Hidden entirely if the picture has not been added yet, so the panel never
  // shows a broken image.
  const [deityImage, setDeityImage] = useState(true);

  // Prefill a previously remembered username.
  useEffect(() => {
    const remembered = localStorage.getItem("remembered-user");
    if (remembered) setFormData((prev) => ({ ...prev, username: remembered }));
  }, []);

  const trackCapsLock = (event) => {
    if (typeof event.getModifierState === "function") {
      setCapsLock(event.getModifierState("CapsLock"));
    }
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Enter your username";
    if (!formData.password) newErrors.password = "Enter your password";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || !validateForm()) return;

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username.trim(),
          password: formData.password,
        }),
      });

      const data = await resp.json();

      if (resp.ok && data.token) {
        const token = setAuthToken(data.token);
        setRefreshToken(data.refreshToken);
        const name = data.name || data.username || formData.username;
        const user = {
          name,
          token,
          roles: normalizeRoles(data),
          permissions: normalizePermissionCodes(data),
        };

        setSession("username", name);
        if (rememberMe) localStorage.setItem("remembered-user", formData.username.trim());
        else localStorage.removeItem("remembered-user");
        login(user);
        successToast("Login successful");
        navigate(getDefaultAuthorizedPath(user), { replace: true });
      } else {
        errorToast(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      errorToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordMessage = errors.password
    ? { tone: "is-error", text: errors.password }
    : capsLock
    ? { tone: "is-warn", text: "Caps Lock is on" }
    : null;

  return (
    <div className="auth-page">
      {/* ---------------- Sign-in side ---------------- */}
      <main className="auth-form-col">
        <header className="auth-top">
          <div className="auth-brand">
            <span className="auth-brand-mark">
              {/* a logo uploaded in Settings > Branding takes the plate; otherwise the emblem */}
              <img
                src={!hasCustomLogo && deityImage ? DEITY_IMAGE : logo}
                alt=""
                aria-hidden="true"
                onError={() => setDeityImage(false)}
              />
            </span>
            <span className="auth-brand-text">
              <strong>{appName}</strong>
              <span>{tagline}</span>
            </span>
          </div>

          <div className="auth-tools">
            <IconButton size="small" onClick={() => setSettingsOpen(true)} aria-label="Open theme settings" title="Theme settings">
              <SettingsIcon fontSize="small" />
            </IconButton>
            <ThemeToggle />
          </div>
        </header>

        <section className="auth-form-wrap">
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-lead">Welcome back. Enter your username and password to open the workspace.</p>

          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <div className={`auth-field ${errors.username ? "has-error" : ""}`}>
              <label htmlFor="auth-username">Username</label>
              <div className="auth-input">
                <PersonRounded className="auth-input-icon" aria-hidden="true" />
                <input
                  id="auth-username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange("username")}
                  placeholder="Enter your username"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  autoFocus
                  disabled={loading}
                  aria-invalid={errors.username ? "true" : undefined}
                  aria-describedby={errors.username ? "auth-username-msg" : undefined}
                />
              </div>
              {errors.username && (
                <p className="auth-msg is-error" id="auth-username-msg" role="alert">
                  {errors.username}
                </p>
              )}
            </div>

            <div className={`auth-field ${errors.password ? "has-error" : ""}`}>
              <label htmlFor="auth-password">Password</label>
              <div className="auth-input">
                <LockRounded className="auth-input-icon" aria-hidden="true" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  onKeyUp={trackCapsLock}
                  onKeyDown={trackCapsLock}
                  onBlur={() => setCapsLock(false)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  aria-invalid={errors.password ? "true" : undefined}
                  aria-describedby={passwordMessage ? "auth-password-msg" : undefined}
                />
                <button
                  type="button"
                  className="auth-input-action"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>
              {passwordMessage && (
                <p className={`auth-msg ${passwordMessage.tone}`} id="auth-password-msg" role={errors.password ? "alert" : "status"}>
                  {passwordMessage.text}
                </p>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowForwardRounded fontSize="small" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="auth-secure">
            <VerifiedUserRounded aria-hidden="true" />
            Authorised users only. Sign-ins may be recorded for audit.
          </p>
        </section>

        <footer className="auth-foot">
          © {new Date().getFullYear()} {COMPANY_NAME} · {COMPANY_ADDRESS}
        </footer>
      </main>

      {/* ---------------- Picture side ---------------- */}
      <aside className={`auth-art ${deityImage ? "has-portrait" : ""}`} aria-label="About the workspace">
        <span className="auth-art-grid" aria-hidden="true" />
        <span className="auth-art-glow one" aria-hidden="true" />
        <span className="auth-art-glow two" aria-hidden="true" />

        <div className="auth-art-copy">
          <span className="auth-eyebrow">{COMPANY_NAME}</span>
          <h2 className="auth-headline">Loans, ledgers and collections in one workspace.</h2>
          <p className="auth-art-lead">
            Cash books, daily and monthly finance, instalment dues and partner reports, kept together from the
            first receipt to the final statement.
          </p>

          <ul className="auth-tiles">
            {MODULES.map((module, index) => {
              const Icon = module.icon;
              return (
                <li key={module.label} className="auth-tile" style={{ "--i": index }}>
                  <span className="auth-tile-icon" aria-hidden="true">
                    <Icon fontSize="small" />
                  </span>
                  <span className="auth-tile-text">
                    <strong>{module.label}</strong>
                    <span>{module.note}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {deityImage && (
          <div className="auth-portrait" aria-hidden="true">
            <img src={DEITY_IMAGE} alt="" onError={() => setDeityImage(false)} />
          </div>
        )}
      </aside>

      <EnterpriseThemePanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Login;
