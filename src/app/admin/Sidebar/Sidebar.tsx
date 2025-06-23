'use client';

import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import {
  ShoppingCart as VentasIcon,
  History as HistorialIcon,
  People as ClientesIcon,
  BarChart as ReportesIcon,
  Inventory as InventarioIcon,
  Store as ProductosIcon,
  Category as CategoriasIcon,
  Person as ProveedoresIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const menuGroups = [
    {
      title: 'Operaciones',
      items: [
        { text: 'Ventas', icon: <VentasIcon />, path: '/admin/ventas' },
        { text: 'Historial', icon: <HistorialIcon />, path: '/admin/historial' }
      ]
    },
    {
      title: 'Gestión',
      items: [
        { text: 'Clientes', icon: <ClientesIcon />, path: '/admin/clientes' },
        { text: 'Proveedores', icon: <ProveedoresIcon />, path: '/admin/proveedores' }
      ]
    },
    {
      title: 'Productos',
      items: [
        { text: 'Inventario', icon: <InventarioIcon />, path: '/admin/inventario' },
        { text: 'Productos', icon: <ProductosIcon />, path: '/admin/productos' },
        { text: 'Categorías', icon: <CategoriasIcon />, path: '/admin/categorias' }
      ]
    },
    {
      title: 'Reportes',
      items: [
        { text: 'Reportes', icon: <ReportesIcon />, path: '/admin/reportes' }
      ]
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        backgroundColor: '#1976d2', // Azul principal de Material-UI
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          Panel Administrativo
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Gestión integral del sistema
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1 }} />

      <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 2 }}>
        {menuGroups.map((group, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                px: 2, 
                py: 1, 
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {group.title}
            </Typography>
            <List dense>
              {group.items.map((item) => (
                <ListItemButton
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      '& .MuiListItemIcon-root': {
                        color: 'white'
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'inherit',
                    minWidth: '36px'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mt: 'auto' }} />

      <Box sx={{ 
        p: 2,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)'
      }}>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          v2.1.0 • Sistema Admin
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;