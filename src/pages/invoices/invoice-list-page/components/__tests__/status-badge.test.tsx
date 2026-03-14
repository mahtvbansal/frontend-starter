import { describe, expect, it } from 'vitest';
import StatusBadge from '@/pages/invoices/invoice-list-page/components/status-badge';
import { render, screen } from '@/test/test-utils';

describe('StatusBadge', () => {
  it('renders status label for paid', () => {
    render(<StatusBadge status="Paid" />);

    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('renders status label for sent and draft', () => {
    const { rerender } = render(<StatusBadge status="Sent" />);
    expect(screen.getByText('Sent')).toBeInTheDocument();

    rerender(<StatusBadge status="Draft" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
});
