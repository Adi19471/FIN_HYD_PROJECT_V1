// Lightweight fetch wrapper for API calls
// Uses `import.meta.env.VITE_API_BASE` as base URL. Returns parsed JSON and
// throws a consistent Error object on non-2xx responses.

const API_BASE = import.meta.env.VITE_API_BASE || "";

function buildUrl(path) {
  if (!path) return API_BASE;
  // If path already contains full origin, use it
  try {
    const u = new URL(path);
    return u.toString();
  } catch {
    // not an absolute URL
  }
  // Ensure slashes are correct
  return `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const text = await res.text();
  let data = text;
  if (isJson && text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // fallback to raw text
    }
  }

  if (!res.ok) {
    const error = new Error(data?.message || res.statusText || "API Error");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function apiFetch(path, options = {}) {
  const url = buildUrl(path);
  const opts = {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body && { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  };

  if (opts.body && typeof opts.body !== "string") {
    opts.body = JSON.stringify(opts.body);
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (e) {
    const networkError = new Error("Network error");
    networkError.cause = e;
    throw networkError;
  }

  return handleResponse(res);
}

export default { apiFetch };
