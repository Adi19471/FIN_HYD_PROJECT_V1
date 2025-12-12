// Local storage helper with safe JSON parsing
const hasWindow = typeof window !== "undefined" && !!window.localStorage;

export function setLocal(key, value) {
  if (!hasWindow) return;
  try {
    const v = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, v);
  } catch (e) {
    console.error("setLocal error", e);
  }
}

export function getLocal(key) {
  if (!hasWindow) return null;
  try {
    const v = window.localStorage.getItem(key);
    if (v === null) return null;
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  } catch (e) {
    console.error("getLocal error", e);
    return null;
  }
}

export function removeLocal(key) {
  if (!hasWindow) return;
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error("removeLocal error", e);
  }
}

export default { setLocal, getLocal, removeLocal };
