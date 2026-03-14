import { Alert, Paper, Stack, TextField } from '@mui/material';
import type { FormEvent } from 'react';
import AppButton from '@/components/button';
import {
  AMOUNT_LABEL,
  AMOUNT_PLACEHOLDER,
  CLIENT_NAME_LABEL,
  CLIENT_NAME_PLACEHOLDER,
  CREATE_BUTTON_LABEL,
  NOTES_LABEL,
  NOTES_PLACEHOLDER,
} from '@/pages/invoices/invoice-create-page/constants';
import { FORM_PAPER_SX } from '@/pages/invoices/invoice-create-page/styles';
import type { CreateInvoiceErrors } from '@/pages/invoices/invoice-create-page/types';

interface InvoiceCreateFormProps {
  readonly customerName: string;
  readonly amount: string;
  readonly notes: string;
  readonly errors: CreateInvoiceErrors;
  readonly serverError: string;
  readonly isSubmitting: boolean;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onCustomerNameChange: (value: string) => void;
  readonly onAmountChange: (value: string) => void;
  readonly onNotesChange: (value: string) => void;
}

const InvoiceCreateForm = ({
  customerName,
  amount,
  notes,
  errors,
  serverError,
  isSubmitting,
  onSubmit,
  onCustomerNameChange,
  onAmountChange,
  onNotesChange,
}: InvoiceCreateFormProps): JSX.Element => (
  <Paper component="form" onSubmit={onSubmit} sx={FORM_PAPER_SX} variant="outlined">
    <Stack spacing={2.5}>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}
      <TextField
        error={Boolean(errors.customerName)}
        fullWidth
        helperText={errors.customerName}
        label={CLIENT_NAME_LABEL}
        onChange={(event) => onCustomerNameChange(event.target.value)}
        placeholder={CLIENT_NAME_PLACEHOLDER}
        required
        value={customerName}
      />
      <TextField
        error={Boolean(errors.amount)}
        fullWidth
        helperText={errors.amount}
        inputProps={{ min: 0, step: '0.01' }}
        label={AMOUNT_LABEL}
        onChange={(event) => onAmountChange(event.target.value)}
        placeholder={AMOUNT_PLACEHOLDER}
        required
        type="number"
        value={amount}
      />
      <TextField
        fullWidth
        label={NOTES_LABEL}
        minRows={4}
        multiline
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder={NOTES_PLACEHOLDER}
        value={notes}
      />
      <Stack direction="row" justifyContent="flex-end">
        <AppButton isLoading={isSubmitting} type="submit" variant="contained">
          {CREATE_BUTTON_LABEL}
        </AppButton>
      </Stack>
    </Stack>
  </Paper>
);

export default InvoiceCreateForm;
