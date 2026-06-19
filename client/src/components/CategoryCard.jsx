// CategoryCard.jsx — Category selection card
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import SpaIcon from '@mui/icons-material/Spa';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CakeIcon from '@mui/icons-material/Cake';
import VideocamIcon from '@mui/icons-material/Videocam';

// Map category names to icons
const CATEGORY_ICONS = {
  Catering: RestaurantIcon,
  Decoration: CelebrationIcon,
  Photography: CameraAltIcon,
  'DJ & Music': MusicNoteIcon,
  Flowers: LocalFloristIcon,
  Mehendi: SpaIcon,
  Transport: DirectionsCarIcon,
  Bridal: CheckroomIcon,
  Cake: CakeIcon,
  Videography: VideocamIcon,
  default: CelebrationIcon
};

const CategoryCard = ({ category, district }) => {
  const navigate = useNavigate();
  const IconComponent = CATEGORY_ICONS[category.name] || CATEGORY_ICONS.default;
  const districtSlug = district?.toLowerCase() || '';

  return (
    <Card
      elevation={0}
      onClick={() => navigate(`/${districtSlug}/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
      sx={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        background: 'linear-gradient(135deg, #fff 0%, #fdf5f6 100%)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(122,28,46,0.12)',
          borderColor: '#7a1c2e',
          background: 'linear-gradient(135deg, #fdf5f6 0%, #faeaec 100%)'
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: 'rgba(122,28,46,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5,
            transition: 'background-color 0.2s'
          }}
        >
          <IconComponent sx={{ color: '#7a1c2e', fontSize: 24 }} />
        </Box>
        <Typography
          sx={{
            fontFamily: '"Lato", sans-serif',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#333'
          }}
        >
          {category.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
