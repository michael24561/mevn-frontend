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
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  Grid,
  InputAdornment,
  Avatar,
  LinearProgress,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';
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
  Person as PersonIcon,
  Work as WorkIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

interface Empleado {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  cargo: string;
  departamento: string;
  salario: number;
  fechaContratacion: string;
  estado: 'activo' | 'inactivo';
  supervisor?: string;
}

const EmpleadosPage: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    cargo: '',
    departamento: '',
    salario: '',
    supervisor: '',
    estado: 'activo' as 'activo' | 'inactivo'
  });

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      // Simular llamada a API
      const mockEmpleados: Empleado[] = [
        {
          _id: '1',
          nombre: 'Juan Pérez',
          email: 'juan.perez@empresa.com',
          telefono: '+1 234 567 890',
          direccion: 'Calle Principal 123',
          ciudad: 'Madrid',
          codigoPostal: '28001',
          cargo: 'Desarrollador Senior',
          departamento: 'Tecnología',
          salario: 45000,
          fechaContratacion: '2023-01-15',
          estado: 'activo'
        },
        {
          _id: '2',
          nombre: 'María García',
          email: 'maria.garcia@empresa.com',
          telefono: '+1 234 567 891',
          direccion: 'Avenida Central 456',
          ciudad: 'Barcelona',
          codigoPostal: '08001',
          cargo: 'Diseñadora UX',
          departamento: 'Diseño',
          salario: 38000,
          fechaContratacion: '2023-03-20',
          estado: 'activo'
        },
        {
          _id: '3',
          nombre: 'Carlos López',
          email: 'carlos.lopez@empresa.com',
          telefono: '+1 234 567 892',
          direccion: 'Plaza Mayor 789',
          ciudad: 'Valencia',
          codigoPostal: '46001',
          cargo: 'Gerente de Proyectos',
          departamento: 'Gestión',
          salario: 55000,
          fechaContratacion: '2022-11-10',
          estado: 'activo'
        }
      ];
      setEmpleados(mockEmpleados);
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al cargar empleados', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (empleado?: Empleado) => {
    if (empleado) {
      setSelectedEmpleado(empleado);
      setFormData({
        nombre: empleado.nombre,
        email: empleado.email,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        ciudad: empleado.ciudad,
        codigoPostal: empleado.codigoPostal,
        cargo: empleado.cargo,
        departamento: empleado.departamento,
        salario: empleado.salario.toString(),
        supervisor: empleado.supervisor || '',
        estado: empleado.estado
      });
    } else {
      setSelectedEmpleado(null);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        cargo: '',
        departamento: '',
        salario: '',
        supervisor: '',
        estado: 'activo'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmpleado(null);
  };

  const handleSubmit = async () => {
    try {
      // Simular operación de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({ 
        open: true, 
        message: selectedEmpleado ? 'Empleado actualizado exitosamente' : 'Empleado creado exitosamente', 
        severity: 'success' 
      });
      handleCloseDialog();
      fetchEmpleados();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error al guardar el empleado', 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedEmpleado) return;

    try {
      // Simular eliminación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({ open: true, message: 'Empleado eliminado exitosamente', severity: 'success' });
      setDeleteDialogOpen(false);
      setSelectedEmpleado(null);
      fetchEmpleados();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el empleado', severity: 'error' });
    }
  };

  const handleViewEmpleado = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setViewDialogOpen(true);
  };

  const filteredEmpleados = empleados.filter(empleado => {
    const matchesSearch = empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCargo = !filterCargo || empleado.cargo === filterCargo;
    const matchesEstado = !filterEstado || empleado.estado === filterEstado;
    
    return matchesSearch && matchesCargo && matchesEstado;
  });

  const cargos = ['Desarrollador Senior', 'Diseñadora UX', 'Gerente de Proyectos', 'Analista', 'Tester'];
  const departamentos = ['Tecnología', 'Diseño', 'Gestión', 'Marketing', 'Ventas'];

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
          Gestión de Empleados
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
        >
          Nuevo Empleado
        </Button>
      </Box>

      {/* Filtros y búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar empleados..."
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
                label="Cargo"
                value={filterCargo}
                onChange={(e) => setFilterCargo(e.target.value)}
              >
                <option value="">Todos</option>
                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </TextField>
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
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchEmpleados}
              >
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de empleados */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell align="right">Salario</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmpleados.map((empleado) => (
                  <TableRow key={empleado._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
                            {empleado.nombre}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Contratado: {new Date(empleado.fechaContratacion).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">{empleado.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2">{empleado.telefono}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<WorkIcon />}
                        label={empleado.cargo}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{empleado.departamento}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: '600', color: '#59ab6e' }}>
                        ${empleado.salario.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={empleado.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        color={empleado.estado === 'activo' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewEmpleado(empleado)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDialog(empleado)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => {
                              setSelectedEmpleado(empleado);
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

      {/* Dialog para crear/editar empleado */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salario"
                type="number"
                value={formData.salario}
                onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                required
              >
                {cargos.map((cargo) => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                required
              >
                {departamentos.map((depto) => (
                  <option key={depto} value={depto}>{depto}</option>
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
                label="Empleado activo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedEmpleado ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el empleado "{selectedEmpleado?.nombre}"?
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

export default EmpleadosPage; 