import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  AMOUNT_INVALID_ERROR,
  CLIENT_NAME_REQUIRED_ERROR,
} from '@/pages/invoices/invoice-create-page/constants';
import useInvoiceCreateState from '@/pages/invoices/invoice-create-page/hooks/useInvoiceCreateState';
import { invoiceApi } from '@/services/api';

vi.mock('@/services/api', () => ({
  invoiceApi: {
    createInvoice: vi.fn(),
  },
}));

const mockedInvoiceApi = vi.mocked(invoiceApi);

describe('useInvoiceCreateState', () => {
  it('returns validation errors for empty customer and invalid amount', async () => {
    const { result } = renderHook(() => useInvoiceCreateState());

    await act(async () => {
      const submitResult = await result.current.handleSubmit();
      expect(submitResult).toEqual({ ok: false });
    });

    expect(result.current.errors.customerName).toBe(CLIENT_NAME_REQUIRED_ERROR);
    expect(result.current.errors.amount).toBe(AMOUNT_INVALID_ERROR);
    expect(mockedInvoiceApi.createInvoice).not.toHaveBeenCalled();
  });

  it('submits valid create payload and resolves successfully', async () => {
    mockedInvoiceApi.createInvoice.mockResolvedValueOnce({ data: { id: 'inv-1' }, error: null });
    const { result } = renderHook(() => useInvoiceCreateState());

    act(() => {
      result.current.setCustomerName('  Acme Corp  ');
      result.current.setAmount('1200');
      result.current.setNotes('test notes');
    });

    await act(async () => {
      const submitResult = await result.current.handleSubmit();
      expect(submitResult).toEqual({ ok: true });
    });

    expect(mockedInvoiceApi.createInvoice).toHaveBeenCalledWith({
      customerName: 'Acme Corp',
      amount: 1200,
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('maps nested API error detail into server error message', async () => {
    mockedInvoiceApi.createInvoice.mockResolvedValueOnce({
      data: null,
      error: {
        details: {
          error: 'Amount exceeds plan limit',
        },
      },
    });

    const { result } = renderHook(() => useInvoiceCreateState());

    act(() => {
      result.current.setCustomerName('Acme Corp');
      result.current.setAmount('1200');
    });

    await act(async () => {
      const submitResult = await result.current.handleSubmit();
      expect(submitResult).toEqual({ ok: false });
    });

    expect(result.current.serverError).toBe('Amount exceeds plan limit');
  });
});
