import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { IconButton, Paper, Skeleton, Stack, TablePagination, Typography } from '@mui/material';
import PermissionGuard from '@/components/RbacGuard';
import {
  EDIT_INVOICE_ARIA_LABEL,
  MOBILE_SKELETON_ROWS,
  NO_INVOICES_FOUND_MESSAGE,
  TABLE_ROWS_PER_PAGE_OPTIONS,
} from '@/pages/invoices/invoice-list-page/constants';
import {
  MOBILE_CARD_SX,
  MOBILE_LIST_STACK_SX,
  MOBILE_PAGINATION_PAPER_SX,
} from '@/pages/invoices/invoice-list-page/styles';
import type { InvoiceItem } from '@/pages/invoices/invoice-list-page/types';
import StatusBadge from '@/pages/invoices/invoice-list-page/components/status-badge';

interface MobileInvoiceListProps {
  readonly isLoading: boolean;
  readonly invoices: InvoiceItem[];
  readonly totalCount: number;
  readonly muiPage: number;
  readonly limit: number;
  readonly formatCurrency: (amount: number) => string;
  readonly formatDate: (timestamp: number | string) => string;
  readonly onOpenInvoice: (invoiceId: string) => void;
  readonly onEditInvoice: (invoiceId: string) => void;
  readonly onPageChange: (newMuiPage: number) => void;
  readonly onRowsPerPageChange: (newLimit: number) => void;
}

const MobileInvoiceList = ({
  isLoading,
  invoices,
  totalCount,
  muiPage,
  limit,
  formatCurrency,
  formatDate,
  onOpenInvoice,
  onEditInvoice,
  onPageChange,
  onRowsPerPageChange,
}: MobileInvoiceListProps): JSX.Element => (
  <Stack spacing={1.5} sx={MOBILE_LIST_STACK_SX}>
    {isLoading ? (
      Array.from({ length: MOBILE_SKELETON_ROWS }).map((_, index) => (
        <Paper
          key={`invoice-mobile-skeleton-${index}`}
          sx={{ p: 2, borderRadius: 3 }}
          variant="outlined"
        >
          <Skeleton height={20} sx={{ mb: 1 }} variant="text" width="42%" />
          <Skeleton height={28} sx={{ mb: 1.5 }} variant="text" width="72%" />
          <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
            <Skeleton height={30} sx={{ borderRadius: 999 }} variant="rounded" width={90} />
            <Skeleton height={26} sx={{ borderRadius: 999 }} variant="circular" width={26} />
          </Stack>
        </Paper>
      ))
    ) : invoices.length === 0 ? (
      <Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
        <Typography align="center" color="text.secondary" variant="body2">
          {NO_INVOICES_FOUND_MESSAGE}
        </Typography>
      </Paper>
    ) : (
      invoices.map((invoice) => (
        <Paper
          key={invoice.id}
          onClick={() => onOpenInvoice(invoice.id)}
          sx={MOBILE_CARD_SX}
          variant="outlined"
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                <Typography color="secondary.main" fontWeight={700} sx={{ letterSpacing: 0.2 }}>
                  {invoice.invoiceNumber}
                </Typography>
                <Typography fontWeight={600} noWrap variant="h6">
                  {invoice.customerName}
                </Typography>
              </Stack>
              <Stack alignItems="flex-end" spacing={0.25}>
                <Typography fontWeight={700} variant="h5">
                  {formatCurrency(invoice.amount)}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase' }}
                  variant="body2"
                >
                  {formatDate(invoice.createdAt)}
                </Typography>
              </Stack>
            </Stack>

            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
              <StatusBadge status={invoice.status} />
              <PermissionGuard permission="invoices:update">
                <IconButton
                  aria-label={EDIT_INVOICE_ARIA_LABEL}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEditInvoice(invoice.id);
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </PermissionGuard>
            </Stack>
          </Stack>
        </Paper>
      ))
    )}

    <Paper sx={MOBILE_PAGINATION_PAPER_SX} variant="outlined">
      <TablePagination
        component="div"
        count={totalCount}
        onPageChange={(_event, newMuiPage) => onPageChange(newMuiPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
        page={muiPage}
        rowsPerPage={limit}
        rowsPerPageOptions={TABLE_ROWS_PER_PAGE_OPTIONS as unknown as number[]}
      />
    </Paper>
  </Stack>
);

export default MobileInvoiceList;
