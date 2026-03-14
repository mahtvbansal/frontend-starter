import type { CreateInvoiceErrors } from '@/pages/invoices/invoice-create-page/types';

export const PAGE_TITLE = 'Create invoice';
export const PAGE_SUBTITLE =
  'Add invoice details. New invoices are created with status Draft by default.';

export const CLIENT_NAME_LABEL = 'Client name';
export const AMOUNT_LABEL = 'Invoice amount';
export const NOTES_LABEL = 'Notes';

export const CLIENT_NAME_PLACEHOLDER = 'Acme Corp';
export const AMOUNT_PLACEHOLDER = '1500';
export const NOTES_PLACEHOLDER = 'Payment terms and project notes';

export const CREATE_BUTTON_LABEL = 'Create invoice';

export const CREATE_ERROR_FALLBACK = 'Unable to create invoice';
export const CLIENT_NAME_REQUIRED_ERROR = 'Client name is required.';
export const AMOUNT_INVALID_ERROR = 'Invoice amount is required and must be greater than 0.';

export const INITIAL_ERRORS: CreateInvoiceErrors = {
  customerName: '',
  amount: '',
};
