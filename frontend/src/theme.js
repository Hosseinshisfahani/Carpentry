import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#6B4226', // Deep walnut brown - defines identity
      light: '#8B5A3C', // Lighter walnut
      dark: '#4A2F1A', // Darker walnut
      contrastText: '#FFF8F0', // Ivory wood
    },
    secondary: {
      main: '#C49A6C', // Oak beige - adds warmth
      light: '#D4B896', // Lighter oak
      dark: '#A67C52', // Darker oak
      contrastText: '#2E1C13', // Dark cocoa
    },
    background: {
      default: '#F7EFE5', // Birch cream - soft, comfortable contrast
      paper: '#FFF8F0', // Ivory wood - material base
    },
    text: {
      primary: '#2E1C13', // Dark cocoa - readable and organic
      secondary: '#4A2F1A', // Medium cocoa
    },
    info: {
      main: '#E6CBA8', // Pale amber - subtle highlight
      light: '#F0DCC4', // Lighter amber
      dark: '#D4B896', // Darker amber
      contrastText: '#2E1C13',
    },
    success: {
      main: '#8B9A5B', // Warm green with brown undertones
      light: '#A8B87A',
      dark: '#6B7A3F',
      contrastText: '#FFF8F0',
    },
    warning: {
      main: '#D4A574', // Warm orange with wood tones
      light: '#E6B890',
      dark: '#B8935A',
      contrastText: '#2E1C13',
    },
    error: {
      main: '#B8866B', // Warm red with brown undertones
      light: '#D4A896',
      dark: '#9B6B4A',
      contrastText: '#FFF8F0',
    },
  },
  typography: {
    fontFamily: '"Vazirmatn", "Shabnam", "Tahoma", "Arial", sans-serif',
    h1: {
      fontFamily: '"Shabnam", "Vazirmatn", sans-serif', // Shabnam for headings
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '0.02em', // Expanded kerning for Persian
    },
    h2: {
      fontFamily: '"Shabnam", "Vazirmatn", sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '0.015em',
    },
    h3: {
      fontFamily: '"Shabnam", "Vazirmatn", sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    h4: {
      fontFamily: '"Shabnam", "Vazirmatn", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Shabnam", "Vazirmatn", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Shabnam", "Vazirmatn", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Vazirmatn", sans-serif', // Vazirmatn for body
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Vazirmatn", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Vazirmatn", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 14, // 12-16px range for comfort
  },
  // Warm brown-tinted shadows for wood grain depth
  shadows: [
    'none',
    '0 1px 3px 0 rgba(107, 66, 38, 0.12), 0 1px 2px 0 rgba(107, 66, 38, 0.08)',
    '0 4px 6px -1px rgba(107, 66, 38, 0.12), 0 2px 4px -1px rgba(107, 66, 38, 0.08)',
    '0 10px 15px -3px rgba(107, 66, 38, 0.12), 0 4px 6px -2px rgba(107, 66, 38, 0.08)',
    '0 20px 25px -5px rgba(107, 66, 38, 0.12), 0 10px 10px -5px rgba(107, 66, 38, 0.08)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
    '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          minHeight: '44px', // Touch target accessibility
          boxShadow: 'none',
          transition: 'all 0.22s cubic-bezier(0.25, 0.8, 0.25, 1)', // Organic timing
          '&:hover': {
            boxShadow: '0 4px 12px rgba(107, 66, 38, 0.2)',
            transform: 'translateY(-1px)',
          },
          '&:focus-visible': {
            outline: '2px solid #E6CBA8', // Amber focus ring
            outlineOffset: '2px',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6B4226 0%, #8B5A3C 100%)', // Walnut gradient
          '&:hover': {
            background: 'linear-gradient(135deg, #4A2F1A 0%, #6B4226 100%)', // Darker walnut
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#C49A6C', // Oak border
          color: '#6B4226', // Walnut text
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(196, 154, 108, 0.08)', // Oak with transparency
            borderColor: '#A67C52', // Darker oak
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(107, 66, 38, 0.12), 0 2px 4px -1px rgba(107, 66, 38, 0.08)',
          border: '1px solid rgba(196, 154, 108, 0.2)', // Oak border
          backgroundColor: '#FFF8F0', // Ivory wood
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', // Organic timing
          '&:hover': {
            boxShadow: '0 8px 16px rgba(107, 66, 38, 0.15), 0 4px 8px rgba(107, 66, 38, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            fontFamily: '"Vazirmatn", sans-serif',
            fontWeight: 500,
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '14px',
            backgroundColor: '#FFF8F0', // Ivory wood
            transition: 'all 0.22s cubic-bezier(0.25, 0.8, 0.25, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#C49A6C', // Oak border
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E6CBA8', // Amber focus
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'none',
          backgroundColor: '#FFF8F0', // Ivory wood base
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(107, 66, 38, 0.12), 0 1px 2px 0 rgba(107, 66, 38, 0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 6px -1px rgba(107, 66, 38, 0.12), 0 2px 4px -1px rgba(107, 66, 38, 0.08)',
        },
        elevation6: {
          boxShadow: '0 10px 15px -3px rgba(107, 66, 38, 0.12), 0 4px 6px -2px rgba(107, 66, 38, 0.08)',
        },
        elevation10: {
          boxShadow: '0 20px 25px -5px rgba(107, 66, 38, 0.12), 0 10px 10px -5px rgba(107, 66, 38, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
          fontFamily: '"Vazirmatn", sans-serif',
          backgroundColor: '#E6CBA8', // Pale amber
          color: '#2E1C13', // Dark cocoa
          '&:hover': {
            backgroundColor: '#D4B896', // Darker amber
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '14px',
          fontFamily: '"Vazirmatn", sans-serif',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6B4226 0%, #4A2F1A 100%)', // Dark walnut gradient
          boxShadow: '0 4px 6px -1px rgba(107, 66, 38, 0.12), 0 2px 4px -1px rgba(107, 66, 38, 0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          backgroundColor: '#FFF8F0', // Ivory wood
          boxShadow: '0 25px 50px -12px rgba(107, 66, 38, 0.2)',
        },
        backdrop: {
          backgroundColor: 'rgba(107, 66, 38, 0.3)', // Warm brown overlay
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(107, 66, 38, 0.3)', // Warm brown semi-transparent
        },
      },
    },
  },
});

export default theme;
