import { describe, expect, it } from 'vitest';
import InvoiceDetailsCard from '@/pages/invoices/invoice-view-page/components/invoice-details-card';
import { render, screen } from '@/test/test-utils';

describe('InvoiceDetailsCard', () => {
  it('renders fallback message when details are unavailable', () => {
    render(<InvoiceDetailsCard invoiceDetails={null} />);

    expect(screen.getByText(/invoice details are unavailable/i)).toBeInTheDocument();
  });

  it('renders invoice field rows when details are provided', () => {
    render(
      <InvoiceDetailsCard
        invoiceDetails={{
          id: 'inv-1',
          invoiceNumber: 'INV-001',
          customerName: 'Acme Corp',
          amount: 500,
          status: 'Sent',
          createdAt: 1700000000000,
        }}
      />
    );

    expect(screen.getByText('Invoice ID')).toBeInTheDocument();
    expect(screen.getByText('inv-1')).toBeInTheDocument();
    expect(screen.getByText('Invoice Number')).toBeInTheDocument();
    expect(screen.getByText('INV-001')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Sent')).toBeInTheDocument();
  });
});
