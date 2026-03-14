import type { StatusFilterOption } from '@/pages/invoices/invoice-list-page/types';

export const PAGE_TITLE = 'Invoices';
export const PAGE_SUBTITLE =
  'Search invoices, track status, and jump into create, view, or edit flows.';

export const CREATE_INVOICE_LABEL = 'Create Invoice';

export const SEARCH_PLACEHOLDER = 'Search invoices, clients, or invoice numbers...';
export const SEARCH_DEBOUNCE_MS = 450;

export const LOAD_INVOICES_ERROR_MESSAGE = 'Unable to load invoices';
export const NO_INVOICES_FOUND_MESSAGE = 'No invoices found for this search.';
export const INVALID_DATE_FALLBACK = 'N/A';

export const TABLE_HEADERS = {
  INVOICE_NUMBER: 'Invoice Number',
  CUSTOMER_NAME: 'Customer Name',
  INVOICE_AMOUNT: 'Invoice Amount',
  STATUS: 'Status',
  CREATION_DATE: 'Creation Date',
  ACTIONS: 'Actions',
} as const;

export const STATUS_FILTER_OPTIONS: readonly StatusFilterOption[] = [
  { label: 'All', value: '' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Sent', value: 'Sent' },
  { label: 'Draft', value: 'Draft' },
] as const;

export const TABLE_ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;

export const MOBILE_SKELETON_ROWS = 5;
export const DESKTOP_SKELETON_ROWS = 5;

export const EDIT_INVOICE_ARIA_LABEL = 'edit invoice';
