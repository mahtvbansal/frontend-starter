import { describe, expect, it, vi } from 'vitest';
import InvoiceCreateForm from '@/pages/invoices/invoice-create-page/components/invoice-create-form';
import { render, screen } from '@/test/test-utils';

const baseProps = {
  customerName: 'Acme',
  amount: '1200',
  notes: '',
  errors: {
    customerName: '',
    amount: '',
  },
  serverError: '',
  isSubmitting: false,
  onSubmit: vi.fn(),
  onCustomerNameChange: vi.fn(),
  onAmountChange: vi.fn(),
  onNotesChange: vi.fn(),
};

describe('InvoiceCreateForm', () => {
  it('forwards input changes and submit', async () => {
    const props = {
      ...baseProps,
      onSubmit: vi.fn(),
      onCustomerNameChange: vi.fn(),
      onAmountChange: vi.fn(),
      onNotesChange: vi.fn(),
    };
    const { user } = render(<InvoiceCreateForm {...props} />);

    await user.type(screen.getByRole('textbox', { name: /client name/i }), 'X');
    await user.type(screen.getByRole('spinbutton', { name: /invoice amount/i }), '1');
    await user.type(screen.getByRole('textbox', { name: /notes/i }), 'Test note');
    await user.click(screen.getByRole('button', { name: /create invoice/i }));

    expect(props.onCustomerNameChange).toHaveBeenCalled();
    expect(props.onAmountChange).toHaveBeenCalled();
    expect(props.onNotesChange).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders server error alert when provided', () => {
    render(<InvoiceCreateForm {...baseProps} serverError="Unable to create" />);

    expect(screen.getByRole('alert')).toHaveTextContent(/unable to create/i);
  });
});
