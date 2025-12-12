// Session storage helper
const isBrowser = typeof window !== "undefined" && !!window.sessionStorage;

export function setSession(key, value) {
  if (!isBrowser) return;
  try {
    const v = typeof value === "string" ? value : JSON.stringify(value);
    window.sessionStorage.setItem(key, v);
  } catch (e) {
    console.error("setSession error", e);
  }
}

export function getSession(key) {
  if (!isBrowser) return null;
  try {
    const v = window.sessionStorage.getItem(key);
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
  } catch (e) {
    console.error("removeSession error", e);
  }
}

export default { setSession, getSession, removeSession };
