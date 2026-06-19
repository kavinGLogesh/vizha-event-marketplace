// LanguageSwitcher.jsx — Toggle between Tamil and English
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

const LanguageSwitcher = ({ dark = false }) => {
  const { i18n } = useTranslation();

  const handleChange = (_, newLang) => {
    if (newLang) {
      i18n.changeLanguage(newLang);
      localStorage.setItem('lang', newLang);
    }
  };

  return (
    <ToggleButtonGroup
      value={i18n.language}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiToggleButton-root': {
          color: dark ? 'rgba(255,255,255,0.7)' : '#7a1c2e',
          borderColor: dark ? 'rgba(255,255,255,0.3)' : '#7a1c2e',
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 600,
          fontSize: '0.8rem',
          py: 0.4,
          px: 1.5,
          textTransform: 'none',
          '&.Mui-selected': {
            backgroundColor: '#7a1c2e',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#6a1826'
            }
          },
          '&:hover': {
            backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(122,28,46,0.08)'
          }
        }
      }}
    >
      <ToggleButton value="en">
        <Typography variant="caption" fontWeight="inherit" fontFamily="inherit">EN</Typography>
      </ToggleButton>
      <ToggleButton value="ta">
        <Typography variant="caption" fontWeight="inherit" fontFamily="inherit">தமிழ்</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageSwitcher;
