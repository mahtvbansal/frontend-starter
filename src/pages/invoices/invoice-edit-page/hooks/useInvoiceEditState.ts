import { useEffect, useState } from 'react';
import {
  DEFAULT_STATUS,
  DETAILS_UNAVAILABLE_ERROR,
  INITIAL_ERRORS,
  LOAD_ERROR_FALLBACK,
  MISSING_ID_ERROR,
  PERMISSION_ERROR,
  UPDATE_ERROR_FALLBACK,
} from '@/pages/invoices/invoice-edit-page/constants';
import type {
  InvoiceDetails,
  InvoiceStatus,
  UseInvoiceEditStateInput,
  UseInvoiceEditStateReturn,
} from '@/pages/invoices/invoice-edit-page/types';
import {
  buildUpdatePayload,
  extractApiErrorMessage,
  hasValidationErrors,
  validateEditForm,
} from '@/pages/invoices/invoice-edit-page/utils';
import { invoiceApi } from '@/services/api';

const useInvoiceEditState = ({
  invoiceId,
  hasPermission,
}: UseInvoiceEditStateInput): UseInvoiceEditStateReturn => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>(DEFAULT_STATUS);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInvoice = async (): Promise<void> => {
      if (!invoiceId) {
        setServerError(MISSING_ID_ERROR);
        setIsLoading(false);

        return;
      }

      setIsLoading(true);
      const result = await invoiceApi.getInvoiceById(invoiceId);

      if (result.error) {
        setServerError(extractApiErrorMessage(result.error, LOAD_ERROR_FALLBACK));
        setIsLoading(false);

        return;
      }

      const nextInvoice = result.data as InvoiceDetails;
      setInvoiceDetails(nextInvoice);
      setCustomerName(nextInvoice.customerName);
      setAmount(String(nextInvoice.amount));
      setStatus(nextInvoice.status);
      setServerError('');
      setIsLoading(false);
    };

    loadInvoice();
  }, [invoiceId]);

  const handleSubmit = async (): Promise<{ ok: boolean }> => {
    setServerError('');

    if (!hasPermission('invoices:update')) {
      setServerError(PERMISSION_ERROR);

      return { ok: false };
    }

    if (!invoiceId || !invoiceDetails) {
      setServerError(DETAILS_UNAVAILABLE_ERROR);

      return { ok: false };
    }

    const nextErrors = validateEditForm(customerName, amount);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return { ok: false };
    }

    const payload = buildUpdatePayload(invoiceDetails, customerName, amount, status);

    setIsSubmitting(true);
    const result = await invoiceApi.updateInvoice(invoiceId, payload);
    setIsSubmitting(false);

    if (result.error) {
      setServerError(extractApiErrorMessage(result.error, UPDATE_ERROR_FALLBACK));

      return { ok: false };
    }

    const updatedInvoice = result.data as InvoiceDetails;
    setInvoiceDetails(updatedInvoice);
    setCustomerName(updatedInvoice.customerName);
    setAmount(String(updatedInvoice.amount));
    setStatus(updatedInvoice.status);

    return { ok: true };
  };

  return {
    invoiceDetails,
    customerName,
    amount,
    status,
    errors,
    isLoading,
    isSubmitting,
    serverError,
    setCustomerName,
    setAmount,
    setStatus,
    handleSubmit,
  };
};

export default useInvoiceEditState;
