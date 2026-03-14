import { Paper } from '@mui/material';
import { type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '@/pages/auth/login/components/login-form';
import useLoginFormState from '@/pages/auth/login/hooks/useLoginFormState';
import { FORM_PAPER_SX } from '@/pages/auth/login/styles';
import type { LocationState } from '@/pages/auth/login/types';
import { useAuth } from '@/context/AuthContext';

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const {
    formValues,
    formErrors,
    serverError,
    isPasswordVisible,
    setEmail,
    setPassword,
    togglePasswordVisibility,
    submitLogin,
  } = useLoginFormState({
    login,
    fromPath: (location.state as LocationState | null)?.from,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const result = await submitLogin();

    if (!result.ok || !result.destination) {
      return;
    }

    navigate(result.destination, { replace: true });
  };

  return (
    <Paper elevation={0} sx={FORM_PAPER_SX}>
      <LoginForm
        formErrors={formErrors}
        formValues={formValues}
        isLoading={isLoading}
        isPasswordVisible={isPasswordVisible}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onTogglePasswordVisibility={togglePasswordVisibility}
        serverError={serverError}
      />
    </Paper>
  );
};

export default Login;
