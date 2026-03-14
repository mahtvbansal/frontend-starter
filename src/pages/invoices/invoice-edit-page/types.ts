export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid';

export interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: number;
}

export interface EditFormErrors {
  customerName: string;
  amount: string;
}

export interface UpdateInvoicePayload {
  customerName?: string;
  amount?: number;
  status?: InvoiceStatus;
}

export interface UseInvoiceEditStateInput {
  invoiceId?: string;
  hasPermission: (requiredPermission?: string | string[]) => boolean;
}

export interface UseInvoiceEditStateReturn {
  invoiceDetails: InvoiceDetails | null;
  customerName: string;
  amount: string;
  status: InvoiceStatus;
  errors: EditFormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  serverError: string;
  setCustomerName: (value: string) => void;
  setAmount: (value: string) => void;
  setStatus: (value: InvoiceStatus) => void;
  handleSubmit: () => Promise<{ ok: boolean }>;
}
