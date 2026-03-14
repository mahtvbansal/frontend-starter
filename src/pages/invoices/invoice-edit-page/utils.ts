import {
  AMOUNT_INVALID_ERROR,
  CLIENT_NAME_REQUIRED_ERROR,
  DEFAULT_STATUS,
  STATUS_FLOW_MAP,
} from '@/pages/invoices/invoice-edit-page/constants';
import type {
  EditFormErrors,
  InvoiceDetails,
  InvoiceStatus,
  UpdateInvoicePayload,
} from '@/pages/invoices/invoice-edit-page/types';

export const getStatusOptions = (currentStatus: InvoiceStatus): InvoiceStatus[] =>
  STATUS_FLOW_MAP[currentStatus] ?? STATUS_FLOW_MAP[DEFAULT_STATUS];

export const validateEditForm = (customerName: string, amount: string): EditFormErrors => ({
  customerName: customerName.trim() ? '' : CLIENT_NAME_REQUIRED_ERROR,
  amount: Number(amount) > 0 ? '' : AMOUNT_INVALID_ERROR,
});

export const hasValidationErrors = (errors: EditFormErrors): boolean =>
  Boolean(errors.customerName || errors.amount);

export const buildUpdatePayload = (
  invoiceDetails: InvoiceDetails,
  customerName: string,
  amount: string,
  status: InvoiceStatus
): UpdateInvoicePayload => {
  const payload: UpdateInvoicePayload = {};

  if (customerName.trim() !== invoiceDetails.customerName) {
    payload.customerName = customerName.trim();
  }

  if (Number(amount) !== invoiceDetails.amount) {
    payload.amount = Number(amount);
  }

  if (status !== invoiceDetails.status) {
    payload.status = status;
  }

  return payload;
};

export const extractApiErrorMessage = (
  error:
    | {
        message?: string;
        details?: unknown;
      }
    | null
    | undefined,
  fallbackMessage: string
): string => {
  if (
    error?.details &&
    typeof error.details === 'object' &&
    'error' in error.details &&
    typeof (error.details as { error?: unknown }).error === 'string'
  ) {
    return (error.details as { error: string }).error;
  }

  return error?.message || fallbackMessage;
};
