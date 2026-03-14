import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Alert, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppButton from '@/components/button';
import PermissionGuard from '@/components/RbacGuard';
import SearchBar from '@/components/search';
import {
  CREATE_INVOICE_LABEL,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SEARCH_DEBOUNCE_MS,
  SEARCH_PLACEHOLDER,
  STATUS_FILTER_OPTIONS,
} from '@/pages/invoices/invoice-list-page/constants';
import DesktopInvoiceTable from '@/pages/invoices/invoice-list-page/components/desktop-invoice-table';
import MobileInvoiceList from '@/pages/invoices/invoice-list-page/components/mobile-invoice-list';
import {
  CREATE_BUTTON_SX,
  FILTER_PAPER_SX,
  FILTER_CHIPS_STACK_SX,
  STATUS_FILTER_CHIP_SX,
} from '@/pages/invoices/invoice-list-page/styles';
import type { InvoiceStatus } from '@/pages/invoices/invoice-list-page/types';
import { formatCurrency, formatDate } from '@/pages/invoices/invoice-list-page/utils';
import useInvoiceListData from '@/pages/invoices/invoice-list-page/hooks/useInvoiceListData';
import useInvoiceParams from '@/hooks/useInvoiceParams';

const InvoiceListPage = (): JSX.Element => {
  const { apiPage, muiPage, limit, search, status, updateParams } = useInvoiceParams();
  const navigate = useNavigate();
  const { invoicesData, isLoading, errorMessage } = useInvoiceListData({
    apiPage,
    limit,
    search,
    status,
  });

  const handleOpenInvoice = useCallback(
    (invoiceId: string): void => {
      navigate(`/invoices/${invoiceId}`);
    },
    [navigate]
  );

  const handleEditInvoice = useCallback(
    (invoiceId: string): void => {
      navigate(`/invoices/${invoiceId}/edit`);
    },
    [navigate]
  );

  const handlePageChange = useCallback(
    (newMuiPage: number): void => {
      updateParams({ page: newMuiPage });
    },
    [updateParams]
  );

  const handleRowsPerPageChange = useCallback(
    (newLimit: number): void => {
      updateParams({ limit: newLimit, page: 0 });
    },
    [updateParams]
  );

  const handleStatusChange = useCallback(
    (nextStatus: '' | InvoiceStatus): void => {
      updateParams({ status: nextStatus });
    },
    [updateParams]
  );

  return (
    <Stack spacing={3}>
      <Stack
        alignItems={{ xs: 'flex-start', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack spacing={1}>
          <Typography variant="h3" fontWeight={800}>
            {PAGE_TITLE}
          </Typography>
          <Typography color="text.secondary">{PAGE_SUBTITLE}</Typography>
        </Stack>
        <PermissionGuard permission="invoices:create">
          <AppButton
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate('/invoices/new')}
            variant="contained"
            sx={CREATE_BUTTON_SX}
          >
            {CREATE_INVOICE_LABEL}
          </AppButton>
        </PermissionGuard>
      </Stack>

      <Paper sx={FILTER_PAPER_SX} variant="outlined">
        <Stack
          alignItems={{ xs: 'stretch', md: 'center' }}
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
        >
          <SearchBar
            debounceMs={SEARCH_DEBOUNCE_MS}
            onDebouncedChange={(value) => updateParams({ search: value })}
            placeholder={SEARCH_PLACEHOLDER}
            sx={{ flex: 1, minWidth: 0 }}
            value={search}
          />
          <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
          <Stack direction="row" spacing={1} sx={FILTER_CHIPS_STACK_SX}>
            {STATUS_FILTER_OPTIONS.map((statusOption) => {
              const isSelected = status === statusOption.value;

              return (
                <Chip
                  clickable
                  color={isSelected ? 'secondary' : 'default'}
                  key={statusOption.label}
                  label={statusOption.label}
                  onClick={() => handleStatusChange(statusOption.value)}
                  sx={STATUS_FILTER_CHIP_SX}
                  variant="filled"
                />
              );
            })}
          </Stack>
        </Stack>
      </Paper>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <DesktopInvoiceTable
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        invoices={invoicesData.items}
        isLoading={isLoading}
        limit={limit}
        muiPage={muiPage}
        onEditInvoice={handleEditInvoice}
        onOpenInvoice={handleOpenInvoice}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={invoicesData.totalCount}
      />

      <MobileInvoiceList
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        invoices={invoicesData.items}
        isLoading={isLoading}
        limit={limit}
        muiPage={muiPage}
        onEditInvoice={handleEditInvoice}
        onOpenInvoice={handleOpenInvoice}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={invoicesData.totalCount}
      />
    </Stack>
  );
};

export default InvoiceListPage;
