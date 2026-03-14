import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { AppBar, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppNavContent from '@/routes/layouts/components/app-nav-content';
import { BRAND_NAME, OPEN_NAV_ARIA_LABEL } from '@/routes/layouts/constants';
import {
  AppLayoutRoot,
  Content,
  ContentPanel,
  DrawerSidebar,
  Sidebar,
} from '@/routes/layouts/styles';
import { useAuth } from '@/context/AuthContext';

const AppLayout = (): JSX.Element => {
  const { isAuthenticated, user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const authUser = user && typeof user === 'object' ? (user as Record<string, unknown>) : null;
  const userEmail = typeof authUser?.email === 'string' ? authUser.email : null;

  const handleDrawerClose = (): void => {
    setIsDrawerOpen(false);
  };

  return (
    <AppLayoutRoot>
      <Sidebar>
        <AppNavContent
          isAuthenticated={isAuthenticated}
          onNavigate={handleDrawerClose}
          userEmail={userEmail}
        />
      </Sidebar>

      <AppBar
        color="inherit"
        elevation={0}
        position="static"
        sx={{
          display: { xs: 'flex', lg: 'none' },
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: 'common.white',
        }}
      >
        <Toolbar>
          <IconButton
            aria-label={OPEN_NAV_ARIA_LABEL}
            edge="start"
            onClick={() => setIsDrawerOpen(true)}
            sx={{ mr: 1 }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Stack alignItems="center" direction="row" spacing={1}>
            <ReceiptLongRoundedIcon color="secondary" fontSize="small" />
            <Typography fontWeight={800} variant="subtitle1">
              {BRAND_NAME}
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        sx={{ display: { xs: 'block', lg: 'none' }, '& .MuiDrawer-paper': { width: 280 } }}
        variant="temporary"
      >
        <DrawerSidebar>
          <AppNavContent
            isAuthenticated={isAuthenticated}
            onNavigate={handleDrawerClose}
            userEmail={userEmail}
          />
        </DrawerSidebar>
      </Drawer>

      <Content>
        <ContentPanel elevation={0}>
          <Outlet />
        </ContentPanel>
      </Content>
    </AppLayoutRoot>
  );
};

export default AppLayout;
