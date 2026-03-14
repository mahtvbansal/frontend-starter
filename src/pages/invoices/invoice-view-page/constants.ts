export const PAGE_TITLE = 'Invoice details';
export const PAGE_SUBTITLE_PREFIX = 'Review invoice #';

export const EDIT_BUTTON_LABEL = 'Edit';
export const DELETE_BUTTON_LABEL = 'Delete';

export const LOADING_TEXT = 'Loading invoice details...';

export const MISSING_ID_ERROR = 'Invoice id is missing.';
export const LOAD_ERROR_FALLBACK = 'Unable to load invoice details';
export const DELETE_ERROR_FALLBACK = 'Unable to delete invoice';
export const PERMISSION_ERROR = "You don't have permission to perform this action.";
export const DETAILS_UNAVAILABLE_MESSAGE = 'Invoice details are unavailable.';

export const DIALOG_TITLE = 'Delete invoice?';
export const DIALOG_CANCEL_LABEL = 'Cancel';
export const DIALOG_CONFIRM_LABEL = 'Yes, delete';
export const DIALOG_DESCRIPTION_PREFIX = 'Are you sure you want to delete invoice #';
export const DIALOG_DESCRIPTION_SUFFIX = '? This action cannot be undone.';

export const FIELD_LABELS = {
  INVOICE_ID: 'Invoice ID',
  INVOICE_NUMBER: 'Invoice Number',
  CUSTOMER: 'Customer',
  AMOUNT: 'Amount',
  STATUS: 'Status',
  CREATED_ON: 'Created on',
} as const;

export const INVALID_DATE_FALLBACK = 'Invalid date';
