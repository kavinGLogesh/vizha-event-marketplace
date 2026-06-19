// DistrictCard.jsx — Card for selecting a district on the home page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';

// District icon colors mapped by name
const DISTRICT_COLORS = {
  Chennai: '#7a1c2e',
  Coimbatore: '#8b3a52',
  Madurai: '#9c4e5f',
  Salem: '#7a1c2e',
  Erode: '#6b1528',
  Trichy: '#8b3a52',
  Tirunelveli: '#7a1c2e',
  Vellore: '#9c4e5f',
  default: '#7a1c2e'
};

const DistrictCard = ({ district }) => {
  const navigate = useNavigate();
  const color = DISTRICT_COLORS[district.name] || DISTRICT_COLORS.default;

  return (
    <Card
      elevation={0}
      onClick={() => navigate(`/${district.name.toLowerCase()}`)}
      sx={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 8px 24px ${color}22`,
          borderColor: color
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: `${color}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5
          }}
        >
          <LocationCityIcon sx={{ color, fontSize: 26 }} />
        </Box>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#1a0a0e'
          }}
        >
          {district.name}
        </Typography>
        {district.vendor_count !== undefined && (
          <Typography sx={{ fontFamily: '"Lato", sans-serif', fontSize: '0.78rem', color: '#888', mt: 0.3 }}>
            {district.vendor_count} vendors
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DistrictCard;
