export interface CreateInvoiceErrors {
  customerName: string;
  amount: string;
}

export interface CreateInvoicePayload {
  customerName: string;
  amount: number;
}

export interface UseInvoiceCreateStateReturn {
  customerName: string;
  amount: string;
  notes: string;
  errors: CreateInvoiceErrors;
  serverError: string;
  isSubmitting: boolean;
  setCustomerName: (value: string) => void;
  setAmount: (value: string) => void;
  setNotes: (value: string) => void;
  handleSubmit: () => Promise<{ ok: boolean }>;
}
