// app/shop/[id]/page.tsx - VERSIÓN CON ESTILOS EN LÍNEA QUE ANULAN CSS GLOBAL

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);

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
        
        setProducto({
          ...productoData,
          imagen: productoData.imagen.startsWith('http') 
            ? productoData.imagen 
            : `${process.env.NEXT_PUBLIC_API_URL}${productoData.imagen}`
        });
        
        setCategorias(categoriasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarDatos();
    }
  }, [id]);

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
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/templatemo.css" />
        <link rel="stylesheet" href="/assets/css/custom.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
      </Head>

      <div className="shop-shell">
        <div className="container" style={{ padding: '1rem 0' }}>
          {/* LAYOUT CON ESTILOS EN LÍNEA PARA ANULAR CSS GLOBAL */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr 1fr',
            gap: '1.5rem',
            alignItems: 'start',
            padding: '0.5rem 0'
          }}>
            
            {/* ========== SIDEBAR COMPACTO ========== */}
            <aside style={{ 
              minWidth: '140px', 
              maxWidth: '180px',
              padding: '0.3rem',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              height: 'fit-content'
            }}>
              <h3 style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                marginBottom: '0.3rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#2d1b0e',
                borderBottom: '2px solid #8b1e3f',
                paddingBottom: '0.2rem'
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
                  <li style={{ padding: '0.2rem 0.3rem', fontSize: '0.65rem', color: '#999' }}>
                    No hay categorías
                  </li>
                ) : (
                  categorias.map((cat) => (
                    <li key={cat._id} style={{ marginBottom: '0.1rem' }}>
                      <button
                        type="button"
                        style={{
                          width: '100%',
                          padding: '0.15rem 0.3rem',
                          fontSize: '0.65rem',
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
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f5f0eb';
                          e.currentTarget.style.color = '#8b1e3f';
                          e.currentTarget.style.fontWeight = '500';
                          e.currentTarget.style.paddingLeft = '0.5rem';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#4a3728';
                          e.currentTarget.style.fontWeight = '400';
                          e.currentTarget.style.paddingLeft = '0.3rem';
                        }}
                      >
                        <span style={{ fontSize: '0.65rem' }}>{cat.nombre}</span>
                        <i className="fa fa-chevron-right" style={{ 
                          fontSize: '0.35rem', 
                          color: '#8b1e3f', 
                          opacity: 0.3,
                          width: 'auto',
                          height: 'auto',
                          background: 'transparent',
                          borderRadius: '0'
                        }}></i>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </aside>

            {/* ========== GALERÍA ========== */}
            <div>
              <div style={{
                maxHeight: '340px',
                overflow: 'hidden',
                borderRadius: '12px',
                background: '#faf8f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #eee'
              }}>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '340px' }}
                />
              </div>
              {producto.imagenesAdicionales && producto.imagenesAdicionales.length > 0 && (
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  {producto.imagenesAdicionales.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setProducto({ ...producto, imagen: img })}
                      style={{
                        width: '50px',
                        height: '40px',
                        overflow: 'hidden',
                        borderRadius: '6px',
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
                        width={50}
                        height={40}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ========== INFORMACIÓN ========== */}
            <div style={{
              padding: '1rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(23,18,15,0.06)'
            }}>
              <span style={{
                fontSize: '0.55rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#8b1e3f',
                fontWeight: '600'
              }}>
                {producto.categoria?.nombre || 'Licores premium'}
              </span>
              <h1 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: '0.15rem 0 0.1rem',
                lineHeight: '1.2'
              }}>
                {producto.nombre}
              </h1>

              <div style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#8b1e3f',
                margin: '0.1rem 0'
              }}>
                ${producto.precio.toFixed(2)}
              </div>

              <span style={{
                display: 'inline-block',
                padding: '0.1rem 0.5rem',
                fontSize: '0.6rem',
                borderRadius: '20px',
                fontWeight: '500',
                backgroundColor: producto.stock > 0 ? '#d4edda' : '#f8d7da',
                color: producto.stock > 0 ? '#155724' : '#721c24',
                marginBottom: '0.3rem'
              }}>
                <i className={producto.stock > 0 ? 'fas fa-check-circle' : 'fas fa-times-circle'} style={{ marginRight: '0.2rem', fontSize: '0.5rem' }}></i>
                {producto.stock > 0 ? 'En stock' : 'Sin stock'}
              </span>

              <p style={{
                fontSize: '0.75rem',
                lineHeight: '1.5',
                color: '#555',
                margin: '0.2rem 0 0.4rem'
              }}>
                {producto.descripcion}
              </p>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                    style={{ padding: '0.2rem 0.5rem', border: 'none', background: '#f5f0eb', fontSize: '0.75rem', cursor: 'pointer' }}
                  >-</button>
                  <input
                    type="number"
                    value={cantidad}
                    min="1"
                    max={producto.stock}
                    onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, parseInt(e.target.value) || 1)))}
                    style={{ width: '32px', textAlign: 'center', border: 'none', padding: '0.2rem 0', fontSize: '0.7rem' }}
                  />
                  <button
                    onClick={() => setCantidad(prev => Math.min(producto.stock, prev + 1))}
                    style={{ padding: '0.2rem 0.5rem', border: 'none', background: '#f5f0eb', fontSize: '0.75rem', cursor: 'pointer' }}
                  >+</button>
                </div>

                <button
                  onClick={agregarAlCarrito}
                  disabled={producto.stock <= 0}
                  style={{
                    padding: '0.25rem 1rem',
                    background: '#8b1e3f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    cursor: producto.stock > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    opacity: producto.stock > 0 ? 1 : 0.5
                  }}
                >
                  <i className="fas fa-shopping-cart" style={{ fontSize: '0.7rem' }}></i> Añadir
                </button>
              </div>

              {/* Meta */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.65rem',
                color: '#666',
                borderTop: '1px solid #eee',
                paddingTop: '0.3rem'
              }}>
                <li style={{ marginBottom: '0.1rem' }}>
                  <strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}
                </li>
                <li style={{ marginBottom: '0.1rem' }}>
                  <strong>Entrega:</strong> 24/48h en península
                </li>
                <li>
                  <strong>Garantía:</strong> autenticidad y embalaje premium
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <script src="/assets/js/jquery-1.11.0.min.js"></script>
      <script src="/assets/js/jquery-migrate-1.2.1.min.js"></script>
      <script src="/assets/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/js/templatemo.js"></script>
      <script src="/assets/js/custom.js"></script>
    </>
  );
}