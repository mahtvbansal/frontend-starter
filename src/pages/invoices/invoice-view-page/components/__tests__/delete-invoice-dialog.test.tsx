import { describe, expect, it, vi } from 'vitest';
import DeleteInvoiceDialog from '@/pages/invoices/invoice-view-page/components/delete-invoice-dialog';
import { render, screen } from '@/test/test-utils';

describe('DeleteInvoiceDialog', () => {
  it('renders confirmation copy and calls action handlers', async () => {
    const onClose = vi.fn();
    const onConfirmDelete = vi.fn().mockResolvedValue(undefined);
    const { user } = render(
      <DeleteInvoiceDialog
        invoiceNumberOrId="INV-001"
        isDeleting={false}
        onClose={onClose}
        onConfirmDelete={onConfirmDelete}
        open
      />
    );

    expect(screen.getByText(/delete invoice\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete invoice #INV-001\?/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await user.click(screen.getByRole('button', { name: /yes, delete/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirmDelete).toHaveBeenCalledTimes(1);
  });

  it('shows loading state while deleting', () => {
    render(
      <DeleteInvoiceDialog
        invoiceNumberOrId="INV-001"
        isDeleting
        onClose={vi.fn()}
        onConfirmDelete={vi.fn().mockResolvedValue(undefined)}
        open
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
