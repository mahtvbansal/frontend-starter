import {
  EMAIL_INVALID_ERROR,
  INITIAL_LOGIN_ERRORS,
  PASSWORD_MIN_LENGTH_ERROR,
} from '@/pages/auth/login/constants';
import type { LoginFormErrors, LoginFormValues } from '@/pages/auth/login/types';

export const validateLoginForm = ({ email, password }: LoginFormValues): LoginFormErrors => {
  const nextErrors: LoginFormErrors = { ...INITIAL_LOGIN_ERRORS };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.email = EMAIL_INVALID_ERROR;
  }

  if (password.length < 8) {
    nextErrors.password = PASSWORD_MIN_LENGTH_ERROR;
  }

  return nextErrors;
};

export const hasValidationErrors = (errors: LoginFormErrors): boolean =>
  Boolean(errors.email || errors.password);
