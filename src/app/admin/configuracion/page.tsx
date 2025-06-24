'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ConfiguracionPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [showPassword, setShowPassword] = useState(false);

  // Configuración general
  const [generalConfig, setGeneralConfig] = useState({
    nombreEmpresa: 'Wine Store',
    emailContacto: 'contacto@winestore.com',
    telefono: '+34 123 456 789',
    direccion: 'Calle Principal 123, Madrid',
    moneda: 'EUR',
    idioma: 'es',
    zonaHoraria: 'Europe/Madrid'
  });

  // Configuración de seguridad
  const [securityConfig, setSecurityConfig] = useState({
    autenticacionDosFactores: true,
    sesionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  });

  // Configuración de notificaciones
  const [notificationConfig, setNotificationConfig] = useState({
    emailNotificaciones: true,
    notificacionesVentas: true,
    notificacionesInventario: true,
    notificacionesClientes: true,
    notificacionesReportes: false,
    notificacionesSistema: true
  });

  // Configuración de apariencia
  const [appearanceConfig, setAppearanceConfig] = useState({
    tema: 'light',
    colorPrimario: '#59ab6e',
    colorSecundario: '#1976d2',
    mostrarAnimaciones: true,
    densidad: 'comfortable'
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveConfig = async (section: string) => {
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({ 
        open: true, 
        message: `Configuración de ${section} guardada exitosamente`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Error al guardar la configuración', 
        severity: 'error' 
      });
    }
  };

  const handleBackup = () => {
    setSnackbar({ 
      open: true, 
      message: 'Respaldo creado exitosamente', 
      severity: 'success' 
    });
  };

  const handleRestore = () => {
    setSnackbar({ 
      open: true, 
      message: 'Sistema restaurado exitosamente', 
      severity: 'success' 
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: '600', color: 'text.primary' }}>
          Configuración del Sistema
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<BackupIcon />}
            onClick={handleBackup}
          >
            Crear Respaldo
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={handleRestore}
          >
            Restaurar
          </Button>
        </Box>
      </Box>

      {/* Tabs de configuración */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="configuración tabs"
            sx={{ px: 2 }}
          >
            <Tab 
              icon={<BusinessIcon />} 
              label="General" 
              iconPosition="start"
            />
            <Tab 
              icon={<SecurityIcon />} 
              label="Seguridad" 
              iconPosition="start"
            />
            <Tab 
              icon={<NotificationsIcon />} 
              label="Notificaciones" 
              iconPosition="start"
            />
            <Tab 
              icon={<PaletteIcon />} 
              label="Apariencia" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Panel General */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Información de la Empresa
              </Typography>
              <TextField
                fullWidth
                label="Nombre de la empresa"
                value={generalConfig.nombreEmpresa}
                onChange={(e) => setGeneralConfig({ ...generalConfig, nombreEmpresa: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email de contacto"
                type="email"
                value={generalConfig.emailContacto}
                onChange={(e) => setGeneralConfig({ ...generalConfig, emailContacto: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={generalConfig.telefono}
                onChange={(e) => setGeneralConfig({ ...generalConfig, telefono: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Dirección"
                multiline
                rows={3}
                value={generalConfig.direccion}
                onChange={(e) => setGeneralConfig({ ...generalConfig, direccion: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Configuración Regional
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={generalConfig.moneda}
                  label="Moneda"
                  onChange={(e) => setGeneralConfig({ ...generalConfig, moneda: e.target.value })}
                >
                  <MenuItem value="EUR">Euro (€)</MenuItem>
                  <MenuItem value="USD">Dólar ($)</MenuItem>
                  <MenuItem value="GBP">Libra (£)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Idioma</InputLabel>
                <Select
                  value={generalConfig.idioma}
                  label="Idioma"
                  onChange={(e) => setGeneralConfig({ ...generalConfig, idioma: e.target.value })}
                >
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Zona horaria</InputLabel>
                <Select
                  value={generalConfig.zonaHoraria}
                  label="Zona horaria"
                  onChange={(e) => setGeneralConfig({ ...generalConfig, zonaHoraria: e.target.value })}
                >
                  <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                  <MenuItem value="Europe/London">London (GMT+0)</MenuItem>
                  <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveConfig('general')}
                  sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
                >
                  Guardar Configuración General
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panel Seguridad */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Autenticación
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={securityConfig.autenticacionDosFactores}
                    onChange={(e) => setSecurityConfig({ 
                      ...securityConfig, 
                      autenticacionDosFactores: e.target.checked 
                    })}
                  />
                }
                label="Autenticación de dos factores"
                sx={{ mb: 2, display: 'block' }}
              />

              <TextField
                fullWidth
                label="Tiempo de sesión (minutos)"
                type="number"
                value={securityConfig.sesionTimeout}
                onChange={(e) => setSecurityConfig({ 
                  ...securityConfig, 
                  sesionTimeout: parseInt(e.target.value) 
                })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Longitud mínima de contraseña"
                type="number"
                value={securityConfig.passwordMinLength}
                onChange={(e) => setSecurityConfig({ 
                  ...securityConfig, 
                  passwordMinLength: parseInt(e.target.value) 
                })}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={securityConfig.passwordRequireSpecial}
                    onChange={(e) => setSecurityConfig({ 
                      ...securityConfig, 
                      passwordRequireSpecial: e.target.checked 
                    })}
                  />
                }
                label="Requerir caracteres especiales"
                sx={{ mb: 1, display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={securityConfig.passwordRequireNumbers}
                    onChange={(e) => setSecurityConfig({ 
                      ...securityConfig, 
                      passwordRequireNumbers: e.target.checked 
                    })}
                  />
                }
                label="Requerir números"
                sx={{ mb: 1, display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={securityConfig.passwordRequireUppercase}
                    onChange={(e) => setSecurityConfig({ 
                      ...securityConfig, 
                      passwordRequireUppercase: e.target.checked 
                    })}
                  />
                }
                label="Requerir mayúsculas"
                sx={{ mb: 2, display: 'block' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Protección contra ataques
              </Typography>

              <TextField
                fullWidth
                label="Máximo intentos de login"
                type="number"
                value={securityConfig.maxLoginAttempts}
                onChange={(e) => setSecurityConfig({ 
                  ...securityConfig, 
                  maxLoginAttempts: parseInt(e.target.value) 
                })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Duración del bloqueo (minutos)"
                type="number"
                value={securityConfig.lockoutDuration}
                onChange={(e) => setSecurityConfig({ 
                  ...securityConfig, 
                  lockoutDuration: parseInt(e.target.value) 
                })}
                sx={{ mb: 2 }}
              />

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Consejo de seguridad:</strong> Se recomienda mantener la autenticación de dos factores habilitada y usar contraseñas fuertes.
                </Typography>
              </Alert>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveConfig('seguridad')}
                  sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
                >
                  Guardar Configuración de Seguridad
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panel Notificaciones */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Configuración de Email
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationConfig.emailNotificaciones}
                    onChange={(e) => setNotificationConfig({ 
                      ...notificationConfig, 
                      emailNotificaciones: e.target.checked 
                    })}
                  />
                }
                label="Habilitar notificaciones por email"
                sx={{ mb: 2, display: 'block' }}
              />

              <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                Tipos de notificaciones:
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationConfig.notificacionesVentas}
                    onChange={(e) => setNotificationConfig({ 
                      ...notificationConfig, 
                      notificacionesVentas: e.target.checked 
                    })}
                  />
                }
                label="Nuevas ventas"
                sx={{ mb: 1, display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationConfig.notificacionesInventario}
                    onChange={(e) => setNotificationConfig({ 
                      ...notificationConfig, 
                      notificacionesInventario: e.target.checked 
                    })}
                  />
                }
                label="Alertas de inventario"
                sx={{ mb: 1, display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationConfig.notificacionesClientes}
                    onChange={(e) => setNotificationConfig({ 
                      ...notificationConfig, 
                      notificacionesClientes: e.target.checked 
                    })}
                  />
                }
                label="Nuevos clientes"
                sx={{ mb: 1, display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationConfig.notificacionesReportes}
                    onChange={(e) => setNotificationConfig({ 
                      ...notificationConfig, 
                      notificacionesReportes: e.target.checked 
                    })}
                  />
                }
                label="Reportes automáticos"
                sx={{ mb: 1, display: 'block' }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={notificationConfig.notificacionesSistema}
                    onChange={(e) => setNotificationConfig({ 
                      ...notificationConfig, 
                      notificacionesSistema: e.target.checked 
                    })}
                  />
                }
                label="Notificaciones del sistema"
                sx={{ mb: 2, display: 'block' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Configuración de Alertas
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Las notificaciones se enviarán a: <strong>{generalConfig.emailContacto}</strong>
                </Typography>
              </Alert>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveConfig('notificaciones')}
                  sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
                >
                  Guardar Configuración de Notificaciones
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Panel Apariencia */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Tema y Colores
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tema</InputLabel>
                <Select
                  value={appearanceConfig.tema}
                  label="Tema"
                  onChange={(e) => setAppearanceConfig({ 
                    ...appearanceConfig, 
                    tema: e.target.value 
                  })}
                >
                  <MenuItem value="light">Claro</MenuItem>
                  <MenuItem value="dark">Oscuro</MenuItem>
                  <MenuItem value="auto">Automático</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Color primario"
                value={appearanceConfig.colorPrimario}
                onChange={(e) => setAppearanceConfig({ 
                  ...appearanceConfig, 
                  colorPrimario: e.target.value 
                })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box 
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          backgroundColor: appearanceConfig.colorPrimario,
                          border: '1px solid #ccc'
                        }} 
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Color secundario"
                value={appearanceConfig.colorSecundario}
                onChange={(e) => setAppearanceConfig({ 
                  ...appearanceConfig, 
                  colorSecundario: e.target.value 
                })}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box 
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          backgroundColor: appearanceConfig.colorSecundario,
                          border: '1px solid #ccc'
                        }} 
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceConfig.mostrarAnimaciones}
                    onChange={(e) => setAppearanceConfig({ 
                      ...appearanceConfig, 
                      mostrarAnimaciones: e.target.checked 
                    })}
                  />
                }
                label="Mostrar animaciones"
                sx={{ mb: 2, display: 'block' }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Densidad de la interfaz</InputLabel>
                <Select
                  value={appearanceConfig.densidad}
                  label="Densidad de la interfaz"
                  onChange={(e) => setAppearanceConfig({ 
                    ...appearanceConfig, 
                    densidad: e.target.value 
                  })}
                >
                  <MenuItem value="comfortable">Cómoda</MenuItem>
                  <MenuItem value="compact">Compacta</MenuItem>
                  <MenuItem value="spacious">Espaciosa</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: '600' }}>
                Vista Previa
              </Typography>

              <Card sx={{ 
                p: 2, 
                backgroundColor: appearanceConfig.tema === 'dark' ? '#1e1e1e' : '#ffffff',
                color: appearanceConfig.tema === 'dark' ? '#ffffff' : '#000000'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: appearanceConfig.colorPrimario }}>
                    <SettingsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                      Vista previa del tema
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Esta es una vista previa de cómo se verá la interfaz
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label="Ejemplo" 
                    color="primary" 
                    size="small"
                    sx={{ backgroundColor: appearanceConfig.colorPrimario }}
                  />
                  <Chip 
                    label="Vista previa" 
                    color="secondary" 
                    size="small"
                    sx={{ backgroundColor: appearanceConfig.colorSecundario }}
                  />
                </Box>
              </Card>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSaveConfig('apariencia')}
                  sx={{ backgroundColor: '#59ab6e', '&:hover': { backgroundColor: '#4a8c5a' } }}
                >
                  Guardar Configuración de Apariencia
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfiguracionPage; 