'use client';

import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar,
  Menu, MenuItem, Divider, Box, InputBase, Badge
} from '@mui/material';
import {
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Notifications as NotificationsIcon,
  AccountCircle,
  ExitToApp
} from '@mui/icons-material';

interface HeaderProps {
  project?: any;
  user: any;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  project, user, drawerOpen, setDrawerOpen
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState('');

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#1976d2', // Azul principal
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ 
          flexGrow: 1, 
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Sistema Administrativo
        </Typography>

        {project && (
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            px: 2,
            py: 1,
            borderRadius: '4px',
            mx: 2
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: '500',
              color: 'white'
            }}>
              {project.nombre}
            </Typography>
          </Box>
        )}

        <Box sx={{
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          padding: '0 12px', 
          borderRadius: '4px', 
          mx: 2,
          width: { xs: '100px', sm: '200px', md: '300px' },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)'
          }
        }}>
          <SearchIcon sx={{ mr: 1, fontSize: '20px' }} />
          <InputBase
            placeholder="Buscar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ 
              color: 'inherit', 
              width: '100%',
              '& input::placeholder': {
                color: 'rgba(255,255,255,0.8)',
                opacity: 1
              }
            }}
          />
        </Box>

        <IconButton color="inherit" sx={{ mx: 1 }}>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Box>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              width: 40,
              height: 40,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)'
              }
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                minWidth: '220px',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)'
              }
            }}
          >
            <MenuItem disabled sx={{ opacity: 1, cursor: 'default', py: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Sesión activa
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user?.name || 'Usuario'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'admin@sistema.com'}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem sx={{ py: 1.5 }}>
              <AccountCircle sx={{ mr: 1.5, fontSize: '22px', color: '#1976d2' }} />
              <Typography>Mi perfil</Typography>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <ExitToApp sx={{ mr: 1.5, fontSize: '22px', color: '#1976d2' }} />
              <Typography>Cerrar sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;