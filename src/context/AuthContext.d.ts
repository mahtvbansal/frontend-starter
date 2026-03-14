import type { ReactNode } from 'react';

export interface AuthUser {
  email?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface AuthResult {
  error?: {
    message?: string;
    details?: unknown;
  };
  data?: unknown;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, role: string) => Promise<AuthResult>;
  logout: () => void;
  checkAuth: () => Promise<AuthResult>;
  hasPermission: (requiredPermission?: string | string[]) => boolean;
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element;
export function useAuth(): AuthContextValue;
