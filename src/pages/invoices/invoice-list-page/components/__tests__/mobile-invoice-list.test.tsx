import { describe, expect, it, vi } from 'vitest';
import MobileInvoiceList from '@/pages/invoices/invoice-list-page/components/mobile-invoice-list';
import { render, screen } from '@/test/test-utils';

const baseProps = {
  isLoading: false,
  invoices: [],
  totalCount: 0,
  muiPage: 0,
  limit: 10,
  formatCurrency: (amount: number): string => `$${amount.toFixed(2)}`,
  formatDate: (): string => 'Jan 01, 2026',
  onOpenInvoice: vi.fn(),
  onEditInvoice: vi.fn(),
  onPageChange: vi.fn(),
  onRowsPerPageChange: vi.fn(),
};

describe('MobileInvoiceList', () => {
  it('renders empty-state message when there are no invoices', () => {
    render(<MobileInvoiceList {...baseProps} />);

    expect(screen.getByText(/no invoices found for this search/i)).toBeInTheDocument();
  });

  it('opens invoice on card click and edits on icon click without opening', async () => {
    const onOpenInvoice = vi.fn();
    const onEditInvoice = vi.fn();
    const { user } = render(
      <MobileInvoiceList
        {...baseProps}
        invoices={[
          {
            id: 'inv-1',
            invoiceNumber: 'INV-001',
            customerName: 'Acme Corp',
            amount: 1200,
            status: 'Sent',
            createdAt: Date.now(),
          },
        ]}
        onEditInvoice={onEditInvoice}
        onOpenInvoice={onOpenInvoice}
        totalCount={1}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit invoice/i }));
    expect(onEditInvoice).toHaveBeenCalledWith('inv-1');
    expect(onOpenInvoice).not.toHaveBeenCalled();

    await user.click(screen.getByText('INV-001'));
    expect(onOpenInvoice).toHaveBeenCalledWith('inv-1');
  });

  it('hides edit action when user lacks update permission', () => {
    render(
      <MobileInvoiceList
        {...baseProps}
        invoices={[
          {
            id: 'inv-1',
            invoiceNumber: 'INV-001',
            customerName: 'Acme Corp',
            amount: 1200,
            status: 'Sent',
            createdAt: Date.now(),
          },
        ]}
        totalCount={1}
      />,
      {
        authValue: {
          hasPermission: () => false,
        },
      }
    );

    expect(screen.queryByRole('button', { name: /edit invoice/i })).not.toBeInTheDocument();
  });
});
