import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '@/api/client';
import { authApi, invoiceApi } from '@/services/api';

vi.mock('@/api/client', () => ({
  apiFetch: vi.fn(),
}));

const mockedApiFetch = vi.mocked(apiFetch);

describe('services/api', () => {
  beforeEach(() => {
    mockedApiFetch.mockReset();
  });

  it('calls auth login endpoint and returns 401 errors from backend', async () => {
    mockedApiFetch.mockResolvedValueOnce({
      data: null,
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    });

    const result = await authApi.login({ email: 'qa@invoicepro.com', password: 'password123' });

    expect(mockedApiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: {
        email: 'qa@invoicepro.com',
        password: 'password123',
      },
    });
    expect(result.error?.status).toBe(401);
  });

  it('builds invoice list query params and excludes empty values', async () => {
    mockedApiFetch.mockResolvedValueOnce({
      data: {
        items: [],
        totalCount: 0,
      },
      error: null,
    });

    await invoiceApi.getInvoices({
      page: 2,
      limit: 10,
      search: '',
      status: 'Sent',
      ignored: undefined,
    });

    expect(mockedApiFetch).toHaveBeenCalledWith('/invoices?page=2&limit=10&status=Sent');
  });

  it('propagates create invoice API failures (500)', async () => {
    mockedApiFetch.mockResolvedValueOnce({
      data: null,
      error: {
        status: 500,
        message: 'Server error',
      },
    });

    const result = await invoiceApi.createInvoice({ customerName: 'Acme', amount: 1200 });

    expect(mockedApiFetch).toHaveBeenCalledWith('/invoices', {
      method: 'POST',
      body: {
        customerName: 'Acme',
        amount: 1200,
      },
    });
    expect(result.error?.status).toBe(500);
  });
});
