import { useSearchParams } from 'react-router-dom';

type InvoiceStatus = '' | 'Draft' | 'Sent' | 'Paid';

interface UseInvoiceParamsReturn {
  /** 1-based page for the API */
  apiPage: number;
  /** 0-based page for MUI TablePagination */
  muiPage: number;
  limit: number;
  search: string;
  status: InvoiceStatus;
  updateParams: (updates: UpdateInvoiceParamsInput) => void;
}

interface UpdateInvoiceParamsInput {
  /** MUI 0-based page number */
  page?: number;
  limit?: number;
  search?: string;
  status?: InvoiceStatus;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const VALID_STATUSES: readonly InvoiceStatus[] = ['Draft', 'Sent', 'Paid'];

const useInvoiceParams = (): UseInvoiceParamsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPage = Number(searchParams.get('page') ?? DEFAULT_PAGE);
  const apiPage = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : DEFAULT_PAGE;
  const muiPage = apiPage - 1;

  const rawLimit = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.floor(rawLimit) : DEFAULT_LIMIT;

  const search = searchParams.get('search') ?? '';

  const rawStatus = searchParams.get('status') ?? '';
  const status: InvoiceStatus = VALID_STATUSES.includes(rawStatus as InvoiceStatus)
    ? (rawStatus as InvoiceStatus)
    : '';

  const updateParams = (updates: UpdateInvoiceParamsInput): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      // Changing search or status always resets to page 1 unless caller overrides
      const isFilterChange = 'search' in updates || 'status' in updates;
      const shouldResetPage = isFilterChange && !('page' in updates);

      if (updates.search !== undefined) {
        if (updates.search) {
          next.set('search', updates.search);
        } else {
          next.delete('search');
        }
      }

      if (updates.status !== undefined) {
        if (updates.status) {
          next.set('status', updates.status);
        } else {
          next.delete('status');
        }
      }

      if (updates.limit !== undefined) {
        next.set('limit', String(updates.limit));
        // Also reset page when limit changes
        if (!('page' in updates)) {
          next.set('page', '1');
        }
      }

      if ('page' in updates && updates.page !== undefined) {
        // Convert MUI 0-based → API 1-based
        next.set('page', String(updates.page + 1));
      } else if (shouldResetPage) {
        next.set('page', '1');
      }

      return next;
    });
  };

  return { apiPage, muiPage, limit, search, status, updateParams };
};

export default useInvoiceParams;
