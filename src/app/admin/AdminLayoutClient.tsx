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
        main: '#8b1e3f',
        light: '#b73452',
        dark: '#63162d',
      },
      secondary: {
        main: '#d4af6a',
        light: '#f2d8a3',
        dark: '#a77f3d',
      },
      background: {
        default: darkMode ? '#12100f' : '#f7f3ee',
        paper: darkMode ? '#1b1715' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#17120f',
        secondary: darkMode ? '#d7c8ba' : '#6b625d',
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
            borderRadius: '10px',
            fontWeight: 600,
            letterSpacing: '0.01em',
          },
          contained: {
            boxShadow: '0 8px 18px rgba(139, 30, 63, 0.18)',
            '&:hover': {
              boxShadow: '0 12px 22px rgba(139, 30, 63, 0.24)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            boxShadow: darkMode 
              ? '0 12px 28px rgba(0,0,0,0.22)' 
              : '0 10px 28px rgba(23,18,15,0.08)',
            border: darkMode 
              ? '1px solid rgba(255,255,255,0.08)' 
              : '1px solid rgba(23,18,15,0.04)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
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
        background: darkMode
          ? 'linear-gradient(135deg, #120d0b 0%, #1a1412 35%, #0f0d0d 100%)'
          : 'linear-gradient(135deg, #f7f3ee 0%, #f1e7da 100%)',
        transition: 'background-color 0.3s ease, background 0.3s ease'
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
            background: darkMode
              ? 'rgba(18, 13, 11, 0.88)'
              : 'rgba(247, 243, 238, 0.9)',
            minHeight: 'calc(100vh - 64px)',
            transition: 'background-color 0.3s ease, background 0.3s ease'
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
} 