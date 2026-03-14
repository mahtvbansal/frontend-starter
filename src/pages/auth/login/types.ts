export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email: string;
  password: string;
}

export interface LocationState {
  from?: string;
}

export interface UseLoginFormStateReturn {
  formValues: LoginFormValues;
  formErrors: LoginFormErrors;
  serverError: string;
  isPasswordVisible: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  togglePasswordVisibility: () => void;
  submitLogin: () => Promise<{ ok: boolean; destination?: string }>;
}
