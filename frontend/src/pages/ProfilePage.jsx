import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Lock as LockIcon,
  Assignment as ProjectIcon,
  Visibility as ViewIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { projectService } from '../services/projectService';
import Navigation from '../components/common/Navigation';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: null,
      });
      setAvatarPreview(user.avatar_url || null);
    }
  }, [user]);

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setLoadingProjects(false);
      return;
    }
    
    try {
      setLoadingProjects(true);
      const data = await projectService.getProjects();
      setProjects(data.results || data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Don't try to refresh user data on every error, just show empty state
      setProjects([]);
      if (error.response?.status === 401) {
        // Session expired, redirect to login
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoadingProjects(false);
    }
  }, [user, navigate]);

  // Fetch projects only when the "My Projects" tab is selected
  useEffect(() => {
    if (tabValue === 2 && user && projects.length === 0 && !loadingProjects) {
      fetchProjects();
    }
  }, [tabValue, user, projects.length, loadingProjects, fetchProjects]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        avatar: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setProfileErrors({});

    try {
      const response = await authService.updateProfile(profileData);
      updateUser(response.user);
      setSuccess(response.message || 'پروفایل با موفقیت به‌روزرسانی شد.');
      setIsEditing(false);
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          setProfileErrors(errorData);
        } else {
          setError(errorData);
        }
      } else {
        setError('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setPasswordErrors({});

    try {
      const response = await authService.changePassword(passwordData);
      setSuccess(response.message || 'رمز عبور با موفقیت تغییر کرد.');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          setPasswordErrors(errorData);
        } else {
          setError(errorData);
        }
      } else {
        setError('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F7EFE5' }}>
      <Navigation />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <Box mb={4}>
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
              پروفایل کاربری
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              setTabValue(newValue);
            }}
            sx={{
              mb: 4,
              borderBottom: '1px solid rgba(107, 66, 38, 0.1)',
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
              },
            }}
          >
            <Tab icon={<EditIcon />} iconPosition="start" label="اطلاعات کاربری" />
            <Tab icon={<LockIcon />} iconPosition="start" label="تغییر رمز عبور" />
            <Tab icon={<ProjectIcon />} iconPosition="start" label="پروژه‌های من" />
          </Tabs>

          {/* Profile Information Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={avatarPreview}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: '#8b4513',
                      fontSize: '3rem',
                      border: '4px solid #FFF8F0',
                      boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3)',
                    }}
                  >
                    {!avatarPreview && user?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: '#8b4513',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#654321',
                        },
                      }}
                    >
                      <PhotoCameraIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </IconButton>
                  )}
                </Box>
                {!isEditing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{ mt: 2 }}
                  >
                    ویرایش پروفایل
                  </Button>
                )}
              </Box>

              <form onSubmit={handleProfileSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="نام کاربری"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      error={!!profileErrors.username}
                      helperText={profileErrors.username}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="ایمیل"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      error={!!profileErrors.email}
                      helperText={profileErrors.email}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="تلفن"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      error={!!profileErrors.phone}
                      helperText={profileErrors.phone}
                    />
                  </Grid>
                  {user?.date_joined && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="تاریخ عضویت"
                        value={formatDate(user.date_joined)}
                        disabled
                      />
                    </Grid>
                  )}
                </Grid>

                {isEditing && (
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          username: user?.username || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          avatar: null,
                        });
                        setAvatarPreview(user?.avatar_url || null);
                        setProfileErrors({});
                      }}
                      disabled={loading}
                    >
                      <CancelIcon sx={{ mr: 1 }} />
                      انصراف
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    >
                      ذخیره تغییرات
                    </Button>
                  </Box>
                )}
              </form>
            </Box>
          )}

          {/* Password Change Tab */}
          {tabValue === 1 && (
            <Box>
              <form onSubmit={handlePasswordSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="رمز عبور فعلی"
                      name="current_password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.current_password}
                      helperText={passwordErrors.current_password}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="رمز عبور جدید"
                      name="new_password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.new_password}
                      helperText={passwordErrors.new_password}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="تایید رمز عبور جدید"
                      name="confirm_password"
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.confirm_password}
                      helperText={passwordErrors.confirm_password}
                      required
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
                  >
                    تغییر رمز عبور
                  </Button>
                </Box>
              </form>
            </Box>
          )}

          {/* My Projects Tab */}
          {tabValue === 2 && (
            <Box>
              {loadingProjects ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <CircularProgress />
                </Box>
              ) : projects.length === 0 ? (
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
                    }}
                  >
                    <ProjectIcon sx={{ fontSize: 60, color: '#64748b' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    هنوز پروژه‌ای ایجاد نکرده‌اید
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                    برای شروع، اولین پروژه خود را ایجاد کنید
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ProjectIcon />}
                    onClick={() => navigate('/projects/new')}
                  >
                    ایجاد پروژه جدید
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {projects.map((project) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                      >
                        {project.image_url ? (
                          <CardMedia
                            component="img"
                            height="200"
                            image={project.image_url}
                            alt={project.title}
                            sx={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            height="200"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                              background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                            }}
                          >
                            <ProjectIcon sx={{ fontSize: 60, color: 'white' }} />
                          </Box>
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                            {project.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {project.description}
                          </Typography>
                          <Chip
                            label={formatDate(project.created_at)}
                            size="small"
                            sx={{ mt: 2 }}
                          />
                        </CardContent>
                        <CardActions>
                          <Button
                            component={Link}
                            to={`/projects/${project.id}`}
                            size="small"
                            startIcon={<ViewIcon />}
                          >
                            مشاهده
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;

