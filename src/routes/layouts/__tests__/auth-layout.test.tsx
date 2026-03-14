import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AuthLayout from '@/routes/layouts/auth-layout';
import { AUTH_HERO_SUBTITLE, AUTH_HERO_TITLE, AUTH_METRICS } from '@/routes/layouts/constants';
import { theme } from '@/theme';

describe('AuthLayout', () => {
  it('renders hero content and metrics', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route element={<div>Auth Outlet Content</div>} path="/login" />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(AUTH_HERO_TITLE)).toBeInTheDocument();
    expect(screen.getByText(AUTH_HERO_SUBTITLE)).toBeInTheDocument();
    expect(screen.getByText(AUTH_METRICS[0].value)).toBeInTheDocument();
    expect(screen.getByText(AUTH_METRICS[0].label)).toBeInTheDocument();
    expect(screen.getByText('Auth Outlet Content')).toBeInTheDocument();
  });
});
