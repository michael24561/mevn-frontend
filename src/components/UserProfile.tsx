'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  joinDate: string;
  ordersCount: number;
  totalSpent: number;
}

export default function UserProfile() {
  const { data: session, status } = useSession();

  // Datos de ejemplo del usuario (en un caso real vendrían del backend)
  const userData: UserData = {
    name: session?.user?.name || 'Usuario',
    email: session?.user?.email || 'usuario@email.com',
    phone: '+34 600 123 456',
    address: 'Calle Principal 123',
    city: 'Madrid',
    joinDate: 'Enero 2024',
    ordersCount: 12,
    totalSpent: 2450.00
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="dropdown ms-3">
        <button className="btn btn-link nav-link d-flex align-items-center" disabled>
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          Cargando...
        </button>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="d-flex align-items-center">
        <Link className="nav-link me-2" href="/auth/login">
          <i className="fa fa-sign-in me-2"></i> Iniciar sesión
        </Link>
        <Link className="btn btn-outline-success btn-sm" href="/auth/register">
          Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="dropdown ms-3">
      <button
        className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
        type="button"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="User profile"
            width={32}
            height={32}
            className="rounded-circle me-2"
          />
        ) : (
          <i className="fa fa-user-circle me-2" style={{fontSize: '1.5rem'}}></i>
        )}
        <span className="d-none d-lg-inline">{userData.name}</span>
      </button>
      
      <ul 
        className="dropdown-menu dropdown-menu-end user-profile-dropdown" 
        aria-labelledby="userDropdown"
      >
        {/* Header del perfil */}
        <li>
          <div className="user-profile-header">
            <div className="d-flex align-items-center">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User profile"
                  width={48}
                  height={48}
                  className="rounded-circle me-3"
                />
              ) : (
                <i className="fa fa-user-circle me-3" style={{fontSize: '2rem', color: '#59ab6e'}}></i>
              )}
              <div>
                <h6 className="mb-0 fw-bold">{userData.name}</h6>
                <small className="text-muted">{userData.email}</small>
              </div>
            </div>
          </div>
        </li>
        
        {/* Información del usuario */}
        <li>
          <div className="user-profile-info">
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted d-block">Miembro desde</small>
                <small className="fw-semibold">{userData.joinDate}</small>
              </div>
              <div className="col-6">
                <small className="text-muted d-block">Pedidos</small>
                <small className="fw-semibold">{userData.ordersCount} completados</small>
              </div>
              <div className="col-6">
                <small className="text-muted d-block">Total gastado</small>
                <small className="fw-semibold">€{userData.totalSpent.toLocaleString()}</small>
              </div>
              <div className="col-6">
                <small className="text-muted d-block">Estado</small>
                <small className="fw-semibold text-success">Activo</small>
              </div>
            </div>
          </div>
        </li>
        
        <li><hr className="dropdown-divider" /></li>
        
        {/* Datos de contacto */}
        <li>
          <div className="user-profile-info">
            <h6 className="mb-2 fw-semibold">Información de contacto</h6>
            <div className="row g-2">
              {userData.phone && (
                <div className="col-12">
                  <small className="text-muted d-block">
                    <i className="fa fa-phone me-2"></i>Teléfono
                  </small>
                  <small className="fw-semibold">{userData.phone}</small>
                </div>
              )}
              {userData.address && (
                <div className="col-12">
                  <small className="text-muted d-block">
                    <i className="fa fa-map-marker-alt me-2"></i>Dirección
                  </small>
                  <small className="fw-semibold">{userData.address}</small>
                </div>
              )}
              {userData.city && (
                <div className="col-12">
                  <small className="text-muted d-block">
                    <i className="fa fa-city me-2"></i>Ciudad
                  </small>
                  <small className="fw-semibold">{userData.city}</small>
                </div>
              )}
            </div>
          </div>
        </li>
        
        <li><hr className="dropdown-divider" /></li>
        
        {/* Enlaces del menú */}
        <li>
          <Link className="dropdown-item" href="/account">
            <i className="fa fa-user me-2"></i> Mi perfil
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/orders">
            <i className="fa fa-shopping-bag me-2"></i> Mis pedidos
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/wishlist">
            <i className="fa fa-heart me-2"></i> Favoritos
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/settings">
            <i className="fa fa-cog me-2"></i> Configuración
          </Link>
        </li>
        
        {session?.user?.role === 'admin' && (
          <>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <Link className="dropdown-item text-success" href="/admin/dashboard">
                <i className="fa fa-tachometer-alt me-2"></i> Panel Admin
              </Link>
            </li>
          </>
        )}
        
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
  );
} 