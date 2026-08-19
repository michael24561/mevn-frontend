// app/shop/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import Head from 'next/head';

import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    direccion?: any;
    telefono?: any;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  }
  interface Session {
    user: {
      id: any;
      direccion: any;
      telefono: any;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  imagenesAdicionales?: string[];
  stock: number;
  categoria?: {
    _id: string;
    nombre: string;
    slug: string;
  };
  rating?: number;
  numReviews?: number;
  especificaciones?: string[];
}

interface Categoria {
  _id: string;
  nombre: string;
  slug: string;
  imagen?: string;
}

export default function DetalleProducto() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: session, status } = useSession();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosSimilares, setProductosSimilares] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const productoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos/${id}`);
        if (!productoResponse.ok) {
          throw new Error('Producto no encontrado');
        }
        const productoData = await productoResponse.json();
        
        const categoriasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorias`);
        const categoriasData = await categoriasResponse.json();
        
        const productosResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos`);
        const todosProductos = await productosResponse.json();
        
        const similares = todosProductos
          .filter((p: Producto) => 
            p.categoria?._id === productoData.categoria?._id && 
            p._id !== productoData._id
          )
          .slice(0, 6);
        
        setProductosSimilares(similares);
        
        setProducto({
          ...productoData,
          imagen: productoData.imagen.startsWith('http') 
            ? productoData.imagen 
            : `${process.env.NEXT_PUBLIC_API_URL}${productoData.imagen}`
        });
        
        setCategorias(categoriasData);

        if (session?.user?.id) {
          const carritoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos?clienteId=${session.user.id}`);
          if (carritoResponse.ok) {
            const carritoData = await carritoResponse.json();
            setCartCount(carritoData.items?.length || 0);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarDatos();
    }
  }, [id, session?.user?.id]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isAdminUser = ['admin', 'administrador', 'super_admin'].includes(
    String(session?.user?.role ?? '').toLowerCase()
  );

  const agregarAlCarrito = async () => {
    if (!producto) return;

    try {
      const toastId = toast.loading(`Agregando ${producto.nombre} al carrito...`);
      
      if (!session?.user?.id) {
        throw new Error('Debes iniciar sesión para agregar productos al carrito');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productoId: producto._id,
          cantidad: cantidad,
          clienteId: session.user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar al carrito');
      }

      const data = await response.json();
      setCartCount(prev => prev + 1);
      
      toast.update(toastId, {
        render: `¡${producto.nombre} agregado al carrito!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Error al agregar al carrito', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      if (error.message.includes('iniciar sesión')) {
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Link href="/shop" className="btn btn-success mt-3">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">Producto no encontrado</div>
        <Link href="/shop" className="btn btn-success mt-3">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${producto.nombre} | Licores Deluxe`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/assets/img/apple-icon.png" />
        <link rel="shortcut icon" type="image/x-icon" href="/assets/img/favicon.ico" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/templatemo.css" />
        <link rel="stylesheet" href="/assets/css/custom.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
      </Head>

      {/* ==================== HEADER (SOLO UNO) ==================== */}
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

      <header className="luxury-header">
        <div className="topbar">
          <div className="container topbar-inner">
            <div className="topbar-group">
              <span><i className="fa fa-envelope"></i> info@licoresdeluxe.com</span>
              <span><i className="fa fa-phone"></i> +34 911 234 567</span>
            </div>
            <div className="topbar-group">
              <span>Envíos en 24/48h | Garantía de autenticidad</span>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-expand-lg luxury-navbar">
          <div className="container navbar-inner">
            <Link className="navbar-brand luxury-brand" href="/">
              <span className="brand-mark">LD</span>
              <span>Licores <strong>Deluxe</strong></span>
            </Link>

            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav mx-auto luxury-nav">
                <li className="nav-item"><Link className="nav-link" href="/">Inicio</Link></li>
                <li className="nav-item"><Link className="nav-link" href="/about">Nosotros</Link></li>
                <li className="nav-item"><Link className="nav-link active" href="/shop">Productos</Link></li>
                <li className="nav-item"><Link className="nav-link" href="/contact">Contacto</Link></li>
              </ul>

              <div className="luxury-userbar">
                <Link href="/cart" className="luxury-icon" aria-label="Carrito">
                  <i className="fa fa-shopping-cart"></i>
                  <span className="cart-count">{cartCount}</span>
                </Link>

                {status === 'authenticated' ? (
                  <div className="dropdown ms-3">
                    <button
                      className="btn luxury-account-button dropdown-toggle"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      title={session.user?.name || 'Mi cuenta'}
                    >
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="User profile"
                          width={30}
                          height={30}
                          className="rounded-circle me-2"
                        />
                      ) : (
                        <i className="fa fa-user-circle me-2"></i>
                      )}
                      <span className="user-button-label">{session.user?.name || 'Mi cuenta'}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end luxury-user-menu">
                      <li><Link className="dropdown-item" href="/account"><i className="fa fa-user me-2"></i> Mi perfil</Link></li>
                      {isAdminUser && (
                        <li><Link className="dropdown-item" href="/admin/dashboard"><i className="fa fa-cog me-2"></i> Panel Admin</Link></li>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="fa fa-sign-out me-2"></i> Cerrar sesión</button></li>
                    </ul>
                  </div>
                ) : (
                  <Link className="luxury-login" href="/auth/login">
                    <i className="fa fa-user me-2"></i> Iniciar sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ==================== CONTENIDO PRINCIPAL ==================== */}
      <div className="shop-shell">
        <div className="container" style={{ padding: '1.5rem 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            gap: '2rem',
            alignItems: 'start',
            padding: '0.5rem 0'
          }}>
            
            {/* SIDEBAR */}
            <aside style={{ 
              minWidth: '160px', 
              maxWidth: '200px',
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              height: 'fit-content'
            }}>
              <h3 style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                marginBottom: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#2d1b0e',
                borderBottom: '2px solid #8b1e3f',
                paddingBottom: '0.3rem'
              }}>
                Categorías
              </h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                display: 'block'
              }}>
                {categorias.length === 0 ? (
                  <li style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', color: '#999' }}>
                    No hay categorías
                  </li>
                ) : (
                  categorias.map((cat) => (
                    <li key={cat._id} style={{ marginBottom: '0.15rem' }}>
                      <button
                        type="button"
                        style={{
                          width: '100%',
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.8rem',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid #f0ebe6',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          color: '#4a3728',
                          fontWeight: '400',
                          textAlign: 'left',
                          borderRadius: '0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f5f0eb';
                          e.currentTarget.style.color = '#8b1e3f';
                          e.currentTarget.style.fontWeight = '500';
                          e.currentTarget.style.paddingLeft = '0.8rem';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#4a3728';
                          e.currentTarget.style.fontWeight = '400';
                          e.currentTarget.style.paddingLeft = '0.6rem';
                        }}
                      >
                        <span style={{ fontSize: '0.8rem' }}>{cat.nombre}</span>
                        <i className="fa fa-chevron-right" style={{ 
                          fontSize: '0.5rem', 
                          color: '#8b1e3f', 
                          opacity: 0.4
                        }}></i>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </aside>

            {/* GALERÍA */}
            <div>
              <div style={{
                maxHeight: '400px',
                overflow: 'hidden',
                borderRadius: '16px',
                background: '#faf8f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #eee'
              }}>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '400px' }}
                />
              </div>
              {producto.imagenesAdicionales && producto.imagenesAdicionales.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {producto.imagenesAdicionales.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setProducto({ ...producto, imagen: img })}
                      style={{
                        width: '60px',
                        height: '48px',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        border: '2px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8b1e3f'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                    >
                      <Image
                        src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`}
                        alt={`Vista ${index + 1}`}
                        width={60}
                        height={48}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* INFORMACIÓN DEL PRODUCTO */}
            <div style={{
              padding: '1.5rem',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(23,18,15,0.06)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
              <span style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#8b1e3f',
                fontWeight: '600'
              }}>
                {producto.categoria?.nombre || 'Licores premium'}
              </span>
              <h1 style={{
                fontSize: '1.6rem',
                fontWeight: '600',
                margin: '0.3rem 0 0.2rem',
                lineHeight: '1.2'
              }}>
                {producto.nombre}
              </h1>

              <div style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#8b1e3f',
                margin: '0.2rem 0'
              }}>
                ${producto.precio.toFixed(2)}
              </div>

              <span style={{
                display: 'inline-block',
                padding: '0.2rem 0.8rem',
                fontSize: '0.7rem',
                borderRadius: '20px',
                fontWeight: '500',
                backgroundColor: producto.stock > 0 ? '#d4edda' : '#f8d7da',
                color: producto.stock > 0 ? '#155724' : '#721c24',
                marginBottom: '0.5rem'
              }}>
                <i className={producto.stock > 0 ? 'fas fa-check-circle' : 'fas fa-times-circle'} style={{ marginRight: '0.3rem', fontSize: '0.6rem' }}></i>
                {producto.stock > 0 ? 'En stock' : 'Sin stock'}
              </span>

              <p style={{
                fontSize: '0.9rem',
                lineHeight: '1.6',
                color: '#555',
                margin: '0.4rem 0 0.8rem'
              }}>
                {producto.descripcion}
              </p>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                    style={{ padding: '0.3rem 0.7rem', border: 'none', background: '#f5f0eb', fontSize: '0.9rem', cursor: 'pointer' }}
                  >-</button>
                  <input
                    type="number"
                    value={cantidad}
                    min="1"
                    max={producto.stock}
                    onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, parseInt(e.target.value) || 1)))}
                    style={{ width: '40px', textAlign: 'center', border: 'none', padding: '0.3rem 0', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => setCantidad(prev => Math.min(producto.stock, prev + 1))}
                    style={{ padding: '0.3rem 0.7rem', border: 'none', background: '#f5f0eb', fontSize: '0.9rem', cursor: 'pointer' }}
                  >+</button>
                </div>

                <button
                  onClick={agregarAlCarrito}
                  disabled={producto.stock <= 0}
                  style={{
                    padding: '0.4rem 1.5rem',
                    background: '#8b1e3f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: producto.stock > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    opacity: producto.stock > 0 ? 1 : 0.5
                  }}
                >
                  <i className="fas fa-shopping-cart" style={{ fontSize: '0.85rem' }}></i> Añadir
                </button>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.75rem',
                color: '#666',
                borderTop: '1px solid #eee',
                paddingTop: '0.5rem'
              }}>
                <li style={{ marginBottom: '0.15rem' }}>
                  <strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}
                </li>
                <li style={{ marginBottom: '0.15rem' }}>
                  <strong>Entrega:</strong> 24/48h en península
                </li>
                <li>
                  <strong>Garantía:</strong> autenticidad y embalaje premium
                </li>
              </ul>
            </div>
          </div>

          {/* PRODUCTOS SIMILARES */}
          {productosSimilares.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e8e0d8' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#2d1b0e',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                🥃 Otros productos similares
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1.5rem'
              }}>
                {productosSimilares.map((item) => (
                  <Link 
                    key={item._id} 
                    href={`/shop/${item._id}`}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      background: 'rgba(255,255,255,0.7)',
                      borderRadius: '16px',
                      padding: '0.8rem',
                      border: '1px solid rgba(23,18,15,0.06)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '140px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#faf8f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={item.imagen?.startsWith('http') ? item.imagen : `${process.env.NEXT_PUBLIC_API_URL}${item.imagen}`}
                        alt={item.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.6rem',
                        textTransform: 'uppercase',
                        color: '#8b1e3f',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                      }}>
                        {item.categoria?.nombre || 'Licor'}
                      </span>
                      <h3 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#2d1b0e',
                        margin: '0.2rem 0'
                      }}>
                        {item.nombre}
                      </h3>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        color: '#8b1e3f'
                      }}>
                        ${item.precio.toFixed(2)}
                      </div>
                      <span style={{
                        fontSize: '0.6rem',
                        color: item.stock > 0 ? '#155724' : '#721c24',
                        backgroundColor: item.stock > 0 ? '#d4edda' : '#f8d7da',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '12px',
                        display: 'inline-block',
                        marginTop: '0.2rem'
                      }}>
                        {item.stock > 0 ? '✓ En stock' : '✗ Sin stock'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== FOOTER (SOLO UNO) ==================== */}
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

      {/* Scripts */}
      <script src="/assets/js/jquery-1.11.0.min.js"></script>
      <script src="/assets/js/jquery-migrate-1.2.1.min.js"></script>
      <script src="/assets/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/js/templatemo.js"></script>
      <script src="/assets/js/custom.js"></script>
    </>
  );
}