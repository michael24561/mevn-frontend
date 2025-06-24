'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, CircularProgress,
  Avatar, Chip, Card, CardContent, Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Category as CategoryIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

interface Categoria {
  _id: string;
  nombre: string;
  descripcion: string;
  imagen?: string;
  productosCount?: number;
  activa: boolean;
  createdAt: string;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<Categoria | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formState, setFormState] = useState({
    nombre: '',
    descripcion: '',
    activa: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/categorias');
      
      if (!res.ok) {
        throw new Error('Error al cargar categorías');
      }

      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Error al cargar', 
        severity: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleOpenDialog = (categoria: Categoria | null) => {
    if (categoria) {
      setCurrentCategoria(categoria);
      setFormState({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        activa: categoria.activa
      });
    } else {
      setCurrentCategoria(null);
      setFormState({
        nombre: '',
        descripcion: '',
        activa: true
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = currentCategoria 
        ? `http://localhost:5000/api/categorias/${currentCategoria._id}`
        : 'http://localhost:5000/api/categorias';
      const method = currentCategoria ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar la categoría');
      }

      setSnackbar({ 
        open: true, 
        message: currentCategoria ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente', 
        severity: 'success' 
      });
      setOpenDialog(false);
      await loadCategorias();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Error al guardar', 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/categorias/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar la categoría');
      }

      setSnackbar({ open: true, message: 'Categoría eliminada exitosamente', severity: 'success' });
      await loadCategorias();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Error al eliminar', 
        severity: 'error' 
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setCategorias(prev => prev.map(cat => 
        cat._id === id 
          ? { ...cat, activa: !cat.activa }
          : cat
      ));
      setSnackbar({ open: true, message: 'Estado actualizado', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar estado', severity: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Header de la página */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: '300',
            color: '#212934',
            mb: 1
          }}>
            Gestión de Categorías
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#6c757d',
            fontSize: '1rem'
          }}>
            Administra las categorías de productos del sistema
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null)}
          sx={{
            backgroundColor: '#59ab6e',
            '&:hover': {
              backgroundColor: '#4a8c5a',
            },
            px: 3,
            py: 1.5
          }}
        >
          Nueva Categoría
        </Button>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#59ab6e',
            color: 'white',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>
                    {categorias.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Categorías
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#1976d2',
            color: 'white',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>
                    {categorias.filter(c => c.activa).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Categorías Activas
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#ff9800',
            color: 'white',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>
                    {categorias.reduce((sum, cat) => sum + (cat.productosCount || 0), 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Productos
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#f44336',
            color: 'white',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: '600', mb: 1 }}>
                    {categorias.filter(c => !c.activa).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Categorías Inactivas
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de categorías */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: '600', color: '#212934' }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#212934' }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#212934' }}>Productos</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#212934' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#212934' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#212934' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria._id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: '#59ab6e', 
                          mr: 2,
                          width: 40,
                          height: 40
                        }}>
                          <CategoryIcon />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                          {categoria.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        {categoria.descripcion}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={categoria.productosCount || 0}
                        size="small"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: '600'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={categoria.activa ? 'Activa' : 'Inactiva'}
                        size="small"
                        onClick={() => handleToggleStatus(categoria._id)}
                        sx={{
                          backgroundColor: categoria.activa ? '#d4edda' : '#f8d7da',
                          color: categoria.activa ? '#155724' : '#721c24',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: categoria.activa ? '#c3e6cb' : '#f5c6cb',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#6c757d' }}>
                        {new Date(categoria.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDialog(categoria)}
                          sx={{ color: '#1976d2' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => handleDelete(categoria._id)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar categoría */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: '600', color: '#212934' }}>
            {currentCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Nombre de la categoría"
              value={formState.nombre}
              onChange={(e) => setFormState(prev => ({ ...prev, nombre: e.target.value }))}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Descripción"
              value={formState.descripcion}
              onChange={(e) => setFormState(prev => ({ ...prev, descripcion: e.target.value }))}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ color: '#6c757d' }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: '#59ab6e',
                '&:hover': {
                  backgroundColor: '#4a8c5a',
                }
              }}
            >
              {isSubmitting ? 'Guardando...' : (currentCategoria ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}