import React from 'react';
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';

const StatsCard = ({ title, value, icon, color = '#6B4226', trend, trendValue }) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(107, 66, 38, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: color,
              color: '#FFF8F0',
              width: 50,
              height: 50,
              mr: 2,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: '#2E1C13',
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#4A2F1A',
                mt: 0.5,
                fontSize: '0.875rem',
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: trend === 'up' ? '#8B9A5B' : '#B8866B',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {trend === 'up' ? '↗' : '↘'} {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
