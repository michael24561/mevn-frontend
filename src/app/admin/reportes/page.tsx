'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const ReportesPage: React.FC = () => {
  const [reportType, setReportType] = useState('ventas');
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Datos de ejemplo para los reportes
  const ventasData = [
    { mes: 'Ene', ventas: 12000, pedidos: 45, clientes: 23 },
    { mes: 'Feb', ventas: 15000, pedidos: 52, clientes: 28 },
    { mes: 'Mar', ventas: 18000, pedidos: 61, clientes: 35 },
    { mes: 'Abr', ventas: 14000, pedidos: 48, clientes: 26 },
    { mes: 'May', ventas: 22000, pedidos: 78, clientes: 42 },
    { mes: 'Jun', ventas: 25000, pedidos: 85, clientes: 48 }
  ];

  const productosData = [
    { name: 'Vino Tinto', value: 35, color: '#59ab6e' },
    { name: 'Vino Blanco', value: 25, color: '#1976d2' },
    { name: 'Champagne', value: 20, color: '#ff9800' },
    { name: 'Vino Rosado', value: 15, color: '#f44336' },
    { name: 'Otros', value: 5, color: '#9c27b0' }
  ];

  const handleGenerateReport = async () => {
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({ 
        open: true, 
        message: `Reporte de ${reportType} generado exitosamente`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Error al generar el reporte', 
        severity: 'error' 
      });
    }
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    setSnackbar({ 
      open: true, 
      message: `Reporte exportado en formato ${format.toUpperCase()}`, 
      severity: 'success' 
    });
  };

  const handleSendEmail = () => {
    setSnackbar({ 
      open: true, 
      message: 'Reporte enviado por email exitosamente', 
      severity: 'success' 
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: '600', color: 'text.primary' }}>
          Reportes y Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={handleGenerateReport}
            sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
          >
            Generar Reporte
          </Button>
        </Box>
      </Box>

      {/* Configuración del reporte */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
            Configuración del Reporte
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Reporte</InputLabel>
                <Select
                  value={reportType}
                  label="Tipo de Reporte"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="ventas">Ventas</MenuItem>
                  <MenuItem value="productos">Productos</MenuItem>
                  <MenuItem value="clientes">Clientes</MenuItem>
                  <MenuItem value="inventario">Inventario</MenuItem>
                  <MenuItem value="financiero">Financiero</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Período</InputLabel>
                <Select
                  value={period}
                  label="Período"
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <MenuItem value="week">Esta semana</MenuItem>
                  <MenuItem value="month">Este mes</MenuItem>
                  <MenuItem value="quarter">Este trimestre</MenuItem>
                  <MenuItem value="year">Este año</MenuItem>
                  <MenuItem value="custom">Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fecha de inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={period !== 'custom'}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Fecha de fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={period !== 'custom'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Métricas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Ventas Totales
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#59ab6e' }}>
                    $45,678
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: '500' }}>
                      +12.5%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '50%', 
                  backgroundColor: '#59ab6e15',
                  color: '#59ab6e'
                }}>
                  <BarChartIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pedidos
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#1976d2' }}>
                    1,234
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: '500' }}>
                      +8.2%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '50%', 
                  backgroundColor: '#1976d215',
                  color: '#1976d2'
                }}>
                  <TimelineIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Clientes
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#ff9800' }}>
                    567
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingDownIcon sx={{ color: '#f44336', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#f44336', fontWeight: '500' }}>
                      -2.1%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '50%', 
                  backgroundColor: '#ff980015',
                  color: '#ff9800'
                }}>
                  <PieChartIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Productos
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#f44336' }}>
                    89
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: '500' }}>
                      +15.3%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '50%', 
                  backgroundColor: '#f4433615',
                  color: '#f44336'
                }}>
                  <AssessmentIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de ventas */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                  Ventas Mensuales
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Exportar PDF">
                    <IconButton size="small" onClick={() => handleExportReport('pdf')}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Imprimir">
                    <IconButton size="small">
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Enviar por email">
                    <IconButton size="small" onClick={handleSendEmail}>
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#59ab6e" 
                    strokeWidth={3}
                    name="Ventas ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    name="Pedidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de productos */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 3 }}>
                Distribución de Productos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={productosData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de datos */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: '600', mb: 3 }}>
            Datos Detallados
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mes</TableCell>
                  <TableCell align="right">Ventas ($)</TableCell>
                  <TableCell align="right">Pedidos</TableCell>
                  <TableCell align="right">Clientes</TableCell>
                  <TableCell align="center">Tendencia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventasData.map((row) => (
                  <TableRow key={row.mes} hover>
                    <TableCell>{row.mes}</TableCell>
                    <TableCell align="right">${row.ventas.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.pedidos}</TableCell>
                    <TableCell align="right">{row.clientes}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label="↑ +12%" 
                        size="small" 
                        color="success"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportesPage; 