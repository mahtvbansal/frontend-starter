import { FIELD_LABELS, INVALID_DATE_FALLBACK } from '@/pages/invoices/invoice-view-page/constants';
import type { FieldRowData, InvoiceDetails } from '@/pages/invoices/invoice-view-page/types';

export const formatDate = (timestamp: number | string): string => {
  const normalizedTimestamp = typeof timestamp === 'string' ? Number(timestamp) : timestamp;

  if (!Number.isFinite(normalizedTimestamp)) {
    return INVALID_DATE_FALLBACK;
  }

  return new Date(normalizedTimestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);

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

export const buildFieldRows = (invoiceDetails: InvoiceDetails): FieldRowData[] => [
  { label: FIELD_LABELS.INVOICE_ID, value: invoiceDetails.id },
  { label: FIELD_LABELS.INVOICE_NUMBER, value: invoiceDetails.invoiceNumber },
  { label: FIELD_LABELS.CUSTOMER, value: invoiceDetails.customerName },
  { label: FIELD_LABELS.AMOUNT, value: formatCurrency(invoiceDetails.amount) },
  { label: FIELD_LABELS.STATUS, value: invoiceDetails.status },
  { label: FIELD_LABELS.CREATED_ON, value: formatDate(invoiceDetails.createdAt) },
];
