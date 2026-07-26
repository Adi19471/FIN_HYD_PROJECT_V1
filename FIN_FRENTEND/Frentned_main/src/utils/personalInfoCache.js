import axios from "axios";
import { API_BASE } from "lib/config";

// Customer/Employee/Partner/Vendor screens all read from this same combined
// findAll endpoint and just filter client-side by category - share one
// short-lived cache across all of them so switching between these screens
// doesn't re-fetch the full table every time.
let personalInfoCache = null; // { data: [...], time: number }
const PERSONAL_INFO_CACHE_TTL = 15000;

export async function fetchAllPersonalInfo(headers, { force = false } = {}) {
  if (!force && personalInfoCache && Date.now() - personalInfoCache.time < PERSONAL_INFO_CACHE_TTL) {
    return personalInfoCache.data;
  }
  const res = await axios.get(`${API_BASE}/PersonalInfo/findAll`, { headers });
  const data = Array.isArray(res.data) ? res.data : [];
  personalInfoCache = { data, time: Date.now() };
  return data;
}
