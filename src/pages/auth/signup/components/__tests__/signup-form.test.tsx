import { describe, expect, it, vi } from 'vitest';
import SignupForm from '@/pages/auth/signup/components/signup-form';
import { render, screen } from '@/test/test-utils';

const baseProps = {
  formValues: {
    email: '',
    password: '',
    role: 'Viewer' as const,
  },
  formErrors: {
    email: '',
    password: '',
    role: '',
  },
  serverError: '',
  isPasswordVisible: false,
  isLoading: false,
  onSubmit: vi.fn(),
  onEmailChange: vi.fn(),
  onPasswordChange: vi.fn(),
  onRoleChange: vi.fn(),
  onTogglePasswordVisibility: vi.fn(),
};

describe('SignupForm', () => {
  it('forwards email/password changes and submit', async () => {
    const props = {
      ...baseProps,
      onSubmit: vi.fn(),
      onEmailChange: vi.fn(),
      onPasswordChange: vi.fn(),
    };
    const { user } = render(<SignupForm {...props} />);

    await user.type(screen.getByRole('textbox', { name: /email address/i }), 'new@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(props.onEmailChange).toHaveBeenCalled();
    expect(props.onPasswordChange).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles role selection and displays server error', async () => {
    const onRoleChange = vi.fn();
    const { user } = render(
      <SignupForm
        {...baseProps}
        onRoleChange={onRoleChange}
        serverError="Unable to create account"
      />
    );

    await user.click(screen.getByRole('combobox', { name: /role/i }));
    await user.click(screen.getByRole('option', { name: 'Admin' }));

    expect(onRoleChange).toHaveBeenCalledWith('Admin');
    expect(screen.getByRole('alert')).toHaveTextContent(/unable to create account/i);
  });
});
