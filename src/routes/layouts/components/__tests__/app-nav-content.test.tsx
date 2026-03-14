import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import AppNavContent from '@/routes/layouts/components/app-nav-content';
import {
  NAV_INVOICES_LABEL,
  SESSION_ACTIVE_LABEL,
  SESSION_CONNECTED_DESCRIPTION,
  SESSION_INACTIVE_LABEL,
  SESSION_USER_PREFIX,
} from '@/routes/layouts/constants';

describe('AppNavContent', () => {
  it('renders authenticated session details and triggers onNavigate on link click', async () => {
    const handleNavigate = vi.fn();

    const { user } = render(
      <AppNavContent isAuthenticated onNavigate={handleNavigate} userEmail="owner@example.com" />
    );

    expect(screen.getByRole('link', { name: NAV_INVOICES_LABEL })).toBeInTheDocument();
    expect(screen.getByText(SESSION_ACTIVE_LABEL)).toBeInTheDocument();
    expect(screen.getByText(`${SESSION_USER_PREFIX}owner@example.com`)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: NAV_INVOICES_LABEL }));

    expect(handleNavigate).toHaveBeenCalledTimes(1);
  });

  it('renders signed-out messaging when user email is missing', () => {
    render(<AppNavContent isAuthenticated={false} onNavigate={vi.fn()} userEmail={null} />);

    expect(screen.getByText(SESSION_INACTIVE_LABEL)).toBeInTheDocument();
    expect(screen.getByText(SESSION_CONNECTED_DESCRIPTION)).toBeInTheDocument();
  });
});
