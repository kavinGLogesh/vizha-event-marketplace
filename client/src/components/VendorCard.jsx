// VendorCard.jsx — Card displaying vendor summary with contact actions
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card, CardMedia, CardContent, CardActions, Typography,
  Box, Button, Chip, Rating, Divider, Tooltip
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import { getImageUrl } from '../utils/image';

const PLACEHOLDER = 'https://via.placeholder.com/400x250/f5e8e8/7a1c2e?text=No+Image';

const VendorCard = ({ vendor }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    _id,
    shop_name,
    category,
    district,
    rating = 0,
    price_range,
    phone,
    whatsapp,
    images = [],
    featured
  } = vendor;

  const imageUrl = getImageUrl(images.length > 0 ? images[0] : null, PLACEHOLDER);

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    window.open(`https://wa.me/91${whatsapp}?text=Hi, I found you on Vizha. I'm interested in your services.`, '_blank');
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: featured ? 'rgba(122,28,46,0.25)' : 'rgba(0,0,0,0.08)',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(122,28,46,0.12)',
          borderColor: 'rgba(122,28,46,0.4)'
        }
      }}
      onClick={() => navigate(`/vendor/${_id}`)}
    >
      {/* Featured badge */}
      {featured && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            backgroundColor: '#7a1c2e',
            color: '#fff',
            fontFamily: '"Lato", sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            px: 1.5,
            py: 0.4,
            borderRadius: 1
          }}
        >
          Featured
        </Box>
      )}

      {/* Image */}
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={shop_name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Shop Name */}
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#1a0a0e',
            mb: 0.5,
            lineHeight: 1.3
          }}
        >
          {shop_name}
        </Typography>

        {/* Meta chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
          <Chip
            icon={<CategoryIcon sx={{ fontSize: '0.8rem !important' }} />}
            label={category}
            size="small"
            sx={{
              backgroundColor: 'rgba(122,28,46,0.08)',
              color: '#7a1c2e',
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.72rem',
              height: 22
            }}
          />
          <Chip
            icon={<LocationOnIcon sx={{ fontSize: '0.8rem !important' }} />}
            label={district}
            size="small"
            sx={{
              backgroundColor: 'rgba(0,0,0,0.05)',
              color: '#555',
              fontFamily: '"Lato", sans-serif',
              fontSize: '0.72rem',
              height: 22
            }}
          />
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating value={rating} readOnly precision={0.5} size="small" sx={{ color: '#c4576a' }} />
          <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', color: '#666' }}>
            {rating.toFixed(1)}
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CurrencyRupeeIcon sx={{ fontSize: 14, color: '#7a1c2e' }} />
          <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#444', fontWeight: 600 }}>
            {price_range || 'Contact for price'}
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: 'rgba(0,0,0,0.06)' }} />

      <CardActions sx={{ p: 1.5, gap: 1 }}>
        <Tooltip title={t('vendor.call')}>
          <Button
            onClick={handleCall}
            variant="outlined"
            size="small"
            startIcon={<PhoneIcon />}
            sx={{
              flex: 1,
              borderColor: '#7a1c2e',
              color: '#7a1c2e',
              fontFamily: '"Lato", sans-serif',
              textTransform: 'none',
              fontSize: '0.78rem',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(122,28,46,0.06)' }
            }}
          >
            {t('vendor.call')}
          </Button>
        </Tooltip>

        <Tooltip title={t('vendor.whatsapp')}>
          <Button
            onClick={handleWhatsApp}
            variant="contained"
            size="small"
            startIcon={<WhatsAppIcon />}
            sx={{
              flex: 1,
              backgroundColor: '#25D366',
              fontFamily: '"Lato", sans-serif',
              textTransform: 'none',
              fontSize: '0.78rem',
              borderRadius: 2,
              '&:hover': { backgroundColor: '#1ebe5d' }
            }}
          >
            WhatsApp
          </Button>
        </Tooltip>

        <Tooltip title={t('vendor.view_details')}>
          <Button
            onClick={(e) => { e.stopPropagation(); navigate(`/vendor/${_id}`); }}
            size="small"
            sx={{
              minWidth: 0,
              color: '#999',
              '&:hover': { color: '#7a1c2e' }
            }}
          >
            <OpenInNewIcon fontSize="small" />
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default VendorCard;
