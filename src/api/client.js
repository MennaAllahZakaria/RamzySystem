const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ramzy-system-backend.vercel.app/api/v1").replace(/\/$/, "");
export const authStorageKey = "ramzy_auth_token";
export function getAuthToken() { return localStorage.getItem(authStorageKey); }
export function setAuthToken(token) { if (token) localStorage.setItem(authStorageKey, token); else localStorage.removeItem(authStorageKey); }
function buildQuery(query = {}) { const params = new URLSearchParams(); Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== "") params.set(key, value); }); const search = params.toString(); return search ? `?${search}` : ""; }
export async function apiRequest(path, options = {}) {
  const { query, body, headers = {}, responseType = "auto", ...requestOptions } = options;
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}${buildQuery(query)}`, { ...requestOptions, headers: { Accept: "application/json", ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const contentType = response.headers.get("content-type") || "";
  const shouldReadBlob = responseType === "blob" || (responseType === "auto" && !contentType.includes("application/json") && !contentType.startsWith("text/"));
  const data = shouldReadBlob ? await response.blob() : contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) { let errorData = data; if (data instanceof Blob) { try { errorData = JSON.parse(await data.text()); } catch (_) { /* keep blob when the server returned a non-JSON error */ } } const error = new Error(errorData?.message || `Request failed with status ${response.status}`); error.status = response.status; error.data = errorData; throw error; }
  return data;
}
export const apiClient = { get: (path, query) => apiRequest(path, { method: "GET", query }), post: (path, body, query) => apiRequest(path, { method: "POST", body, query }), patch: (path, body, query) => apiRequest(path, { method: "PATCH", body, query }), put: (path, body, query) => apiRequest(path, { method: "PUT", body, query }), delete: (path, query) => apiRequest(path, { method: "DELETE", query }), download: (path, query) => apiRequest(path, { method: "GET", query, responseType: "blob" }) };
export { API_BASE_URL };
