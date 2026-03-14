import { useAuth } from '@/context/AuthContext';

export interface AuthState {
  user: Record<string, unknown> | null;
  token: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthState = (): AuthState => {
  const { user, token, isAuthenticated, isLoading } = useAuth();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
  };
};
