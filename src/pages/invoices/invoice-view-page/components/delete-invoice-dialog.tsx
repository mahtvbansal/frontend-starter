import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import AppButton from '@/components/button';
import {
  DIALOG_CANCEL_LABEL,
  DIALOG_CONFIRM_LABEL,
  DIALOG_DESCRIPTION_PREFIX,
  DIALOG_DESCRIPTION_SUFFIX,
  DIALOG_TITLE,
} from '@/pages/invoices/invoice-view-page/constants';

interface DeleteInvoiceDialogProps {
  readonly open: boolean;
  readonly isDeleting: boolean;
  readonly invoiceNumberOrId: string;
  readonly onClose: () => void;
  readonly onConfirmDelete: () => Promise<void>;
}

const DeleteInvoiceDialog = ({
  open,
  isDeleting,
  invoiceNumberOrId,
  onClose,
  onConfirmDelete,
}: DeleteInvoiceDialogProps): JSX.Element => (
  <Dialog open={open} onClose={() => !isDeleting && onClose()}>
    <DialogTitle>{DIALOG_TITLE}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {`${DIALOG_DESCRIPTION_PREFIX}${invoiceNumberOrId}${DIALOG_DESCRIPTION_SUFFIX}`}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <AppButton disabled={isDeleting} onClick={onClose} variant="text">
        {DIALOG_CANCEL_LABEL}
      </AppButton>
      <AppButton color="error" isLoading={isDeleting} onClick={onConfirmDelete} variant="contained">
        {DIALOG_CONFIRM_LABEL}
      </AppButton>
    </DialogActions>
  </Dialog>
);

export default DeleteInvoiceDialog;
