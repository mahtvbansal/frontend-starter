import { Divider, Paper, Stack, Typography } from '@mui/material';
import { DETAILS_UNAVAILABLE_MESSAGE } from '@/pages/invoices/invoice-view-page/constants';
import { DETAILS_PAPER_SX } from '@/pages/invoices/invoice-view-page/styles';
import type { InvoiceDetails } from '@/pages/invoices/invoice-view-page/types';
import { buildFieldRows } from '@/pages/invoices/invoice-view-page/utils';
import FieldRow from '@/pages/invoices/invoice-view-page/components/field-row';

interface InvoiceDetailsCardProps {
  readonly invoiceDetails: InvoiceDetails | null;
}

const InvoiceDetailsCard = ({ invoiceDetails }: InvoiceDetailsCardProps): JSX.Element => (
  <Paper sx={DETAILS_PAPER_SX} variant="outlined">
    {invoiceDetails ? (
      <Stack divider={<Divider flexItem />} spacing={2.5}>
        {buildFieldRows(invoiceDetails).map((field) => (
          <FieldRow key={field.label} label={field.label} value={field.value} />
        ))}
      </Stack>
    ) : (
      <Typography color="text.secondary" variant="body2">
        {DETAILS_UNAVAILABLE_MESSAGE}
      </Typography>
    )}
  </Paper>
);

export default InvoiceDetailsCard;
