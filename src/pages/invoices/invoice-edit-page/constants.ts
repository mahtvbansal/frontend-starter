import type { EditFormErrors, InvoiceStatus } from '@/pages/invoices/invoice-edit-page/types';

export const PAGE_TITLE = 'Edit invoice';
export const PAGE_SUBTITLE_PREFIX = 'Update invoice #';
export const PAGE_SUBTITLE_SUFFIX = 'and submit changes to the API.';

export const LOADING_TEXT = 'Loading invoice details...';

export const CLIENT_NAME_LABEL = 'Client name';
export const AMOUNT_LABEL = 'Invoice amount';
export const STATUS_LABEL = 'Status';
export const UPDATE_BUTTON_LABEL = 'Update invoice';

export const MISSING_ID_ERROR = 'Invoice id is missing.';
export const LOAD_ERROR_FALLBACK = 'Unable to load invoice';
export const PERMISSION_ERROR = "You don't have permission to perform this action.";
export const DETAILS_UNAVAILABLE_ERROR = 'Invoice details are unavailable.';
export const UPDATE_ERROR_FALLBACK = 'Unable to update invoice';

export const CLIENT_NAME_REQUIRED_ERROR = 'Client name is required.';
export const AMOUNT_INVALID_ERROR = 'Invoice amount is required and must be greater than 0.';

export const INITIAL_ERRORS: EditFormErrors = {
  customerName: '',
  amount: '',
};

export const DEFAULT_STATUS: InvoiceStatus = 'Draft';

export const STATUS_FLOW_MAP: Record<InvoiceStatus, InvoiceStatus[]> = {
  Draft: ['Draft', 'Sent'],
  Sent: ['Sent', 'Paid'],
  Paid: ['Paid'],
};
