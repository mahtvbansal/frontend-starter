export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid';

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: number | string;
}

export interface InvoicesResponse {
  items: InvoiceItem[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface StatusFilterOption {
  label: string;
  value: '' | InvoiceStatus;
}

export interface InvoiceStatusTone {
  tone: 'success' | 'info' | 'neutral' | 'warning';
  label: string;
}
