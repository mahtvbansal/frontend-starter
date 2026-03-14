export interface AuthState {
  user: Record<string, unknown> | null;
  token: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

import { useAuth } from '@/context/AuthContext';

export const useAuthState = (): AuthState => {
  const { user, token, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
  };
};
