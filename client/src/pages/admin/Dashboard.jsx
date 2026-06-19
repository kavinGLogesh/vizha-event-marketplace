// Dashboard.jsx — Admin dashboard with stats and quick links
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Typography, Grid, Paper, Button,
  CircularProgress, Alert, Divider, List, ListItem,
  ListItemIcon, ListItemText, AppBar, Toolbar, IconButton
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { getVendors, getCategories, getDistricts } from '../../api/axios';

const StatCard = ({ icon, label, value, color = '#7a1c2e' }) => (
  <Paper
    elevation={0}
    sx={{
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: 3,
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2.5,
      transition: 'all 0.2s',
      '&:hover': { boxShadow: '0 4px 16px rgba(122,28,46,0.1)', borderColor: color }
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: 2,
        backgroundColor: `${color}14`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#888' }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1a0a0e',
          lineHeight: 1.2
        }}
      >
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ vendors: 0, categories: 0, districts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [v, c, d] = await Promise.all([getVendors(), getCategories(), getDistricts()]);
        setStats({
          vendors: v.data.length,
          categories: c.data.length,
          districts: d.data.length
        });
      } catch {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f4f5' }}>
      {/* Admin Top Bar */}
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#1a0a0e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <EventNoteIcon sx={{ color: '#c4576a', mr: 1 }} />
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 700, color: '#fff', flexGrow: 1 }}>
              Vizha Admin
            </Typography>
            <Button
              onClick={() => navigate('/')}
              sx={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"Lato", sans-serif', textTransform: 'none', mr: 1 }}
            >
              View Site
            </Button>
            <IconButton onClick={handleLogout} sx={{ color: '#c4576a' }}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 5, flexGrow: 1 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: { xs: '1.8rem', md: '2.4rem' },
            fontWeight: 700,
            color: '#1a0a0e',
            mb: 1
          }}
        >
          {t('admin.dashboard')}
        </Typography>
        <Typography sx={{ fontFamily: '"Lato", sans-serif', color: '#888', mb: 4 }}>
          Welcome back. Here's an overview of your platform.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#7a1c2e' }} />
          </Box>
        ) : (
          <>
            {/* Stats */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={4}>
                <StatCard
                  icon={<StoreIcon sx={{ color: '#7a1c2e', fontSize: 26 }} />}
                  label={t('admin.total_vendors')}
                  value={stats.vendors}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  icon={<CategoryIcon sx={{ color: '#2563eb', fontSize: 26 }} />}
                  label={t('admin.total_categories')}
                  value={stats.categories}
                  color="#2563eb"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  icon={<LocationCityIcon sx={{ color: '#059669', fontSize: 26 }} />}
                  label={t('admin.total_districts')}
                  value={stats.districts}
                  color="#059669"
                />
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: 3 }}>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 700, mb: 2 }}>
                    {t('admin.manage_vendors')}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      component={Link}
                      to="/admin/vendors"
                      variant="outlined"
                      sx={{
                        borderColor: '#7a1c2e', color: '#7a1c2e',
                        fontFamily: '"Lato", sans-serif', textTransform: 'none',
                        borderRadius: 2
                      }}
                    >
                      {t('admin.manage_vendors')}
                    </Button>
                    <Button
                      component={Link}
                      to="/admin/vendors/add"
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      sx={{
                        backgroundColor: '#7a1c2e',
                        fontFamily: '"Lato", sans-serif',
                        textTransform: 'none',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#6a1826' }
                      }}
                    >
                      {t('admin.add_vendor')}
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: 3 }}>
                  <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 700, mb: 2 }}>
                    Quick Info
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense disablePadding>
                    {[
                      { icon: <StoreIcon sx={{ color: '#7a1c2e', fontSize: 18 }} />, text: `${stats.vendors} active vendors on the platform` },
                      { icon: <CategoryIcon sx={{ color: '#2563eb', fontSize: 18 }} />, text: `${stats.categories} service categories available` },
                      { icon: <LocationCityIcon sx={{ color: '#059669', fontSize: 18 }} />, text: `${stats.districts} districts covered across Tamil Nadu` }
                    ].map((item, i) => (
                      <ListItem key={i} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} primaryTypographyProps={{ fontFamily: '"Lato", sans-serif', fontSize: '0.88rem', color: '#555' }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
