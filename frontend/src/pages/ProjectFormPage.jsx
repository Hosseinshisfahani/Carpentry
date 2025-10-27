import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { projectService } from '../services/projectService';

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchProject();
    }
  }, [id, isEdit]);

  const fetchProject = async () => {
    try {
      const project = await projectService.getProject(id);
      setFormData({
        title: project.title || '',
        description: project.description || '',
        image: null,
      });
    } catch (error) {
      setMessage('خطا در بارگذاری پروژه');
      console.error('Error fetching project:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image') {
      const file = files[0] || null;
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview URL
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      const submitData = { ...formData };
      

      if (isEdit) {
        await projectService.updateProject(id, submitData);
        setMessage('پروژه با موفقیت ویرایش شد!');
      } else {
        await projectService.createProject(submitData);
        setMessage('پروژه با موفقیت ایجاد شد!');
      }
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          setErrors(errorData);
        } else {
          setMessage(errorData);
        }
      } else {
        setMessage('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      <Container maxWidth="md">
        <Button
          onClick={() => navigate('/')}
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
          بازگشت به لیست
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
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3)',
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                {isEdit ? '✏️' : '➕'}
              </Typography>
            </Box>
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
              {isEdit ? 'ویرایش پروژه' : 'ایجاد پروژه جدید'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              اطلاعات پروژه را تکمیل کنید
            </Typography>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="عنوان پروژه"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="توضیحات"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>

              <Grid size={12}>
                <Card
                  sx={{
                    border: '2px dashed',
                    borderColor: imagePreview ? 'success.main' : 'grey.300',
                    borderRadius: 3,
                    backgroundColor: imagePreview ? 'rgba(76, 175, 80, 0.05)' : 'rgba(139, 69, 19, 0.02)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: imagePreview ? 'success.dark' : 'primary.main',
                      backgroundColor: imagePreview ? 'rgba(76, 175, 80, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {imagePreview ? (
                      <Box>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircleIcon color="success" />
                            <Typography variant="h6" color="success.main" fontWeight={600}>
                              تصویر انتخاب شده
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={handleRemoveImage}
                            color="error"
                            sx={{
                              backgroundColor: 'rgba(244, 67, 54, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        
                        <Box
                          sx={{
                            position: 'relative',
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'white',
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="پیش‌نمایش تصویر"
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            {formData.image?.name}
                          </Box>
                        </Box>
                        
                        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                          <Chip
                            icon={<ImageIcon />}
                            label={`${(formData.image?.size / 1024 / 1024).toFixed(2)} MB`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={formData.image?.type || 'نوع فایل نامشخص'}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Box textAlign="center">
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 4px 20px rgba(139, 69, 19, 0.3)',
                          }}
                        >
                          <CloudUploadIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          تصویر پروژه را انتخاب کنید
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                          فایل‌های JPG، PNG، GIF تا حداکثر 10 مگابایت
                        </Typography>
                        
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="image-upload"
                          type="file"
                          name="image"
                          onChange={handleChange}
                        />
                        <label htmlFor="image-upload">
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={<ImageIcon />}
                            sx={{
                              borderRadius: 3,
                              px: 4,
                              py: 1.5,
                              fontSize: '1rem',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #a0522d 0%, #cd853f 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(139, 69, 19, 0.4)',
                              },
                            }}
                          >
                            انتخاب فایل
                          </Button>
                        </label>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                {errors.image && (
                  <Typography variant="body2" color="error" sx={{ mt: 1, ml: 2 }}>
                    {errors.image}
                  </Typography>
                )}
              </Grid>

            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                isEdit ? 'ذخیره تغییرات' : 'ایجاد پروژه'
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProjectFormPage;
