// app/admin/dashboard/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
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

} from '@mui/material';
import { Grid } from '@mui/material';
import {
  ShoppingCart as VentasIcon,
  People as ClienteIcon,
  Inventory as ProductosIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

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
}

interface Venta {
  _id: string;
  codigoVenta: string;
  cliente: {
    nombre: string;
  };
  total: number;
  fecha: string;
  estado: 'en proceso' | 'cancelada' | 'completada';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentVentas, setRecentVentas] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos desde tu API
      const [ventasRes, clientesRes, productosRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ventas`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos`)
      ]);

      if (ventasRes.ok && clientesRes.ok && productosRes.ok) {
        const ventasData = await ventasRes.json();
        const clientesData = await clientesRes.json();
        const productosData = await productosRes.json();

        // Asegurarnos de que los datos tienen la estructura esperada
        const ventasArray = ventasData.data || ventasData || [];
        const clientesArray = clientesData.data || clientesData || [];
        const productosArray = productosData.data || productosData || [];

        // Procesar datos para el dashboard
        const ventasCompletadas = ventasArray.filter((v: Venta) => v.estado === 'completada');
        const clientesActivos = clientesArray.filter((c: any) => c.activo);
        const ventasRecientes = [...ventasArray]
          .sort((a: Venta, b: Venta) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 5);

        // Calcular estadísticas
        const totalVentas = ventasCompletadas.reduce((sum: number, v: Venta) => sum + v.total, 0);

        setStats({
          ventas: { 
            total: totalVentas, 
            cambio: 12.5 // Esto debería calcularse comparando con el período anterior
          },
          clientes: { 
            total: clientesArray.length, 
            activos: clientesActivos.length, 
            cambio: 8.2 // Esto debería calcularse comparando con el período anterior
          },
          productos: { 
            total: productosArray.length, 
            cambio: 5.3 // Esto debería calcularse comparando con el período anterior
          }
        });

        setRecentVentas(ventasRecientes);
      } else {
        throw new Error('Error al cargar datos');
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      // Datos de ejemplo si el backend falla
      setStats({
        ventas: { total: 0, cambio: 0 },
        clientes: { total: 0, activos: 0, cambio: 0 },
        productos: { total: 0, cambio: 0 }
      });
      setRecentVentas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada': return '#59ab6e';
      case 'en proceso': return '#ff9800';
      case 'cancelada': return '#f44336';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completada': return 'Completada';
      case 'en proceso': return 'En proceso';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#59ab6e' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Título de la página */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: '300', color: '#212934', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#6c757d', fontSize: '1rem' }}>
          Resumen de las actividades del sistema
        </Typography>
      </Box>

      {/* Tarjetas de estadísticas con redirección */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card de Ventas Totales - Redirige a Reportes */}
        <Grid item xs={12} sm={6} md={4}>
          <Link href="/admin/reportes">
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                cursor: 'pointer'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: '#59ab6e',
                    width: 56,
                    height: 56,
                    fontSize: '1.5rem'
                  }}>
                    <VentasIcon />
                  </Avatar>
                  <Chip 
                    label={`${(stats?.ventas.cambio ?? 0) > 0 ? '+' : ''}${stats?.ventas.cambio ?? 0}%`}
                    size="small"
                    sx={{
                      backgroundColor: (stats?.ventas.cambio ?? 0) >= 0 ? '#d4edda' : '#f8d7da',
                      color: (stats?.ventas.cambio ?? 0) >= 0 ? '#155724' : '#721c24',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: '600', color: '#212934', mb: 1 }}>
                  ${stats?.ventas.total.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.875rem' }}>
                  Ventas Totales
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>

        {/* Card de Clientes Activos - Redirige a Clientes */}
        <Grid item xs={12} sm={6} md={4}>
          <Link href="/admin/clientes">
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                cursor: 'pointer'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: '#1976d2',
                    width: 56,
                    height: 56,
                    fontSize: '1.5rem'
                  }}>
                    <ClienteIcon />
                  </Avatar>
                  <Chip 
                    label={`${(stats?.clientes.cambio ?? 0) > 0 ? '+' : ''}${stats?.clientes.cambio ?? 0}%`}
                    size="small"
                    sx={{
                      backgroundColor: (stats?.clientes.cambio ?? 0) >= 0 ? '#d4edda' : '#f8d7da',
                      color: (stats?.clientes.cambio ?? 0) >= 0 ? '#155724' : '#721c24',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: '600', color: '#212934', mb: 1 }}>
                  {stats?.clientes.activos.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.875rem' }}>
                  Clientes Activos
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>

        {/* Card de Productos - Redirige a Productos */}
        <Grid item xs={12} sm={6} md={4}>
          <Link href="/admin/productos">
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                cursor: 'pointer'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: '#ff9800',
                    width: 56,
                    height: 56,
                    fontSize: '1.5rem'
                  }}>
                    <ProductosIcon />
                  </Avatar>
                  <Chip 
                    label={`${(stats?.productos.cambio ?? 0) > 0 ? '+' : ''}${stats?.productos.cambio ?? 0}%`}
                    size="small"
                    sx={{
                      backgroundColor: (stats?.productos.cambio ?? 0) >= 0 ? '#d4edda' : '#f8d7da',
                      color: (stats?.productos.cambio ?? 0) >= 0 ? '#155724' : '#721c24',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: '600', color: '#212934', mb: 1 }}>
                  {stats?.productos.total.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.875rem' }}>
                  Productos
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>

      {/* Sección de Ventas Recientes */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: '600', color: '#212934', mb: 3 }}>
                Ventas Recientes
              </Typography>
              
              {recentVentas.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentVentas.map((venta, index) => (
                    <React.Fragment key={venta._id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getStatusColor(venta.estado) }}>
                            {venta.estado === 'completada' ? <CheckIcon /> : <WarningIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                                {venta.cliente.nombre}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: '600', color: '#59ab6e' }}>
                                ${venta.total.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box component="span" sx={{ color: '#6c757d', fontSize: '0.875rem' }}>
                              {venta.codigoVenta} • {new Date(venta.fecha).toLocaleDateString()}
                            </Box>
                          }
                        />
                        <Chip 
                          label={getStatusLabel(venta.estado)}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(venta.estado) + '20',
                            color: getStatusColor(venta.estado),
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}
                        />
                      </ListItem>
                      {index < recentVentas.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" sx={{ color: '#6c757d', textAlign: 'center', py: 4 }}>
                  No hay ventas recientes
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}