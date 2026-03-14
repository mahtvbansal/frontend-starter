import {
  AMOUNT_INVALID_ERROR,
  CLIENT_NAME_REQUIRED_ERROR,
  CREATE_ERROR_FALLBACK,
} from '@/pages/invoices/invoice-create-page/constants';
import type {
  CreateInvoiceErrors,
  CreateInvoicePayload,
} from '@/pages/invoices/invoice-create-page/types';

export const validateCreateForm = (customerName: string, amount: string): CreateInvoiceErrors => ({
  customerName: customerName.trim() ? '' : CLIENT_NAME_REQUIRED_ERROR,
  amount: Number(amount) > 0 ? '' : AMOUNT_INVALID_ERROR,
});

export const hasValidationErrors = (errors: CreateInvoiceErrors): boolean =>
  Boolean(errors.customerName || errors.amount);

export const buildCreatePayload = (customerName: string, amount: string): CreateInvoicePayload => ({
  customerName: customerName.trim(),
  amount: Number(amount),
});

export const extractApiErrorMessage = (
  error:
    | {
        message?: string;
        details?: unknown;
      }
    | null
    | undefined
): string => {
  if (
    error?.details &&
    typeof error.details === 'object' &&
    'error' in error.details &&
    typeof (error.details as { error?: unknown }).error === 'string'
  ) {
    return (error.details as { error: string }).error;
  }

  return error?.message || CREATE_ERROR_FALLBACK;
};
