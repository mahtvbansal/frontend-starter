import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import Login from '@/pages/auth/login/index';

describe('Login page', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/login');
  });

  it('shows validation errors and prevents submit when password is shorter than 8 characters', async () => {
    const loginMock = vi.fn();
    const { user } = render(<Login />, {
      authValue: {
        isLoading: false,
        login: loginMock,
      },
    });

    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), '12345');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/login');
  });

  it('submits credentials and navigates to invoices on success', async () => {
    const loginMock = vi.fn().mockResolvedValue({ data: { token: 'token' } });
    const { user } = render(<Login />, {
      authValue: {
        isLoading: false,
        login: loginMock,
      },
    });

    await user.type(screen.getByRole('textbox', { name: /email address/i }), 'qa@invoicepro.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('qa@invoicepro.com', 'password123');
    });
    expect(window.location.pathname).toBe('/invoices');
  });

  it('shows API error and does not navigate when backend rejects login (401)', async () => {
    const loginMock = vi.fn().mockResolvedValue({
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    });

    const { user } = render(<Login />, {
      authValue: {
        isLoading: false,
        login: loginMock,
      },
    });

    await user.type(screen.getByRole('textbox', { name: /email address/i }), 'qa@invoicepro.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/unauthorized/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });
});
