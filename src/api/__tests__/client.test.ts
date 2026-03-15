import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  text: () => Promise<string>;
}

const createMockResponse = ({
  ok,
  status,
  statusText = '',
  body = '',
}: {
  ok: boolean;
  status: number;
  statusText?: string;
  body?: string;
}): MockResponse => ({
  ok,
  status,
  statusText,
  text: async () => body,
});

const loadApiClient = async () => {
  vi.resetModules();

  return import('@/api/client');
};

describe('api/client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds JSON request with default credentials and auth header', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        ok: true,
        status: 200,
        body: JSON.stringify({ id: 'inv-1' }),
      }) as unknown as Response
    );

    const { apiFetch, configureApiClient } = await loadApiClient();
    configureApiClient({
      getToken: () => 'token-123',
    });

    const result = await apiFetch('/invoices', {
      method: 'POST',
      body: { amount: 1200 },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toMatch(/\/api\/invoices$/);
    expect(options.credentials).toBe('include');
    expect(options.body).toBe(JSON.stringify({ amount: 1200 }));

    const headers = options.headers as Headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer token-123');
    expect(result).toEqual({ data: { id: 'inv-1' }, error: null });
  });

  it('does not force json content-type for FormData body', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        ok: true,
        status: 200,
        body: JSON.stringify({ ok: true }),
      }) as unknown as Response
    );

    const { apiFetch } = await loadApiClient();
    const formData = new FormData();
    formData.append('file', 'blob');

    await apiFetch('/upload', {
      method: 'POST',
      body: formData,
    });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = options.headers as Headers;

    expect(headers.has('Content-Type')).toBe(false);
  });

  it('returns normalized error payload for non-401 failures', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        body: JSON.stringify({ message: 'Server exploded' }),
      }) as unknown as Response
    );

    const { apiFetch } = await loadApiClient();
    const result = await apiFetch('/invoices');

    expect(result).toEqual({
      data: null,
      error: {
        status: 500,
        message: 'Server exploded',
        details: { message: 'Server exploded' },
      },
    });
  });

  it('retries original request after successful refresh on 401', async () => {
    const fetchMock = vi.mocked(fetch);
    const onTokenRefresh = vi.fn();

    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          ok: false,
          status: 401,
          body: JSON.stringify({ message: 'Unauthorized' }),
        }) as unknown as Response
      )
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: JSON.stringify({ token: 'new-token', user: { email: 'qa@x.com' } }),
        }) as unknown as Response
      )
      .mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          status: 200,
          body: JSON.stringify({ items: [] }),
        }) as unknown as Response
      );

    const { apiFetch, configureApiClient } = await loadApiClient();
    configureApiClient({
      getToken: () => 'stale-token',
      onTokenRefresh,
    });

    const result = await apiFetch('/invoices');

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect((fetchMock.mock.calls[0] as [string])[0]).toMatch(/\/api\/invoices$/);
    expect((fetchMock.mock.calls[1] as [string])[0]).toMatch(/\/api\/auth\/refresh$/);
    expect((fetchMock.mock.calls[2] as [string])[0]).toMatch(/\/api\/invoices$/);
    expect(onTokenRefresh).toHaveBeenCalledWith({
      token: 'new-token',
      user: { email: 'qa@x.com' },
    });
    expect(result).toEqual({ data: { items: [] }, error: null });
  });

  it('calls onUnauthorized when refresh fails after 401', async () => {
    const fetchMock = vi.mocked(fetch);
    const onUnauthorized = vi.fn();

    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          ok: false,
          status: 401,
          body: JSON.stringify({ message: 'Unauthorized' }),
        }) as unknown as Response
      )
      .mockResolvedValueOnce(
        createMockResponse({
          ok: false,
          status: 401,
          body: JSON.stringify({ message: 'Refresh failed' }),
        }) as unknown as Response
      );

    const { apiFetch, configureApiClient } = await loadApiClient();
    configureApiClient({ onUnauthorized });

    const result = await apiFetch('/invoices');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      data: null,
      error: {
        status: 401,
        message: 'Unauthorized',
        details: { message: 'Unauthorized' },
      },
    });
  });

  it('does not recursively refresh when request path is /auth/refresh', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        ok: false,
        status: 401,
        body: JSON.stringify({ message: 'Unauthorized refresh' }),
      }) as unknown as Response
    );

    const { apiFetch } = await loadApiClient();
    await apiFetch('/auth/refresh', { method: 'POST' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls[0] as [string])[0]).toMatch(/\/api\/auth\/refresh$/);
  });

  it('returns normalized runtime error when request throws (e.g. CORS/network)', async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const { apiFetch } = await loadApiClient();
    const result = await apiFetch('/auth/refresh', { method: 'POST' });

    expect(result.data).toBeNull();
    expect(result.error?.status).toBe(0);
    expect(result.error?.message).toMatch(/failed to fetch/i);
  });

  it('returns normalized runtime error when refresh call throws during 401 retry', async () => {
    const fetchMock = vi.mocked(fetch);

    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          ok: false,
          status: 401,
          body: JSON.stringify({ message: 'Unauthorized' }),
        }) as unknown as Response
      )
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const onUnauthorized = vi.fn();
    const { apiFetch, configureApiClient } = await loadApiClient();
    configureApiClient({ onUnauthorized });

    const result = await apiFetch('/invoices');

    expect(result.data).toBeNull();
    expect(result.error?.status).toBe(401);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
