import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface PermissionGuardProps {
  permission?: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

const PermissionGuard = ({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps): JSX.Element => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
