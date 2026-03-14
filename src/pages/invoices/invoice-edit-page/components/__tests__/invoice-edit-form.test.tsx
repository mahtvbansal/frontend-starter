import { describe, expect, it, vi } from 'vitest';
import InvoiceEditForm from '@/pages/invoices/invoice-edit-page/components/invoice-edit-form';
import { render, screen } from '@/test/test-utils';

const baseProps = {
  customerName: 'Acme Corp',
  amount: '1000',
  status: 'Draft' as const,
  statusOptions: ['Draft', 'Sent'] as const,
  errors: {
    customerName: '',
    amount: '',
  },
  serverError: '',
  isSubmitting: false,
  onSubmit: vi.fn(),
  onCustomerNameChange: vi.fn(),
  onAmountChange: vi.fn(),
  onStatusChange: vi.fn(),
};

describe('InvoiceEditForm', () => {
  it('forwards field updates and submit', async () => {
    const props = {
      ...baseProps,
      onSubmit: vi.fn(),
      onCustomerNameChange: vi.fn(),
      onAmountChange: vi.fn(),
      onStatusChange: vi.fn(),
    };
    const { user } = render(<InvoiceEditForm {...props} />);

    const customerNameInput = screen.getByRole('textbox', { name: /client name/i });
    await user.clear(customerNameInput);
    await user.type(customerNameInput, 'Umbrella Corp');

    const amountInput = screen.getByRole('spinbutton', { name: /invoice amount/i });
    await user.clear(amountInput);
    await user.type(amountInput, '1500');

    await user.click(screen.getByRole('combobox', { name: /status/i }));
    await user.click(screen.getByRole('option', { name: 'Sent' }));

    await user.click(screen.getByRole('button', { name: /update invoice/i }));

    expect(props.onCustomerNameChange).toHaveBeenCalled();
    expect(props.onAmountChange).toHaveBeenCalled();
    expect(props.onStatusChange).toHaveBeenCalledWith('Sent');
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows server error alert when provided', () => {
    render(<InvoiceEditForm {...baseProps} serverError="Unable to update" />);

    expect(screen.getByRole('alert')).toHaveTextContent(/unable to update/i);
  });
});
