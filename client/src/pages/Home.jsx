// Home.jsx — Main landing page with district selection, categories, featured vendors
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Typography, Grid, CircularProgress,
  Alert, Divider, Paper
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import TranslateIcon from '@mui/icons-material/Translate';
import { getDistricts, getCategories, getVendors } from '../api/axios';
import DistrictCard from '../components/DistrictCard';
import CategoryCard from '../components/CategoryCard';
import VendorCard from '../components/VendorCard';

const SectionTitle = ({ children, subtitle }) => (
  <Box sx={{ textAlign: 'center', mb: 5 }}>
    <Typography
      sx={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: { xs: '1.8rem', md: '2.4rem' },
        fontWeight: 700,
        color: '#1a0a0e'
      }}
    >
      {children}
    </Typography>
    {subtitle && (
      <Typography
        sx={{
          fontFamily: '"Lato", sans-serif',
          color: '#888',
          mt: 0.5,
          fontSize: '1rem'
        }}
      >
        {subtitle}
      </Typography>
    )}
    <Box sx={{ width: 50, height: 3, backgroundColor: '#7a1c2e', mx: 'auto', mt: 1.5, borderRadius: 2 }} />
  </Box>
);

const Home = () => {
  const { t } = useTranslation();
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dRes, cRes, vRes] = await Promise.all([
          getDistricts(),
          getCategories(),
          getVendors({ featured: true, limit: 6 })
        ]);
        setDistricts(dRes.data);
        setCategories(cRes.data);
        setFeatured(vRes.data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#7a1c2e' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* ─── Hero Section ─── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a0a0e 0%, #3d0f1c 50%, #7a1c2e 100%)',
          color: '#fff',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(196,87,106,0.15) 0%, transparent 60%)',
          }
        }}
      >
        {/* Decorative pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0, right: 0,
            width: { xs: 200, md: 400 },
            height: '100%',
            opacity: 0.04,
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px'
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.8rem',
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#c4576a',
              mb: 2
            }}
          >
            Tamil Nadu's #1 Event Platform
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2.2rem', md: '3.5rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 2.5
            }}
          >
            {t('home.hero_title')}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Lato", sans-serif',
              fontSize: { xs: '1rem', md: '1.15rem' },
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.7
            }}
          >
            {t('home.hero_subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* ─── District Selection ─── */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <SectionTitle subtitle={t('home.select_district_hint')}>
          {t('home.select_district')}
        </SectionTitle>

        <Grid container spacing={2.5}>
          {districts.map((district) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={district._id}>
              <DistrictCard district={district} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ─── Popular Categories ─── */}
      <Box sx={{ backgroundColor: '#faf7f7', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <SectionTitle>{t('home.popular_categories')}</SectionTitle>
          <Grid container spacing={2}>
            {categories.map((cat) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={cat._id}>
                <CategoryCard category={cat} district="chennai" />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Featured Vendors ─── */}
      {featured.length > 0 && (
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
          <SectionTitle>{t('home.featured_vendors')}</SectionTitle>
          <Grid container spacing={3}>
            {featured.map((vendor) => (
              <Grid item xs={12} sm={6} md={4} key={vendor._id}>
                <VendorCard vendor={vendor} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* ─── Why Choose Us ─── */}
      <Box sx={{ backgroundColor: '#1a0a0e', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionTitle>
            <Box component="span" sx={{ color: '#fff' }}>{t('home.why_choose')}</Box>
          </SectionTitle>
          <Grid container spacing={4}>
            {[
              {
                icon: <VerifiedIcon sx={{ fontSize: 36, color: '#c4576a' }} />,
                title: t('home.trusted'),
                desc: t('home.trusted_desc')
              },
              {
                icon: <TouchAppIcon sx={{ fontSize: 36, color: '#c4576a' }} />,
                title: t('home.easy_contact'),
                desc: t('home.easy_contact_desc')
              },
              {
                icon: <TranslateIcon sx={{ fontSize: 36, color: '#c4576a' }} />,
                title: t('home.multilingual'),
                desc: t('home.multilingual_desc')
              }
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: '#fff',
                      mb: 1
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Lato", sans-serif',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.9rem',
                      lineHeight: 1.7
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
