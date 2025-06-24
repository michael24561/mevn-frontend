// src/app/admin/proveedores/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Snackbar,
  Alert,
  Avatar,
  Chip,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  LinearProgress,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Web as WebIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  AccountBalance as BankIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';

interface Proveedor {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  ruc: string;
  sitioWeb?: string;
  contacto: string;
  estado: 'activo' | 'inactivo';
  fechaRegistro: string;
  productosSuministrados: number;
  ultimaCompra?: string;
  calificacion: number;
}

const ProveedoresPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterPais, setFilterPais] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: '',
    ruc: '',
    sitioWeb: '',
    contacto: '',
    estado: 'activo' as 'activo' | 'inactivo'
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/proveedores');
      if (response.ok) {
        const data = await response.json();
        setProveedores(data);
      } else {
        throw new Error('Error al cargar proveedores');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al cargar proveedores', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (proveedor?: Proveedor) => {
    if (proveedor) {
      setSelectedProveedor(proveedor);
      setFormData({
        nombre: proveedor.nombre,
        email: proveedor.email,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
        ciudad: proveedor.ciudad,
        codigoPostal: proveedor.codigoPostal,
        pais: proveedor.pais,
        ruc: proveedor.ruc,
        sitioWeb: proveedor.sitioWeb || '',
        contacto: proveedor.contacto,
        estado: proveedor.estado
      });
    } else {
      setSelectedProveedor(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        pais: '',
        ruc: '',
        sitioWeb: '',
        contacto: '',
        estado: 'activo'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProveedor(null);
  };

  const handleSubmit = async () => {
    try {
      const url = selectedProveedor 
        ? `http://localhost:5000/api/proveedores/${selectedProveedor._id}`
        : 'http://localhost:5000/api/proveedores';
      
      const method = selectedProveedor ? 'PUT' : 'POST';
      
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
          message: selectedProveedor ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente', 
          severity: 'success' 
        });
        handleCloseDialog();
        fetchProveedores();
      } else {
        throw new Error('Error en la operación');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al guardar el proveedor', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProveedor) return;

    try {
      const response = await fetch(`http://localhost:5000/api/proveedores/${selectedProveedor._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Proveedor eliminado exitosamente', severity: 'success' });
        setDeleteDialogOpen(false);
        setSelectedProveedor(null);
        fetchProveedores();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el proveedor', severity: 'error' });
    }
  };

  const handleViewProveedor = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setViewDialogOpen(true);
  };

  const filteredProveedores = proveedores.filter(proveedor => {
    const matchesSearch = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proveedor.ruc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filterEstado || proveedor.estado === filterEstado;
    const matchesPais = !filterPais || proveedor.pais === filterPais;
    
    return matchesSearch && matchesEstado && matchesPais;
  });

  const getCalificacionColor = (calificacion: number) => {
    if (calificacion >= 4.5) return 'success';
    if (calificacion >= 3.5) return 'warning';
    return 'error';
  };

  const getCalificacionText = (calificacion: number) => {
    if (calificacion >= 4.5) return 'Excelente';
    if (calificacion >= 3.5) return 'Bueno';
    return 'Regular';
  };

  const paises = ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'México', 'Perú', 'Uruguay', 'Venezuela'];

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
          Gestión de Proveedores
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
        >
          Nuevo Proveedor
        </Button>
      </Box>

      {/* Filtros y búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar proveedores..."
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="País"
                value={filterPais}
                onChange={(e) => setFilterPais(e.target.value)}
              >
                <option value="">Todos</option>
                {paises.map((pais) => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchProveedores}
              >
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de proveedores */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>RUC</TableCell>
                  <TableCell align="center">Productos</TableCell>
                  <TableCell align="center">Calificación</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                            {proveedor.nombre}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Registrado: {new Date(proveedor.fechaRegistro).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">{proveedor.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">{proveedor.telefono}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{proveedor.ciudad}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {proveedor.pais}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {proveedor.ruc}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${proveedor.productosSuministrados} productos`}
                        color="primary"
                        size="small"
                        icon={<LocalShippingIcon />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Chip
                          label={`${proveedor.calificacion}/5.0`}
                          color={getCalificacionColor(proveedor.calificacion) as any}
                          size="small"
                        />
                        <Typography variant="caption" color="textSecondary">
                          {getCalificacionText(proveedor.calificacion)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={proveedor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        color={proveedor.estado === 'activo' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewProveedor(proveedor)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(proveedor)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => {
                              setSelectedProveedor(proveedor);
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

      {/* Dialog para crear/editar proveedor */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre de la empresa"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="RUC"
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Persona de contacto"
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="País"
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                required
              >
                {paises.map((pais) => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </TextField>
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código Postal"
                value={formData.codigoPostal}
                onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sitio Web (opcional)"
                value={formData.sitioWeb}
                onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                placeholder="https://www.ejemplo.com"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.estado === 'activo'}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      estado: e.target.checked ? 'activo' : 'inactivo' 
                    })}
                  />
                }
                label="Proveedor activo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedProveedor ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles del proveedor */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Detalles del Proveedor
        </DialogTitle>
        <DialogContent>
          {selectedProveedor && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: '#1976d2' }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>
                    {selectedProveedor.nombre}
                  </Typography>
                  <Chip
                    label={selectedProveedor.estado === 'activo' ? 'Proveedor Activo' : 'Proveedor Inactivo'}
                    color={selectedProveedor.estado === 'activo' ? 'success' : 'default'}
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
                  <Typography variant="body1">{selectedProveedor.email}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>Teléfono:</Typography>
                  </Box>
                  <Typography variant="body1">{selectedProveedor.telefono}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>Dirección:</Typography>
                  </Box>
                  <Typography variant="body1">
                    {selectedProveedor.direccion}, {selectedProveedor.ciudad}, {selectedProveedor.pais} {selectedProveedor.codigoPostal}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BankIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>RUC:</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {selectedProveedor.ruc}
                  </Typography>
                </Grid>

                {selectedProveedor.sitioWeb && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <WebIcon sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>Sitio Web:</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#1976d2' }}>
                      {selectedProveedor.sitioWeb}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: '600' }}>
                    Información de Suministro
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">Productos suministrados:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: '600', color: '#1976d2' }}>
                      {selectedProveedor.productosSuministrados}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">Calificación:</Typography>
                    <Chip
                      label={`${selectedProveedor.calificacion}/5.0 - ${getCalificacionText(selectedProveedor.calificacion)}`}
                      color={getCalificacionColor(selectedProveedor.calificacion) as any}
                      size="small"
                    />
                  </Box>
                  {selectedProveedor.ultimaCompra && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Última compra:</Typography>
                      <Typography variant="body2">
                        {new Date(selectedProveedor.ultimaCompra).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
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
            ¿Estás seguro de que quieres eliminar el proveedor "{selectedProveedor?.nombre}"?
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

export default ProveedoresPage;