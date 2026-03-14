import { useContext } from 'react';
import type { PropsWithChildren } from 'react';
import type { AuthContextValue } from '@/context/AuthContext';
import { AuthTestContext } from '@/test/auth-test-context';

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => <>{children}</>;

export const useAuth = (): AuthContextValue => useContext(AuthTestContext);
