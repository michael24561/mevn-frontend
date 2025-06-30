'use client';

import React, { useState, useEffect } from 'react';
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
  Tooltip,
  CircularProgress
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
}

interface ItemVenta {
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

interface Venta {
  _id: string;
  codigoVenta: string;
  cliente: Cliente;
  items: ItemVenta[];
  total: number;
  fecha: string;
  estado: 'en proceso' | 'cancelada' | 'completada';
  createdAt: string;
}

const ReportesPage: React.FC = () => {
  const [reportType, setReportType] = useState('ventas');
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener ventas desde tu API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ventas`);
        setVentas(response.data.data);
      } catch (error) {
        setSnackbar({ 
          open: true, 
          message: 'Error al cargar las ventas', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  // Procesar datos para gráficos
  const procesarDatosVentas = () => {
    if (!ventas.length) return [];

    const ventasPorMes = ventas.reduce((acc: Record<string, {
      ventas: number;
      pedidos: number;
      clientes: Set<string>;
      productos: Record<string, { nombre: string; cantidad: number }>;
    }>, venta) => {
      const fecha = new Date(venta.fecha);
      const mes = format(fecha, 'MMM', { locale: es });
      
      if (!acc[mes]) {
        acc[mes] = {
          ventas: 0,
          pedidos: 0,
          clientes: new Set(),
          productos: {}
        };
      }
      
      acc[mes].ventas += venta.total;
      acc[mes].pedidos += 1;
      acc[mes].clientes.add(venta.cliente._id);
      
      venta.items.forEach(item => {
        if (!acc[mes].productos[item.producto._id]) {
          acc[mes].productos[item.producto._id] = {
            nombre: item.producto.nombre,
            cantidad: 0
          };
        }
        acc[mes].productos[item.producto._id].cantidad += item.cantidad;
      });
      
      return acc;
    }, {});

    return Object.entries(ventasPorMes).map(([mes, datos]) => ({
      mes,
      ventas: datos.ventas,
      pedidos: datos.pedidos,
      clientes: datos.clientes.size,
      productos: Object.values(datos.productos).length
    }));
  };

  const ventasData = procesarDatosVentas();
  
  // Productos más vendidos
  const productosMasVendidos = () => {
    if (!ventas.length) return [];
    
    const productos: Record<string, { nombre: string; cantidad: number; ventas: number }> = {};
    
    ventas.forEach(venta => {
      venta.items.forEach(item => {
        if (!productos[item.producto._id]) {
          productos[item.producto._id] = {
            nombre: item.producto.nombre,
            cantidad: 0,
            ventas: 0
          };
        }
        productos[item.producto._id].cantidad += item.cantidad;
        productos[item.producto._id].ventas += item.subtotal;
      });
    });
    
    return Object.values(productos)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
      .map((prod, index) => ({
        name: prod.nombre,
        value: prod.cantidad,
        ventas: prod.ventas,
        color: ['#59ab6e', '#1976d2', '#ff9800', '#f44336', '#9c27b0'][index]
      }));
  };

  const productosData = productosMasVendidos();

  // Métricas resumidas
  const calcularMetricas = () => {
    if (!ventas.length) return {
      totalVentas: 0,
      totalPedidos: 0,
      clientesUnicos: 0,
      productosVendidos: 0
    };
    
    const clientesUnicos = new Set(ventas.map(v => v.cliente._id));
    const productosVendidos = new Set<string>();
    let totalVentas = 0;
    
    ventas.forEach(venta => {
      totalVentas += venta.total;
      venta.items.forEach(item => {
        productosVendidos.add(item.producto._id);
      });
    });
    
    return {
      totalVentas,
      totalPedidos: ventas.length,
      clientesUnicos: clientesUnicos.size,
      productosVendidos: productosVendidos.size
    };
  };

  const metricas = calcularMetricas();

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      // Aquí puedes llamar a tu API para generar un reporte
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
    } finally {
      setLoading(false);
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

  if (loading && !ventas.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

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
            disabled={loading}
            sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
          >
            {loading ? 'Generando...' : 'Generar Reporte'}
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
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Ventas Totales
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#59ab6e' }}>
                    ${metricas.totalVentas.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: '500' }}>
                      +12.5%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, borderRadius: '50%', backgroundColor: '#59ab6e15', color: '#59ab6e' }}>
                  <BarChartIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pedidos
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#1976d2' }}>
                    {metricas.totalPedidos}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: '500' }}>
                      +8.2%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, borderRadius: '50%', backgroundColor: '#1976d215', color: '#1976d2' }}>
                  <TimelineIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Clientes
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#ff9800' }}>
                    {metricas.clientesUnicos}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingDownIcon sx={{ color: '#f44336', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#f44336', fontWeight: '500' }}>
                      -2.1%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, borderRadius: '50%', backgroundColor: '#ff980015', color: '#ff9800' }}>
                  <PieChartIcon />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Productos Vendidos
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: '700', color: '#f44336' }}>
                    {metricas.productosVendidos}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '1rem', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: '500' }}>
                      +15.3%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, borderRadius: '50%', backgroundColor: '#f4433615', color: '#f44336' }}>
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
              {ventasData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ventasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value, name) => 
                        name === 'Ventas ($)' ? [`$${value.toLocaleString()}`, name] : [value, name]
                      }
                    />
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
              ) : (
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="textSecondary">No hay datos de ventas para mostrar</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de productos */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 3 }}>
                Productos Más Vendidos
              </Typography>
              {productosData.length > 0 ? (
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
                    <RechartsTooltip 
                      formatter={(value, name, props) => [
                        `${value} unidades ($${props.payload.ventas.toLocaleString()})`,
                        name
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography color="textSecondary">No hay datos de productos para mostrar</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de datos */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: '600', mb: 3 }}>
            Historial de Ventas
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.length > 0 ? (
                  ventas.map((venta) => (
                    <TableRow key={venta._id} hover>
                      <TableCell>{venta.codigoVenta}</TableCell>
                      <TableCell>
                        {format(new Date(venta.fecha), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>{venta.cliente.nombre}</TableCell>
                      <TableCell align="right">${venta.total.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={venta.estado === 'completada' ? 'Completada' : 
                                 venta.estado === 'cancelada' ? 'Cancelada' : 'En proceso'}
                          size="small"
                          color={
                            venta.estado === 'completada' ? 'success' :
                            venta.estado === 'cancelada' ? 'error' : 'warning'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="textSecondary">No hay ventas registradas</Typography>
                    </TableCell>
                  </TableRow>
                )}
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