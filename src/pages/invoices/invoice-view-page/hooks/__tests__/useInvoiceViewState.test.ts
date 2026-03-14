import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DELETE_ERROR_FALLBACK,
  MISSING_ID_ERROR,
  PERMISSION_ERROR,
} from '@/pages/invoices/invoice-view-page/constants';
import useInvoiceViewState from '@/pages/invoices/invoice-view-page/hooks/useInvoiceViewState';
import { invoiceApi } from '@/services/api';

vi.mock('@/services/api', () => ({
  invoiceApi: {
    getInvoiceById: vi.fn(),
    deleteInvoice: vi.fn(),
  },
}));

const mockedInvoiceApi = vi.mocked(invoiceApi);

interface UseInvoiceViewStateHookProps {
  hasPermission: (permission?: string | string[]) => boolean;
}

describe('useInvoiceViewState', () => {
  it('sets missing id error when invoiceId is not provided', async () => {
    const { result } = renderHook(() =>
      useInvoiceViewState({
        invoiceId: undefined,
        hasPermission: () => true,
        onDeleteSuccess: vi.fn(),
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBe(MISSING_ID_ERROR);
    expect(mockedInvoiceApi.getInvoiceById).not.toHaveBeenCalled();
  });

  it('loads invoice details when invoiceId exists', async () => {
    mockedInvoiceApi.getInvoiceById.mockResolvedValueOnce({
      data: {
        id: 'inv-1',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        amount: 100,
        status: 'Sent',
        createdAt: Date.now(),
      },
      error: null,
    });

    const { result } = renderHook(() =>
      useInvoiceViewState({
        invoiceId: 'inv-1',
        hasPermission: () => true,
        onDeleteSuccess: vi.fn(),
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.invoiceDetails?.invoiceNumber).toBe('INV-001');
    expect(result.current.errorMessage).toBe('');
  });

  it('blocks delete without permission and handles API delete errors', async () => {
    mockedInvoiceApi.getInvoiceById.mockResolvedValueOnce({
      data: {
        id: 'inv-1',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        amount: 100,
        status: 'Sent',
        createdAt: Date.now(),
      },
      error: null,
    });

    const onDeleteSuccess = vi.fn();
    const denyPermission = (): boolean => false;
    const allowPermission = (): boolean => true;

    const { result, rerender } = renderHook(
      ({ hasPermission }: UseInvoiceViewStateHookProps) =>
        useInvoiceViewState({
          invoiceId: 'inv-1',
          hasPermission,
          onDeleteSuccess,
        }),
      {
        initialProps: {
          hasPermission: denyPermission,
        } as UseInvoiceViewStateHookProps,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.errorMessage).toBe(PERMISSION_ERROR);
    expect(mockedInvoiceApi.deleteInvoice).not.toHaveBeenCalled();

    mockedInvoiceApi.deleteInvoice.mockResolvedValueOnce({ error: {} });
    rerender({ hasPermission: allowPermission });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.errorMessage).toBe(DELETE_ERROR_FALLBACK);
    expect(onDeleteSuccess).not.toHaveBeenCalled();
  });
});
