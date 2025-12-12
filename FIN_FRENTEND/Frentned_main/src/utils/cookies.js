import Cookies from "js-cookie";

// Simple cookie helper wrapper around js-cookie
const DEFAULT_OPTIONS = { secure: true, sameSite: "Lax", path: "/" };

export function setCookie(name, value, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  // js-cookie will stringify objects if needed
  return Cookies.set(name, value, opts);
}

export function getCookie(name) {
  return Cookies.get(name);
}

export function removeCookie(name, options = {}) {
  const opts = { path: "/", ...options };
  return Cookies.remove(name, opts);
}

export default { setCookie, getCookie, removeCookie };
