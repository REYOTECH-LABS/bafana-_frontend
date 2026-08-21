import axios from 'axios';

/**
 * The single axios instance every request goes through.
 *
 * Two interceptors do the work that would otherwise be repeated in every
 * caller: unwrapping the backend's response envelope, and normalising errors
 * into one predictable shape.
 */

const LOCAL_API_FALLBACK = 'http://localhost:5000/api/v1';

/**
 * Where the API lives.
 *
 * Set VITE_API_URL per environment; the localhost fallback exists so a fresh
 * clone runs with no configuration.
 *
 * The warning matters: a production bundle built without VITE_API_URL points
 * every request at the *visitor's own* machine, which fails as an opaque
 * network error with nothing in it to suggest the real cause. import.meta.env
 * is inlined at build time, so this is decided when the bundle is built, not
 * when it runs — a deployed bundle cannot be corrected without rebuilding.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || LOCAL_API_FALLBACK;

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.error(
    'VITE_API_URL was not set when this bundle was built, so API requests are ' +
      'pointing at localhost and will fail. Set it in the hosting provider and rebuild.'
  );
}

/** Where the auth token lives. */
export const TOKEN_STORAGE_KEY = 'bafana.auth.token';

/**
 * The token lives in one of two places, chosen at sign-in by "Keep me signed in":
 *
 *   localStorage    persists until signed out, surviving a browser restart
 *   sessionStorage  cleared when the tab closes
 *
 * Reads prefer sessionStorage, so a deliberate this-session-only sign-in is
 * never shadowed by a stale persistent token from an earlier one.
 *
 * Every access is wrapped: Safari in private mode throws on storage access
 * rather than returning null, and an unauthenticated visitor should never see a
 * crash because of it.
 */
const readFrom = (storage) => {
  try {
    return storage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

const clearFrom = (storage) => {
  try {
    storage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* storage unavailable — nothing was stored, so nothing to clear */
  }
};

export const getToken = () => readFrom(sessionStorage) ?? readFrom(localStorage);

/**
 * @param {string|null} token
 * @param {{ persist?: boolean }} options  persist:true keeps the session across
 *   browser restarts; the default keeps it to the current tab.
 */
export const setToken = (token, { persist = false } = {}) => {
  // Always clear both first, so switching persistence never leaves a second
  // copy behind that outlives the one just written.
  clearFrom(localStorage);
  clearFrom(sessionStorage);

  if (!token) return;

  try {
    (persist ? localStorage : sessionStorage).setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* storage unavailable — the session simply won't survive a reload */
  }
};

export const clearToken = () => setToken(null);

const api = axios.create({
  baseURL: API_BASE_URL,
  // 45s, not 15s. A free-tier Render instance spins down when idle and took
  // 34 seconds to answer the first request in testing; the old ceiling aborted
  // before the server had finished waking, showing "cannot reach the server"
  // for a backend that was merely asleep.
  timeout: 45000,
  headers: { 'Content-Type': 'application/json' },
});

// Attaches the bearer token when one exists. Public endpoints ignore it, and
// the endpoints with an "authenticated upgrade" (lawyers, content,
// announcements, testimonials, posts) return more when it is present.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Let the browser set the multipart boundary itself; a hardcoded JSON
  // content-type would corrupt a file upload.
  if (config.data instanceof FormData) delete config.headers['Content-Type'];

  return config;
});

/**
 * The API always answers with
 *   { success, statusCode, message, data, pagination? }
 * so callers get `data` directly, with `pagination` attached when present
 * rather than buried a level down.
 */
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'data' in body) {
      const payload = body.data;
      if (body.pagination && payload && typeof payload === 'object') {
        // Non-destructive: attach pagination without mutating the array's
        // contents, so `payload.length` and iteration still behave.
        Object.defineProperty(payload, 'pagination', {
          value: body.pagination,
          enumerable: false,
        });
      }
      return payload;
    }
    return body;
  },
  (error) => {
    // A 401 means the token is gone, expired, or belongs to an account that no
    // longer exists. Keeping it would make every later request fail the same
    // way, so it is discarded here rather than in each caller.
    //
    // 403 is deliberately left alone: the token is valid, the account simply
    // lacks the permission (or has been deactivated). Signing the user out over
    // a single forbidden action would be wrong.
    if (error.response?.status === 401) {
      clearToken();
      onUnauthorized?.();
    }

    return Promise.reject(normaliseError(error));
  }
);

/**
 * Called after a 401 has cleared the token, so the auth context can drop its
 * copy of the administrator and the route guard can redirect.
 *
 * A callback rather than a direct import: this module must not depend on React
 * or on the router.
 */
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

/**
 * Collapses the three failure modes — a structured API error, a network
 * failure, and an unexpected exception — into one shape, so UI code never has
 * to branch on axios internals.
 *
 * `errors` carries the per-field list from the backend's Zod validator, which
 * forms map straight back onto their inputs.
 */
export function normaliseError(error) {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || `Request failed with status ${status}`,
      errors: data?.errors || [],
      isNetworkError: false,
    };
  }

  if (error.request) {
    return {
      status: 0,
      message:
        'Could not reach the server. Check your connection and try again.',
      errors: [],
      isNetworkError: true,
    };
  }

  return {
    status: 0,
    message: error.message || 'Something went wrong.',
    errors: [],
    isNetworkError: false,
  };
}

/** Turns the backend's per-field error list into a { field: message } map. */
export const toFieldErrors = (errors = []) =>
  errors.reduce((acc, item) => {
    if (item?.field) acc[item.field] = item.message;
    return acc;
  }, {});

export default api;
