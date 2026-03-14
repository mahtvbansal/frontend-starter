import { CircularProgress, Stack, Typography } from '@mui/material';
import { type FormEvent, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceEditForm from '@/pages/invoices/invoice-edit-page/components/invoice-edit-form';
import useInvoiceEditState from '@/pages/invoices/invoice-edit-page/hooks/useInvoiceEditState';
import { LOADING_STACK_SX } from '@/pages/invoices/invoice-edit-page/styles';
import {
  DEFAULT_STATUS,
  LOADING_TEXT,
  PAGE_SUBTITLE_PREFIX,
  PAGE_SUBTITLE_SUFFIX,
  PAGE_TITLE,
} from '@/pages/invoices/invoice-edit-page/constants';
import { getStatusOptions } from '@/pages/invoices/invoice-edit-page/utils';
import { useAuth } from '@/context/AuthContext';

const InvoiceEditPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { id } = useParams<{ id: string }>();

  const {
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
  } = useInvoiceEditState({
    invoiceId: id,
    hasPermission,
  });

  const statusOptions = useMemo(
    () => getStatusOptions(invoiceDetails?.status ?? DEFAULT_STATUS),
    [invoiceDetails?.status]
  );

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const result = await handleSubmit();

    if (!result.ok) {
      return;
    }

    if (!id) {
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);

      return;
    }

    navigate(`/invoices/${id}`, { replace: true });
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={LOADING_STACK_SX}>
        <CircularProgress size={28} />
        <Typography color="text.secondary" variant="body2">
          {LOADING_TEXT}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3" fontWeight={800}>
          {PAGE_TITLE}
        </Typography>
        <Typography color="text.secondary">
          {`${PAGE_SUBTITLE_PREFIX}${invoiceDetails?.invoiceNumber ?? id} ${PAGE_SUBTITLE_SUFFIX}`}
        </Typography>
      </Stack>

      <InvoiceEditForm
        amount={amount}
        customerName={customerName}
        errors={errors}
        isSubmitting={isSubmitting}
        onAmountChange={setAmount}
        onCustomerNameChange={setCustomerName}
        onStatusChange={setStatus}
        onSubmit={handleFormSubmit}
        serverError={serverError}
        status={status}
        statusOptions={statusOptions}
      />
    </Stack>
  );
};

export default InvoiceEditPage;
