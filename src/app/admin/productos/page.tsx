'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, Avatar, CircularProgress, MenuItem,
  Card, CardContent, Grid, InputAdornment, Chip, Tooltip, FormControl, InputLabel, Select
} from '@mui/material';
import { Edit, Delete, Add, CloudUpload, Search, Refresh, Inventory } from '@mui/icons-material';

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: { _id: string, nombre: string };
  proveedor: { _id: string, nombre: string };
  fechaCreacion: string;
}

interface Categoria {
  _id: string;
  nombre: string;
}

interface Proveedor {
  _id: string;
  nombre: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProducto, setCurrentProducto] = useState<Producto | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formState, setFormState] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: null as File | null,
    imagenPreview: '',
    categoria: '',
    proveedor: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productosRes, categoriasRes, proveedoresRes] = await Promise.all([
        fetch('http://localhost:5000/api/productos'),
        fetch('http://localhost:5000/api/categorias'),
        fetch('http://localhost:5000/api/proveedores')
      ]);

      if (!productosRes.ok || !categoriasRes.ok || !proveedoresRes.ok) {
        throw new Error('Error al cargar datos');
      }

      const [productosData, categoriasData, proveedoresData] = await Promise.all([
        productosRes.json(),
        categoriasRes.json(),
        proveedoresRes.json()
      ]);

      setProductos(productosData);
      setCategorias(categoriasData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Error al cargar datos', 
        severity: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormState(prev => ({
        ...prev,
        imagen: file,
        imagenPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleOpenDialog = (producto: Producto | null) => {
    if (producto) {
      setCurrentProducto(producto);
      setFormState({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen: null,
        imagenPreview: producto.imagen ? `${process.env.NEXT_PUBLIC_API_URL || ''}${producto.imagen}` : '',
        categoria: producto.categoria._id,
        proveedor: producto.proveedor._id
      });
    } else {
      setCurrentProducto(null);
      setFormState({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        imagen: null,
        imagenPreview: '',
        categoria: '',
        proveedor: ''
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('nombre', formState.nombre);
      formData.append('descripcion', formState.descripcion);
      formData.append('precio', formState.precio.toString());
      formData.append('stock', formState.stock.toString());
      formData.append('categoria', formState.categoria);
      formData.append('proveedor', formState.proveedor);
      
      if (formState.imagen) {
        formData.append('imagen', formState.imagen);
      } else if (!currentProducto) {
        throw new Error('La imagen es requerida');
      }

      const url = currentProducto 
        ? `http://localhost:5000/api/productos/${currentProducto._id}`
        : 'http://localhost:5000/api/productos';
      const method = currentProducto ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }

      setSnackbar({ 
        open: true, 
        message: currentProducto ? 'Producto actualizado' : 'Producto creado', 
        severity: 'success' 
      });
      setOpenDialog(false);
      await loadData();
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
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setSnackbar({ open: true, message: 'Producto eliminado', severity: 'success' });
      await loadData();
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Error al eliminar', 
        severity: 'error' 
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !filterCategoria || producto.categoria._id === filterCategoria;
    
    return matchesSearch && matchesCategoria;
  });

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Sin stock';
    if (stock < 10) return 'Stock bajo';
    return 'En stock';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      <Button 
        variant="contained" 
        startIcon={<Add />} 
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 3 }}
      >
        Nuevo Producto
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filterCategoria}
                  label="Categoría"
                  onChange={(e) => setFilterCategoria(e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadData}
              >
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductos.map((producto) => (
              <TableRow key={producto._id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>${producto.precio.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={`${producto.stock} - ${getStockText(producto.stock)}`}
                    color={getStockColor(producto.stock)}
                  />
                </TableCell>
                <TableCell>{producto.categoria?.nombre || 'Sin categoría'}</TableCell>
                <TableCell>{producto.proveedor?.nombre || 'Sin proveedor'}</TableCell>
                <TableCell>
                  <Avatar 
                    src={producto.imagen ? `${process.env.NEXT_PUBLIC_API_URL || ''}${producto.imagen}` : ''}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  >
                    {!producto.imagen && <Inventory />}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(producto)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(producto._id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => !isSubmitting && setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProducto ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 300 }}>
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={formState.nombre}
                  onChange={(e) => setFormState({...formState, nombre: e.target.value})}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Descripción"
                  fullWidth
                  variant="outlined"
                  value={formState.descripcion}
                  onChange={(e) => setFormState({...formState, descripcion: e.target.value})}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Precio"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formState.precio}
                  onChange={(e) => setFormState({...formState, precio: Number(e.target.value)})}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Stock"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formState.stock}
                  onChange={(e) => setFormState({...formState, stock: Number(e.target.value)})}
                  required
                  inputProps={{ min: 0 }}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 300 }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ mb: 2 }}
                >
                  Seleccionar Imagen
                </Button>
                
                {formState.imagenPreview && (
                  <Avatar 
                    src={formState.imagenPreview}
                    variant="rounded"
                    sx={{ width: '100%', height: 200, mb: 2 }}
                  />
                )}

                <TextField
                  select
                  margin="dense"
                  label="Categoría"
                  fullWidth
                  variant="outlined"
                  value={formState.categoria}
                  onChange={(e) => setFormState({...formState, categoria: e.target.value})}
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="">Seleccione una categoría</MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  margin="dense"
                  label="Proveedor"
                  fullWidth
                  variant="outlined"
                  value={formState.proveedor}
                  onChange={(e) => setFormState({...formState, proveedor: e.target.value})}
                  required
                >
                  <MenuItem value="">Seleccione un proveedor</MenuItem>
                  {proveedores.map((prov) => (
                    <MenuItem key={prov._id} value={prov._id}>
                      {prov.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Guardando...' : currentProducto ? 'Actualizar' : 'Crear'}
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