import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

export const AuthLayoutRoot = styled('main')(({ theme }) => ({
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(320px, 0.9fr)',
  background: theme.palette.grey[100],
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const AuthHero = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: `linear-gradient(160deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 55%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.common.white,
  [theme.breakpoints.down('md')]: {
    minHeight: 360,
    padding: theme.spacing(4),
  },
}));

export const AuthPanel = styled(Box)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const FloatingOrb = styled('span')(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  backgroundColor: theme.palette.common.white,
  opacity: 0.08,
  '&:first-of-type': {
    width: 112,
    height: 112,
    top: theme.spacing(9),
    left: theme.spacing(8),
  },
  '&:last-of-type': {
    width: 72,
    height: 72,
    bottom: theme.spacing(7),
    right: theme.spacing(9),
  },
}));

export const AppLayoutRoot = styled('div')(({ theme }) => ({
  height: '100vh',
  display: 'grid',
  gridTemplateColumns: '260px 1fr',
  backgroundColor: theme.palette.grey[100],
  overflow: 'hidden',
  [theme.breakpoints.down('lg')]: {
    minHeight: '100vh',
    height: 'auto',
    gridTemplateColumns: '1fr',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
  },
}));

export const Sidebar = styled('aside')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  padding: theme.spacing(3),
  borderRight: '1px solid rgba(255,255,255,0.18)',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  [theme.breakpoints.down('lg')]: {
    position: 'static',
    top: 'auto',
    height: 'auto',
    overflowY: 'visible',
    display: 'none',
  },
}));

export const DrawerSidebar = styled('div')(({ theme }) => ({
  width: 280,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
}));

export const Content = styled('main')(({ theme }) => ({
  height: '100vh',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('lg')]: {
    height: 'auto',
    overflowY: 'visible',
  },
}));

export const NavItem = styled(NavLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.25, 1.5),
  borderRadius: theme.shape.borderRadius,
  color: 'rgba(255,255,255,0.82)',
  fontWeight: 600,
  textDecoration: 'none',
  '&.active': {
    backgroundColor: 'rgba(255,255,255,0.16)',
    color: theme.palette.common.white,
  },
}));

export const ContentPanel = styled(Paper)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  [theme.breakpoints.down('lg')]: {
    minHeight: 'auto',
  },
}));
