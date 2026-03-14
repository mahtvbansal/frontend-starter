import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AuthContextValue } from '@/context/AuthContext';
import { AuthTestProvider, buildAuthContextValue } from '@/test/auth-test-context';
import { theme } from '@/theme';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authValue?: Partial<AuthContextValue>;
}

interface CustomRenderResult extends RenderResult {
  user: ReturnType<typeof userEvent.setup>;
}

interface TestProvidersProps {
  children: ReactNode;
  authContextValue: AuthContextValue;
}

const TestProviders = ({ children, authContextValue }: TestProvidersProps): JSX.Element => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <AuthTestProvider value={authContextValue}>{children}</AuthTestProvider>
    </BrowserRouter>
  </ThemeProvider>
);

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}): CustomRenderResult => {
  const { authValue, ...renderOptions } = options;
  const authContextValue = buildAuthContextValue(authValue);
  const user = userEvent.setup();

  const result = rtlRender(ui, {
    wrapper: ({ children }) => (
      <TestProviders authContextValue={authContextValue}>{children}</TestProviders>
    ),
    ...renderOptions,
  });

  return {
    ...result,
    user,
  };
};

export * from '@testing-library/react';
export { customRender as render };
