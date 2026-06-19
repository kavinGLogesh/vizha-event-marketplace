// Footer.jsx — Site footer with links and brand info
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Grid, Typography, Divider, IconButton
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const POPULAR_DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Erode', 'Trichy'];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a0a0e',
        color: '#ccc',
        pt: 6,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EventNoteIcon sx={{ color: '#c4576a', fontSize: 28 }} />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: '#fff'
                }}
              >
                Vizha
              </Typography>
            </Box>
            <Typography
              sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.9rem', color: '#999', mb: 3, lineHeight: 1.7 }}
            >
              {t('footer.tagline')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: '#c4576a' }} />
                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#888' }}>
                  Tamil Nadu, India
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 16, color: '#c4576a' }} />
                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#888' }}>
                  +91 98765 43210
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 16, color: '#c4576a' }} />
                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#888' }}>
                  hello@vizha.in
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                mb: 2
              }}
            >
              {t('footer.quick_links')}
            </Typography>
            {[
              { label: t('nav.home'), path: '/' },
              { label: t('nav.about'), path: '/about' },
              { label: t('nav.contact'), path: '/contact' },
            ].map((link) => (
              <Typography
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  display: 'block',
                  fontFamily: '"Lato", sans-serif',
                  fontSize: '0.875rem',
                  color: '#999',
                  textDecoration: 'none',
                  mb: 1,
                  '&:hover': { color: '#c4576a' },
                  transition: 'color 0.2s'
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Grid>

          {/* Districts */}
          <Grid item xs={6} md={3}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                mb: 2
              }}
            >
              {t('footer.districts')}
            </Typography>
            {POPULAR_DISTRICTS.map((district) => (
              <Typography
                key={district}
                component={Link}
                to={`/${district.toLowerCase()}`}
                sx={{
                  display: 'block',
                  fontFamily: '"Lato", sans-serif',
                  fontSize: '0.875rem',
                  color: '#999',
                  textDecoration: 'none',
                  mb: 1,
                  '&:hover': { color: '#c4576a' },
                  transition: 'color 0.2s'
                }}
              >
                {district}
              </Typography>
            ))}
          </Grid>

          {/* Popular Categories */}
          <Grid item xs={12} md={3}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff',
                mb: 2
              }}
            >
              {t('home.popular_categories')}
            </Typography>
            {['Catering', 'Decoration', 'Photography', 'DJ & Music', 'Mehendi', 'Flowers'].map((cat) => (
              <Typography
                key={cat}
                sx={{
                  display: 'block',
                  fontFamily: '"Lato", sans-serif',
                  fontSize: '0.875rem',
                  color: '#999',
                  mb: 1
                }}
              >
                {cat}
              </Typography>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#666' }}>
            © {new Date().getFullYear()} Vizha. {t('footer.rights')}
          </Typography>
          <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#666' }}>
            Made with ❤️ for Tamil Nadu
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
