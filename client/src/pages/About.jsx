// About.jsx — About Us page
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Grid, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import HandshakeIcon from '@mui/icons-material/Handshake';

const StatBox = ({ icon, number, label }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>{icon}</Box>
    <Typography
      sx={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#7a1c2e',
        lineHeight: 1
      }}
    >
      {number}
    </Typography>
    <Typography sx={{ fontFamily: '"Lato", sans-serif', color: '#666', fontSize: '0.9rem', mt: 0.5 }}>
      {label}
    </Typography>
  </Box>
);

const About = () => {
  const { t } = useTranslation();

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #1a0a0e 0%, #4a1220 100%)', py: { xs: 7, md: 10 }, px: 2 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <FavoriteIcon sx={{ color: '#c4576a', fontSize: 40, mb: 2 }} />
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#fff',
              mb: 2
            }}
          >
            {t('about.title')}
          </Typography>
          <Typography sx={{ fontFamily: '"Lato", sans-serif', color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            {t('about.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Stats */}
      <Box sx={{ backgroundColor: '#faf7f7', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <StatBox icon={<PeopleIcon sx={{ color: '#7a1c2e', fontSize: 32 }} />} number="500+" label="Trusted Vendors" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatBox icon={<EmojiEventsIcon sx={{ color: '#7a1c2e', fontSize: 32 }} />} number="38" label="Districts Covered" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatBox icon={<HandshakeIcon sx={{ color: '#7a1c2e', fontSize: 32 }} />} number="10K+" label="Happy Customers" />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatBox icon={<FavoriteIcon sx={{ color: '#7a1c2e', fontSize: 32 }} />} number="15+" label="Categories" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ width: 4, height: 48, backgroundColor: '#7a1c2e', borderRadius: 2 }} />
          <Typography
            sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '1.8rem', md: '2.2rem' }, fontWeight: 700 }}
          >
            {t('about.mission')}
          </Typography>
        </Box>
        <Typography
          sx={{ fontFamily: '"Lato", sans-serif', color: '#555', lineHeight: 1.9, fontSize: '1rem' }}
        >
          {t('about.mission_text')}
        </Typography>
        <Divider sx={{ my: 4 }} />
        <Typography sx={{ fontFamily: '"Lato", sans-serif', color: '#555', lineHeight: 1.9, fontSize: '1rem' }}>
          Whether it's a grand wedding in Chennai, a birthday celebration in Coimbatore, or a corporate event in Madurai —
          Vizha connects you with the best local vendors who understand Tamil culture, traditions, and expectations.
          We believe every family deserves access to quality event services at transparent prices.
        </Typography>
      </Container>
    </Box>
  );
};

export default About;
