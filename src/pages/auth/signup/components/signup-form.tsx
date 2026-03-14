import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Alert,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppButton from '@/components/button';
import {
  EMAIL_LABEL,
  EMAIL_PLACEHOLDER,
  HIDE_PASSWORD_ARIA_LABEL,
  LOGIN_LINK_LABEL,
  LOGIN_PROMPT,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  PASSWORD_LABEL,
  PASSWORD_PLACEHOLDER,
  ROLE_LABEL,
  SHOW_PASSWORD_ARIA_LABEL,
  SUBMIT_BUTTON_LABEL,
} from '@/pages/auth/signup/constants';
import { ROLE_OPTIONS } from '@/pages/auth/signup/types';
import type { RoleOption, SignupFormErrors, SignupFormValues } from '@/pages/auth/signup/types';

interface SignupFormProps {
  readonly formValues: SignupFormValues;
  readonly formErrors: SignupFormErrors;
  readonly serverError: string;
  readonly isPasswordVisible: boolean;
  readonly isLoading: boolean;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly onEmailChange: (value: string) => void;
  readonly onPasswordChange: (value: string) => void;
  readonly onRoleChange: (value: RoleOption) => void;
  readonly onTogglePasswordVisibility: () => void;
}

const SignupForm = ({
  formValues,
  formErrors,
  serverError,
  isPasswordVisible,
  isLoading,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onTogglePasswordVisibility,
}: SignupFormProps): JSX.Element => (
  <Stack spacing={3} component="form" onSubmit={onSubmit}>
    <Stack spacing={1}>
      <Typography variant="h4" fontWeight={700}>
        {PAGE_TITLE}
      </Typography>
      <Typography color="text.secondary">{PAGE_SUBTITLE}</Typography>
    </Stack>
    {serverError ? <Alert severity="error">{serverError}</Alert> : null}
    <TextField
      error={Boolean(formErrors.email)}
      fullWidth
      helperText={formErrors.email}
      label={EMAIL_LABEL}
      onChange={(event) => onEmailChange(event.target.value)}
      placeholder={EMAIL_PLACEHOLDER}
      type="email"
      value={formValues.email}
    />
    <TextField
      error={Boolean(formErrors.password)}
      fullWidth
      helperText={formErrors.password}
      label={PASSWORD_LABEL}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={isPasswordVisible ? HIDE_PASSWORD_ARIA_LABEL : SHOW_PASSWORD_ARIA_LABEL}
              edge="end"
              onClick={onTogglePasswordVisibility}
            >
              {isPasswordVisible ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      onChange={(event) => onPasswordChange(event.target.value)}
      placeholder={PASSWORD_PLACEHOLDER}
      type={isPasswordVisible ? 'text' : 'password'}
      value={formValues.password}
    />
    <TextField
      error={Boolean(formErrors.role)}
      fullWidth
      helperText={formErrors.role}
      label={ROLE_LABEL}
      onChange={(event) => onRoleChange(event.target.value as RoleOption)}
      select
      value={formValues.role}
    >
      {ROLE_OPTIONS.map((roleOption) => (
        <MenuItem key={roleOption} value={roleOption}>
          {roleOption}
        </MenuItem>
      ))}
    </TextField>
    <AppButton isLoading={isLoading} size="large" type="submit" variant="contained">
      {SUBMIT_BUTTON_LABEL}
    </AppButton>
    <Typography color="text.secondary" variant="body2">
      {`${LOGIN_PROMPT} `}
      <Link component={RouterLink} to="/login" underline="hover">
        {LOGIN_LINK_LABEL}
      </Link>
    </Typography>
  </Stack>
);

export default SignupForm;
