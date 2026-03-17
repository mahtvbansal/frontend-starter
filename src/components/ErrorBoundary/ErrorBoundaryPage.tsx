import { Box, Button, Stack, Typography } from '@mui/material';

interface ErrorBoundaryPageProps {
  error: Error | null;
}

const ErrorBoundaryPage = ({ error }: ErrorBoundaryPageProps): JSX.Element => (
  <Box
    sx={(theme) => ({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 3,
      backgroundColor: theme.palette.background.default,
    })}
  >
    <Stack spacing={2} sx={{ maxWidth: 560, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary">
        An unexpected error occurred. Please refresh and try again.
      </Typography>
      {error ? (
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      ) : null}
      <Box>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </Box>
    </Stack>
  </Box>
);

export default ErrorBoundaryPage;
