'use client';

import React from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Chip,
  Container,
  Skeleton
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AdminPanelSettings as AdminIcon,
  PersonPin as UserIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const AccountPage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card sx={{ 
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
        }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Skeleton variant="circular" width={120} height={120} />
              <Skeleton variant="text" width="60%" height={50} sx={{ fontSize: '2rem' }} />
              <Skeleton variant="text" width="40%" height={40} />
              
              <Divider sx={{ 
                width: '80%', 
                my: 4, 
                borderColor: 'divider',
                borderBottomWidth: 2,
                opacity: 0.3
              }} />
              
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                {[...Array(4)].map((_, i) => (
                  <Box key={i} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3, 
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width="70%" height={30} />
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ 
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
          textAlign: 'center'
        }}>
          Acceso requerido
        </Typography>
        <Typography variant="body1" sx={{ 
          mb: 4,
          color: 'text.secondary',
          maxWidth: 500,
          textAlign: 'center',
          fontSize: '1.1rem'
        }}>
          Para ver esta información, por favor inicia sesión en tu cuenta.
        </Typography>
        <Link 
          href="/auth/login" 
          className="btn btn-success btn-lg"
          style={{
            backgroundColor: '#59ab6e',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none',
            '&:hover': {
              backgroundColor: '#4a8c5a'
            }
          }}
        >
          Iniciar sesión
        </Link>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Mi Cuenta | Licores Deluxe</title>
        <meta name="description" content="Administra tu cuenta en Licores Deluxe" />
      </Head>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block">
        <div className="container text-light">
          <div className="w-100 d-flex justify-content-between">
            <div>
              <i className="fa fa-envelope mx-2"></i>
              <a className="navbar-sm-brand text-light text-decoration-none" href="mailto:info@licoresdeluxe.com">
                info@licoresdeluxe.com
              </a>
              <i className="fa fa-phone mx-2"></i>
              <a className="navbar-sm-brand text-light text-decoration-none" href="tel:+34911234567">
                +34 911 234 567
              </a>
            </div>
            <div>
              <span className="text-light small">
                Envíos en 24/48h | Garantía de autenticidad
              </span>
            </div>
          </div>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand text-success logo h1 align-self-center" href="/">
            Licores<span className="text-light">Deluxe</span>
          </Link>

          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="align-self-center collapse navbar-collapse flex-fill d-lg-flex justify-content-lg-between" id="navbarContent">
            <div className="flex-fill">
              <ul className="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                <li className="nav-item">
                  <Link className="nav-link" href="/">Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/about">Nosotros</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/shop">Productos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/contact">Contacto</Link>
                </li>
              </ul>
            </div>
            
            <div className="navbar align-self-center d-flex">
              <div className="d-lg-none flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3">
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="inputMobileSearch" 
                    placeholder="Buscar licores..." 
                  />
                  <div className="input-group-text">
                    <i className="fa fa-fw fa-search"></i>
                  </div>
                </div>
              </div>
              
              <a className="nav-icon d-none d-lg-inline" href="#" data-bs-toggle="modal" data-bs-target="#templatemo_search">
                <i className="fa fa-fw fa-search text-dark mr-2"></i>
              </a>
              
              <Link className="nav-icon position-relative text-decoration-none" href="/cart">
                <i className="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">0</span>
              </Link>

              <div className="dropdown ms-3">
                <button
                  className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-user-circle me-2"></i>
                  <span className="d-none d-lg-inline">Mi cuenta</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" href="/account">
                      <i className="fa fa-user me-2"></i> Mi perfil
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fa fa-sign-out me-2"></i> Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Búsqueda */}
      <div className="modal fade bg-white" id="templatemo_search" tabIndex={-1} role="dialog" aria-labelledby="searchModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="w-100 pt-1 mb-5 text-right">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <form action="" method="get" className="modal-content modal-body border-0 p-0">
            <div className="input-group mb-2">
              <input type="text" className="form-control" id="inputModalSearch" name="q" placeholder="Buscar licores..." />
              <button type="submit" className="input-group-text bg-success text-light">
                <i className="fa fa-fw fa-search text-white"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contenido principal */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card sx={{ 
          borderRadius: 4,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)',
          overflow: 'hidden',
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(to right, #59ab6e, #1976d2)'
          }
        }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 3 
            }}>
              {/* Avatar con efecto de gradiente */}
              <Box sx={{
                position: 'relative',
                mb: 2,
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #59ab6e, #1976d2)',
                  zIndex: 0,
                  opacity: 0.7
                }
              }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    bgcolor: session.user.role === 'admin' ? '#1976d2' : '#59ab6e',
                    fontSize: '3rem',
                    position: 'relative',
                    zIndex: 1,
                    border: '4px solid white'
                  }}
                >
                  {session.user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                textAlign: 'center',
                color: 'text.primary',
                mt: 2
              }}>
                {session.user.name}
              </Typography>
              
              <Chip
                label={session.user.role === 'admin' ? 'Administrador' : 'Usuario'}
                size="medium"
                icon={session.user.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                sx={{
                  backgroundColor: session.user.role === 'admin' ? 'rgba(25, 118, 210, 0.1)' : 'rgba(89, 171, 110, 0.1)',
                  color: session.user.role === 'admin' ? '#1976d2' : '#59ab6e',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  fontSize: '0.9rem',
                  '& .MuiChip-icon': {
                    color: session.user.role === 'admin' ? '#1976d2' : '#59ab6e'
                  }
                }}
              />
              
              <Divider sx={{ 
                width: '80%', 
                my: 4, 
                borderColor: 'divider',
                borderBottomWidth: 2,
                opacity: 0.3
              }} />
              
              {/* Información del usuario con tarjetas */}
              <Box sx={{ 
                width: '100%', 
                maxWidth: 500,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3
              }}>
                {/* Tarjeta de Email */}
                <Box sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'rgba(89, 171, 110, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#59ab6e'
                  }}>
                    <EmailIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {session.user.email}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Tarjeta de Teléfono */}
                {session.user.telefono && (
                  <Box sx={{ 
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1976d2'
                    }}>
                      <PhoneIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Teléfono
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {session.user.telefono}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Tarjeta de Dirección */}
                {session.user.direccion && (
                  <Box sx={{ 
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    gridColumn: { xs: '1', sm: '1 / -1' }
                  }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff9800'
                    }}>
                      <LocationIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Dirección
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {session.user.direccion}
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Tarjeta de Fecha de Registro */}
                <Box sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  gridColumn: { xs: '1', sm: '1 / -1' }
                }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'rgba(156, 39, 176, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9c27b0'
                  }}>
                    <CalendarIcon fontSize="medium" />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Miembro desde
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date().toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-light" id="licores_footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 pt-5">
              <h2 className="h2 text-success border-bottom pb-3 border-light logo">Licores Deluxe</h2>
              <ul className="list-unstyled footer-link-list">
                <li className="mb-2">
                  <i className="fas fa-map-marker-alt fa-fw me-2"></i>
                  Av. de los Licores 123, Madrid 28001
                </li>
                <li className="mb-2">
                  <i className="fa fa-phone fa-fw me-2"></i>
                  <a className="text-light text-decoration-none" href="tel:+34911234567">+34 911 234 567</a>
                </li>
                <li className="mb-2">
                  <i className="fa fa-envelope fa-fw me-2"></i>
                  <a className="text-light text-decoration-none" href="mailto:info@licoresdeluxe.com">info@licoresdeluxe.com</a>
                </li>
                <li>
                  <i className="fa fa-clock fa-fw me-2"></i>
                  Lunes-Viernes: 9:00 - 20:00
                </li>
              </ul>
            </div>

            <div className="col-md-4 pt-5">
              <h2 className="h2 border-bottom pb-3 border-light">Nuestros Productos</h2>
              <ul className="list-unstyled footer-link-list">
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Whiskies Premium</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Vinos & Champagnes</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Licores Artesanales</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Ron & Brandy</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Vodka & Ginebra</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Ediciones Limitadas</Link></li>
                <li><Link className="text-light text-decoration-none" href="#">Accesorios</Link></li>
              </ul>
            </div>

            <div className="col-md-4 pt-5">
              <h2 className="h2 border-bottom pb-3 border-light">Información</h2>
              <ul className="list-unstyled footer-link-list">
                <li className="mb-2"><Link className="text-light text-decoration-none" href="/">Inicio</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="/about">Sobre Nosotros</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Política de Envíos</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="#">Preguntas Frecuentes</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="/contact">Contacto</Link></li>
                <li><Link className="text-light text-decoration-none" href="#">Política de Privacidad</Link></li>
              </ul>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12 mb-3">
              <div className="w-100 my-3 border-top border-light"></div>
            </div>
            <div className="col-auto me-auto">
              <ul className="list-inline footer-icons">
                <li className="list-inline-item border border-light rounded-circle text-center me-2">
                  <a className="text-light text-decoration-none d-flex align-items-center justify-content-center" 
                    target="_blank" 
                    href="http://facebook.com/licoresdeluxe" 
                    rel="noopener noreferrer"
                    style={{width: '40px', height: '40px'}}>
                    <i className="fab fa-facebook-f fa-lg"></i>
                  </a>
                </li>
                <li className="list-inline-item border border-light rounded-circle text-center me-2">
                  <a className="text-light text-decoration-none d-flex align-items-center justify-content-center" 
                    target="_blank" 
                    href="https://www.instagram.com/licoresdeluxe" 
                    rel="noopener noreferrer"
                    style={{width: '40px', height: '40px'}}>
                    <i className="fab fa-instagram fa-lg"></i>
                  </a>
                </li>
                <li className="list-inline-item border border-light rounded-circle text-center me-2">
                  <a className="text-light text-decoration-none d-flex align-items-center justify-content-center" 
                    target="_blank" 
                    href="https://twitter.com/licoresdeluxe" 
                    rel="noopener noreferrer"
                    style={{width: '40px', height: '40px'}}>
                    <i className="fab fa-twitter fa-lg"></i>
                  </a>
                </li>
                <li className="list-inline-item border border-light rounded-circle text-center">
                  <a className="text-light text-decoration-none d-flex align-items-center justify-content-center" 
                    target="_blank" 
                    href="https://www.youtube.com/licoresdeluxe" 
                    rel="noopener noreferrer"
                    style={{width: '40px', height: '40px'}}>
                    <i className="fab fa-youtube fa-lg"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-auto">
              <label className="sr-only" htmlFor="subscribeEmail">Suscríbete</label>
              <div className="input-group mb-2">
                <input 
                  type="text" 
                  className="form-control bg-dark border-light text-light" 
                  id="subscribeEmail" 
                  placeholder="Tu correo electrónico" 
                />
                <button className="input-group-text btn-success text-light">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-100 bg-black py-3">
          <div className="container">
            <div className="row pt-2">
              <div className="col-12">
                <p className="text-left m-0">
                  &copy; {new Date().getFullYear()} Licores Deluxe - Todos los derechos reservados |
                  Consumo responsable. Prohibida la venta a menores de 18 años.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AccountPage;