import type { PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import useInvoiceParams from '@/hooks/useInvoiceParams';

const getWrapper = (initialRoute: string) =>
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>;
  };

describe('useInvoiceParams', () => {
  it('parses valid query values and sanitizes invalid page/limit/status', () => {
    const { result } = renderHook(() => useInvoiceParams(), {
      wrapper: getWrapper('/invoices?page=0&limit=-5&search=acme&status=NotAStatus'),
    });

    expect(result.current.apiPage).toBe(1);
    expect(result.current.muiPage).toBe(0);
    expect(result.current.limit).toBe(10);
    expect(result.current.search).toBe('acme');
    expect(result.current.status).toBe('');
  });

  it('converts MUI page to API page and resets page when filters change', () => {
    const { result } = renderHook(() => useInvoiceParams(), {
      wrapper: getWrapper('/invoices?page=3&limit=25&search=old&status=Paid'),
    });

    act(() => {
      result.current.updateParams({ page: 1 });
    });

    expect(result.current.apiPage).toBe(2);
    expect(result.current.muiPage).toBe(1);

    act(() => {
      result.current.updateParams({ search: 'next' });
    });

    expect(result.current.search).toBe('next');
    expect(result.current.apiPage).toBe(1);
    expect(result.current.muiPage).toBe(0);
  });
});
