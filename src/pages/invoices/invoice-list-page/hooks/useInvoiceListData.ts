import { useEffect, useState } from 'react';
import { LOAD_INVOICES_ERROR_MESSAGE } from '@/pages/invoices/invoice-list-page/constants';
import type { InvoiceStatus, InvoicesResponse } from '@/pages/invoices/invoice-list-page/types';
import { invoiceApi } from '@/services/api';

interface UseInvoiceListDataInput {
  apiPage: number;
  limit: number;
  search: string;
  status: '' | InvoiceStatus;
}

interface UseInvoiceListDataReturn {
  invoicesData: InvoicesResponse;
  isLoading: boolean;
  errorMessage: string;
}

const INITIAL_INVOICES_DATA: InvoicesResponse = {
  items: [],
  totalCount: 0,
  page: 1,
  limit: 10,
};

const useInvoiceListData = ({
  apiPage,
  limit,
  search,
  status,
}: UseInvoiceListDataInput): UseInvoiceListDataReturn => {
  const [invoicesData, setInvoicesData] = useState<InvoicesResponse>(INITIAL_INVOICES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadInvoices = async (): Promise<void> => {
      setIsLoading(true);

      const result = await invoiceApi.getInvoices({
        page: apiPage,
        limit,
        ...(search && { search }),
        ...(status && { status }),
      });

      if (result.error) {
        setErrorMessage(result.error.message || LOAD_INVOICES_ERROR_MESSAGE);
        setIsLoading(false);

        return;
      }

      setInvoicesData(result.data as InvoicesResponse);
      setErrorMessage('');
      setIsLoading(false);
    };

    loadInvoices();
  }, [apiPage, limit, search, status]);

  return { invoicesData, isLoading, errorMessage };
};

export default useInvoiceListData;
