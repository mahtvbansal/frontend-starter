import { INVALID_DATE_FALLBACK } from '@/pages/invoices/invoice-list-page/constants';

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
