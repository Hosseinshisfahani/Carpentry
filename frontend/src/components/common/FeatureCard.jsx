import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';

const FeatureCard = ({ title, description, icon, color = '#6B4226' }) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(107, 66, 38, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Avatar
          sx={{
            bgcolor: color,
            color: '#FFF8F0',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 16px rgba(107, 66, 38, 0.2)',
          }}
        >
          {icon}
        </Avatar>
        
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#2E1C13',
            mb: 2,
            fontFamily: '"Shabnam", "Vazirmatn", sans-serif',
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: '#4A2F1A',
            lineHeight: 1.6,
            fontFamily: '"Vazirmatn", sans-serif',
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
