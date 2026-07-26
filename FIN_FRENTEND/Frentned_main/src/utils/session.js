// Persistent session helper.
// The session lives in a browser session cookie (no Expires/Max-Age), not
// localStorage: a session cookie is shared across every tab of the same
// browser (so opening a fresh/blank tab and entering a route directly still
// has access to it), but it's cleared once the browser itself is fully
// closed - so reopening the browser requires logging in again instead of
// silently resuming the old session.
const isBrowser = typeof window !== "undefined";

function setCookie(key, value) {
  const secure = window.location.protocol === "https:" ? ";Secure" : "";
  document.cookie = `${key}=${encodeURIComponent(value)};path=/;SameSite=Lax${secure}`;
}

function getCookie(key) {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${key}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function removeCookie(key) {
  document.cookie = `${key}=;path=/;max-age=0`;
}

export function setSession(key, value) {
  if (!isBrowser) return;
  try {
    const v = typeof value === "string" ? value : JSON.stringify(value);
    window.sessionStorage.setItem(key, v);
    setCookie(key, v);
  } catch (e) {
    console.error("setSession error", e);
  }
}

export function getSession(key) {
  if (!isBrowser) return null;
  try {
    const v = window.sessionStorage.getItem(key) ?? getCookie(key);
    if (v === null) return null;
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  } catch (e) {
    console.error("getSession error", e);
    return null;
  }
}

export function removeSession(key) {
  if (!isBrowser) return;
  try {
    window.sessionStorage.removeItem(key);
    removeCookie(key);
  } catch (e) {
    console.error("removeSession error", e);
  }
}

export default { setSession, getSession, removeSession };
