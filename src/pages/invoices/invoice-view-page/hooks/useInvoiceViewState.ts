import { useEffect, useState } from 'react';
import {
  DELETE_ERROR_FALLBACK,
  LOAD_ERROR_FALLBACK,
  MISSING_ID_ERROR,
  PERMISSION_ERROR,
} from '@/pages/invoices/invoice-view-page/constants';
import type {
  InvoiceDetails,
  UseInvoiceViewStateInput,
  UseInvoiceViewStateReturn,
} from '@/pages/invoices/invoice-view-page/types';
import { extractApiErrorMessage } from '@/pages/invoices/invoice-view-page/utils';
import { invoiceApi } from '@/services/api';

const useInvoiceViewState = ({
  invoiceId,
  hasPermission,
  onDeleteSuccess,
}: UseInvoiceViewStateInput): UseInvoiceViewStateReturn => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadInvoice = async (): Promise<void> => {
      if (!invoiceId) {
        setErrorMessage(MISSING_ID_ERROR);
        setIsLoading(false);

        return;
      }

      setIsLoading(true);
      const result = await invoiceApi.getInvoiceById(invoiceId);

      if (result.error) {
        setErrorMessage(extractApiErrorMessage(result.error, LOAD_ERROR_FALLBACK));
        setInvoiceDetails(null);
        setIsLoading(false);

        return;
      }

      setInvoiceDetails(result.data as InvoiceDetails);
      setErrorMessage('');
      setIsLoading(false);
    };

    loadInvoice();
  }, [invoiceId]);

  const handleDelete = async (): Promise<void> => {
    if (!hasPermission('invoices:delete')) {
      setErrorMessage(PERMISSION_ERROR);
      setIsDeleteDialogOpen(false);

      return;
    }

    if (!invoiceId) {
      return;
    }

    setIsDeleting(true);
    const result = await invoiceApi.deleteInvoice(invoiceId);
    setIsDeleting(false);

    if (result.error) {
      setErrorMessage(extractApiErrorMessage(result.error, DELETE_ERROR_FALLBACK));
      setIsDeleteDialogOpen(false);

      return;
    }

    onDeleteSuccess();
  };

  return {
    invoiceDetails,
    isLoading,
    errorMessage,
    isDeleteDialogOpen,
    isDeleting,
    setIsDeleteDialogOpen,
    handleDelete,
  };
};

export default useInvoiceViewState;
