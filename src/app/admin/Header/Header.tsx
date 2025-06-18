'use client';

import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Avatar,
  Menu, MenuItem, Divider, Box, InputBase
} from '@mui/material';
import {
  Menu as MenuIcon, Search as SearchIcon, AccountCircle,
  ExitToApp, Brightness4, Brightness7
} from '@mui/icons-material';

interface HeaderProps {
  project?: any;
  user: any;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  project, user,
  isDarkMode, toggleDarkMode, drawerOpen, setDrawerOpen
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchText, setSearchText] = useState('');

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2D8F2F' }}>
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

        <Typography variant="h6" sx={{ flexGrow: 1 }}>Panel de Administración</Typography>

        {project && (
          <Typography variant="subtitle1" sx={{ mx: 2, fontWeight: 'bold' }}>
            {project.nombre}
          </Typography>
        )}

        <Box sx={{
          display: 'flex', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          padding: '0 8px', borderRadius: '4px', mx: 2,
          width: { xs: '100px', sm: '200px', md: '300px' }
        }}>
          <SearchIcon sx={{ mr: 1 }} />
          <InputBase
            placeholder="Buscar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ color: 'inherit', width: '100%' }}
          />
        </Box>

        <IconButton color="inherit" onClick={toggleDarkMode}>
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Box>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: 'white', color: '#002607E0' }}>
              <AccountCircle />
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
                minWidth: '200px',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                borderRadius: '8px'
              }
            }}
          >
            <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Usuario</Typography>
                <Typography variant="body1" fontWeight="medium">
                  {user?.username || 'Desconocido'}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ExitToApp sx={{ mr: 1.5, fontSize: '20px' }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
