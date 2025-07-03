'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Tooltip,
  InputAdornment,
  Avatar,
  LinearProgress,
  Divider,
  Chip,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaRegistro: string;
  activo: boolean;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState<{ 
    open: boolean; 
    message: string; 
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({ 
    open: false, 
    message: '', 
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    activo: true
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        throw new Error('Error al cargar clientes');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al cargar clientes', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (cliente?: Cliente) => {
    if (cliente) {
      setSelectedCliente(cliente);
      setFormData({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        activo: cliente.activo
      });
    } else {
      setSelectedCliente(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        activo: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCliente(null);
  };

  const handleSubmit = async () => {
    try {
      const url = selectedCliente 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${selectedCliente._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}`;
      
      const method = selectedCliente ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({ 
          open: true, 
          message: selectedCliente ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente', 
          severity: 'success' 
        });
        handleCloseDialog();
        fetchClientes();
      } else {
        throw new Error('Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al guardar el cliente', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedCliente) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${selectedCliente._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Cliente eliminado exitosamente', severity: 'success' });
        setDeleteDialogOpen(false);
        setSelectedCliente(null);
        fetchClientes();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el cliente', severity: 'error' });
    }
  };

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setViewDialogOpen(true);
  };

  const handleToggleActive = async (cliente: Cliente) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clientes/${cliente._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: !cliente.activo })
      });

      if (response.ok) {
        setClientes(prev => prev.map(c => 
          c._id === cliente._id ? { ...c, activo: !c.activo } : c
        ));
        setSnackbar({ 
          open: true, 
          message: `Cliente ${!cliente.activo ? 'activado' : 'desactivado'} exitosamente`, 
          severity: 'success' 
        });
      } else {
        throw new Error('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al cambiar estado del cliente', 
        severity: 'error' 
      });
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    return cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: '600' }}>
          Gestión de Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* Filtros y búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={10}>
              <TextField
                fullWidth
                placeholder="Buscar clientes por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchClientes}
              >
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: cliente.activo ? '#59ab6e' : '#f44336' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                            {cliente.nombre}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Registrado: {new Date(cliente.fechaRegistro).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">{cliente.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">{cliente.telefono}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{cliente.direccion}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={cliente.activo ? 'Activo' : 'Inactivo'}
                        sx={{
                          backgroundColor: cliente.activo ? '#4caf50' : '#f44336',
                          color: 'white',
                          fontWeight: 'bold',
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewCliente(cliente)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(cliente)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => {
                              setSelectedCliente(cliente);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar cliente */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    color="primary"
                  />
                }
                label="Cliente activo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCliente ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles del cliente */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Detalles del Cliente
        </DialogTitle>
        <DialogContent>
          {selectedCliente && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: selectedCliente.activo ? '#4caf50' : '#f44336' 
                }}>
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    {selectedCliente.nombre}
                  </Typography>
                  <Chip
                    label={selectedCliente.activo ? 'Activo' : 'Inactivo'}
                    sx={{
                      backgroundColor: selectedCliente.activo ? '#4caf50' : '#f44336',
                      color: 'white',
                      fontWeight: 'bold',
                      mt: 1
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>Email:</Typography>
                  </Box>
                  <Typography variant="body1">{selectedCliente.email}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>Teléfono:</Typography>
                  </Box>
                  <Typography variant="body1">{selectedCliente.telefono}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>Dirección:</Typography>
                  </Box>
                  <Typography variant="body1">{selectedCliente.direccion}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Registrado: {new Date(selectedCliente.fechaRegistro).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el cliente "{selectedCliente?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
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
};

export default ClientesPage;