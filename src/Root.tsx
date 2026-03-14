import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { appRouter } from '@/routes/app-router';

const Root = (): JSX.Element => (
  <AuthProvider>
    <RouterProvider router={appRouter} />
  </AuthProvider>
);

export default Root;
