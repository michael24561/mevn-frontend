'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Group as EmpleadosIcon,
  LocalShipping as LocalShippingIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
  darkMode?: boolean;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  open,
  onToggle,
  currentSection,
  onSectionChange,
  darkMode = false
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard'
    },
    {
      text: 'Gestión de Productos',
      icon: <InventoryIcon />,
      path: '/admin/productos',
      children: [
        { text: 'Productos', icon: <InventoryIcon />, path: '/admin/productos' },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/admin/categorias' }
      ]
    },
    {
      text: 'Gestión de Clientes',
      icon: <PeopleIcon />,
      path: '/admin/clientes'
    },
    {
      text: 'Gestión de Empleados',
      icon: <EmpleadosIcon />,
      path: '/admin/empleados'
    },
    {
      text: 'Proveedores',
      icon: <LocalShippingIcon />,
      path: '/admin/proveedores'
    },
    {
      text: 'Reportes',
      icon: <AssessmentIcon />,
      path: '/admin/reportes'
    },
    {
      text: 'Configuración',
      icon: <SettingsIcon />,
      path: '/admin/configuracion'
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      // Si tiene hijos, expandir/contraer
      setExpandedItems(prev => 
        prev.includes(item.text) 
          ? prev.filter(text => text !== item.text)
          : [...prev, item.text]
      );
    } else {
      // Si no tiene hijos, navegar
      router.push(item.path);
      onSectionChange(item.text);
    }
  };

  const isExpanded = (text: string) => expandedItems.includes(text);
  const isActive = (path: string) => pathname === path;

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const expanded = isExpanded(item.text);
    const active = isActive(item.path);

    return (
      <Box key={item.text}>
        <ListItem 
          disablePadding 
          sx={{ 
            display: 'block',
            pl: level * 2
          }}
        >
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              backgroundColor: active 
                ? darkMode ? 'rgba(89, 171, 110, 0.2)' : 'rgba(89, 171, 110, 0.1)'
                : 'transparent',
              borderRight: active 
                ? '3px solid #59ab6e' 
                : '3px solid transparent',
              '&:hover': {
                backgroundColor: darkMode 
                  ? 'rgba(89, 171, 110, 0.15)' 
                  : 'rgba(89, 171, 110, 0.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Tooltip 
              title={!open ? item.text : ''} 
              placement="right"
              disableHoverListener={open}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: active ? '#59ab6e' : darkMode ? '#b0b0b0' : '#6c757d',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            
            {open && (
              <>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: 1,
                    '& .MuiListItemText-primary': {
                      fontWeight: active ? '600' : '400',
                      color: active 
                        ? '#59ab6e' 
                        : darkMode ? '#ffffff' : '#212934',
                    }
                  }}
                />
                {hasChildren && (
                  <Box sx={{ ml: 'auto' }}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && open && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 280 : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 64,
          boxSizing: 'border-box',
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          borderRight: darkMode 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid rgba(0,0,0,0.05)',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header del sidebar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          padding: 2,
          minHeight: 64,
          borderBottom: darkMode 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {open && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: '700',
              color: '#59ab6e',
              fontSize: '1.25rem',
            }}
          >
            Admin Panel
          </Typography>
        )}
        
        <Tooltip title={open ? "Contraer menú" : "Expandir menú"}>
          <IconButton
            onClick={onToggle}
            sx={{
              color: darkMode ? '#b0b0b0' : '#6c757d',
              '&:hover': {
                backgroundColor: darkMode 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Lista de menú */}
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer del sidebar */}
      <Box
        sx={{
          padding: 2,
          borderTop: darkMode 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {open && (
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? '#b0b0b0' : '#6c757d',
              fontSize: '0.75rem',
              textAlign: 'center',
              display: 'block',
            }}
          >
            Sistema de Administración
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default AdminSidebar; 