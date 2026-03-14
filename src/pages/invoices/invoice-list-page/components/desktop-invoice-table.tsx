import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import PermissionGuard from '@/components/RbacGuard';
import {
  DESKTOP_SKELETON_ROWS,
  NO_INVOICES_FOUND_MESSAGE,
  TABLE_HEADERS,
  TABLE_ROWS_PER_PAGE_OPTIONS,
} from '@/pages/invoices/invoice-list-page/constants';
import { DESKTOP_TABLE_PAPER_SX } from '@/pages/invoices/invoice-list-page/styles';
import type { InvoiceItem } from '@/pages/invoices/invoice-list-page/types';
import StatusBadge from '@/pages/invoices/invoice-list-page/components/status-badge';

interface DesktopInvoiceTableProps {
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

const DesktopInvoiceTable = ({
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
}: DesktopInvoiceTableProps): JSX.Element => (
  <Paper sx={DESKTOP_TABLE_PAPER_SX} variant="outlined">
    <Table sx={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          <TableCell>{TABLE_HEADERS.INVOICE_NUMBER}</TableCell>
          <TableCell>{TABLE_HEADERS.CUSTOMER_NAME}</TableCell>
          <TableCell>{TABLE_HEADERS.INVOICE_AMOUNT}</TableCell>
          <TableCell>{TABLE_HEADERS.STATUS}</TableCell>
          <TableCell>{TABLE_HEADERS.CREATION_DATE}</TableCell>
          <TableCell align="right">{TABLE_HEADERS.ACTIONS}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          Array.from({ length: DESKTOP_SKELETON_ROWS }).map((_, index) => (
            <TableRow key={`invoice-skeleton-${index}`}>
              <TableCell>
                <Skeleton height={20} variant="text" width="75%" />
              </TableCell>
              <TableCell>
                <Skeleton height={20} variant="text" width="80%" />
              </TableCell>
              <TableCell>
                <Skeleton height={20} variant="text" width="65%" />
              </TableCell>
              <TableCell>
                <Skeleton height={26} sx={{ borderRadius: 999 }} variant="rounded" width={72} />
              </TableCell>
              <TableCell>
                <Skeleton height={20} variant="text" width="70%" />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Skeleton height={28} sx={{ borderRadius: 999 }} variant="circular" width={28} />
                </Stack>
              </TableCell>
            </TableRow>
          ))
        ) : invoices.length === 0 ? (
          <TableRow>
            <TableCell align="center" colSpan={6}>
              <Typography color="text.secondary" variant="body2">
                {NO_INVOICES_FOUND_MESSAGE}
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => (
            <TableRow
              hover
              key={invoice.id}
              onClick={() => onOpenInvoice(invoice.id)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>
                <StatusBadge status={invoice.status} />
              </TableCell>
              <TableCell>{formatDate(invoice.createdAt)}</TableCell>
              <TableCell align="right">
                <PermissionGuard permission="invoices:update">
                  <IconButton
                    onClick={(event) => {
                      event.stopPropagation();
                      onEditInvoice(invoice.id);
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </PermissionGuard>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    <Divider />
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
);

export default DesktopInvoiceTable;
