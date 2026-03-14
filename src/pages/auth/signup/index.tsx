import { Paper } from '@mui/material';
import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '@/pages/auth/signup/components/signup-form';
import useSignupFormState from '@/pages/auth/signup/hooks/useSignupFormState';
import { FORM_PAPER_SX } from '@/pages/auth/signup/styles';
import { useAuth } from '@/context/AuthContext';

const Signup = (): JSX.Element => {
  const navigate = useNavigate();
  const { isLoading, signup } = useAuth();

  const {
    formValues,
    formErrors,
    serverError,
    isPasswordVisible,
    setEmail,
    setPassword,
    setRole,
    togglePasswordVisibility,
    submitSignup,
  } = useSignupFormState({ signup });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const result = await submitSignup();

    if (!result.ok) {
      return;
    }

    navigate('/invoices', { replace: true });
  };

  return (
    <Paper elevation={0} sx={FORM_PAPER_SX}>
      <SignupForm
        formErrors={formErrors}
        formValues={formValues}
        isLoading={isLoading}
        isPasswordVisible={isPasswordVisible}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onRoleChange={setRole}
        onSubmit={handleSubmit}
        onTogglePasswordVisibility={togglePasswordVisibility}
        serverError={serverError}
      />
    </Paper>
  );
};

export default Signup;
