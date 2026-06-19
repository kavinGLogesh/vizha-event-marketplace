// CategoryPage.jsx — Shows all vendors for a district + category combo
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Typography, Grid, CircularProgress,
  Alert, Breadcrumbs, Link, FormControl, InputLabel,
  Select, MenuItem, TextField, InputAdornment
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import { getVendors } from '../api/axios';
import VendorCard from '../components/VendorCard';

const CategoryPage = () => {
  const { district, category } = useParams();
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const districtName = district.charAt(0).toUpperCase() + district.slice(1);
  const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await getVendors({
          district: districtName,
          category: categoryName
        });
        setVendors(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [district, category]);

  // Apply search and sort
  useEffect(() => {
    let result = [...vendors];
    if (search) {
      result = result.filter(v =>
        v.shop_name.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.price_range || '').localeCompare(b.price_range || ''));
    }
    setFiltered(result);
  }, [search, sortBy, vendors]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#7a1c2e' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1a0a0e 0%, #4a1220 100%)', py: { xs: 5, md: 7 }, px: 2 }}>
        <Container maxWidth="xl">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.4)' }} />}
            sx={{ mb: 2 }}
          >
            <Link href="/" underline="hover" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.6)', fontFamily: '"Lato", sans-serif', fontSize: '0.85rem' }}>
              <HomeIcon fontSize="small" /> {t('nav.home')}
            </Link>
            <Link href={`/${district}`} underline="hover" sx={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"Lato", sans-serif', fontSize: '0.85rem' }}>
              {districtName}
            </Link>
            <Typography sx={{ color: '#c4576a', fontFamily: '"Lato", sans-serif', fontSize: '0.85rem' }}>
              {categoryName}
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
            {categoryName} — {districtName}
          </Typography>
          <Typography sx={{ fontFamily: '"Lato", sans-serif', color: 'rgba(255,255,255,0.6)', mt: 1 }}>
            {filtered.length} {t('category.vendors_in')} {districtName}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#888' }} />
                </InputAdornment>
              ),
              sx: { fontFamily: '"Lato", sans-serif', borderRadius: 2 }
            }}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel sx={{ fontFamily: '"Lato", sans-serif' }}>{t('category.sort_by')}</InputLabel>
            <Select
              value={sortBy}
              label={t('category.sort_by')}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ fontFamily: '"Lato", sans-serif', borderRadius: 2 }}
            >
              <MenuItem value="rating">{t('category.rating')}</MenuItem>
              <MenuItem value="price_asc">{t('category.price')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#888' }}>
              {t('vendor.no_vendors')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((vendor) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={vendor._id}>
                <VendorCard vendor={vendor} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CategoryPage;
