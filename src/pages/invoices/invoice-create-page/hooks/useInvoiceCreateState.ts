import { useState } from 'react';
import { INITIAL_ERRORS } from '@/pages/invoices/invoice-create-page/constants';
import type { UseInvoiceCreateStateReturn } from '@/pages/invoices/invoice-create-page/types';
import {
  buildCreatePayload,
  extractApiErrorMessage,
  hasValidationErrors,
  validateCreateForm,
} from '@/pages/invoices/invoice-create-page/utils';
import { invoiceApi } from '@/services/api';

const useInvoiceCreateState = (): UseInvoiceCreateStateReturn => {
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<{ ok: boolean }> => {
    setServerError('');

    const nextErrors = validateCreateForm(customerName, amount);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return { ok: false };
    }

    setIsSubmitting(true);
    const result = await invoiceApi.createInvoice(buildCreatePayload(customerName, amount));
    setIsSubmitting(false);

    if (result.error) {
      setServerError(extractApiErrorMessage(result.error));

      return { ok: false };
    }

    return { ok: true };
  };

  return {
    customerName,
    amount,
    notes,
    errors,
    serverError,
    isSubmitting,
    setCustomerName,
    setAmount,
    setNotes,
    handleSubmit,
  };
};

export default useInvoiceCreateState;
