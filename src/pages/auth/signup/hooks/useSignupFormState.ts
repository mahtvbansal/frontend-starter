import { useState } from 'react';
import { INITIAL_SIGNUP_ERRORS, SIGNUP_ERROR_FALLBACK } from '@/pages/auth/signup/constants';
import type {
  RoleOption,
  SignupFormValues,
  UseSignupFormStateReturn,
} from '@/pages/auth/signup/types';
import { ROLE_OPTIONS } from '@/pages/auth/signup/types';
import { hasValidationErrors, validateSignupForm } from '@/pages/auth/signup/utils';
import type { AuthResult } from '@/context/AuthContext';

interface UseSignupFormStateInput {
  signup: (email: string, password: string, role: string) => Promise<AuthResult>;
}

const useSignupFormState = ({ signup }: UseSignupFormStateInput): UseSignupFormStateReturn => {
  const [formValues, setFormValues] = useState<SignupFormValues>({
    email: '',
    password: '',
    role: ROLE_OPTIONS[2],
  });
  const [formErrors, setFormErrors] = useState(INITIAL_SIGNUP_ERRORS);
  const [serverError, setServerError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const setEmail = (value: string): void => {
    setFormValues((current) => ({ ...current, email: value }));
    setFormErrors((current) => ({ ...current, email: '' }));
    setServerError('');
  };

  const setPassword = (value: string): void => {
    setFormValues((current) => ({ ...current, password: value }));
    setFormErrors((current) => ({ ...current, password: '' }));
    setServerError('');
  };

  const setRole = (value: RoleOption): void => {
    setFormValues((current) => ({ ...current, role: value }));
    setFormErrors((current) => ({ ...current, role: '' }));
    setServerError('');
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible((current) => !current);
  };

  const submitSignup = async (): Promise<{ ok: boolean }> => {
    const validationErrors = validateSignupForm(formValues);

    if (hasValidationErrors(validationErrors)) {
      setFormErrors(validationErrors);

      return { ok: false };
    }

    const result = await signup(formValues.email, formValues.password, formValues.role);

    if (result.error) {
      setServerError(result.error.message || SIGNUP_ERROR_FALLBACK);

      return { ok: false };
    }

    return { ok: true };
  };

  return {
    formValues,
    formErrors,
    serverError,
    isPasswordVisible,
    setEmail,
    setPassword,
    setRole,
    togglePasswordVisibility,
    submitSignup,
  };
};

export default useSignupFormState;
