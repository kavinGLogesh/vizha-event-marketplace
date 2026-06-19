// Navbar.jsx — Responsive navigation bar with language switcher
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer,
  List, ListItem, ListItemText, Container, Button, useScrollTrigger
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdmin = !!localStorage.getItem('admin_token');

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 4 : 0}
        sx={{
          backgroundColor: trigger ? '#fff' : '#fff',
          borderBottom: '1px solid rgba(122,28,46,0.12)',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5 }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 }
              }}
            >
              <EventNoteIcon sx={{ color: '#7a1c2e', fontSize: 28 }} />
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: '#7a1c2e',
                    lineHeight: 1.1
                  }}
                >
                  Vizha
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Lato", sans-serif',
                    fontSize: '0.6rem',
                    color: '#888',
                    letterSpacing: 2,
                    textTransform: 'uppercase'
                  }}
                >
                  Tamil Nadu Events
                </Typography>
              </Box>
            </Box>

            {/* Desktop Nav Links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    fontFamily: '"Lato", sans-serif',
                    fontWeight: isActive(link.path) ? 700 : 400,
                    color: isActive(link.path) ? '#7a1c2e' : '#444',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    borderBottom: isActive(link.path) ? '2px solid #7a1c2e' : '2px solid transparent',
                    borderRadius: 0,
                    pb: 0.2,
                    '&:hover': { color: '#7a1c2e', backgroundColor: 'transparent' }
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Right side */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <LanguageSwitcher />
              {isAdmin ? (
                <Button
                  component={Link}
                  to="/admin/dashboard"
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: '#7a1c2e',
                    fontFamily: '"Lato", sans-serif',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#6a1826' }
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/admin/login"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#7a1c2e',
                    color: '#7a1c2e',
                    fontFamily: '"Lato", sans-serif',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'rgba(122,28,46,0.06)' }
                  }}
                >
                  {t('nav.admin')}
                </Button>
              )}
            </Box>

            {/* Mobile menu icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
              <LanguageSwitcher />
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#7a1c2e' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 1 }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.path}
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color: isActive(link.path) ? '#7a1c2e' : '#333',
                  fontWeight: isActive(link.path) ? 700 : 400,
                  borderLeft: isActive(link.path) ? '3px solid #7a1c2e' : '3px solid transparent',
                  textDecoration: 'none'
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontFamily: '"Lato", sans-serif',
                    fontWeight: isActive(link.path) ? 700 : 400
                  }}
                />
              </ListItem>
            ))}
            <ListItem
              component={Link}
              to={isAdmin ? '/admin/dashboard' : '/admin/login'}
              onClick={() => setDrawerOpen(false)}
              sx={{ textDecoration: 'none', color: '#7a1c2e' }}
            >
              <ListItemText
                primary={isAdmin ? 'Dashboard' : t('nav.admin')}
                primaryTypographyProps={{ fontFamily: '"Lato", sans-serif', fontWeight: 600 }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
