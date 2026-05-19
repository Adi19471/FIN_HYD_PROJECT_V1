// Persistent session helper.
// localStorage keeps auth available when a user opens app screens in a new tab.
const isBrowser = typeof window !== "undefined";

const stores = () => {
  if (!isBrowser) return [];
  return [window.sessionStorage, window.localStorage].filter(Boolean);
};

export function setSession(key, value) {
  if (!isBrowser) return;
  try {
    const v = typeof value === "string" ? value : JSON.stringify(value);
    stores().forEach((store) => store.setItem(key, v));
  } catch (e) {
    console.error("setSession error", e);
  }
}

export function getSession(key) {
  if (!isBrowser) return null;
  try {
    const v = window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
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
    stores().forEach((store) => store.removeItem(key));
  } catch (e) {
    console.error("removeSession error", e);
  }
}

export default { setSession, getSession, removeSession };
