import { describe, expect, it, vi } from 'vitest';
import LoginForm from '@/pages/auth/login/components/login-form';
import { render, screen } from '@/test/test-utils';

const baseProps = {
  formValues: {
    email: '',
    password: '',
  },
  formErrors: {
    email: '',
    password: '',
  },
  serverError: '',
  isPasswordVisible: false,
  isLoading: false,
  onSubmit: vi.fn(),
  onEmailChange: vi.fn(),
  onPasswordChange: vi.fn(),
  onTogglePasswordVisibility: vi.fn(),
};

describe('LoginForm', () => {
  it('renders fields and forwards change/submit interactions', async () => {
    const props = {
      ...baseProps,
      onSubmit: vi.fn(),
      onEmailChange: vi.fn(),
      onPasswordChange: vi.fn(),
    };
    const { user } = render(<LoginForm {...props} />);

    await user.type(screen.getByRole('textbox', { name: /email address/i }), 'qa@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(props.onEmailChange).toHaveBeenCalled();
    expect(props.onPasswordChange).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders server error and toggles password visibility control', async () => {
    const onTogglePasswordVisibility = vi.fn();
    const { user } = render(
      <LoginForm
        {...baseProps}
        serverError="Invalid credentials"
        onTogglePasswordVisibility={onTogglePasswordVisibility}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid credentials/i);
    await user.click(screen.getByRole('button', { name: /show password/i }));
    expect(onTogglePasswordVisibility).toHaveBeenCalledTimes(1);
  });
});
