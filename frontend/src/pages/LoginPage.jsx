import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Password reset states
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      await login(formData);
      navigate('/');
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

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      const response = await authService.requestPasswordReset(resetEmail);
      setResetMessage(response.message || 'اگر ایمیل شما در سیستم ثبت شده باشد، لینک بازیابی رمز عبور به ایمیل شما ارسال شد.');
      setResetEmail('');
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          setResetError(errorData.email || errorData.non_field_errors || 'خطایی رخ داده است.');
        } else {
          setResetError(errorData);
        }
      } else {
        setResetError('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
    setResetEmail('');
    setResetError('');
    setResetMessage('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    >
      <Container maxWidth="sm">
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
                background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 32px rgba(139, 69, 19, 0.3)',
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                🔐
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
              ورود
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              به حساب کاربری خود وارد شوید
            </Typography>
          </Box>

          {message && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.2rem',
                },
              }}
            >
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="نام کاربری"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              margin="normal"
              required
              autoFocus
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '1rem',
                  padding: '16px 14px',
                },
              }}
            />

            <TextField
              fullWidth
              label="رمز عبور"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              required
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '1rem',
                  padding: '16px 14px',
                },
              }}
            />

            <Box textAlign="center" mt={2}>
              <Button
                onClick={() => setResetDialogOpen(true)}
                sx={{
                  color: '#8b4513',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  padding: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                بازیابی رمز عبور
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 4, 
                mb: 3, 
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>در حال ورود...</span>
                </Box>
              ) : (
                'ورود به سیستم'
              )}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>
              حساب کاربری ندارید؟{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: '#8b4513', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#654321';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#8b4513';
                  e.target.style.textDecoration = 'none';
                }}
              >
                ثبت نام کنید
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Password Reset Dialog */}
      <Dialog 
        open={resetDialogOpen} 
        onClose={handleCloseResetDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            direction: 'rtl',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
          color: 'white',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            بازیابی رمز عبور
          </Typography>
          <IconButton
            onClick={handleCloseResetDialog}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {resetMessage ? (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
              }}
            >
              {resetMessage}
            </Alert>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                لطفاً ایمیل خود را وارد کنید. لینک بازیابی رمز عبور به ایمیل شما ارسال خواهد شد.
              </Typography>
              
              {resetError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  {resetError}
                </Alert>
              )}

              <form onSubmit={handleResetRequest}>
                <TextField
                  fullWidth
                  label="ایمیل"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setResetError('');
                  }}
                  margin="normal"
                  required
                  autoFocus
                  disabled={resetLoading}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '1rem',
                      fontWeight: 500,
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: '1rem',
                      padding: '16px 14px',
                    },
                  }}
                />
                
                <DialogActions sx={{ px: 0, pt: 3, pb: 1 }}>
                  <Button
                    onClick={handleCloseResetDialog}
                    disabled={resetLoading}
                    sx={{
                      color: 'text.secondary',
                      textTransform: 'none',
                    }}
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={resetLoading}
                    sx={{
                      backgroundColor: '#8b4513',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#654321',
                      },
                    }}
                  >
                    {resetLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <span>در حال ارسال...</span>
                      </Box>
                    ) : (
                      'ارسال لینک بازیابی'
                    )}
                  </Button>
                </DialogActions>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
