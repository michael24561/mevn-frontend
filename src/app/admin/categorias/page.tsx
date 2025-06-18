'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Categoria {
  _id: string;
  nombre: string;
}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<Categoria | null>(null);
  const [nombre, setNombre] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
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
    setCurrentCategoria(categoria);
    setNombre(categoria ? categoria.nombre : '');
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
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar la categoría');
      }

      setSnackbar({ 
        open: true, 
        message: currentCategoria ? 'Categoría actualizada' : 'Categoría creada', 
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

 const checkProductosAsociados = async (categoriaId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/productos?categoria=${categoriaId}`);
      
      // Si hay error en la petición, asumimos que no hay productos para permitir la eliminación
      if (!res.ok) {
        console.error('Error verificando productos:', await res.text());
        return false;
      }
      
      const productos = await res.json();
      return Array.isArray(productos) && productos.length > 0;
    } catch (error) {
      console.error('Error verificando productos:', error);
      return false; // Por precaución, permitimos eliminar si hay error
    }
  };

  const handleDelete = async (id: string, nombreCategoria: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${nombreCategoria}"?`)) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/categorias/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        // Si hay productos asociados, el backend devuelve error 400
        if (data.error && data.error.includes('productos asociados')) {
          const productosLista = data.productos ? 
            `Productos asociados: ${data.productos.join(', ')}` : 
            '';
          
          setSnackbar({
            open: true,
            message: `${data.error} ${productosLista}`,
            severity: 'error'
          });
          return;
        }
        throw new Error(data.error || 'Error al eliminar categoría');
      }

      setSnackbar({
        open: true,
        message: data.mensaje || 'Categoría eliminada correctamente',
        severity: 'success'
      });
      await loadCategorias();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error al eliminar categoría',
        severity: 'error'
      });
    }
  };


  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
        Gestión de Categorías
      </Typography>

      <Button 
        variant="contained" 
        startIcon={<Add />} 
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 3 }}
      >
        Nueva Categoría
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria._id}>
                <TableCell>{categoria.nombre}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleOpenDialog(categoria)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
    onClick={() => handleDelete(categoria._id, categoria.nombre)}
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
        onClose={() => !isSubmitting && setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre de la categoría"
              type="text"
              fullWidth
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenDialog(false)} 
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
                : currentCategoria ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}