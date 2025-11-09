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
  Tabs,
  Tab,
  TextField,
  IconButton,
  Chip,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { projectService } from '../services/projectService';
import { binPackingService } from '../services/binPackingService';
import MainPackingDiagram from '../components/bin-packing/MainPackingDiagram';
import RectanglesOverview from '../components/bin-packing/RectanglesOverview';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Bin packing state
  const [containerSize, setContainerSize] = useState({ width: '', height: '' });
  const [rectangles, setRectangles] = useState([{ width: '', height: '' }]);
  const [packingResult, setPackingResult] = useState(null);
  const [packingLoading, setPackingLoading] = useState(false);
  const [packingError, setPackingError] = useState('');
  const [zoom, setZoom] = useState(1.4);
  
  // Reports state
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (tabValue === 2 && project) {
      fetchReports();
    }
  }, [tabValue, project]);

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

  // Bin packing handlers
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

  const handlePackingSubmit = async () => {
    setPackingError('');
    setPackingResult(null);

    // Validate input
    const validation = binPackingService.validateInput(containerSize, rectangles);
    if (!validation.isValid) {
      setPackingError(validation.errors.join('\n'));
      return;
    }

    setPackingLoading(true);
    try {
      const response = await binPackingService.packRectangles(containerSize, rectangles);
      const formattedResult = binPackingService.formatResult(response);
      setPackingResult(formattedResult);
      
      // Auto-save report if successful
      if (formattedResult.success) {
        try {
          await binPackingService.saveReport(
            id,
            containerSize,
            rectangles,
            formattedResult
          );
          // Refresh reports if we're on that tab
          if (tabValue === 2) {
            fetchReports();
          }
        } catch (saveError) {
          console.error('Failed to auto-save report:', saveError);
          // Don't show error to user, just log it
        }
      }
    } catch (err) {
      setPackingError(err.message);
    } finally {
      setPackingLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      setReportsError('');
      const data = await binPackingService.getReports(id);
      setReports(data);
    } catch (err) {
      setReportsError(err.message);
    } finally {
      setReportsLoading(false);
    }
  };

  const resetPackingForm = () => {
    setContainerSize({ width: '', height: '' });
    setRectangles([{ width: '', height: '' }]);
    setPackingResult(null);
    setPackingError('');
  };
  
  const increaseZoom = () => setZoom(prev => Math.min(3, Number((prev + 0.2).toFixed(2))));
  const decreaseZoom = () => setZoom(prev => Math.max(0.6, Number((prev - 0.2).toFixed(2))));
  const handleZoomSlider = (_, value) => setZoom(value);

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
                  background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
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

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              mb: 4,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
              },
            }}
          >
            <Tab label="جزئیات پروژه" />
            <Tab label="بهینه‌سازی چیدمان" />
            <Tab label="گزارش‌های ذخیره شده" />
          </Tabs>

          {/* Tab Panel: Project Details */}
          {tabValue === 0 && (
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
          )}

          {/* Tab Panel: Bin Packing */}
          {tabValue === 1 && (
            <Box>
              {/* Input Form */}
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
                        startIcon={packingLoading ? <CircularProgress size={20} /> : <PlayIcon />}
                        onClick={handlePackingSubmit}
                        disabled={packingLoading}
                        fullWidth
                      >
                        {packingLoading ? 'در حال پردازش...' : 'شروع بهینه‌سازی'}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={resetPackingForm}
                        disabled={packingLoading}
                        fullWidth
                      >
                        ریست
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                {/* Error Display */}
                {packingError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {packingError}
                  </Alert>
                )}

                {/* Results Summary */}
                {packingResult && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={packingResult.success ? 'موفق' : 'ناموفق'}
                        color={packingResult.success ? 'success' : 'error'}
                      />
                      <Chip
                        label={`چگالی: ${packingResult.density}%`}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    {packingResult.message && (
                      <Alert severity={packingResult.success ? 'success' : 'warning'} sx={{ mt: 1 }}>
                        {packingResult.message}
                      </Alert>
                    )}
                  </Box>
                )}
              </Paper>

              {/* Main Packing Diagram */}
              {packingResult && packingResult.visualization && (
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
                    bin={{ width: packingResult.visualization.container.width, height: packingResult.visualization.container.height }}
                    rects={packingResult.visualization.packed_rects.map((rect, index) => ({
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

              {/* Rectangles Overview */}
              {packingResult && packingResult.visualization && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    نمای کلی قطعات
                  </Typography>
                  <RectanglesOverview 
                    visualizationData={packingResult.visualization}
                    zoom={zoom}
                  />
                </Paper>
              )}

              {/* Packed Rectangles Table */}
              {packingResult && packingResult.packedRectangles.length > 0 && (
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
                        {packingResult.packedRectangles.map((rect, index) => (
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
              {!packingResult && !packingError && !packingLoading && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    برای شروع، مشخصات ورق و قطعات را وارد کنید
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Tab Panel: Saved Reports */}
          {tabValue === 2 && (
            <Box>
              {reportsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : reportsError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {reportsError}
                </Alert>
              ) : reports.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    هیچ گزارشی ذخیره نشده است
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    برای ذخیره گزارش، از تب "بهینه‌سازی چیدمان" استفاده کنید
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {/* Reports List */}
                  <Grid size={{ xs: 12, md: selectedReport ? 4 : 12 }}>
                    <Typography variant="h6" gutterBottom>
                      لیست گزارش‌ها ({reports.length})
                    </Typography>
                    {reports.map((report) => (
                      <Card
                        key={report.id}
                        sx={{
                          mb: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: selectedReport?.id === report.id ? 2 : 1,
                          borderColor: selectedReport?.id === report.id ? 'primary.main' : 'divider',
                          '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => setSelectedReport(report)}
                      >
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                              {report.name}
                            </Typography>
                            <Chip
                              label={report.success ? 'موفق' : 'ناموفق'}
                              color={report.success ? 'success' : 'error'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {formatDate(report.created_at)}
                          </Typography>
                          <Box display="flex" gap={2} flexWrap="wrap">
                            <Chip
                              label={`چگالی: ${report.density.toFixed(2)}%`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`ورق: ${report.container_width} × ${report.container_height}`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`قطعات: ${report.rectangles?.length || 0}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>

                  {/* Report Details */}
                  {selectedReport && (
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Paper sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                          <Typography variant="h5">
                            {selectedReport.name}
                          </Typography>
                          <IconButton onClick={() => setSelectedReport(null)}>
                            <CloseIcon />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              تاریخ ایجاد
                            </Typography>
                            <Typography variant="body1">
                              {formatDate(selectedReport.created_at)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              چگالی
                            </Typography>
                            <Typography variant="body1">
                              {selectedReport.density.toFixed(2)}%
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              ابعاد ورق
                            </Typography>
                            <Typography variant="body1">
                              {selectedReport.container_width} × {selectedReport.container_height}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              تعداد قطعات
                            </Typography>
                            <Typography variant="body1">
                              {selectedReport.rectangles?.length || 0}
                            </Typography>
                          </Grid>
                        </Grid>

                        {selectedReport.message && (
                          <Alert severity={selectedReport.success ? 'success' : 'warning'} sx={{ mb: 3 }}>
                            {selectedReport.message}
                          </Alert>
                        )}

                        {/* Visualization */}
                        {selectedReport.visualization && (
                          <>
                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                              نمودار چیدمان
                            </Typography>
                            <MainPackingDiagram 
                              bin={{
                                width: selectedReport.visualization.container.width,
                                height: selectedReport.visualization.container.height
                              }}
                              rects={selectedReport.visualization.packed_rects?.map((rect, index) => ({
                                id: index + 1,
                                x: rect.x,
                                y: rect.y,
                                w: rect.width,
                                h: rect.height,
                                rotated: rect.rotated
                              })) || []}
                              initialScale={zoom}
                              rtl={true}
                              showExport={true}
                              className="h-[500px] rounded-2xl shadow"
                            />

                            {/* Packed Rectangles Table */}
                            {selectedReport.packed_rectangles && selectedReport.packed_rectangles.length > 0 && (
                              <Box sx={{ mt: 3 }}>
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
                                      {selectedReport.packed_rectangles.map((rect, index) => (
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
                              </Box>
                            )}
                          </>
                        )}
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          )}

        </Paper>
      </Container>
    </Box>
  );
};

export default ProjectDetailPage;
