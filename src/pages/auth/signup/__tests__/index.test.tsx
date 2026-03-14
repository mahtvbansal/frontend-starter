import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import Signup from '@/pages/auth/signup/index';

describe('Signup page', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/signup');
  });

  it('navigates to invoices after successful signup submission', async () => {
    const signupMock = vi.fn().mockResolvedValue({ data: { token: 'token' } });
    const { user } = render(<Signup />, {
      authValue: {
        isLoading: false,
        signup: signupMock,
      },
    });

    await user.type(screen.getByRole('textbox', { name: /email address/i }), 'new@invoicepro.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledWith('new@invoicepro.com', 'password123', 'Viewer');
    });
    expect(window.location.pathname).toBe('/invoices');
  });

  it('shows validation errors when form is invalid', async () => {
    const signupMock = vi.fn();
    const { user } = render(<Signup />, {
      authValue: {
        isLoading: false,
        signup: signupMock,
      },
    });

    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), '1234');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    expect(signupMock).not.toHaveBeenCalled();
  });

  it('renders API failure for server-side errors (500)', async () => {
    const signupMock = vi.fn().mockResolvedValue({
      error: {
        status: 500,
        message: 'Server error',
      },
    });
    const { user } = render(<Signup />, {
      authValue: {
        isLoading: false,
        signup: signupMock,
      },
    });

    await user.type(screen.getByRole('textbox', { name: /email address/i }), 'new@invoicepro.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/signup');
  });
});
