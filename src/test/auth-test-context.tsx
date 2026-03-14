import { createContext } from 'react';
import type { PropsWithChildren } from 'react';
import type { AuthContextValue, AuthResult } from '@/context/AuthContext';

const defaultAuthResult: AuthResult = {};

const defaultAuthContextValue: AuthContextValue = {
  user: null,
  token: '',
  isAuthenticated: false,
  isLoading: false,
  login: async () => defaultAuthResult,
  signup: async () => defaultAuthResult,
  logout: () => undefined,
  checkAuth: async () => defaultAuthResult,
  hasPermission: () => true,
};

export const AuthTestContext = createContext<AuthContextValue>(defaultAuthContextValue);

export const buildAuthContextValue = (
  overrides: Partial<AuthContextValue> = {}
): AuthContextValue => ({
  ...defaultAuthContextValue,
  ...overrides,
});

interface AuthTestProviderProps extends PropsWithChildren {
  value: AuthContextValue;
}

export const AuthTestProvider = ({ children, value }: AuthTestProviderProps): JSX.Element => (
  <AuthTestContext.Provider value={value}>{children}</AuthTestContext.Provider>
);
