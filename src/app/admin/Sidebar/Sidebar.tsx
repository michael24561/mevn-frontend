'use client';

import React from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/navigation';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const menuItems = [
    { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/admin/ventas' },
    { text: 'Historiales', icon: <HistoryIcon />, path: '/admin/historiales' },
    { text: 'Clientes', icon: <PeopleIcon />, path: '/admin/clientes' },
    { text: 'Gráficos', icon: <BarChartIcon />, path: '/admin/graficos' },
    { text: 'Inventario', icon: <InventoryIcon />, path: '/admin/inventario' },
    { text: 'Productos', icon: <StoreIcon />, path: '/admin/productos' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: '#2D8F2F',
        color: 'white',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ mb: 4 }}>
        <h3 style={{ margin: 0 }}>Administrador</h3>
        <p style={{ fontSize: 12 }}>Control preciso, decisiones inteligentes</p>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                backgroundColor: 'white',
                color: '#002607E0',
                '& .MuiListItemIcon-root': { color: '#002607E0' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;