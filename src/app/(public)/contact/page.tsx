'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export default function PaginaDeContacto() {
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
                <li className="nav-item"><Link className="nav-link" href="/about">Nosotros</Link></li>
                <li className="nav-item"><Link className="nav-link" href="/shop">Productos</Link></li>
                <li className="nav-item"><Link className="nav-link active" href="/contact">Contacto</Link></li>
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
        <section className="page-hero contact-hero">
          <div className="container page-hero-content contact-layout">
            <div className="page-hero-copy">
              <span className="eyebrow">Contacto</span>
              <h1>Estamos aquí para ayudarte.</h1>
              <p>
                Te asesoramos para elegir la botella ideal, resolver dudas sobre productos y ayudarte
                a encontrar la mejor opción para cada momento especial.
              </p>

              <div className="contact-highlights">
                <div><i className="fas fa-clock"></i> Lunes a viernes: 9:00 - 20:00</div>
                <div><i className="fas fa-map-marker-alt"></i> Madrid 28001</div>
                <div><i className="fas fa-envelope"></i> info@licoresdeluxe.com</div>
              </div>
            </div>

            <div className="contact-visual">
              <img
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
                alt="Consultoría de licores"
              />
            </div>
          </div>
        </section>

        <section className="container section-block contact-wrap">
          <ContactForm />
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
