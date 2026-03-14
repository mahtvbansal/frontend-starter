const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_PREFIX = '/api';

const authRuntime = {
  getToken: () => '',
  onTokenRefresh: () => {},
  onUnauthorized: () => {},
};

let refreshRequest = null;

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

const buildUrl = (path) => {
  if (typeof path !== 'string') {
    return `${API_BASE_URL}${API_PREFIX}`;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/api/')
    ? path
    : `${API_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;

  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

const parseBody = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const createError = (response, payload) => ({
  status: response.status,
  message:
    (payload && typeof payload === 'object' && 'message' in payload && payload.message) ||
    response.statusText ||
    'Invalid email or password',
  details: payload,
});

const buildHeaders = (headers, body, token) => {
  const requestHeaders = new Headers(headers || {});

  if (!(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  return requestHeaders;
};

const buildRequestInit = (options, token) => {
  const { body, headers, ...restOptions } = options || {};
  const requestHeaders = buildHeaders(headers, body, token);
  const requestBody =
    body instanceof FormData || typeof body === 'string' || body == null || !isPlainObject(body)
      ? (body ?? undefined)
      : JSON.stringify(body);

  return {
    ...restOptions,
    credentials: restOptions.credentials ?? 'include',
    headers: requestHeaders,
    body: requestBody,
  };
};

const runRefreshRequest = async () => {
  const token = authRuntime.getToken();
  const response = await fetch(buildUrl('/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders(undefined, undefined, token),
  });
  const payload = await parseBody(response);

  if (!response.ok) {
    return { data: null, error: createError(response, payload) };
  }

  authRuntime.onTokenRefresh(payload);

  return { data: payload, error: null };
};

const refreshAuth = async () => {
  if (!refreshRequest) {
    refreshRequest = runRefreshRequest().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
};

export const configureApiClient = (config = {}) => {
  if (typeof config.getToken === 'function') {
    authRuntime.getToken = config.getToken;
  }

  if (typeof config.onTokenRefresh === 'function') {
    authRuntime.onTokenRefresh = config.onTokenRefresh;
  }

  if (typeof config.onUnauthorized === 'function') {
    authRuntime.onUnauthorized = config.onUnauthorized;
  }
};

export const apiFetch = async (path, options = {}, retryOnUnauthorized = true) => {
  const response = await fetch(buildUrl(path), buildRequestInit(options, authRuntime.getToken()));
  const payload = await parseBody(response);

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    buildUrl(path) !== buildUrl('/auth/refresh')
  ) {
    const refreshResult = await refreshAuth();

    if (!refreshResult.error) {
      return apiFetch(path, options, false);
    }

    authRuntime.onUnauthorized();

    return { data: null, error: createError(response, payload) };
  }

  if (!response.ok) {
    return { data: null, error: createError(response, payload) };
  }

  return { data: payload, error: null };
};
