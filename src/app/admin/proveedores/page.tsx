// src/app/admin/proveedores/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Proveedor {
  _id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState<Proveedor | null>(null);
  const [formState, setFormState] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: ''
  });
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProveedores = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/proveedores');
      
      if (!res.ok) {
        throw new Error('Error al cargar proveedores');
      }

      const data = await res.json();
      setProveedores(data);
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
    loadProveedores();
  }, []);

  const handleOpenDialog = (proveedor: Proveedor | null) => {
    setCurrentProveedor(proveedor);
    setFormState(proveedor ? {
      nombre: proveedor.nombre,
      contacto: proveedor.contacto || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || ''
    } : {
      nombre: '',
      contacto: '',
      telefono: '',
      email: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = currentProveedor 
        ? `http://localhost:5000/api/proveedores/${currentProveedor._id}`
        : 'http://localhost:5000/api/proveedores';
      const method = currentProveedor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar el proveedor');
      }

      setSnackbar({ 
        open: true, 
        message: currentProveedor ? 'Proveedor actualizado' : 'Proveedor creado', 
        severity: 'success' 
      });
      setOpenDialog(false);
      await loadProveedores();
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

  const handleDelete = async (id: string, nombreProveedor: string) => {
  if (!confirm(`¿Estás seguro de eliminar al proveedor "${nombreProveedor}"?`)) return;
  
  try {
    const response = await fetch(`http://localhost:5000/api/proveedores/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      // Si hay productos asociados, el backend devuelve error 400
      if (data.error && data.error.includes('productos asociados')) {
        const productosLista = data.productos ? 
          `Productos asociados: ${data.productos.join(', ')}` : '';
        
        setSnackbar({
          open: true,
          message: `${data.error} ${productosLista}`,
          severity: 'error'
        });
        return;
      }
      throw new Error(data.error || 'Error al eliminar proveedor');
    }

    setSnackbar({
      open: true,
      message: data.mensaje || 'Proveedor eliminado correctamente',
      severity: 'success'
    });
    await loadProveedores();
  } catch (error) {
    console.error('Error:', error);
    setSnackbar({
      open: true,
      message: error instanceof Error ? error.message : 'Error al eliminar proveedor',
      severity: 'error'
    });
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Proveedores
      </Typography>

      <Button 
        variant="contained" 
        startIcon={<Add />} 
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 3 }}
      >
        Nuevo Proveedor
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((proveedor) => (
              <TableRow key={proveedor._id}>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.contacto || '-'}</TableCell>
                <TableCell>{proveedor.telefono || '-'}</TableCell>
                <TableCell>{proveedor.email || '-'}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleOpenDialog(proveedor)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(proveedor._id, proveedor.nombre)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nombre"
              name="nombre"
              fullWidth
              variant="outlined"
              value={formState.nombre}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Persona de contacto"
              name="contacto"
              fullWidth
              variant="outlined"
              value={formState.contacto}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Teléfono"
              name="telefono"
              fullWidth
              variant="outlined"
              value={formState.telefono}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              value={formState.email}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDialog} 
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting 
                ? 'Guardando...' 
                : currentProveedor ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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