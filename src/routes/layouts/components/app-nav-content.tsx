import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { Box, Paper, Stack, Typography } from '@mui/material';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  NAV_INVOICES_LABEL,
  SESSION_ACTIVE_LABEL,
  SESSION_CONNECTED_DESCRIPTION,
  SESSION_INACTIVE_LABEL,
  SESSION_USER_PREFIX,
} from '@/routes/layouts/constants';
import { NavItem } from '@/routes/layouts/styles';
import type { AppNavContentProps } from '@/routes/layouts/types';

const AppNavContent = ({
  isAuthenticated,
  userEmail,
  onNavigate,
}: AppNavContentProps): JSX.Element => (
  <>
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack alignItems="center" direction="row" spacing={1.5}>
          <ReceiptLongRoundedIcon />
          <Box>
            <Typography fontWeight={800}>{BRAND_NAME}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.78)' }} variant="body2">
              {BRAND_TAGLINE}
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={1}>
          <NavItem onClick={onNavigate} to="/invoices">
            <ReceiptLongRoundedIcon fontSize="small" />
            {NAV_INVOICES_LABEL}
          </NavItem>
        </Stack>
      </Stack>
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderColor: 'rgba(255,255,255,0.24)',
          color: 'common.white',
        }}
        variant="outlined"
      >
        <Typography fontWeight={700} sx={{ mb: 0.5 }}>
          {isAuthenticated ? SESSION_ACTIVE_LABEL : SESSION_INACTIVE_LABEL}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.78)' }} variant="body2">
          {userEmail ? `${SESSION_USER_PREFIX}${userEmail}` : SESSION_CONNECTED_DESCRIPTION}
        </Typography>
      </Paper>
    </Stack>
  </>
);

export default AppNavContent;
