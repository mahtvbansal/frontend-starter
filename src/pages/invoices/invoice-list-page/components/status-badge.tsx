import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { InvoiceStatus, InvoiceStatusTone } from '@/pages/invoices/invoice-list-page/types';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const getStatusTone = (status: InvoiceStatus): InvoiceStatusTone => {
  switch (status) {
    case 'Paid':
      return { tone: 'success', label: 'Paid' };
    case 'Sent':
      return { tone: 'info', label: 'Sent' };
    case 'Draft':
    default:
      return { tone: 'neutral', label: 'Draft' };
  }
};

const StatusBadge = ({ status }: StatusBadgeProps): JSX.Element => {
  const style = getStatusTone(status);

  return (
    <Box
      sx={{
        borderRadius: 999,
        px: 1.5,
        py: 0.5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.8,
        backgroundColor: (theme) => {
          switch (style.tone) {
            case 'success':
              return alpha(theme.palette.success.main, 0.12);
            case 'info':
              return alpha(theme.palette.info.main, 0.12);
            case 'warning':
              return alpha(theme.palette.warning.main, 0.12);
            default:
              return theme.palette.action.hover;
          }
        },
        color: (theme) => {
          switch (style.tone) {
            case 'success':
              return theme.palette.success.dark;
            case 'info':
              return theme.palette.info.dark;
            case 'warning':
              return theme.palette.warning.dark;
            default:
              return theme.palette.text.primary;
          }
        },
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: (theme) => {
            switch (style.tone) {
              case 'success':
                return theme.palette.success.main;
              case 'info':
                return theme.palette.info.main;
              case 'warning':
                return theme.palette.warning.main;
              default:
                return theme.palette.text.secondary;
            }
          },
        }}
      />
      <Typography fontWeight={600} variant="body2">
        {style.label}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
