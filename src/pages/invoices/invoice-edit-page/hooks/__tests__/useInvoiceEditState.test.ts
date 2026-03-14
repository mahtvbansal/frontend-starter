import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DETAILS_UNAVAILABLE_ERROR,
  MISSING_ID_ERROR,
  PERMISSION_ERROR,
} from '@/pages/invoices/invoice-edit-page/constants';
import useInvoiceEditState from '@/pages/invoices/invoice-edit-page/hooks/useInvoiceEditState';
import { invoiceApi } from '@/services/api';

vi.mock('@/services/api', () => ({
  invoiceApi: {
    getInvoiceById: vi.fn(),
    updateInvoice: vi.fn(),
  },
}));

const mockedInvoiceApi = vi.mocked(invoiceApi);

describe('useInvoiceEditState', () => {
  it('sets missing invoice id error and stops loading', async () => {
    const { result } = renderHook(() =>
      useInvoiceEditState({
        invoiceId: undefined,
        hasPermission: () => true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.serverError).toBe(MISSING_ID_ERROR);
    expect(mockedInvoiceApi.getInvoiceById).not.toHaveBeenCalled();
  });

  it('loads invoice details and populates edit state', async () => {
    mockedInvoiceApi.getInvoiceById.mockResolvedValueOnce({
      data: {
        id: 'inv-1',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        amount: 500,
        status: 'Draft',
        createdAt: Date.now(),
      },
      error: null,
    });

    const { result } = renderHook(() =>
      useInvoiceEditState({
        invoiceId: 'inv-1',
        hasPermission: () => true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.customerName).toBe('Acme Corp');
    expect(result.current.amount).toBe('500');
    expect(result.current.status).toBe('Draft');
  });

  it('blocks submit without update permission and when details are unavailable', async () => {
    mockedInvoiceApi.getInvoiceById.mockResolvedValueOnce({
      data: {
        id: 'inv-1',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        amount: 500,
        status: 'Draft',
        createdAt: Date.now(),
      },
      error: null,
    });

    const { result, rerender } = renderHook(
      ({
        invoiceId,
        hasPermission,
      }: {
        invoiceId?: string;
        hasPermission: (permission?: string | string[]) => boolean;
      }) =>
        useInvoiceEditState({
          invoiceId,
          hasPermission,
        }),
      {
        initialProps: {
          invoiceId: 'inv-1',
          hasPermission: () => false,
        },
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const submitResult = await result.current.handleSubmit();
      expect(submitResult).toEqual({ ok: false });
    });
    expect(result.current.serverError).toBe(PERMISSION_ERROR);

    rerender({ invoiceId: undefined, hasPermission: () => true });
    await act(async () => {
      const submitResult = await result.current.handleSubmit();
      expect(submitResult).toEqual({ ok: false });
    });
    expect(result.current.serverError).toBe(DETAILS_UNAVAILABLE_ERROR);
  });

  it('submits updated invoice payload and stores updated details', async () => {
    mockedInvoiceApi.getInvoiceById.mockResolvedValueOnce({
      data: {
        id: 'inv-1',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        amount: 500,
        status: 'Draft',
        createdAt: Date.now(),
      },
      error: null,
    });
    mockedInvoiceApi.updateInvoice.mockResolvedValueOnce({
      data: {
        id: 'inv-1',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp Updated',
        amount: 700,
        status: 'Sent',
        createdAt: Date.now(),
      },
      error: null,
    });

    const { result } = renderHook(() =>
      useInvoiceEditState({
        invoiceId: 'inv-1',
        hasPermission: () => true,
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setCustomerName('Acme Corp Updated');
      result.current.setAmount('700');
      result.current.setStatus('Sent');
    });

    await act(async () => {
      const submitResult = await result.current.handleSubmit();
      expect(submitResult).toEqual({ ok: true });
    });

    expect(mockedInvoiceApi.updateInvoice).toHaveBeenCalledWith(
      'inv-1',
      expect.objectContaining({
        customerName: 'Acme Corp Updated',
        amount: 700,
        status: 'Sent',
      })
    );
    expect(result.current.customerName).toBe('Acme Corp Updated');
    expect(result.current.amount).toBe('700');
    expect(result.current.status).toBe('Sent');
  });
});
