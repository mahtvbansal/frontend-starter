import { describe, expect, it, vi } from 'vitest';
import DesktopInvoiceTable from '@/pages/invoices/invoice-list-page/components/desktop-invoice-table';
import { render, screen, within } from '@/test/test-utils';

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

describe('DesktopInvoiceTable', () => {
  it('renders empty-state message when no invoices exist', () => {
    render(<DesktopInvoiceTable {...baseProps} />);

    expect(screen.getByText(/no invoices found for this search/i)).toBeInTheDocument();
  });

  it('opens invoice on row click and edits via icon click', async () => {
    const onOpenInvoice = vi.fn();
    const onEditInvoice = vi.fn();
    const { user } = render(
      <DesktopInvoiceTable
        {...baseProps}
        invoices={[
          {
            id: 'inv-1',
            invoiceNumber: 'INV-001',
            customerName: 'Acme Corp',
            amount: 999,
            status: 'Draft',
            createdAt: Date.now(),
          },
        ]}
        onEditInvoice={onEditInvoice}
        onOpenInvoice={onOpenInvoice}
        totalCount={1}
      />
    );

    const row = screen.getByText('INV-001').closest('tr');
    expect(row).not.toBeNull();

    if (!row) {
      throw new Error('Expected invoice row to be present');
    }

    await user.click(within(row).getByRole('button'));
    expect(onEditInvoice).toHaveBeenCalledWith('inv-1');
    expect(onOpenInvoice).not.toHaveBeenCalled();

    await user.click(row);
    expect(onOpenInvoice).toHaveBeenCalledWith('inv-1');
  });

  it('hides edit icon when user has no update permission', () => {
    render(
      <DesktopInvoiceTable
        {...baseProps}
        invoices={[
          {
            id: 'inv-1',
            invoiceNumber: 'INV-001',
            customerName: 'Acme Corp',
            amount: 999,
            status: 'Draft',
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

    const row = screen.getByText('INV-001').closest('tr');
    expect(row).not.toBeNull();

    if (!row) {
      throw new Error('Expected invoice row to be present');
    }

    expect(within(row).queryByRole('button')).not.toBeInTheDocument();
  });
});
