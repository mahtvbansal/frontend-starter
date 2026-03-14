import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import PrivateRoute from '@/routes/private-route';
import { AuthTestProvider, buildAuthContextValue } from '@/test/auth-test-context';
import { theme } from '@/theme';
import type { AuthContextValue } from '@/context/AuthContext';

interface RenderWithProvidersOptions {
  initialEntries?: string[];
  authOverrides?: Partial<AuthContextValue>;
}

interface ProvidersProps {
  children: ReactNode;
  initialEntries: string[];
  authOverrides: Partial<AuthContextValue>;
}

const Providers = ({ children, initialEntries, authOverrides }: ProvidersProps): JSX.Element => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthTestProvider value={buildAuthContextValue(authOverrides)}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </AuthTestProvider>
  </ThemeProvider>
);

const renderWithProviders = (
  ui: JSX.Element,
  { initialEntries = ['/'], authOverrides = {} }: RenderWithProvidersOptions = {}
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <Providers authOverrides={authOverrides} initialEntries={initialEntries}>
        {children}
      </Providers>
    ),
  });

const LocationStateProbe = (): JSX.Element => {
  const location = useLocation();

  return <pre data-testid="location-state">{JSON.stringify(location.state)}</pre>;
};

describe('PrivateRoute', () => {
  it('shows a loading spinner when auth is loading', () => {
    renderWithProviders(
      <Routes>
        <Route element={<PrivateRoute />} path="/protected">
          <Route element={<div>Protected</div>} index />
        </Route>
      </Routes>,
      {
        initialEntries: ['/protected'],
        authOverrides: { isLoading: true },
      }
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login with the original path in state', () => {
    renderWithProviders(
      <Routes>
        <Route element={<PrivateRoute />} path="/protected">
          <Route element={<div>Protected</div>} index />
        </Route>
        <Route element={<LocationStateProbe />} path="/login" />
      </Routes>,
      {
        initialEntries: ['/protected?tab=all#summary'],
        authOverrides: { isAuthenticated: false },
      }
    );

    const stateText = screen.getByTestId('location-state').textContent ?? '{}';
    const locationState = JSON.parse(stateText) as { from?: string };

    expect(locationState.from).toBe('/protected?tab=all#summary');
  });

  it('redirects to invoices when required permission is missing', () => {
    renderWithProviders(
      <Routes>
        <Route element={<PrivateRoute requiredPermission="invoices:create" />} path="/protected">
          <Route element={<div>Protected</div>} index />
        </Route>
        <Route element={<LocationStateProbe />} path="/invoices" />
      </Routes>,
      {
        initialEntries: ['/protected'],
        authOverrides: {
          isAuthenticated: true,
          hasPermission: () => false,
        },
      }
    );

    const stateText = screen.getByTestId('location-state').textContent ?? '{}';
    const locationState = JSON.parse(stateText) as { denied?: string };

    expect(locationState.denied).toBe('invoices:create');
  });

  it('renders children when authenticated and authorized', () => {
    renderWithProviders(
      <Routes>
        <Route
          element={
            <PrivateRoute>
              <div>Children Content</div>
            </PrivateRoute>
          }
          path="/protected"
        />
      </Routes>,
      {
        initialEntries: ['/protected'],
        authOverrides: {
          isAuthenticated: true,
          hasPermission: () => true,
        },
      }
    );

    expect(screen.getByText('Children Content')).toBeInTheDocument();
  });

  it('renders outlet when no children are provided', () => {
    renderWithProviders(
      <Routes>
        <Route element={<PrivateRoute />} path="/protected">
          <Route element={<div>Outlet Content</div>} index />
        </Route>
      </Routes>,
      {
        initialEntries: ['/protected'],
        authOverrides: {
          isAuthenticated: true,
          hasPermission: () => true,
        },
      }
    );

    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });
});
