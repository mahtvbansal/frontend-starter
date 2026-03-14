import { apiFetch } from '@/api/client';

export const authApi = {
  signup: async (payload) => apiFetch('/auth/signup', { method: 'POST', body: payload }),
  login: async (payload) => apiFetch('/auth/login', { method: 'POST', body: payload }),
  me: async () => apiFetch('/auth/me'),
};

export const invoiceApi = {
  getInvoices: async (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });

    return apiFetch(`/invoices${query.toString() ? `?${query.toString()}` : ''}`);
  },
  createInvoice: async (payload) => apiFetch('/invoices', { method: 'POST', body: payload }),
  getInvoiceById: async (id) => apiFetch(`/invoices/${id}`),
  updateInvoice: async (id, payload) =>
    apiFetch(`/invoices/${id}`, { method: 'PATCH', body: payload }),
  deleteInvoice: async (id) => apiFetch(`/invoices/${id}`, { method: 'DELETE' }),
};

export { apiFetch as request };
