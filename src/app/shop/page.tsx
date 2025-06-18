// app/shop/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/productos');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        
        // Asegurarnos de que las imágenes tengan la URL completa si son rutas relativas
        const productosConImagen = data.map((producto: Producto) => ({
          ...producto,
          imagen: producto.imagen 
            ? producto.imagen.startsWith('http') 
              ? producto.imagen 
              : `http://localhost:5000${producto.imagen}`
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
  }, []);

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

      {/* Barra principal */}
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
                  <Link className="nav-link active" href="/shop">Productos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/contact">Contacto</Link>
                </li>
              </ul>
            </div>
            
            <div className="navbar align-self-center d-flex">
              {/* Componente de búsqueda para móviles */}
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
              
              {/* Icono de búsqueda para desktop */}
              <a className="nav-icon d-none d-lg-inline" href="#" data-bs-toggle="modal" data-bs-target="#templatemo_search">
                <i className="fa fa-fw fa-search text-dark mr-2"></i>
              </a>
              
              {/* Carrito de compras */}
              <Link className="nav-icon position-relative text-decoration-none" href="/cart">
                <i className="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">3</span>
              </Link>

              {/* Área de usuario */}
              {status === "authenticated" ? (
                <div className="dropdown ms-3">
                  <button
                    className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        width={32}
                        height={32}
                        className="rounded-circle me-2"
                      />
                    ) : (
                      <i className="fa fa-user-circle me-2"></i>
                    )}
                    <span className="d-none d-lg-inline">{session.user?.name || 'Mi cuenta'}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" href="/account">
                        <i className="fa fa-user me-2"></i> Mi perfil
                      </Link>
                    </li>
                    {session.user?.role === 'admin' && (
                      <li>
                        <Link className="dropdown-item" href="/admin/dashboard">
                          <i className="fa fa-cog me-2"></i> Panel Admin
                        </Link>
                      </li>
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
              ) : (
                <Link className="nav-link" href="/auth/login">
                  <i className="fa fa-user me-2"></i> Iniciar sesión
                </Link>
              )}
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

      {/* Contenido principal de la tienda */}
      <div className="container py-5">
        <div className="row">
          {/* Barra Lateral de Categorías */}
          <div className="col-lg-3">
            <h1 className="h2 pb-4">Categorías</h1>
            <ul className="list-unstyled templatemo-accordion">
              <li className="pb-3">
                <a className="collapsed d-flex justify-content-between h3 text-decoration-none" href="#">
                  Tipo
                  <i className="fa fa-fw fa-chevron-circle-down mt-1"></i>
                </a>
                <ul className="collapse show list-unstyled pl-3">
                  <li><Link className="text-decoration-none" href="#">Whisky</Link></li>
                  <li><Link className="text-decoration-none" href="#">Vodka</Link></li>
                  <li><Link className="text-decoration-none" href="#">Ron</Link></li>
                  <li><Link className="text-decoration-none" href="#">Tequila</Link></li>
                </ul>
              </li>
              <li className="pb-3">
                <a className="collapsed d-flex justify-content-between h3 text-decoration-none" href="#">
                  Ofertas
                  <i className="pull-right fa fa-fw fa-chevron-circle-down mt-1"></i>
                </a>
                <ul id="collapseTwo" className="collapse list-unstyled pl-3">
                  <li><Link className="text-decoration-none" href="#">Promociones</Link></li>
                  <li><Link className="text-decoration-none" href="#">Ediciones Limitadas</Link></li>
                  <li><Link className="text-decoration-none" href="#">Combos</Link></li>
                </ul>
              </li>
              <li className="pb-3">
                <a className="collapsed d-flex justify-content-between h3 text-decoration-none" href="#">
                  Precio
                  <i className="pull-right fa fa-fw fa-chevron-circle-down mt-1"></i>
                </a>
                <ul id="collapseThree" className="collapse list-unstyled pl-3">
                  <li><Link className="text-decoration-none" href="#">Premium</Link></li>
                  <li><Link className="text-decoration-none" href="#">Gama Media</Link></li>
                  <li><Link className="text-decoration-none" href="#">Básicos</Link></li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Listado de Productos */}
          <div className="col-lg-9">
            <div className="row">
              <div className="col-md-6">
                <ul className="list-inline shop-top-menu pb-3 pt-1">
                  <li className="list-inline-item">
                    <Link className="h3 text-dark text-decoration-none mr-3" href="#">Todos</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link className="h3 text-dark text-decoration-none mr-3" href="#">Destilados</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link className="h3 text-dark text-decoration-none" href="#">Licores</Link>
                  </li>
                </ul>
              </div>
              <div className="col-md-6 pb-4">
                <div className="d-flex">
                  <select className="form-control">
                    <option>Destacados</option>
                    <option>Precio: Menor a Mayor</option>
                    <option>Precio: Mayor a Menor</option>
                    <option>Novedades</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cuadrícula de Productos */}
            {productos.length === 0 ? (
              <div className="alert alert-warning text-center">
                No hay productos disponibles
              </div>
            ) : (
              <div className="row">
                {productos.map((producto) => (
                  <div key={producto._id} className="col-md-4 mb-4">
                    <div className="card mb-4 product-wap rounded-0 h-100">
                      <div className="card rounded-0">
                        <img 
                          className="card-img rounded-0 img-fluid" 
                          src={producto.imagen} 
                          alt={producto.nombre}
                          style={{ height: '300px', objectFit: 'cover' }}
                        />
                        <div className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                          <ul className="list-unstyled">
                            <li>
                              <button className="btn btn-success text-white">
                                <i className="far fa-heart"></i>
                              </button>
                            </li>
                            <li>
                              <Link 
                                href={`/shop-single/${producto._id}`} 
                                className="btn btn-success text-white mt-2"
                              >
                                <i className="far fa-eye"></i>
                              </Link>
                            </li>
                            <li>
                              <button className="btn btn-success text-white mt-2">
                                <i className="fas fa-cart-plus"></i>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="card-body">
                        <Link 
                          href={`/shop-single/${producto._id}`} 
                          className="h3 text-decoration-none"
                        >
                          {producto.nombre}
                        </Link>
                        <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">
                          <li>Stock: {producto.stock}</li>
                          {producto.categoria && (
                            <li className="text-muted">{producto.categoria.nombre}</li>
                          )}
                        </ul>
                        <ul className="list-unstyled d-flex justify-content-center mb-1">
                          <li>
                            <i className="text-warning fa fa-star"></i>
                            <i className="text-warning fa fa-star"></i>
                            <i className="text-warning fa fa-star"></i>
                            <i className="text-muted fa fa-star"></i>
                            <i className="text-muted fa fa-star"></i>
                          </li>
                        </ul>
                        <p className="text-center mb-0">${producto.precio.toFixed(2)}</p>
                        {producto.descripcion && (
                          <p className="text-muted small mt-2">{producto.descripcion.substring(0, 60)}...</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            <div className="row">
              <ul className="pagination pagination-lg justify-content-end">
                <li className="page-item disabled">
                  <a className="page-link active rounded-0 mr-3 shadow-sm border-top-0 border-left-0" href="#" tabIndex={-1}>1</a>
                </li>
                <li className="page-item">
                  <a className="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-dark" href="#">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link rounded-0 shadow-sm border-top-0 border-left-0 text-dark" href="#">3</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Marcas */}
      <section className="bg-light py-5">
        <div className="container my-4">
          <div className="row text-center py-3">
            <div className="col-lg-6 m-auto">
              <h1 className="h1">Nuestras Marcas</h1>
              <p>
                Las mejores marcas internacionales de licores y destilados, seleccionadas para los paladares más exigentes.
              </p>
            </div>
            <div className="col-lg-9 m-auto tempaltemo-carousel">
              <div className="row d-flex flex-row">
                <div className="col-1 align-self-center">
                  <a className="h1" href="#brandCarousel" role="button" data-bs-slide="prev">
                    <i className="text-light fas fa-chevron-left"></i>
                  </a>
                </div>

                <div className="col">
                  <div className="carousel slide carousel-multi-item pt-2 pt-md-0" id="brandCarousel" data-bs-ride="carousel">
                    <div className="carousel-inner product-links-wap" role="listbox">
                      <div className="carousel-item active">
                        <div className="row">
                          {[1, 2, 3, 4].map((brand) => (
                            <div key={brand} className="col-3 p-md-5">
                              <a href="#">
                                <img 
                                  className="img-fluid brand-img" 
                                  src={`/assets/img/marca_0${brand}.png`} 
                                  alt={`Marca ${brand}`} 
                                />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-1 align-self-center">
                  <a className="h1" href="#brandCarousel" role="button" data-bs-slide="next">
                    <i className="text-light fas fa-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Scripts */}
      <script src="/assets/js/jquery-1.11.0.min.js"></script>
      <script src="/assets/js/jquery-migrate-1.2.1.min.js"></script>
      <script src="/assets/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/js/templatemo.js"></script>
      <script src="/assets/js/custom.js"></script>
    </>
  );
}