import { Alert, MenuItem, Paper, Stack, TextField } from '@mui/material';
import type { FormEvent } from 'react';
import AppButton from '@/components/button';
import {
  AMOUNT_LABEL,
  CLIENT_NAME_LABEL,
  STATUS_LABEL,
  UPDATE_BUTTON_LABEL,
} from '@/pages/invoices/invoice-edit-page/constants';
import { FORM_PAPER_SX } from '@/pages/invoices/invoice-edit-page/styles';
import type { EditFormErrors, InvoiceStatus } from '@/pages/invoices/invoice-edit-page/types';

interface InvoiceEditFormProps {
  readonly customerName: string;
  readonly amount: string;
  readonly status: InvoiceStatus;
  readonly statusOptions: readonly InvoiceStatus[];
  readonly errors: EditFormErrors;
  readonly serverError: string;
  readonly isSubmitting: boolean;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onCustomerNameChange: (value: string) => void;
  readonly onAmountChange: (value: string) => void;
  readonly onStatusChange: (value: InvoiceStatus) => void;
}

const InvoiceEditForm = ({
  customerName,
  amount,
  status,
  statusOptions,
  errors,
  serverError,
  isSubmitting,
  onSubmit,
  onCustomerNameChange,
  onAmountChange,
  onStatusChange,
}: InvoiceEditFormProps): JSX.Element => (
  <Paper component="form" onSubmit={onSubmit} sx={FORM_PAPER_SX} variant="outlined">
    <Stack spacing={2.5}>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}
      <TextField
        error={Boolean(errors.customerName)}
        fullWidth
        helperText={errors.customerName}
        label={CLIENT_NAME_LABEL}
        onChange={(event) => onCustomerNameChange(event.target.value)}
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
        required
        type="number"
        value={amount}
      />
      <TextField
        fullWidth
        label={STATUS_LABEL}
        onChange={(event) => onStatusChange(event.target.value as InvoiceStatus)}
        select
        value={status}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Stack direction="row" justifyContent="flex-end">
        <AppButton isLoading={isSubmitting} type="submit" variant="contained">
          {UPDATE_BUTTON_LABEL}
        </AppButton>
      </Stack>
    </Stack>
  </Paper>
);

export default InvoiceEditForm;
