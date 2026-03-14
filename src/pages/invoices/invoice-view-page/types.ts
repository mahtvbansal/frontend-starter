export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid';

export interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: number | string;
}

export interface FieldRowData {
  label: string;
  value: string;
}

export interface UseInvoiceViewStateInput {
  invoiceId?: string;
  hasPermission: (requiredPermission?: string | string[]) => boolean;
  onDeleteSuccess: () => void;
}

export interface UseInvoiceViewStateReturn {
  invoiceDetails: InvoiceDetails | null;
  isLoading: boolean;
  errorMessage: string;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  handleDelete: () => Promise<void>;
}
