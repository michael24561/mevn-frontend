'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
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

  const isAdminUser = ['admin', 'administrador', 'super_admin'].includes(
    String(session?.user?.role ?? '').toLowerCase()
  );

  return (
    <div className="luxury-shell">
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
                <li className="nav-item"><Link className="nav-link active" href="/about">Nosotros</Link></li>
                <li className="nav-item"><Link className="nav-link" href="/shop">Productos</Link></li>
                <li className="nav-item"><Link className="nav-link" href="/contact">Contacto</Link></li>
              </ul>

              <div className="luxury-userbar">
                <Link href="/cart" className="luxury-icon" aria-label="Carrito">
                  <i className="fa fa-shopping-cart"></i>
                  <span className="cart-count">3</span>
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

      <main>
        <section className="page-hero about-hero">
          <div className="container page-hero-content">
            <div className="page-hero-copy">
              <span className="eyebrow">Nuestra historia</span>
              <h1>La esencia del buen beber, con criterio y pasión.</h1>
              <p>
                En Licores Deluxe creemos que cada botella cuenta una historia. Por eso seleccionamos
                marcas con identidad, legado y carácter para ofrecer una experiencia premium, clara y auténtica.
              </p>
            </div>
            <div className="page-hero-visual">
              <img
                src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80"
                alt="Historia de Licores Deluxe"
              />
            </div>
          </div>
        </section>

        <section className="container section-block about-grid">
          <div className="story-copy">
            <span className="eyebrow dark">Desde 2010</span>
            <h3>Una pasión que se convirtió en una referencia premium.</h3>
            <p>
              Licores Deluxe nació de la pasión por los destilados finos, el cuidado del detalle y una
              búsqueda constante por descubrir productos de gran valor. Hoy contamos con una selección
              de whiskies, rones, vinos y licores cuidadosamente curados para degustaciones, regalos y celebraciones.
            </p>
            <p>
              Nuestra misión es hacer que cada compra sea una experiencia sencilla, elegante y confiable,
              apoyada por asesoría real y un servicio orientado al cliente.
            </p>
          </div>

          <div className="feature-panel">
            <div className="mini-stat">
              <strong>+180</strong>
              <span>marcas premium</span>
            </div>
            <div className="mini-stat">
              <strong>10k+</strong>
              <span>pedidos atendidos</span>
            </div>
            <div className="mini-stat">
              <strong>24/48h</strong>
              <span>entrega estimada</span>
            </div>
          </div>
        </section>

        <section className="feature-band">
          <div className="container feature-grid">
            <div className="feature-item">
              <div className="feature-icon"><i className="fas fa-award"></i></div>
              <h4>Calidad superior</h4>
              <p>Curación exclusiva con marcas y referencias de alto nivel.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fas fa-box-open"></i></div>
              <h4>Servicio responsable</h4>
              <p>Embalaje cuidado, entrega segura y atención cercana.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fas fa-heart"></i></div>
              <h4>Vínculo con el cliente</h4>
              <p>Orientados a asesorar con criterio y honestidad.</p>
            </div>
          </div>
        </section>

        <section className="container section-block about-values">
          <div className="section-heading align-left">
            <span className="eyebrow dark">Nuestros valores</span>
            <h3>Más que una tienda: una experiencia de consumo premium.</h3>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-check-circle"></i>
              <h4>Autenticidad</h4>
              <p>Solo trabajamos con productos reales y marca de confianza.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-seedling"></i>
              <h4>Selección</h4>
              <p>Cuidamos cada elección para ofrecer un catálogo con identidad.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-star"></i>
              <h4>Experiencia</h4>
              <p>Queremos que cada compra se sienta elegante, clara y memorable.</p>
            </div>
          </div>
        </section>
      </main>

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
              <li>Whiskies Premium</li>
              <li>Vinos & Champagne</li>
              <li>Ron & Brandy</li>
            </ul>
          </div>

          <div>
            <h4>Información</h4>
            <ul className="footer-list">
              <li><Link href="/about">Sobre nosotros</Link></li>
              <li><Link href="/contact">Contacto</Link></li>
              <li>Política de envíos</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© {new Date().getFullYear()} Licores Deluxe. Todos los derechos reservados.</span>
            <div className="socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://x.com" target="_blank" rel="noreferrer"><i className="fab fa-x-twitter"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
