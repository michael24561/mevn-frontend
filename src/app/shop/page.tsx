// app/shop/page.tsx - VERSIÓN SIMPLIFICADA CON UN SOLO HEADER Y FOOTER
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
}

export default function PaginaTienda() {
  const { data: session, status } = useSession();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [categorias, setCategorias] = useState<{ _id: string; nombre: string; slug: string }[]>([]);

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
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      const producto = productos.find(p => p._id === productoId);
      const toastId = toast.loading(`Agregando ${producto?.nombre || 'producto'} al carrito...`);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carritos/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId,
          cantidad: 1,
          clienteId: session?.user?.id || 'admin'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar al carrito');
      }

      setCartCount(prev => prev + 1);
      
      toast.update(toastId, {
        render: `¡${producto?.nombre || 'Producto'} agregado al carrito!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.error((error instanceof Error ? error.message : 'Error al agregar al carrito'));
    }
  };

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos`);
        if (!response.ok) throw new Error('Error al obtener los productos');
        const data = await response.json();

        const categoriasResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorias`);
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);
        
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
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }

  return (
    <>
      <Head>
        <title>Licores Deluxe - Nuestra Selección</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/templatemo.css" />
        <link rel="stylesheet" href="/assets/css/custom.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
      </Head>

      {/* ====== HEADER (UN SOLO) ====== */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block">
        <div className="container text-light">
          <div className="w-100 d-flex justify-content-between">
            <div>
              <i className="fa fa-envelope mx-2"></i>
              <a className="navbar-sm-brand text-light text-decoration-none" href="mailto:info@licoresdeluxe.com">info@licoresdeluxe.com</a>
              <i className="fa fa-phone mx-2"></i>
              <a className="navbar-sm-brand text-light text-decoration-none" href="tel:+34911234567">+34 911 234 567</a>
            </div>
            <div>
              <span className="text-light small">Envíos en 24/48h | Garantía de autenticidad</span>
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
                    <button className="btn luxury-account-button dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                      {session.user?.image ? (
                        <Image src={session.user.image} alt="User profile" width={30} height={30} className="rounded-circle me-2" />
                      ) : (
                        <i className="fa fa-user-circle me-2"></i>
                      )}
                      <span className="user-button-label">{session.user?.name || 'Mi cuenta'}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end luxury-user-menu">
                      <li><Link className="dropdown-item" href="/account"><i className="fa fa-user me-2"></i> Mi perfil</Link></li>
                      {isAdminUser && <li><Link className="dropdown-item" href="/admin/dashboard"><i className="fa fa-cog me-2"></i> Panel Admin</Link></li>}
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

      {/* ====== CONTENIDO ====== */}
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
                      <Link href={`/shop/${producto._id}`} className="btn luxury-button secondary ghost-button">Ver detalle</Link>
                      <button onClick={() => agregarAlCarrito(producto._id)} className="btn luxury-button primary" disabled={producto.stock <= 0}>
                        {producto.stock <= 0 ? 'Sin stock' : 'Comprar'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== FOOTER (UN SOLO) ====== */}
      <footer className="bg-dark text-light" id="licores_footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 pt-5">
              <h2 className="h2 text-success border-bottom pb-3 border-light logo">Licores Deluxe</h2>
              <ul className="list-unstyled footer-link-list">
                <li className="mb-2"><i className="fas fa-map-marker-alt fa-fw me-2"></i> Av. de los Licores 123, Madrid 28001</li>
                <li className="mb-2"><i className="fa fa-phone fa-fw me-2"></i> <a className="text-light text-decoration-none" href="tel:+34911234567">+34 911 234 567</a></li>
                <li className="mb-2"><i className="fa fa-envelope fa-fw me-2"></i> <a className="text-light text-decoration-none" href="mailto:info@licoresdeluxe.com">info@licoresdeluxe.com</a></li>
                <li><i className="fa fa-clock fa-fw me-2"></i> Lunes-Viernes: 9:00 - 20:00</li>
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
        </div>
        <div className="w-100 bg-black py-3">
          <div className="container">
            <div className="row pt-2">
              <div className="col-12">
                <p className="text-left m-0">&copy; {new Date().getFullYear()} Licores Deluxe - Todos los derechos reservados | Consumo responsable. Prohibida la venta a menores de 18 años.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <script src="/assets/js/jquery-1.11.0.min.js"></script>
      <script src="/assets/js/jquery-migrate-1.2.1.min.js"></script>
      <script src="/assets/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/js/templatemo.js"></script>
      <script src="/assets/js/custom.js"></script>
    </>
  );
}