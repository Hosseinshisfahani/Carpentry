import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Divider,
  useTheme,
  Slider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import { binPackingService } from '../services/binPackingService';
import Navigation from '../components/common/Navigation';
import MainPackingDiagram from '../components/bin-packing/MainPackingDiagram';
import RectanglesOverview from '../components/bin-packing/RectanglesOverview';

const BinPackingPage = () => {
  const theme = useTheme();
  const [containerSize, setContainerSize] = useState({ width: '', height: '' });
  const [rectangles, setRectangles] = useState([{ width: '', height: '' }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1.4);

  const handleContainerSizeChange = (field) => (event) => {
    setContainerSize(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleRectangleChange = (index, field) => (event) => {
    const newRectangles = [...rectangles];
    newRectangles[index][field] = event.target.value;
    setRectangles(newRectangles);
  };

  const addRectangle = () => {
    setRectangles([...rectangles, { width: '', height: '' }]);
  };

  const removeRectangle = (index) => {
    if (rectangles.length > 1) {
      const newRectangles = rectangles.filter((_, i) => i !== index);
      setRectangles(newRectangles);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setResult(null);

    // Validate input
    const validation = binPackingService.validateInput(containerSize, rectangles);
    if (!validation.isValid) {
      setError(validation.errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      const response = await binPackingService.packRectangles(containerSize, rectangles);
      const formattedResult = binPackingService.formatResult(response);
      setResult(formattedResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setContainerSize({ width: '', height: '' });
    setRectangles([{ width: '', height: '' }]);
    setResult(null);
    setError('');
  };
  
  const increaseZoom = () => setZoom(prev => Math.min(3, Number((prev + 0.2).toFixed(2))));
  const decreaseZoom = () => setZoom(prev => Math.max(0.6, Number((prev - 0.2).toFixed(2))));
  const handleZoomSlider = (_, value) => setZoom(value);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          بهینه‌سازی چیدمان 2D
        </Typography>

        {/* Section 1: Input Form - Full Width */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            مشخصات ورودی
          </Typography>

          <Grid container spacing={3}>
            {/* Container Size */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                ابعاد ورق
              </Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="عرض ورق"
                    type="number"
                    value={containerSize.width}
                    onChange={handleContainerSizeChange('width')}
                    inputProps={{ min: 1, step: 0.1 }}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="ارتفاع ورق"
                    type="number"
                    value={containerSize.height}
                    onChange={handleContainerSizeChange('height')}
                    inputProps={{ min: 1, step: 0.1 }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Rectangles */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  قطعات
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addRectangle}
                  variant="outlined"
                  size="small"
                >
                  افزودن قطعه
                </Button>
              </Box>

              {rectangles.map((rect, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <TextField
                    label="عرض"
                    type="number"
                    value={rect.width}
                    onChange={handleRectangleChange(index, 'width')}
                    inputProps={{ min: 0.1, step: 0.1 }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="ارتفاع"
                    type="number"
                    value={rect.height}
                    onChange={handleRectangleChange(index, 'height')}
                    inputProps={{ min: 0.1, step: 0.1 }}
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    onClick={() => removeRectangle(index)}
                    disabled={rectangles.length === 1}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12, md: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayIcon />}
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'در حال پردازش...' : 'شروع بهینه‌سازی'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={resetForm}
                  disabled={loading}
                  fullWidth
                >
                  ریست
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Results Summary */}
          {result && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                <Chip
                  label={result.success ? 'موفق' : 'ناموفق'}
                  color={result.success ? 'success' : 'error'}
                />
                <Chip
                  label={`چگالی: ${result.density}%`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              {result.message && (
                <Alert severity={result.success ? 'success' : 'warning'} sx={{ mt: 1 }}>
                  {result.message}
                </Alert>
              )}
            </Box>
          )}
        </Paper>

        {/* Section 2: Main Packing Diagram - Full Width */}
        {result && result.visualization && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                نمودار چیدمان اصلی
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton size="small" onClick={decreaseZoom}>
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
                <Slider
                  size="small"
                  value={zoom}
                  onChange={handleZoomSlider}
                  step={0.1}
                  min={0.6}
                  max={3}
                  sx={{ width: 120 }}
                  aria-label="zoom"
                />
                <IconButton size="small" onClick={increaseZoom}>
                  <ZoomInIcon fontSize="small" />
                </IconButton>
                <Chip label={`${Math.round(zoom * 100)}%`} size="small" />
              </Box>
            </Box>
            <MainPackingDiagram 
              bin={{ width: result.visualization.container.width, height: result.visualization.container.height }}
              rects={result.visualization.packed_rects.map((rect, index) => ({
                id: index + 1,
                x: rect.x,
                y: rect.y,
                w: rect.width,
                h: rect.height,
                rotated: rect.rotated
              }))}
              initialScale={zoom}
              rtl={true}
              showExport={true}
              className="h-[600px] rounded-2xl shadow"
            />
          </Paper>
        )}

        {/* Section 3: Rectangles Overview - Full Width */}
        {result && result.visualization && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              نمای کلی قطعات
            </Typography>
            <RectanglesOverview 
              visualizationData={result.visualization}
              zoom={zoom}
            />
          </Paper>
        )}

        {/* Section 4: Packed Rectangles Table - Full Width */}
        {result && result.packedRectangles.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              قطعات چیده شده
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>X</TableCell>
                    <TableCell>Y</TableCell>
                    <TableCell>عرض</TableCell>
                    <TableCell>ارتفاع</TableCell>
                    <TableCell>چرخش</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.packedRectangles.map((rect, index) => (
                    <TableRow key={index}>
                      <TableCell>{rect.x.toFixed(1)}</TableCell>
                      <TableCell>{rect.y.toFixed(1)}</TableCell>
                      <TableCell>{rect.width.toFixed(1)}</TableCell>
                      <TableCell>{rect.height.toFixed(1)}</TableCell>
                      <TableCell>
                        <Chip
                          label={rect.rotated ? 'بله' : 'خیر'}
                          size="small"
                          color={rect.rotated ? 'secondary' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Empty State */}
        {!result && !error && !loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              برای شروع، مشخصات ورق و قطعات را وارد کنید
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default BinPackingPage;
