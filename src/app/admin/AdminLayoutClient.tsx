'use client';

import { useState, useEffect } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './admin-styles.css';

// Hook personalizado para el modo oscuro
const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Obtener preferencia guardada en localStorage
    const savedMode = localStorage.getItem('admin-dark-mode');
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('admin-dark-mode', JSON.stringify(newMode));
  };

  return { darkMode, toggleDarkMode };
};

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('Dashboard');
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Tema personalizado que concuerda con los colores del proyecto
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#59ab6e', // Verde principal del proyecto
        light: '#69bb7e',
        dark: '#4a8c5a',
      },
      secondary: {
        main: '#1976d2', // Azul para elementos secundarios
      },
      background: {
        default: darkMode ? '#121212' : '#f8f9fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#212934',
        secondary: darkMode ? '#b0b0b0' : '#6c757d',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: {
        fontWeight: 300,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 300,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 400,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 400,
        fontSize: '1.25rem',
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.125rem',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 500,
          },
          contained: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: darkMode 
              ? '0 2px 8px rgba(0,0,0,0.3)' 
              : '0 2px 8px rgba(0,0,0,0.1)',
            border: darkMode 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid rgba(0,0,0,0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            borderRight: darkMode 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid rgba(0,0,0,0.05)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: darkMode ? '#121212' : '#f8f9fa',
        transition: 'background-color 0.3s ease'
      }}>
        <AdminSidebar 
          open={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          darkMode={darkMode}
        />
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease',
          marginLeft: sidebarOpen ? '280px' : '0px'
        }}>
          <AdminHeader 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            currentSection={currentSection}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
          <Box component="main" sx={{ 
            flexGrow: 1, 
            p: 3,
            backgroundColor: darkMode ? '#121212' : '#f8f9fa',
            minHeight: 'calc(100vh - 64px)',
            transition: 'background-color 0.3s ease'
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
} 