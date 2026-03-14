import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LOAD_INVOICES_ERROR_MESSAGE } from '@/pages/invoices/invoice-list-page/constants';
import useInvoiceListData from '@/pages/invoices/invoice-list-page/hooks/useInvoiceListData';
import { invoiceApi } from '@/services/api';

vi.mock('@/services/api', () => ({
  invoiceApi: {
    getInvoices: vi.fn(),
  },
}));

const mockedInvoiceApi = vi.mocked(invoiceApi);

describe('useInvoiceListData', () => {
  it('loads invoices successfully using provided query params', async () => {
    mockedInvoiceApi.getInvoices.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'inv-1',
            invoiceNumber: 'INV-001',
            customerName: 'Acme Corp',
            amount: 200,
            status: 'Paid',
            createdAt: Date.now(),
          },
        ],
        totalCount: 1,
        page: 2,
        limit: 25,
      },
      error: null,
    });

    const { result } = renderHook(() =>
      useInvoiceListData({
        apiPage: 2,
        limit: 25,
        search: 'acme',
        status: 'Paid',
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedInvoiceApi.getInvoices).toHaveBeenCalledWith({
      page: 2,
      limit: 25,
      search: 'acme',
      status: 'Paid',
    });
    expect(result.current.invoicesData.totalCount).toBe(1);
    expect(result.current.errorMessage).toBe('');
  });

  it('exposes fallback error message when API fails without message', async () => {
    mockedInvoiceApi.getInvoices.mockResolvedValueOnce({
      data: null,
      error: {},
    });

    const { result } = renderHook(() =>
      useInvoiceListData({
        apiPage: 1,
        limit: 10,
        search: '',
        status: '',
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe(LOAD_INVOICES_ERROR_MESSAGE);
  });
});
