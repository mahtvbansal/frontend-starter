import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { Box, Stack, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import {
  AUTH_HERO_SUBTITLE,
  AUTH_HERO_TITLE,
  AUTH_METRICS,
  BRAND_NAME,
} from '@/routes/layouts/constants';
import { AuthHero, AuthLayoutRoot, AuthPanel, FloatingOrb } from '@/routes/layouts/styles';

const AuthLayout = (): JSX.Element => (
  <AuthLayoutRoot>
    <AuthHero>
      <FloatingOrb />
      <FloatingOrb />
      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1, maxWidth: 420 }}>
        <Stack alignItems="center" direction="row" spacing={1.5}>
          <ReceiptLongRoundedIcon fontSize="large" />
          <Typography fontWeight={700} variant="h6">
            {BRAND_NAME}
          </Typography>
        </Stack>
        <Box>
          <Typography fontWeight={700} sx={{ mb: 2 }} variant="h3">
            {AUTH_HERO_TITLE}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)' }} variant="body1">
            {AUTH_HERO_SUBTITLE}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={4} sx={{ position: 'relative', zIndex: 1, pt: 6 }}>
        {AUTH_METRICS.map((metric) => (
          <Box key={metric.label}>
            <Typography fontWeight={600} variant="h5">
              {metric.value}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)' }} variant="body2">
              {metric.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </AuthHero>
    <AuthPanel>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Outlet />
      </Box>
    </AuthPanel>
  </AuthLayoutRoot>
);

export default AuthLayout;
