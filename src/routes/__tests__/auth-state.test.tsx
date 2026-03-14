import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import type { AuthContextValue } from '@/context/AuthContext';
import { useAuthState } from '@/routes/auth-state';
import { AuthTestProvider, buildAuthContextValue } from '@/test/auth-test-context';

interface WrapperProps {
  children: ReactNode;
}

const createWrapper = (overrides: Partial<AuthContextValue> = {}) => {
  const authValue = buildAuthContextValue(overrides);

  return ({ children }: WrapperProps): JSX.Element => (
    <AuthTestProvider value={authValue}>{children}</AuthTestProvider>
  );
};

describe('useAuthState', () => {
  it('maps auth context into auth-state shape', () => {
    const wrapper = createWrapper({
      user: { email: 'admin@example.com' },
      token: 'jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });

    const { result } = renderHook(() => useAuthState(), { wrapper });

    expect(result.current).toEqual({
      user: { email: 'admin@example.com' },
      token: 'jwt-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });
});
