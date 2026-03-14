import { Button, CircularProgress } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { JSX } from 'react';

interface AppButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const AppButton = ({
  isLoading = false,
  sx,
  children,
  disabled,
  color = 'secondary',
  size = 'large',
  variant = 'contained',
  ...buttonProps
}: AppButtonProps): JSX.Element => (
  <Button
    {...buttonProps}
    color={color}
    disableElevation
    disabled={isLoading || disabled}
    size={size}
    variant={variant}
    sx={[
      {
        borderRadius: 2.5,
        fontWeight: 700,
        letterSpacing: 0.1,
        px: 2.25,
        minHeight: 42,
        textTransform: 'none',
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {isLoading ? <CircularProgress color="inherit" size={20} /> : children}
  </Button>
);

export default AppButton;
