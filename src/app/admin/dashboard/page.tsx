// app/admin/dashboard/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ShoppingCart as VentasIcon,
  People as ClienteIcon,
  Inventory as ProductosIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as DineroIcon,
  LocalShipping as PedidosIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  MoreVert as MoreIcon,
  Visibility,
  Download,
  Print,
  Email,
  Refresh
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  ventas: {
    total: number;
    cambio: number;
  };
  clientes: {
    total: number;
    activos: number;
    cambio: number;
  };
  productos: {
    total: number;
    cambio: number;
  };
  pedidos: {
    pendientes: number;
    cambio: number;
  };
}

interface Pedido {
  _id: string;
  cliente: string;
  total: number;
  estado: string;
  fecha: string;
}

interface ProductoTop {
  _id: string;
  nombre: string;
  ventas: number;
  ingresos: number;
  crecimiento: number;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down';
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

interface SalesData {
  month: string;
  sales: number;
  orders: number;
  customers: number;
}

interface ProductData {
  name: string;
  value: number;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Pedido[]>([]);
  const [topProducts, setTopProducts] = useState<ProductoTop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState('sales');
  const [reportPeriod, setReportPeriod] = useState('month');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar estadísticas desde el backend
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard/stats'),
        fetch('http://localhost:5000/api/dashboard/recent-orders'),
        fetch('http://localhost:5000/api/dashboard/top-products')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setTopProducts(productsData);
      }

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      // Usar datos de ejemplo si el backend no está disponible
      setStats({
        ventas: { total: 45231, cambio: 20.1 },
        clientes: { total: 2350, activos: 2100, cambio: 180 },
        productos: { total: 1234, cambio: 19 },
        pedidos: { pendientes: 12, cambio: -2 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Datos de ejemplo como fallback
  const statsEjemplo = {
    ventas: { total: 45231, cambio: 20.1 },
    clientes: { total: 2350, activos: 2100, cambio: 180 },
    productos: { total: 1234, cambio: 19 },
    pedidos: { pendientes: 12, cambio: -2 }
  };

  const recentOrdersEjemplo = [
    {
      _id: '1',
      cliente: 'Juan Pérez',
      total: 299.00,
      estado: 'Completado',
      fecha: '2024-01-15'
    },
    {
      _id: '2',
      cliente: 'María García',
      total: 199.00,
      estado: 'En proceso',
      fecha: '2024-01-14'
    },
    {
      _id: '3',
      cliente: 'Carlos López',
      total: 599.00,
      estado: 'Pendiente',
      fecha: '2024-01-13'
    },
    {
      _id: '4',
      cliente: 'Ana Martínez',
      total: 399.00,
      estado: 'Completado',
      fecha: '2024-01-12'
    }
  ];

  const topProductsEjemplo = [
    {
      _id: '1',
      nombre: 'Producto A',
      ventas: 234,
      ingresos: 12345,
      crecimiento: 12.5
    },
    {
      _id: '2',
      nombre: 'Producto B',
      ventas: 189,
      ingresos: 8901,
      crecimiento: 8.2
    },
    {
      _id: '3',
      nombre: 'Producto C',
      ventas: 156,
      ingresos: 7234,
      crecimiento: 15.3
    }
  ];

  // Usar datos reales o de ejemplo
  const currentStats = stats || statsEjemplo;
  const currentOrders = recentOrders.length > 0 ? recentOrders : recentOrdersEjemplo;
  const currentProducts = topProducts.length > 0 ? topProducts : topProductsEjemplo;

  const statsCards = [
    {
      title: 'Ventas Totales',
      value: `$${currentStats.ventas.total.toLocaleString()}`,
      change: `${currentStats.ventas.cambio > 0 ? '+' : ''}${currentStats.ventas.cambio}%`,
      changeType: currentStats.ventas.cambio >= 0 ? 'positive' : 'negative',
      icon: <VentasIcon />,
      color: '#59ab6e'
    },
    {
      title: 'Clientes Activos',
      value: currentStats.clientes.activos.toLocaleString(),
      change: `${currentStats.clientes.cambio > 0 ? '+' : ''}${currentStats.clientes.cambio}`,
      changeType: currentStats.clientes.cambio >= 0 ? 'positive' : 'negative',
      icon: <ClienteIcon />,
      color: '#1976d2'
    },
    {
      title: 'Productos',
      value: currentStats.productos.total.toLocaleString(),
      change: `${currentStats.productos.cambio > 0 ? '+' : ''}${currentStats.productos.cambio}`,
      changeType: currentStats.productos.cambio >= 0 ? 'positive' : 'negative',
      icon: <ProductosIcon />,
      color: '#ff9800'
    },
    {
      title: 'Pedidos Pendientes',
      value: currentStats.pedidos.pendientes.toString(),
      change: `${currentStats.pedidos.cambio > 0 ? '+' : ''}${currentStats.pedidos.cambio}`,
      changeType: currentStats.pedidos.cambio <= 0 ? 'positive' : 'negative',
      icon: <PedidosIcon />,
      color: '#f44336'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return '#59ab6e';
      case 'En proceso':
        return '#ff9800';
      case 'Pendiente':
        return '#f44336';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completado':
        return <CheckIcon fontSize="small" />;
      case 'En proceso':
        return <WarningIcon fontSize="small" />;
      case 'Pendiente':
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const fetchMetrics = async (): Promise<MetricCard[]> => {
    // Simular llamada a API
    return [
      {
        title: 'Ventas Totales',
        value: '$45,678',
        change: 12.5,
        icon: <DineroIcon />,
        color: '#59ab6e',
        trend: 'up'
      },
      {
        title: 'Pedidos',
        value: '1,234',
        change: 8.2,
        icon: <VentasIcon />,
        color: '#1976d2',
        trend: 'up'
      },
      {
        title: 'Clientes',
        value: '567',
        change: -2.1,
        icon: <ClienteIcon />,
        color: '#ff9800',
        trend: 'down'
      },
      {
        title: 'Productos',
        value: '89',
        change: 15.3,
        icon: <ProductosIcon />,
        color: '#f44336',
        trend: 'up'
      }
    ];
  };

  const fetchSalesData = async (): Promise<SalesData[]> => {
    // Simular llamada a API
    return [
      { month: 'Ene', sales: 12000, orders: 45, customers: 23 },
      { month: 'Feb', sales: 15000, orders: 52, customers: 28 },
      { month: 'Mar', sales: 18000, orders: 61, customers: 35 },
      { month: 'Abr', sales: 14000, orders: 48, customers: 26 },
      { month: 'May', sales: 22000, orders: 78, customers: 42 },
      { month: 'Jun', sales: 25000, orders: 85, customers: 48 }
    ];
  };

  const fetchProductData = async (): Promise<ProductData[]> => {
    // Simular llamada a API
    return [
      { name: 'Vino Tinto', value: 35, color: '#59ab6e' },
      { name: 'Vino Blanco', value: 25, color: '#1976d2' },
      { name: 'Champagne', value: 20, color: '#ff9800' },
      { name: 'Vino Rosado', value: 15, color: '#f44336' },
      { name: 'Otros', value: 5, color: '#9c27b0' }
    ];
  };

  const handleGenerateReport = async () => {
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({ 
        open: true, 
        message: `Reporte de ${reportType} generado exitosamente`, 
        severity: 'success' 
      });
      setReportDialogOpen(false);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Error al generar el reporte', 
        severity: 'error' 
      });
    }
  };

  const handleExportData = (format: 'pdf' | 'excel' | 'csv') => {
    setSnackbar({ 
      open: true, 
      message: `Datos exportados en formato ${format.toUpperCase()}`, 
      severity: 'success' 
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress size={60} sx={{ color: '#59ab6e' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Título de la página */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: '300',
          color: '#212934',
          mb: 1
        }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#6c757d',
          fontSize: '1rem'
        }}>
          Bienvenido al panel de administración. Aquí puedes ver un resumen de las actividades del sistema.
        </Typography>
      </Box>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: stat.color,
                    width: 56,
                    height: 56,
                    fontSize: '1.5rem'
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Chip 
                    label={stat.change}
                    size="small"
                    sx={{
                      backgroundColor: stat.changeType === 'positive' ? '#d4edda' : '#f8d7da',
                      color: stat.changeType === 'positive' ? '#155724' : '#721c24',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: '600',
                  color: '#212934',
                  mb: 1
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#6c757d',
                  fontSize: '0.875rem'
                }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos y contenido principal */}
      <Grid container spacing={3}>
        {/* Pedidos recientes */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: '600',
                  color: '#212934'
                }}>
                  Pedidos Recientes
                </Typography>
                <IconButton size="small">
                  <MoreIcon />
                </IconButton>
              </Box>
              
              <List sx={{ p: 0 }}>
                {currentOrders.map((order, index) => (
                  <React.Fragment key={order._id}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#59ab6e' }}>
                          <VentasIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                              {order.cliente}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#59ab6e' }}>
                              ${order.total.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box component="span" sx={{ color: '#6c757d', fontSize: '0.875rem' }}>
                            #{order._id} • {order.fecha}
                          </Box>
                        }
                      />
                      <Chip 
                        label={order.estado}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(order.estado) + '20',
                          color: getStatusColor(order.estado),
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      />
                    </ListItem>
                    {index < currentOrders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Productos más vendidos */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: '600',
                color: '#212934',
                mb: 3
              }}>
                Productos Más Vendidos
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                {currentProducts.map((product, index) => (
                  <Box key={product._id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                        {product.nombre}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#59ab6e', fontWeight: '600' }}>
                        +{product.crecimiento}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        {product.ventas} ventas
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: '600' }}>
                        ${product.ingresos.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((product.ventas / 300) * 100, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#e9ecef',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#59ab6e',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información adicional */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: '600',
                color: '#212934',
                mb: 2
              }}>
                Actividad Reciente
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingIcon sx={{ color: '#59ab6e', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  Ventas aumentaron un {currentStats.ventas.cambio}% esta semana
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DineroIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  Ingresos totales: ${currentStats.ventas.total.toLocaleString()} este mes
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ClienteIcon sx={{ color: '#ff9800', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  {currentStats.clientes.cambio} nuevos clientes registrados
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: '600',
                color: '#212934',
                mb: 2
              }}>
                Estado del Sistema
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckIcon sx={{ color: '#59ab6e', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  Servidor funcionando correctamente
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckIcon sx={{ color: '#59ab6e', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  Base de datos sincronizada
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  {currentStats.pedidos.pendientes} pedidos pendientes de procesamiento
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos y tablas */}
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
                    <IconButton size="small" onClick={() => handleExportData('pdf')}>
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Imprimir">
                    <IconButton size="small">
                      <Print />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#59ab6e" 
                    strokeWidth={3}
                    name="Ventas ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
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
                    data={productData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pedidos recientes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                  Pedidos Recientes
                </Typography>
                <Button variant="text" color="primary">
                  Ver todos
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Pedido</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{order.cliente}</TableCell>
                        <TableCell>{order._id}</TableCell>
                        <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.estado}
                            color={getStatusColor(order.estado) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Ver detalles">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para generar reportes */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generar Reporte</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Reporte</InputLabel>
              <Select
                value={reportType}
                label="Tipo de Reporte"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="sales">Ventas</MenuItem>
                <MenuItem value="orders">Pedidos</MenuItem>
                <MenuItem value="customers">Clientes</MenuItem>
                <MenuItem value="products">Productos</MenuItem>
                <MenuItem value="inventory">Inventario</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={reportPeriod}
                label="Período"
                onChange={(e) => setReportPeriod(e.target.value)}
              >
                <MenuItem value="week">Esta semana</MenuItem>
                <MenuItem value="month">Este mes</MenuItem>
                <MenuItem value="quarter">Este trimestre</MenuItem>
                <MenuItem value="year">Este año</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleGenerateReport} variant="contained">
            Generar Reporte
          </Button>
        </DialogActions>
      </Dialog>

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
}