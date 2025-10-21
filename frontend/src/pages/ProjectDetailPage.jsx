import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { projectService } from '../services/projectService';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProject(id);
      setProject(data);
    } catch (error) {
      setError('خطا در بارگذاری پروژه');
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این پروژه را حذف کنید؟')) {
      try {
        await projectService.deleteProject(id);
        navigate('/');
      } catch (error) {
        setError('خطا در حذف پروژه');
        console.error('Error deleting project:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          بازگشت به لیست پروژه‌ها
        </Button>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">پروژه یافت نشد</Alert>
        <Button component={Link} to="/" sx={{ mt: 2 }}>
          بازگشت به لیست پروژه‌ها
        </Button>
      </Container>
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
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3, 
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          بازگشت به لیست پروژه‌ها
        </Button>

        <Paper
          elevation={24}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
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
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {project.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontSize: '1.1rem' }}>
                جزئیات و اطلاعات پروژه
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/projects/${id}/edit`)}
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                ویرایش پروژه
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                حذف پروژه
              </Button>
            </Box>
          </Box>

          {project.image_url && (
            <Box mb={4}>
              <img
                src={project.image_url}
                alt={project.title}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </Box>
          )}

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 2,
                    }}
                  >
                    توضیحات پروژه
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      lineHeight: 1.8,
                      fontSize: '1.1rem',
                      color: '#64748b',
                    }}
                  >
                    {project.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 3,
                    }}
                  >
                    اطلاعات پروژه
                  </Typography>
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                      ایجاد شده:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(project.created_at)}
                    </Typography>
                  </Box>
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                      آخرین بروزرسانی:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(project.updated_at)}
                    </Typography>
                  </Box>
                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                      ایجاد کننده:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {project.user?.username}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                      شناسه پروژه:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      #{project.id}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Paper>
      </Container>
    </Box>
  );
};

export default ProjectDetailPage;
