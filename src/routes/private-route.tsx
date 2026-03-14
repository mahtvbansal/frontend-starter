import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
  children?: JSX.Element;
  requiredPermission?: string | string[];
}

const PrivateRoute = ({ children, requiredPermission }: PrivateRouteProps): JSX.Element => {
  const location = useLocation();
  const { hasPermission, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
        to="/login"
      />
    );
  }

  if (!hasPermission(requiredPermission)) {
    return <Navigate replace state={{ denied: requiredPermission }} to="/invoices" />;
  }

  return children ?? <Outlet />;
};

export default PrivateRoute;
