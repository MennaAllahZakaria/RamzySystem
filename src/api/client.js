const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ramzy-system-backend.vercel.app/api/v1").replace(/\/$/, "");
export const authStorageKey = "ramzy_auth_token";
const GET_CACHE_TTL_MS = 8_000;
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_READ_RETRIES = 2;
const responseCache = new Map();
const inFlightGets = new Map();
let cacheGeneration = 0;

export function getAuthToken() { return localStorage.getItem(authStorageKey); }
export function clearApiCache() { responseCache.clear(); cacheGeneration += 1; }
export function setAuthToken(token) {
  const previous = getAuthToken();
  if (token) localStorage.setItem(authStorageKey, token);
  else localStorage.removeItem(authStorageKey);
  if (previous !== (token || null)) clearApiCache();
}
function buildQuery(query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  const search = params.toString();
  return search ? `?${search}` : "";
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const transientStatus = (status) => [408, 429, 500, 502, 503, 504].includes(status);
const isNetworkFailure = (error) => !error?.status && error?.name !== "AbortError";
const isTemporaryFailure = (error) => isNetworkFailure(error) || transientStatus(error?.status);

async function performRequest(url, requestOptions, body, headers, responseType, method) {
  let lastError;
  const attempts = method === "GET" ? MAX_READ_RETRIES + 1 : 1;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        ...requestOptions,
        signal: requestOptions.signal || controller.signal,
        headers: {
          Accept: "application/json",
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
          ...headers,
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      const contentType = response.headers.get("content-type") || "";
      const shouldReadBlob = responseType === "blob" || (responseType === "auto" && !contentType.includes("application/json") && !contentType.startsWith("text/"));
      const data = shouldReadBlob ? await response.blob() : contentType.includes("application/json") ? await response.json() : await response.text();
      if (!response.ok) {
        if (attempt + 1 < attempts && transientStatus(response.status)) {
          const retryAfter = Number(response.headers.get("retry-after"));
          await wait(retryAfter > 0 ? Math.min(retryAfter * 1000, 1_500) : 300 * (2 ** attempt));
          continue;
        }
        let errorData = data;
        if (data instanceof Blob) {
          try { errorData = JSON.parse(await data.text()); } catch { /* retain the non-JSON response */ }
        }
        const error = new Error(errorData?.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      return { data, contentType };
    } catch (error) {
      lastError = error;
      if (attempt + 1 >= attempts || error?.status || requestOptions.signal?.aborted) break;
      await wait(300 * (2 ** attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  if (isNetworkFailure(lastError)) {
    const error = new Error("تعذر الاتصال بالخادم بعد عدة محاولات. تحققي من الإنترنت ثم أعيدي المحاولة.");
    error.cause = lastError;
    error.code = "API_UNAVAILABLE";
    throw error;
  }
  if (lastError?.name === "AbortError") {
    const error = new Error("استغرق رد الخادم وقتًا أطول من المعتاد. أعيدي المحاولة بعد لحظات.");
    error.cause = lastError;
    error.code = "API_TIMEOUT";
    throw error;
  }
  throw lastError;
}

export async function apiRequest(path, options = {}) {
  const { query, body, headers = {}, responseType = "auto", ...requestOptions } = options;
  const method = (requestOptions.method || "GET").toUpperCase();
  const url = `${API_BASE_URL}${path}${buildQuery(query)}`;
  const cacheKey = `${getAuthToken() || "anonymous"}:${url}`;
  const cacheable = method === "GET" && responseType === "auto";
  const cached = cacheable ? responseCache.get(cacheKey) : null;
  if (cacheable && cached && cached.expiresAt > Date.now()) return cached.data;
  if (cacheable && inFlightGets.has(cacheKey)) return inFlightGets.get(cacheKey);

  const generation = cacheGeneration;
  const request = performRequest(url, requestOptions, body, headers, responseType, method)
    .then(({ data, contentType }) => {
      if (cacheable && contentType.includes("application/json") && generation === cacheGeneration) responseCache.set(cacheKey, { data, expiresAt: Date.now() + GET_CACHE_TTL_MS });
      if (method !== "GET") clearApiCache();
      return data;
    })
    .catch((error) => {
      if (cacheable && cached && isTemporaryFailure(error)) {
        console.warn("API temporarily unreachable; returning the last cached response.");
        return cached.data;
      }
      throw error;
    })
    .finally(() => { if (cacheable) inFlightGets.delete(cacheKey); });

  if (cacheable) inFlightGets.set(cacheKey, request);
  return request;
}

export const apiClient = {
  get: (path, query) => apiRequest(path, { method: "GET", query }),
  post: (path, body, query) => apiRequest(path, { method: "POST", body, query }),
  patch: (path, body, query) => apiRequest(path, { method: "PATCH", body, query }),
  put: (path, body, query) => apiRequest(path, { method: "PUT", body, query }),
  delete: (path, query) => apiRequest(path, { method: "DELETE", query }),
  download: (path, query) => apiRequest(path, { method: "GET", query, responseType: "blob" }),
};
export { API_BASE_URL };
