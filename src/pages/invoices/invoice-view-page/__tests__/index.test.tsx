import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import InvoiceViewPage from '@/pages/invoices/invoice-view-page/index';
import useInvoiceViewState from '@/pages/invoices/invoice-view-page/hooks/useInvoiceViewState';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: 'inv-001' }),
  };
});

vi.mock('@/pages/invoices/invoice-view-page/hooks/useInvoiceViewState', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockedUseInvoiceViewState = vi.mocked(useInvoiceViewState);

describe('InvoiceViewPage RBAC', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    mockedUseInvoiceViewState.mockReset();
  });

  it('hides delete action when user does not have invoices:delete permission', () => {
    const setIsDeleteDialogOpen = vi.fn();

    mockedUseInvoiceViewState.mockReturnValue({
      invoiceDetails: {
        id: 'inv-001',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        amount: 100,
        status: 'Sent',
        createdAt: Date.now(),
      },
      isLoading: false,
      errorMessage: '',
      isDeleteDialogOpen: false,
      isDeleting: false,
      setIsDeleteDialogOpen,
      handleDelete: vi.fn(),
    });

    render(<InvoiceViewPage />, {
      authValue: {
        hasPermission: (permission?: string | string[]) => {
          if (!permission) {
            return true;
          }

          const permissions = Array.isArray(permission) ? permission : [permission];

          return !permissions.includes('invoices:delete');
        },
      },
    });

    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    expect(setIsDeleteDialogOpen).not.toHaveBeenCalled();
  });

  it('allows delete interaction when user has invoices:delete permission', async () => {
    const setIsDeleteDialogOpen = vi.fn();
    mockedUseInvoiceViewState.mockReturnValue({
      invoiceDetails: {
        id: 'inv-001',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        amount: 100,
        status: 'Sent',
        createdAt: Date.now(),
      },
      isLoading: false,
      errorMessage: '',
      isDeleteDialogOpen: false,
      isDeleting: false,
      setIsDeleteDialogOpen,
      handleDelete: vi.fn(),
    });

    const { user } = render(<InvoiceViewPage />, {
      authValue: {
        hasPermission: () => true,
      },
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(setIsDeleteDialogOpen).toHaveBeenCalledWith(true);
  });
});
