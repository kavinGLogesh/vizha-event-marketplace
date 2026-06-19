// Contact.jsx — Contact form and info page
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Typography, Grid, TextField, Button,
  Alert, Paper
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission (integrate with backend email endpoint if needed)
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
    setForm({ name: '', email: '', message: '' });
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
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1a0a0e 0%, #4a1220 100%)', py: { xs: 7, md: 10 }, px: 2 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#fff'
            }}
          >
            {t('contact.title')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 } }}>
        <Grid container spacing={5}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmit}
              sx={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 3, p: { xs: 3, md: 5 } }}
            >
              {submitted && (
                <Alert severity="success" sx={{ mb: 3, fontFamily: '"Lato", sans-serif' }}>
                  Thank you! We'll get back to you shortly.
                </Alert>
              )}

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('contact.name')}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('contact.email')}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('contact.message')}
                    name="message"
                    multiline
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={<SendIcon />}
                    sx={{
                      backgroundColor: '#7a1c2e',
                      fontFamily: '"Lato", sans-serif',
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      '&:hover': { backgroundColor: '#6a1826' }
                    }}
                  >
                    {loading ? t('common.loading') : t('contact.send')}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ pt: { md: 2 } }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#1a0a0e',
                  mb: 3
                }}
              >
                Get In Touch
              </Typography>

              {[
                { icon: <LocationOnIcon sx={{ color: '#7a1c2e' }} />, label: t('contact.address'), value: 'Tamil Nadu, India' },
                { icon: <PhoneIcon sx={{ color: '#7a1c2e' }} />, label: t('contact.phone'), value: '+91 98765 43210' },
                { icon: <EmailIcon sx={{ color: '#7a1c2e' }} />, label: 'Email', value: 'hello@vizha.in' }
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      backgroundColor: 'rgba(122,28,46,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.78rem', color: '#888' }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontFamily: '"Lato", sans-serif', fontWeight: 600, color: '#333', mt: 0.2 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
