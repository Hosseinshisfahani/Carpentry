import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as ProjectIcon,
  Group as TeamIcon,
  TrendingUp as AnalyticsIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/common/Navigation';
import StatsCard from '../components/common/StatsCard';
import FeatureCard from '../components/common/FeatureCard';

const HomePage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <ProjectIcon sx={{ fontSize: 40 }} />,
      title: 'مدیریت پروژه‌ها',
      description: 'ایجاد، ویرایش و پیگیری پروژه‌های خود با دقت و نظم',
      color: '#6B4226',
    },
    {
      icon: <TeamIcon sx={{ fontSize: 40 }} />,
      title: 'همکاری تیمی',
      description: 'کار با تیم‌ها و اشتراک‌گذاری پیشرفت پروژه‌ها',
      color: '#C49A6C',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'تحلیل و گزارش',
      description: 'گزارش‌های دقیق از پیشرفت و عملکرد پروژه‌ها',
      color: '#E6CBA8',
    },
  ];

  const stats = [
    { label: 'پروژه‌های فعال', value: '12', icon: <ProjectIcon /> },
    { label: 'تکمیل شده', value: '8', icon: <CheckIcon /> },
    { label: 'در انتظار', value: '4', icon: <ScheduleIcon /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7EFE5' }}>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6B4226 0%, #C49A6C 100%)',
          color: '#FFF8F0',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'gentleFloat 20s ease-in-out infinite',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(135deg, #FFF8F0 0%, #E6CBA8 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  خوش آمدید، {user?.username}
                  <br />
                  مدیریت پروژه‌ها با دقت و نظم
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    lineHeight: 1.6,
                    fontFamily: '"Vazirmatn", sans-serif',
                  }}
                >
                  سیستم مدیریت پروژه‌های حرفه‌ای با طراحی گرم و طبیعی
                  <br />
                  برای تجربه‌ای آرام و قابل اعتماد
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/projects"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#FFF8F0',
                      color: '#FFF8F0',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#E6CBA8',
                        bgcolor: 'rgba(255, 248, 240, 0.1)',
                      },
                    }}
                  >
                    مشاهده پروژه‌ها
                  </Button>
                  <Button
                    component={Link}
                    to="/projects/new"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#FFF8F0',
                      color: '#FFF8F0',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#E6CBA8',
                        bgcolor: 'rgba(255, 248, 240, 0.1)',
                      },
                    }}
                  >
                    پروژه جدید
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Paper
                  elevation={24}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 248, 240, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 248, 240, 0.3)',
                    maxWidth: 400,
                    width: '100%',
                  }}
                >
                  <Box textAlign="center" mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: '#6B4226',
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <DashboardIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E1C13' }}>
                      داشبورد شما
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {stats.map((stat, index) => (
                      <Grid size={4} key={index}>
                        <Box textAlign="center">
                          <Box
                            sx={{
                              bgcolor: '#E6CBA8',
                              borderRadius: '50%',
                              width: 50,
                              height: 50,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 1,
                            }}
                          >
                            {stat.icon}
                          </Box>
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, color: '#6B4226' }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#4A2F1A', fontSize: '0.75rem' }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#2E1C13',
              mb: 2,
            }}
          >
            ویژگی‌های سیستم
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#4A2F1A',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            ابزارهای قدرتمند برای مدیریت حرفه‌ای پروژه‌ها با طراحی گرم و طبیعی
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Quick Actions Section */}
      <Box sx={{ bgcolor: '#FFF8F0', py: 6 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#2E1C13',
              }}
            >
              دسترسی سریع
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                component={Link}
                to="/projects"
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ProjectIcon />}
                sx={{
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                همه پروژه‌ها
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                component={Link}
                to="/projects/new"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<AddIcon />}
                sx={{
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                پروژه جدید
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<AnalyticsIcon />}
                sx={{
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                گزارش‌ها
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<SettingsIcon />}
                sx={{
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                تنظیمات
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#6B4226',
          color: '#FFF8F0',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            سیستم مدیریت پروژه با طراحی گرم و طبیعی
            <br />
            ساخته شده با دقت و عشق به جزئیات
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
