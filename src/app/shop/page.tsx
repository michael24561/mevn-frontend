// app/shop/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
  stock: number;
  categoria?: {
    _id: string;
    nombre: string;
  };
  proveedor?: {
    _id: string;
    nombre: string;
  };
}

export default function PaginaTienda() {
  const { data: session, status } = useSession();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [categorias, setCategorias] = useState<
    { _id: string; nombre: string; slug: string }[]
  >([]);

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

  const agregarAlCarrito = async (productoId: string) => {
    if (status !== "authenticated") {
      toast.error('Debes iniciar sesión para agregar productos al carrito', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    try {
      const producto = productos.find(p => p._id === productoId);
      const productoNombre = producto?.nombre || 'producto';

      const toastId = toast.loading(`Agregando ${productoNombre} al carrito...`);

      const clienteId = session?.user?.id || 'admin';

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productoId,
          cantidad: 1,
          clienteId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar al carrito');
      }

      const data = await response.json();
      setCartCount(prev => prev + 1);
      
      toast.update(toastId, {
        render: `¡${productoNombre} agregado al carrito!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      
      return data;
    } catch (error) {
      const errorMessage = (error instanceof Error && error.message) ? error.message : 'Error al agregar al carrito';
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos`);
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();

        const cargarCategorias = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorias`);
            if (!response.ok) throw new Error('Error al cargar categorías');
            const data = await response.json();
            setCategorias(data);
          } catch (err) {
            console.error('Error al cargar categorías:', err);
          }
        };

        cargarCategorias();
        
        const productosConImagen = data.map((producto: Producto) => ({
          ...producto,
          imagen: producto.imagen 
            ? producto.imagen.startsWith('http') 
              ? producto.imagen 
              : `${process.env.NEXT_PUBLIC_API_URL}${producto.imagen}`
            : '/assets/img/licor_default.jpg',
        }));
        
        setProductos(productosConImagen);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();

    if (status === "authenticated") {
      const cargarCarrito = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos?clienteId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setCartCount(data.items?.length || 0);
          }
        } catch (error) {
          console.error('Error al cargar carrito:', error);
        }
      };
      cargarCarrito();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-5">
        {error}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Licores Deluxe - Nuestra Selección</title>
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

      {/* ==================== HEADER ==================== */}
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

      {/* ==================== CONTENIDO PRINCIPAL ==================== */}
      <div className="shop-shell">
        <section className="shop-page-hero">
          <div className="container py-5">
            <div className="shop-toolbar">
              <h2>Catálogo premium</h2>
              <span className="badge">{productos.length} productos</span>
            </div>
          </div>
        </section>

        <div className="container shop-layout">
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

          <div className="shop-content">
            <div className="shop-toolbar">
              <h2>Todos los licores</h2>
              <span className="badge">Destacados</span>
            </div>

            {productos.length === 0 ? (
              <div className="empty-state">No hay productos disponibles</div>
            ) : (
              <div className="product-grid">
                {productos.map((producto) => (
                  <article key={producto._id} className="product-card">
                    <div className="product-card-image">
                      <img src={producto.imagen} alt={producto.nombre} />
                    </div>

                    <div className="product-card-body">
                      <div className="product-meta">
                        <span>{producto.categoria?.nombre || 'Licores'}</span>
                        <span>Stock {producto.stock}</span>
                      </div>

                      <h3>{producto.nombre}</h3>
                      <div className="product-price">${producto.precio.toFixed(2)}</div>

                      <div className="product-actions">
                        <Link href={`/shop/${producto._id}`} className="btn luxury-button secondary ghost-button">
                          Ver detalle
                        </Link>
                        <button
                          onClick={() => agregarAlCarrito(producto._id)}
                          className="btn luxury-button primary"
                          disabled={producto.stock <= 0}
                        >
                          {producto.stock <= 0 ? 'Sin stock' : 'Comprar'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="luxury-footer">
        <div className="container footer-grid">
          <div>
            <h4>Licores Deluxe</h4>
            <ul className="footer-list">
              <li><i className="fas fa-map-marker-alt"></i> Av. de los Licores 123, Madrid 28001</li>
              <li><i className="fa fa-phone"></i> +34 911 234 567</li>
              <li><i className="fa fa-envelope"></i> info@licoresdeluxe.com</li>
            </ul>
          </div>

          <div>
            <h4>Productos</h4>
            <ul className="footer-list">
              <li><Link href="/shop">Whiskies Premium</Link></li>
              <li><Link href="/shop">Vinos & Champagne</Link></li>
              <li><Link href="/shop">Ron & Brandy</Link></li>
            </ul>
          </div>

          <div>
            <h4>Información</h4>
            <ul className="footer-list">
              <li><Link href="/about">Sobre nosotros</Link></li>
              <li><Link href="/contact">Contacto</Link></li>
              <li><Link href="/shop">Política de envíos</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© {new Date().getFullYear()} Licores Deluxe - Todos los derechos reservados | Consumo responsable. Prohibida la venta a menores de 18 años.</span>
            <div className="socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://x.com" target="_blank" rel="noreferrer"><i className="fab fa-x-twitter"></i></a>
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