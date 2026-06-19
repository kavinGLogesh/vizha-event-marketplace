// AddVendor.jsx — Admin form to add a new vendor with Cloudinary image upload
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Typography, Paper, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel,
  Switch, Chip, Alert, CircularProgress, AppBar, Toolbar,
  IconButton, InputAdornment, LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import { getCategories, getDistricts, createVendor, uploadImage } from '../../api/axios';

const LANGUAGES = ['Tamil', 'English', 'Telugu', 'Malayalam', 'Kannada', 'Hindi'];

const inputSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: '"Lato", sans-serif',
    borderRadius: 2,
    '&.Mui-focused fieldset': { borderColor: '#7a1c2e' }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7a1c2e' }
};

const AddVendor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [serviceInput, setServiceInput] = useState('');

  const [form, setForm] = useState({
    shop_name: '',
    category: '',
    district: '',
    phone: '',
    whatsapp: '',
    description: '',
    price_range: '',
    rating: '',
    owner_name: '',
    experience: '',
    languages: [],
    services: [],
    images: [],
    featured: false
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, d] = await Promise.all([getCategories(), getDistricts()]);
        setCategories(c.data);
        setDistricts(d.data);
      } catch {}
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleLanguageToggle = (lang) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleAddService = () => {
    if (serviceInput.trim()) {
      setForm(prev => ({ ...prev, services: [...prev.services, serviceInput.trim()] }));
      setServiceInput('');
    }
  };

  const handleRemoveService = (s) => {
    setForm(prev => ({ ...prev, services: prev.services.filter(x => x !== s) }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await uploadImage(fd);
        urls.push(res.data.url);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch {
      setError('Image upload failed. Check Cloudinary config.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : 0,
        experience: form.experience ? parseInt(form.experience) : 0
      };
      await createVendor(payload);
      navigate('/admin/vendors');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create vendor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f4f5' }}>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#1a0a0e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <EventNoteIcon sx={{ color: '#c4576a', mr: 1 }} />
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 700, color: '#fff', flexGrow: 1 }}>
              Vizha Admin
            </Typography>
            <Button component={Link} to="/admin/dashboard" sx={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"Lato", sans-serif', textTransform: 'none', mr: 1 }}>
              Dashboard
            </Button>
            <IconButton onClick={handleLogout} sx={{ color: '#c4576a' }}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/vendors')}
          sx={{ color: '#888', fontFamily: '"Lato", sans-serif', textTransform: 'none', mb: 2, pl: 0 }}
        >
          Back to Vendors
        </Button>

        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 700, mb: 4 }}>
          {t('admin.add_vendor')}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: { xs: 3, md: 5 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, mb: 1, color: '#7a1c2e' }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label={t('admin.shop_name')} name="shop_name" value={form.shop_name} onChange={handleChange} sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Owner Name" name="owner_name" value={form.owner_name} onChange={handleChange} sx={inputSx} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={inputSx}>
                  <InputLabel sx={{ fontFamily: '"Lato", sans-serif' }}>{t('vendor.category')}</InputLabel>
                  <Select name="category" value={form.category} label={t('vendor.category')} onChange={handleChange} sx={{ fontFamily: '"Lato", sans-serif', borderRadius: 2 }}>
                    {categories.map(c => <MenuItem key={c._id} value={c.name}>{c.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={inputSx}>
                  <InputLabel sx={{ fontFamily: '"Lato", sans-serif' }}>{t('vendor.district')}</InputLabel>
                  <Select name="district" value={form.district} label={t('vendor.district')} onChange={handleChange} sx={{ fontFamily: '"Lato", sans-serif', borderRadius: 2 }}>
                    {districts.map(d => <MenuItem key={d._id} value={d.name}>{d.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label={t('vendor.description')} name="description" value={form.description} onChange={handleChange} sx={inputSx} />
              </Grid>

              {/* Contact */}
              <Grid item xs={12}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, mb: 1, color: '#7a1c2e' }}>
                  Contact Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label={t('admin.phone')} name="phone" value={form.phone} onChange={handleChange} sx={inputSx} inputProps={{ maxLength: 10 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label={t('admin.whatsapp')} name="whatsapp" value={form.whatsapp} onChange={handleChange} sx={inputSx} inputProps={{ maxLength: 10 }} />
              </Grid>

              {/* Pricing & Experience */}
              <Grid item xs={12}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, mb: 1, color: '#7a1c2e' }}>
                  Pricing & Experience
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label={t('vendor.price_range')} name="price_range" value={form.price_range} onChange={handleChange} sx={inputSx} placeholder="e.g. ₹250/person" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label={t('vendor.rating')} name="rating" type="number" value={form.rating} onChange={handleChange} sx={inputSx} inputProps={{ min: 0, max: 5, step: 0.1 }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label={t('vendor.experience')} name="experience" type="number" value={form.experience} onChange={handleChange} sx={inputSx} placeholder="Years" />
              </Grid>

              {/* Languages */}
              <Grid item xs={12}>
                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#555', mb: 1 }}>
                  {t('vendor.languages')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {LANGUAGES.map(lang => (
                    <Chip
                      key={lang}
                      label={lang}
                      clickable
                      onClick={() => handleLanguageToggle(lang)}
                      sx={{
                        fontFamily: '"Lato", sans-serif',
                        backgroundColor: form.languages.includes(lang) ? '#7a1c2e' : 'rgba(0,0,0,0.06)',
                        color: form.languages.includes(lang) ? '#fff' : '#555',
                        '&:hover': { backgroundColor: form.languages.includes(lang) ? '#6a1826' : 'rgba(0,0,0,0.1)' }
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Services */}
              <Grid item xs={12}>
                <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#555', mb: 1 }}>
                  {t('vendor.services')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add a service..."
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                    sx={{ ...inputSx, flexGrow: 1 }}
                  />
                  <Button onClick={handleAddService} variant="outlined" sx={{ borderColor: '#7a1c2e', color: '#7a1c2e', borderRadius: 2, minWidth: 0, px: 2 }}>
                    <AddIcon />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {form.services.map(s => (
                    <Chip key={s} label={s} onDelete={() => handleRemoveService(s)} sx={{ fontFamily: '"Lato", sans-serif', backgroundColor: '#faf0f1', color: '#7a1c2e' }} />
                  ))}
                </Box>
              </Grid>

              {/* Images */}
              <Grid item xs={12}>
                <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 700, mb: 1, color: '#7a1c2e' }}>
                  {t('vendor.gallery')}
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploading}
                  sx={{ borderColor: '#7a1c2e', color: '#7a1c2e', fontFamily: '"Lato", sans-serif', textTransform: 'none', borderRadius: 2 }}
                >
                  Upload Images
                  <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                </Button>
                {uploading && <LinearProgress sx={{ mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#7a1c2e' } }} />}
                {form.images.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    {form.images.map((url, i) => (
                      <Box key={i} component="img" src={url} sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1.5, border: '1px solid rgba(0,0,0,0.1)' }} />
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Featured */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="featured"
                      checked={form.featured}
                      onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#7a1c2e' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7a1c2e' } }}
                    />
                  }
                  label={<Typography sx={{ fontFamily: '"Lato", sans-serif' }}>{t('admin.featured')} (show on homepage)</Typography>}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => navigate('/admin/vendors')}
                    sx={{ fontFamily: '"Lato", sans-serif', textTransform: 'none', color: '#555', borderRadius: 2 }}
                  >
                    {t('admin.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#7a1c2e',
                      fontFamily: '"Lato", sans-serif',
                      textTransform: 'none',
                      px: 4,
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#6a1826' }
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : t('admin.save')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddVendor;
