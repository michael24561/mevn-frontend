'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

// Extiende el tipo de usuario de la sesión para incluir 'id'
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
import Head from 'next/head';
import { toast } from 'react-toastify';

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

      {/* Barra superior */}
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

                {session ? (
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

      <div className="shop-shell">
        <div className="container product-detail-layout">
          <aside className="shop-sidebar">
            <h3>Categorías</h3>
            <ul className="sidebar-list">
              {categorias.length === 0 ? (
                <li className="empty-state">No hay categorías registradas</li>
              ) : (
                categorias.map((categoria) => (
                  <li key={categoria._id}>
                    <button type="button" className="active">
                      <span>{categoria.nombre}</span>
                      <i className="fa fa-chevron-right"></i>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>

          <div className="product-gallery">
            <div className="product-gallery-main">
              <img src={producto.imagen} alt={producto.nombre} />
            </div>

            {producto.imagenesAdicionales && producto.imagenesAdicionales.length > 0 && (
              <div className="product-thumbs">
                {producto.imagenesAdicionales.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className="product-thumb"
                    onClick={() => setProducto({ ...producto, imagen: img })}
                  >
                    <Image
                      src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`}
                      alt={`Vista ${index + 1} de ${producto.nombre}`}
                      width={200}
                      height={160}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-summary">
            <span className="eyebrow dark">{producto.categoria?.nombre || 'Licores premium'}</span>
            <h1>{producto.nombre}</h1>

            <div className="product-price">${producto.precio.toFixed(2)}</div>

            <span className={producto.stock > 0 ? 'stock-pill' : 'stock-pill out'}>
              <i className={producto.stock > 0 ? 'fas fa-check-circle' : 'fas fa-times-circle'}></i>
              {producto.stock > 0 ? 'En stock' : 'Sin stock'}
            </span>

            <p>{producto.descripcion}</p>

            <div className="product-actions-row">
              <div className="quantity-box">
                <button type="button" onClick={() => setCantidad(prev => Math.max(1, prev - 1))}>-</button>
                <input type="number" value={cantidad} min="1" max={producto.stock} onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, parseInt(e.target.value) || 1)))} />
                <button type="button" onClick={() => setCantidad(prev => Math.min(producto.stock, prev + 1))}>+</button>
              </div>

              <button className="btn luxury-button primary" onClick={agregarAlCarrito} disabled={producto.stock <= 0}>
                <i className="fas fa-shopping-cart me-2"></i> Añadir
              </button>
            </div>

            <ul className="meta-list">
              <li><strong>Categoría:</strong> {producto.categoria?.nombre || 'Sin categoría'}</li>
              <li><strong>Entrega:</strong> 24/48h en península</li>
              <li><strong>Garantía:</strong> autenticidad y embalaje premium</li>
            </ul>
          </div>
        </div>
      </div>


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
}