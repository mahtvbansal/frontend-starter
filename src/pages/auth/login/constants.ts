import type { LoginFormErrors } from '@/pages/auth/login/types';

export const PAGE_TITLE = 'Welcome back';
export const PAGE_SUBTITLE =
  'Sign in to your account to continue managing invoices and client payments.';

export const EMAIL_LABEL = 'Email address';
export const PASSWORD_LABEL = 'Password';
export const EMAIL_PLACEHOLDER = 'you@company.com';
export const PASSWORD_PLACEHOLDER = 'Enter your password';

export const EMAIL_INVALID_ERROR = 'Enter a valid email address.';
export const PASSWORD_MIN_LENGTH_ERROR = 'Password must be at least 8 characters long.';
export const LOGIN_ERROR_FALLBACK = 'Invalid credentials';

export const SUBMIT_BUTTON_LABEL = 'Sign in';
export const SIGNUP_PROMPT = "Don't have an account?";
export const SIGNUP_LINK_LABEL = 'Create one';

export const SHOW_PASSWORD_ARIA_LABEL = 'Show password';
export const HIDE_PASSWORD_ARIA_LABEL = 'Hide password';

export const INITIAL_LOGIN_ERRORS: LoginFormErrors = {
  email: '',
  password: '',
};

export const DEFAULT_LOGIN_REDIRECT = '/invoices';
