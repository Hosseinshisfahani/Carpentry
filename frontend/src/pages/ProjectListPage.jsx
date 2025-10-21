import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data.results || data);
    } catch (error) {
      setError('خطا در بارگذاری پروژه‌ها');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این پروژه را حذف کنید؟')) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
        setError('خطا در حذف پروژه');
        console.error('Error deleting project:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 25s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(180deg)' },
        },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={24}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #8b4513, #a0522d, #d2691e)',
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 2,
                    boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3)',
                  }}
                >
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    📁
                  </Typography>
                </Box>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    لیست پروژه‌ها
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    مدیریت و مشاهده تمام پروژه‌های شما
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/projects/new')}
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                ایجاد پروژه جدید
              </Button>
              <Button
                variant="outlined"
                onClick={logout}
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                خروج
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {projects.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h2" sx={{ color: '#64748b' }}>
                  📁
                </Typography>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
                هنوز پروژه‌ای ایجاد نکرده‌اید
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontSize: '1.1rem', mb: 3 }}>
                برای شروع، اولین پروژه خود را ایجاد کنید
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/projects/new')}
                sx={{ 
                  mt: 2,
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                ایجاد اولین پروژه
              </Button>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {projects.map((project, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #8b4513, #a0522d, #d2691e)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      },
                    }}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      opacity: 0,
                      transform: 'translateY(20px)',
                    }}
                  >
                    {project.image_url ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={project.image_url}
                        alt={project.title}
                        sx={{
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    ) : (
                      <Box
                        height="200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                          color: 'white',
                          fontSize: '4rem',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            animation: 'float 15s ease-in-out infinite',
                          },
                        }}
                      >
                        📁
                      </Box>
                    )}
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 700,
                          color: '#1e293b',
                          lineHeight: 1.3,
                        }}
                      >
                        {project.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                        }}
                      >
                        {project.description}
                      </Typography>
                      
                      <Box mt={3} display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          label={`ایجاد شده: ${formatDate(project.created_at)}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                            backgroundColor: 'rgba(139, 69, 19, 0.1)',
                            borderColor: 'rgba(139, 69, 19, 0.3)',
                            color: '#8b4513',
                          }}
                        />
                        <Chip
                          label={`توسط: ${project.user?.username}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            fontWeight: 500,
                            backgroundColor: 'rgba(210, 105, 30, 0.1)',
                            borderColor: 'rgba(210, 105, 30, 0.3)',
                            color: '#d2691e',
                          }}
                        />
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <IconButton
                        component={Link}
                        to={`/projects/${project.id}`}
                        color="primary"
                        title="مشاهده"
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(139, 69, 19, 0.1)',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        component={Link}
                        to={`/projects/${project.id}/edit`}
                        color="secondary"
                        title="ویرایش"
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(210, 105, 30, 0.1)',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(project.id)}
                        color="error"
                        title="حذف"
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ProjectListPage;
