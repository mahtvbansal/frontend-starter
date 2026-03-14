import { Navigate, createBrowserRouter } from 'react-router-dom';
import InvoiceCreatePage from '@/pages/invoices/invoice-create-page/index';
import InvoiceEditPage from '@/pages/invoices/invoice-edit-page/index';
import InvoiceListPage from '@/pages/invoices/invoice-list-page/index';
import InvoiceViewPage from '@/pages/invoices/invoice-view-page/index';
import Login from '@/pages/auth/login/index';
import Signup from '@/pages/auth/signup/index';
import { AppLayout, AuthLayout } from '@/routes/layouts';
import PrivateRoute from '@/routes/private-route';

export const appRouter = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate replace to="/invoices" />,
          },
          {
            path: '/invoices',
            children: [
              {
                index: true,
                element: (
                  <PrivateRoute requiredPermission="invoices:read">
                    <InvoiceListPage />
                  </PrivateRoute>
                ),
              },
              {
                path: 'new',
                element: (
                  <PrivateRoute requiredPermission="invoices:create">
                    <InvoiceCreatePage />
                  </PrivateRoute>
                ),
              },
              {
                path: ':id',
                element: (
                  <PrivateRoute requiredPermission="invoices:read">
                    <InvoiceViewPage />
                  </PrivateRoute>
                ),
              },
              {
                path: ':id/edit',
                element: (
                  <PrivateRoute requiredPermission="invoices:update">
                    <InvoiceEditPage />
                  </PrivateRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to="/invoices" />,
  },
]);
