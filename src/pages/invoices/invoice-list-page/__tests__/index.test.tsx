import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import InvoiceListPage from '@/pages/invoices/invoice-list-page/index';
import useInvoiceListData from '@/pages/invoices/invoice-list-page/hooks/useInvoiceListData';
import useInvoiceParams from '@/hooks/useInvoiceParams';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/pages/invoices/invoice-list-page/hooks/useInvoiceListData', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@/hooks/useInvoiceParams', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockedUseInvoiceListData = vi.mocked(useInvoiceListData);
const mockedUseInvoiceParams = vi.mocked(useInvoiceParams);

describe('InvoiceListPage', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    mockedUseInvoiceListData.mockReset();
    mockedUseInvoiceParams.mockReset();

    mockedUseInvoiceParams.mockReturnValue({
      apiPage: 1,
      muiPage: 0,
      limit: 10,
      search: '',
      status: '',
      updateParams: vi.fn(),
    });
  });

  it('renders empty state when API returns no invoices', () => {
    mockedUseInvoiceListData.mockReturnValue({
      invoicesData: {
        items: [],
        totalCount: 0,
        page: 1,
        limit: 10,
      },
      isLoading: false,
      errorMessage: '',
    });

    render(<InvoiceListPage />);

    expect(screen.getAllByText(/no invoices found for this search/i).length).toBeGreaterThan(0);
  });

  it('renders API failure banner when loading invoices fails', () => {
    mockedUseInvoiceListData.mockReturnValue({
      invoicesData: {
        items: [],
        totalCount: 0,
        page: 1,
        limit: 10,
      },
      isLoading: false,
      errorMessage: 'Unable to load invoices',
    });

    render(<InvoiceListPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(/unable to load invoices/i);
  });

  it('navigates to create invoice page from primary action', async () => {
    mockedUseInvoiceListData.mockReturnValue({
      invoicesData: {
        items: [],
        totalCount: 0,
        page: 1,
        limit: 10,
      },
      isLoading: false,
      errorMessage: '',
    });

    const { user } = render(<InvoiceListPage />);

    await user.click(screen.getByRole('button', { name: /create invoice/i }));

    expect(navigateMock).toHaveBeenCalledWith('/invoices/new');
  });
});
