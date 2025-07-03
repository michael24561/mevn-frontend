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
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface Proveedor {
  _id: string;
  nombre: string;
  telefono: string;
  contacto: string;
  email: string;
  estado: boolean;
}

const ProveedoresPage: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    contacto: '',
    email: '',
    estado: true
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/proveedores`);
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
        telefono: proveedor.telefono,
        contacto: proveedor.contacto,
        email: proveedor.email,
        estado: proveedor.estado
      });
    } else {
      setSelectedProveedor(null);
      setFormData({
        nombre: '',
        telefono: '',
        contacto: '',
        email: '',
        estado: true
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
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/proveedores/${selectedProveedor._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/proveedores`;
      
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/proveedores/${selectedProveedor._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Proveedor eliminado exitosamente', severity: 'success' });
        fetchProveedores();
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el proveedor', severity: 'error' });
    }
  };

  const filteredProveedores = proveedores.filter(proveedor => {
    return proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Proveedores
      </Typography>

      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={() => handleOpenDialog()}
        sx={{ mb: 3 }}
      >
        Nuevo Proveedor
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
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
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Proveedor</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProveedores.map((proveedor) => (
              <TableRow key={proveedor._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <BusinessIcon />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                      {proveedor.nombre}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {proveedor.contacto}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {proveedor.telefono}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {proveedor.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(proveedor)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setSelectedProveedor(proveedor);
                        if (confirm(`¿Estás seguro de eliminar el proveedor ${proveedor.nombre}?`)) {
                          handleDelete();
                        }
                      }}
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de la empresa"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Persona de contacto"
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                sx={{ mb: 2 }}
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