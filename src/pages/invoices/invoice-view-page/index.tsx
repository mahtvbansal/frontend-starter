import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from '@/components/button';
import PermissionGuard from '@/components/RbacGuard';
import DeleteInvoiceDialog from '@/pages/invoices/invoice-view-page/components/delete-invoice-dialog';
import InvoiceDetailsCard from '@/pages/invoices/invoice-view-page/components/invoice-details-card';
import useInvoiceViewState from '@/pages/invoices/invoice-view-page/hooks/useInvoiceViewState';
import { ACTION_STACK_SX, LOADING_STACK_SX } from '@/pages/invoices/invoice-view-page/styles';
import {
  DELETE_BUTTON_LABEL,
  EDIT_BUTTON_LABEL,
  LOADING_TEXT,
  PAGE_SUBTITLE_PREFIX,
  PAGE_TITLE,
} from '@/pages/invoices/invoice-view-page/constants';
import { useAuth } from '@/context/AuthContext';

const InvoiceViewPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { id } = useParams<{ id: string }>();

  const handleDeleteSuccess = useCallback((): void => {
    navigate('/invoices', { replace: true });
  }, [navigate]);

  const {
    invoiceDetails,
    isLoading,
    errorMessage,
    isDeleteDialogOpen,
    isDeleting,
    setIsDeleteDialogOpen,
    handleDelete,
  } = useInvoiceViewState({
    invoiceId: id,
    hasPermission,
    onDeleteSuccess: handleDeleteSuccess,
  });

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
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Stack spacing={1}>
          <Typography variant="h3" fontWeight={800}>
            {PAGE_TITLE}
          </Typography>
          <Typography color="text.secondary">
            {`${PAGE_SUBTITLE_PREFIX}${invoiceDetails?.invoiceNumber ?? id}.`}
          </Typography>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={ACTION_STACK_SX}>
          <PermissionGuard permission="invoices:update">
            <AppButton onClick={() => navigate(`/invoices/${id}/edit`)} variant="outlined">
              {EDIT_BUTTON_LABEL}
            </AppButton>
          </PermissionGuard>
          <PermissionGuard permission="invoices:delete">
            <AppButton
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="contained"
            >
              {DELETE_BUTTON_LABEL}
            </AppButton>
          </PermissionGuard>
        </Stack>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <InvoiceDetailsCard invoiceDetails={invoiceDetails} />

      <DeleteInvoiceDialog
        invoiceNumberOrId={invoiceDetails?.invoiceNumber ?? id ?? ''}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirmDelete={handleDelete}
        open={isDeleteDialogOpen}
      />
    </Stack>
  );
};

export default InvoiceViewPage;
