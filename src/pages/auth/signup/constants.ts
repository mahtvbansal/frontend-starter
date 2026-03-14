import type { SignupFormErrors } from '@/pages/auth/signup/types';

export const PAGE_TITLE = 'Create your workspace';
export const PAGE_SUBTITLE =
  'Set up your invoice management account and start issuing invoices in minutes.';

export const EMAIL_LABEL = 'Email address';
export const PASSWORD_LABEL = 'Password';
export const ROLE_LABEL = 'Role';

export const EMAIL_PLACEHOLDER = 'you@company.com';
export const PASSWORD_PLACEHOLDER = 'Create a secure password';

export const EMAIL_INVALID_ERROR = 'Enter a valid email address.';
export const PASSWORD_MIN_LENGTH_ERROR = 'Password must be at least 8 characters long.';
export const ROLE_REQUIRED_ERROR = 'Select a role to continue.';
export const SIGNUP_ERROR_FALLBACK = 'Unable to create your account';

export const SUBMIT_BUTTON_LABEL = 'Create account';
export const LOGIN_PROMPT = 'Already have an account?';
export const LOGIN_LINK_LABEL = 'Sign in';

export const SHOW_PASSWORD_ARIA_LABEL = 'Show password';
export const HIDE_PASSWORD_ARIA_LABEL = 'Hide password';

export const INITIAL_SIGNUP_ERRORS: SignupFormErrors = {
  email: '',
  password: '',
  role: '',
};
