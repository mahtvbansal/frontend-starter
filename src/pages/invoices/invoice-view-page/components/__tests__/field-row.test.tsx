import { describe, expect, it } from 'vitest';
import FieldRow from '@/pages/invoices/invoice-view-page/components/field-row';
import { render, screen } from '@/test/test-utils';

describe('FieldRow', () => {
  it('renders both label and value', () => {
    render(<FieldRow label="Status" value="Paid" />);

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });
});
