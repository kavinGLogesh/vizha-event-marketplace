// AdminLogin.jsx — Secure admin login with JWT
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Paper, Typography, TextField,
  Button, Alert, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import { adminLogin } from '../../api/axios';

const AdminLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(form);
      localStorage.setItem('admin_token', res.data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      fontFamily: '"Lato", sans-serif',
      borderRadius: 2,
      '&.Mui-focused fieldset': { borderColor: '#7a1c2e' }
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7a1c2e' }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a0a0e 0%, #3d0f1c 50%, #7a1c2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          maxWidth: 420,
          width: '100%',
          border: '1px solid rgba(122,28,46,0.2)'
        }}
      >
        {/* Icon */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'rgba(122,28,46,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <LockIcon sx={{ color: '#7a1c2e', fontSize: 28 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#1a0a0e'
            }}
          >
            {t('admin.login')}
          </Typography>
          <Typography sx={{ fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', mt: 0.5 }}>
            Vizha Administration Panel
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, fontFamily: '"Lato", sans-serif', borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label={t('admin.username')}
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
            sx={inputSx}
          />

          <TextField
            fullWidth
            label={t('admin.password')}
            name="password"
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={inputSx}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#7a1c2e',
              fontFamily: '"Lato", sans-serif',
              textTransform: 'none',
              fontSize: '1rem',
              py: 1.5,
              borderRadius: 2,
              mt: 1,
              '&:hover': { backgroundColor: '#6a1826' }
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : t('admin.sign_in')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
