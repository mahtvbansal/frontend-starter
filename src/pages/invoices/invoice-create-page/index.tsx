import { Stack, Typography } from '@mui/material';
import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceCreateForm from '@/pages/invoices/invoice-create-page/components/invoice-create-form';
import useInvoiceCreateState from '@/pages/invoices/invoice-create-page/hooks/useInvoiceCreateState';
import { PAGE_SUBTITLE, PAGE_TITLE } from '@/pages/invoices/invoice-create-page/constants';

const InvoiceCreatePage = (): JSX.Element => {
  const navigate = useNavigate();
  const {
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
  } = useInvoiceCreateState();

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const result = await handleSubmit();

    if (!result.ok) {
      return;
    }

    navigate('/invoices');
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3" fontWeight={800}>
          {PAGE_TITLE}
        </Typography>
        <Typography color="text.secondary">{PAGE_SUBTITLE}</Typography>
      </Stack>

      <InvoiceCreateForm
        amount={amount}
        customerName={customerName}
        errors={errors}
        isSubmitting={isSubmitting}
        notes={notes}
        onAmountChange={setAmount}
        onCustomerNameChange={setCustomerName}
        onNotesChange={setNotes}
        onSubmit={handleFormSubmit}
        serverError={serverError}
      />
    </Stack>
  );
};

export default InvoiceCreatePage;
