'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
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
  const { id } = useParams();
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
                <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">{cartCount}</span>
              </Link>

              {session ? (
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

      {/* Contenido principal del producto */}
      <div className="container py-5">
        <div className="row gx-5">
          {/* Barra Lateral de Categorías */}
          <div className="col-lg-3">
            <h1 className="h2 pb-4">Categorías</h1>
            <ul className="list-unstyled templatemo-accordion">
              {categorias.length === 0 ? (
                <li className="text-muted">No hay categorías registradas</li>
              ) : (
                categorias.map((categoria) => (
                  <li key={categoria._id} className="pb-2">
                    <Link
                      className="d-flex justify-content-between h5 text-decoration-none"
                      href={`/categorias/${categoria.slug}`}
                    >
                      {categoria.nombre}
                      <i className="fa fa-fw fa-chevron-circle-right mt-1"></i>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Contenido principal del producto */}
          <div className="col-lg-9">
            <div className="row">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="border rounded-4 mb-3 d-flex justify-content-center">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    width={550}
                    height="auto"
                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                  />
                </div>
                
                {producto.imagenesAdicionales && producto.imagenesAdicionales.length > 0 && (
                  <div className="row gx-3">
                    {producto.imagenesAdicionales.map((img, index) => (
                      <div className="col-4" key={index}>
                        <button 
                          className="border rounded-2 p-1 w-100"
                          onClick={() => setProducto({...producto, imagen: img})}
                        >
                          <Image
                            src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`}
                            alt={`Vista ${index + 1} de ${producto.nombre}`}
                            width={200}
                            height={200}
                            className="img-fluid rounded-2"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-lg-6">
                <h2 className="fw-bold mb-4">{producto.nombre}</h2>
                
                {producto.rating && (
                  <div className="d-flex align-items-center mb-3">
                    <div className="text-warning me-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.floor(producto.rating!) ? 'fas' : 'far'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-muted">
                      {producto.rating.toFixed(1)} ({producto.numReviews} reseñas)
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-primary fs-3 fw-bold">${producto.precio.toFixed(2)}</span>
                  {producto.stock > 0 ? (
                    <span className="text-success ms-3">
                      <i className="fas fa-check-circle me-1"></i> En stock
                    </span>
                  ) : (
                    <span className="text-danger ms-3">
                      <i className="fas fa-times-circle me-1"></i> Sin stock
                    </span>
                  )}
                </div>

                <p className="mb-4">{producto.descripcion}</p>

                {producto.categoria && (
                  <div className="mb-3">
                    <span className="fw-bold me-2">Categoría:</span>
                    <Link 
                      href={`/categorias/${producto.categoria.slug || producto.categoria._id}`} 
                      className="text-decoration-none text-success"
                    >
                      {producto.categoria.nombre}
                    </Link>
                  </div>
                )}

                {producto.especificaciones && producto.especificaciones.length > 0 && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Especificaciones</h5>
                    <ul className="list-unstyled">
                      {producto.especificaciones.map((item, index) => (
                        <li key={index} className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="row gx-3 mb-4">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <label className="form-label">Cantidad</label>
                    <div className="input-group">
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center" 
                        value={cantidad}
                        min="1"
                        max={producto.stock}
                        onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, parseInt(e.target.value) || 1)))}
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => setCantidad(prev => Math.min(producto.stock, prev + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    className="btn btn-success flex-grow-1 py-3"
                    onClick={agregarAlCarrito}
                    disabled={producto.stock <= 0}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Añadir al carrito
                  </button>
                  <button className="btn btn-outline-success flex-grow-1 py-3">
                    <i className="fas fa-heart me-2"></i>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
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