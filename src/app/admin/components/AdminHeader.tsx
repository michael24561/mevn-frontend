'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { signOut } from 'next-auth/react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  currentSection: string;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

// Estilo para la barra de búsqueda
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuToggle,
  currentSection,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const notifications = [
    { id: 1, message: 'Nuevo pedido recibido', time: '2 min ago', type: 'order' },
    { id: 2, message: 'Stock bajo en producto XYZ', time: '15 min ago', type: 'warning' },
    { id: 3, message: 'Venta completada exitosamente', time: '1 hora ago', type: 'success' },
  ];

  const unreadCount = notifications.length;

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
        color: darkMode ? '#ffffff' : '#212934',
        borderBottom: darkMode 
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: '600',
            color: darkMode ? '#ffffff' : '#212934'
          }}
        >
          {currentSection}
        </Typography>

        {/* Barra de búsqueda */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Buscar..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {/* Toggle de modo oscuro */}
        <Tooltip title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
          <IconButton
            color="inherit"
            onClick={onToggleDarkMode}
            sx={{ mr: 1 }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Notificaciones */}
        <Tooltip title="Notificaciones">
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Menú de notificaciones */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 300,
              backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#212934',
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: '600' }}>
              Notificaciones ({unreadCount})
            </Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={handleNotificationsClose}
              sx={{ 
                borderBottom: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" sx={{ color: darkMode ? '#b0b0b0' : '#6c757d' }}>
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Sección actual */}
        <Chip 
          label={currentSection} 
          size="small" 
          sx={{ 
            mr: 2,
            backgroundColor: '#59ab6e',
            color: 'white',
            fontWeight: '500'
          }}
        />

        {/* Perfil de usuario */}
        <Tooltip title="Configuración de cuenta">
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ 
              width: 32, 
              height: 32,
              bgcolor: '#59ab6e',
              fontSize: '0.875rem'
            }}>
              A
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Menú de perfil */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#212934',
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <AccountCircleIcon sx={{ mr: 2 }} />
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon sx={{ mr: 2 }} />
            Configuración
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 2 }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader; 