export const ROLE_OPTIONS = ['Admin', 'Accountant', 'Viewer'] as const;

export type RoleOption = (typeof ROLE_OPTIONS)[number];

export interface SignupFormValues {
  email: string;
  password: string;
  role: RoleOption;
}

export interface SignupFormErrors {
  email: string;
  password: string;
  role: string;
}

export interface UseSignupFormStateReturn {
  formValues: SignupFormValues;
  formErrors: SignupFormErrors;
  serverError: string;
  isPasswordVisible: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setRole: (value: RoleOption) => void;
  togglePasswordVisibility: () => void;
  submitSignup: () => Promise<{ ok: boolean }>;
}
