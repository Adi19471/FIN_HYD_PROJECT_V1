import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/authStore";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import {
  ApartmentRounded,
  ArrowForwardRounded,
  LockRounded,
  PersonRounded,
  StorefrontRounded,
  VerifiedUserRounded,
} from "@mui/icons-material";
import { actionIcons } from "src/lib/icons";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { removeSession, setSession } from "src/utils/session";
import { setAuthToken, setRefreshToken } from "src/utils/authToken";
import {
  branchLabel,
  clearBranch,
  getCurrentBranch,
  hasBranchChoice,
  saveBranchInfo,
  setCurrentBranch,
} from "src/utils/branch";
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
 * What the sign-in leads into, shown on the picture side. Generic on purpose:
 * branch names are kept on Branch Master and only known after sign-in.
 */
const OFFICES = [
  { label: "Multiple branches", icon: StorefrontRounded },
  { label: "Branch-wise data", icon: ApartmentRounded },
  { label: "Secure access", icon: VerifiedUserRounded },
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
  // Step 2 of sign-in, for a user with more than one branch: a popup asking
  // which branch to work in. Holds the signed-in user until one is chosen.
  const [branchStep, setBranchStep] = useState(null);
  const [chosenBranch, setChosenBranch] = useState("");

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
        // The branches this user may work in (see src/utils/branch.js).
        const branch = saveBranchInfo(data);
        const user = {
          name,
          token,
          roles: normalizeRoles(data),
          permissions: normalizePermissionCodes(data),
        };

        setSession("username", name);
        if (rememberMe) localStorage.setItem("remembered-user", formData.username.trim());
        else localStorage.removeItem("remembered-user");

        if (hasBranchChoice(branch)) {
          // Several branches: ask which one before opening the app.
          setChosenBranch(getCurrentBranch() || branch.branches[0]?.code || "");
          setBranchStep({ user, info: branch });
        } else {
          enterApp(user);
        }
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

  // Open the app in the branch now stored (see src/utils/branch.js).
  const enterApp = (user) => {
    login(user);
    successToast(`Welcome. Working in ${branchLabel() || "your branch"}`);
    navigate(getDefaultAuthorizedPath(user), { replace: true });
  };

  const confirmBranch = (event) => {
    event.preventDefault();
    if (!branchStep || !chosenBranch) return;
    setCurrentBranch(chosenBranch);
    enterApp(branchStep.user);
  };

  // Back to the password form as someone else: drop what step 1 stored.
  const useAnotherAccount = () => {
    removeSession("token");
    removeSession("refreshToken");
    clearBranch();
    setBranchStep(null);
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  const branchOptions = branchStep ? branchStep.info.branches : [];

  const passwordMessage = errors.password
    ? { tone: "is-error", text: errors.password }
    : capsLock
    ? { tone: "is-warn", text: "Caps Lock is on" }
    : null;

  return (
    <div className="auth-page is-card">
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
          <h1 className="auth-title">
            Welcome back,
            <br />
            sign in to your branch
          </h1>
          <p className="auth-lead">
            Use your username and password. If you work in more than one branch, you will be asked which
            branch to open.
          </p>

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

      {/* ---------------- Picture side ----------------
          Sri Venkateswara Swamy in an arched frame, the company's promise
          under it, and the office structure the sign-in leads into. */}
      <aside className={`auth-art ${deityImage ? "has-portrait" : ""}`} aria-label="About Sri Balaji Finance">
        <span className="auth-art-glow one" aria-hidden="true" />
        <span className="auth-art-glow two" aria-hidden="true" />

        {deityImage && (
          <figure className="auth-deity">
            <span className="auth-deity-halo" aria-hidden="true" />
            <img src={DEITY_IMAGE} alt="Sri Venkateswara Swamy" onError={() => setDeityImage(false)} />
          </figure>
        )}

        <div className="auth-art-copy">
          <span className="auth-eyebrow">Om Namo Venkatesaya</span>
          <h2 className="auth-headline">
            One finance house,
            <br />
            every branch in step.
          </h2>
          <p className="auth-art-lead">
            {COMPANY_NAME}: every branch keeps its own customers, loans, cash book and collections. Sign in
            and work in the branch you choose.
          </p>

          <ul className="auth-offices" aria-label="Offices">
            {OFFICES.map((office, index) => {
              const Icon = office.icon;
              return (
                <li key={office.label} className="auth-office" style={{ "--i": index }}>
                  <Icon fontSize="small" aria-hidden="true" />
                  <span>{office.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>


      {/* Step 2: a user with several branches picks one before entering. */}
      <Dialog
        open={Boolean(branchStep)}
        onClose={useAnotherAccount}
        maxWidth="xs"
        fullWidth
        aria-labelledby="auth-branch-title"
        PaperProps={{ className: "auth-page is-card auth-branch-dialog" }}
      >
        <DialogContent>
          {branchStep && (
                <>
                  <h2 className="auth-title" id="auth-branch-title">Choose your branch</h2>
                  <p className="auth-lead">
                    Signed in as <strong>{branchStep.user.name}</strong>. Pick the branch to work in; you can switch
                    later from the top bar.
                  </p>

                  <form onSubmit={confirmBranch} className="auth-form">
                    <div className="auth-branches" role="radiogroup" aria-label="Branch">
                      {branchOptions.map((branch) => {
                        const selected = chosenBranch === branch.code;
                        return (
                          <button
                            key={branch.code}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={`auth-branch ${selected ? "is-selected" : ""}`}
                            onClick={() => setChosenBranch(branch.code)}
                          >
                            <span className="auth-branch-icon" aria-hidden="true">
                              <ApartmentRounded fontSize="small" />
                            </span>
                            <span className="auth-branch-text">
                              <strong>{branch.name}</strong>
                              {branch.location && <span>{branch.location}</span>}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button type="submit" className="auth-submit" disabled={!chosenBranch}>
                      Continue
                      <ArrowForwardRounded fontSize="small" aria-hidden="true" />
                    </button>
                    <button type="button" className="auth-link" onClick={useAnotherAccount}>
                      Use a different account
                    </button>
                  </form>
                </>
          )}
        </DialogContent>
      </Dialog>

      <EnterpriseThemePanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Login;
