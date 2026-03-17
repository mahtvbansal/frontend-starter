import { CssBaseline, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from '@/components/ErrorBoundary';
import Root from '@/Root';
import { theme } from '@/theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </ThemeProvider>
);
