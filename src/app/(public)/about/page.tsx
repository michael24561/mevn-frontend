// app/about/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

export default function AboutPage() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Licores Deluxe - Sobre Nosotros</title>
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
                  <Link className="nav-link active" href="/about">Nosotros</Link>
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

      {/* Sección Hero */}
      <section className="bg-success py-5">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-md-8 text-white">
              <h1>Nuestra Historia</h1>
              <p>
                Licores Deluxe nació de la pasión por los destilados finos y el arte de la mixología. 
                Desde 2010, nos dedicamos a seleccionar las mejores bebidas espirituosas del mundo 
                para los paladares más exigentes. Nuestro equipo de sommeliers y expertos en licores 
                viaja por los cinco continentes en busca de productos exclusivos y ediciones limitadas.
              </p>
              <p>
                Más que una tienda, somos una comunidad de amantes de los buenos licores que valoran 
                la calidad, el origen y las historias detrás de cada botella.
              </p>
            </div>
            <div className="col-md-4">
              <img src="/assets/img/about-hero.svg" alt="Licores Premium" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Servicios */}
      <section className="container py-5">
        <div className="row text-center pt-5 pb-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1">Nuestros Servicios</h1>
            <p>
              Ofrecemos una experiencia de compra premium para los verdaderos conocedores de bebidas espirituosas.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center"><i className="fa fa-truck fa-lg"></i></div>
              <h2 className="h5 mt-4 text-center">Entrega Express</h2>
              <p className="text-center px-3">Envío en 24/48h con embalaje especial para licores</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center"><i className="fas fa-exchange-alt"></i></div>
              <h2 className="h5 mt-4 text-center">Asesoramiento Expertos</h2>
              <p className="text-center px-3">Recomendaciones personalizadas por nuestros sommeliers</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center"><i className="fa fa-gift"></i></div>
              <h2 className="h5 mt-4 text-center">Regalos Premium</h2>
              <p className="text-center px-3">Embalaje de lujo y tarjetas personalizadas</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow">
              <div className="h1 text-success text-center"><i className="fa fa-lock"></i></div>
              <h2 className="h5 mt-4 text-center">Compra Segura</h2>
              <p className="text-center px-3">Proceso de verificación de edad y entrega responsable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestras Marcas */}
      <section className="bg-light py-5">
        <div className="container my-4">
          <div className="row text-center py-3">
            <div className="col-lg-6 m-auto">
              <h1 className="h1">Nuestras Marcas</h1>
              <p>
                Colaboramos con las mejores destilerías y bodegas del mundo para ofrecerte una selección exclusiva.
              </p>
            </div>
            <div className="col-lg-9 m-auto tempaltemo-carousel">
              <div className="row d-flex flex-row">
                <div className="col-1 align-self-center">
                  <a className="h1" href="#brandCarousel" role="button" data-bs-slide="prev">
                    <i className="text-dark fas fa-chevron-left"></i>
                  </a>
                </div>

                <div className="col">
                  <div className="carousel slide carousel-multi-item pt-2 pt-md-0" id="brandCarousel" data-bs-ride="carousel">
                    <div className="carousel-inner product-links-wap" role="listbox">
                      <div className="carousel-item active">
                        <div className="row">
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/whisky-brand.png" alt="Whisky Premium" /></a>
                          </div>
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/tequila-brand.png" alt="Tequila Artesanal" /></a>
                          </div>
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/gin-brand.png" alt="Gin Botánico" /></a>
                          </div>
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/rum-brand.png" alt="Ron Añejo" /></a>
                          </div>
                        </div>
                      </div>

                      <div className="carousel-item">
                        <div className="row">
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/vodka-brand.png" alt="Vodka Premium" /></a>
                          </div>
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/cognac-brand.png" alt="Cognac Exclusivo" /></a>
                          </div>
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/mezcal-brand.png" alt="Mezcal Artesanal" /></a>
                          </div>
                          <div className="col-3 p-md-5">
                            <a href="#"><img className="img-fluid brand-img" src="/assets/img/champagne-brand.png" alt="Champagne de Lujo" /></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-1 align-self-center">
                  <a className="h1" href="#brandCarousel" role="button" data-bs-slide="next">
                    <i className="text-dark fas fa-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Compromiso */}
      <section className="container py-5">
        <div className="row">
          <div className="col-lg-6">
            <h2 className="h2 text-success">Nuestro Compromiso</h2>
            <p>
              En Licores Deluxe garantizamos la autenticidad de cada botella. Trabajamos directamente 
              con productores y distribuidores autorizados para ofrecerte productos 100% originales.
            </p>
            <ul className="list-unstyled">
              <li className="py-2"><i className="fas fa-check text-success me-2"></i> Certificados de autenticidad</li>
              <li className="py-2"><i className="fas fa-check text-success me-2"></i> Condiciones óptimas de almacenamiento</li>
              <li className="py-2"><i className="fas fa-check text-success me-2"></i> Entrega con control de temperatura</li>
              <li className="py-2"><i className="fas fa-check text-success me-2"></i> Servicio de verificación de coleccionables</li>
            </ul>
          </div>
          <div className="col-lg-6">
            <img src="/assets/img/wine-cellar.jpg" alt="Bodega de Licores" className="img-fluid rounded shadow" />
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