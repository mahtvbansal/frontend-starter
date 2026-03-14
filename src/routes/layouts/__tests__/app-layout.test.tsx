import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { AuthContextValue } from '@/context/AuthContext';
import AppLayout from '@/routes/layouts/app-layout';
import {
  OPEN_NAV_ARIA_LABEL,
  SESSION_CONNECTED_DESCRIPTION,
  SESSION_USER_PREFIX,
} from '@/routes/layouts/constants';
import { AuthTestProvider, buildAuthContextValue } from '@/test/auth-test-context';
import { theme } from '@/theme';

const renderLayout = (authOverrides: Partial<AuthContextValue>) =>
  render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthTestProvider value={buildAuthContextValue(authOverrides)}>
        <MemoryRouter initialEntries={['/invoices']}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route element={<div>Invoices Content</div>} path="/invoices" />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthTestProvider>
    </ThemeProvider>
  );

describe('AppLayout', () => {
  it('renders outlet content and authenticated user email', async () => {
    const user = userEvent.setup();

    renderLayout({
      isAuthenticated: true,
      user: { email: 'owner@example.com' },
    });

    expect(screen.getByText('Invoices Content')).toBeInTheDocument();
    expect(screen.getAllByText(`${SESSION_USER_PREFIX}owner@example.com`).length).toBeGreaterThan(
      0
    );

    await user.click(screen.getByRole('button', { name: OPEN_NAV_ARIA_LABEL }));

    expect(screen.getByRole('link', { name: /invoices/i })).toBeInTheDocument();
  });

  it('renders connected description when no email is available', () => {
    renderLayout({
      isAuthenticated: true,
      user: { role: 'admin' },
    });

    expect(screen.getAllByText(SESSION_CONNECTED_DESCRIPTION).length).toBeGreaterThan(0);
  });
});
