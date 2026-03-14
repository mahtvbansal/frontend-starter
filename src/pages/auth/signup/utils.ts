import {
  EMAIL_INVALID_ERROR,
  INITIAL_SIGNUP_ERRORS,
  PASSWORD_MIN_LENGTH_ERROR,
  ROLE_REQUIRED_ERROR,
} from '@/pages/auth/signup/constants';
import type { SignupFormErrors, SignupFormValues } from '@/pages/auth/signup/types';

export const validateSignupForm = ({
  email,
  password,
  role,
}: SignupFormValues): SignupFormErrors => {
  const nextErrors: SignupFormErrors = { ...INITIAL_SIGNUP_ERRORS };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    nextErrors.email = EMAIL_INVALID_ERROR;
  }

  if (password.length < 8) {
    nextErrors.password = PASSWORD_MIN_LENGTH_ERROR;
  }

  if (!role) {
    nextErrors.role = ROLE_REQUIRED_ERROR;
  }

  return nextErrors;
};

export const hasValidationErrors = (errors: SignupFormErrors): boolean =>
  Boolean(errors.email || errors.password || errors.role);
