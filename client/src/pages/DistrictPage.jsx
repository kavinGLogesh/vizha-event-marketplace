// DistrictPage.jsx — Shows all categories for a selected district
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Typography, Grid, CircularProgress,
  Alert, Breadcrumbs, Link
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { getCategories } from '../api/axios';
import CategoryCard from '../components/CategoryCard';

const DistrictPage = () => {
  const { district } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Capitalize district name for display
  const districtName = district.charAt(0).toUpperCase() + district.slice(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [district]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#7a1c2e' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a0a0e 0%, #4a1220 100%)',
          py: { xs: 5, md: 7 },
          px: 2
        }}
      >
        <Container maxWidth="xl">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />}
            sx={{ mb: 2 }}
          >
            <Link
              href="/"
              underline="hover"
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.5,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: '"Lato", sans-serif', fontSize: '0.85rem'
              }}
            >
              <HomeIcon fontSize="small" /> {t('nav.home')}
            </Link>
            <Typography
              sx={{
                color: '#c4576a',
                fontFamily: '"Lato", sans-serif',
                fontSize: '0.85rem'
              }}
            >
              {districtName}
            </Typography>
          </Breadcrumbs>

          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 700,
              color: '#fff'
            }}
          >
            {t('district.title')} {districtName}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Lato", sans-serif',
              color: 'rgba(255,255,255,0.6)',
              mt: 1,
              fontSize: '1rem'
            }}
          >
            {t('district.select_category')}
          </Typography>
        </Container>
      </Box>

      {/* Categories Grid */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {categories.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontFamily: '"Lato", sans-serif', color: '#888' }}>
              {t('common.no_results')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {categories.map((cat) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={cat._id}>
                <CategoryCard category={cat} district={district} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DistrictPage;
