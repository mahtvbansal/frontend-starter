import { useState } from 'react';
import {
  DEFAULT_LOGIN_REDIRECT,
  INITIAL_LOGIN_ERRORS,
  LOGIN_ERROR_FALLBACK,
} from '@/pages/auth/login/constants';
import type { UseLoginFormStateReturn } from '@/pages/auth/login/types';
import { hasValidationErrors, validateLoginForm } from '@/pages/auth/login/utils';
import type { AuthResult } from '@/context/AuthContext';

interface UseLoginFormStateInput {
  login: (email: string, password: string) => Promise<AuthResult>;
  fromPath?: string;
}

const useLoginFormState = ({
  login,
  fromPath,
}: UseLoginFormStateInput): UseLoginFormStateReturn => {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState(INITIAL_LOGIN_ERRORS);
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

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible((current) => !current);
  };

  const submitLogin = async (): Promise<{ ok: boolean; destination?: string }> => {
    const validationErrors = validateLoginForm(formValues);

    if (hasValidationErrors(validationErrors)) {
      setFormErrors(validationErrors);

      return { ok: false };
    }

    const result = await login(formValues.email, formValues.password);

    if (result.error) {
      setServerError(result.error.message || LOGIN_ERROR_FALLBACK);

      return { ok: false };
    }

    return { ok: true, destination: fromPath || DEFAULT_LOGIN_REDIRECT };
  };

  return {
    formValues,
    formErrors,
    serverError,
    isPasswordVisible,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    submitLogin,
  };
};

export default useLoginFormState;
