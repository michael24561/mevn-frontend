'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Categoria {
  _id: string;
  nombre: string;
  slug: string;
  destacada?: boolean;
}

const categoryImages: Record<string, string> = {
  whisky:
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80',
  ron:
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80',
  vodka:
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80',
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorias/destacadas?limit=3`);

        if (!response.ok) {
          throw new Error('Error al obtener categorías destacadas');
        }

        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setCategorias([
          { _id: '1', nombre: 'Whiskies Premium', slug: 'whisky' },
          { _id: '2', nombre: 'Ron Añejo', slug: 'ron' },
          { _id: '3', nombre: 'Vodka de Lujo', slug: 'vodka' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

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
    <>
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

              <button
                className="navbar-toggler luxury-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarContent"
                aria-controls="navbarContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarContent">
                <ul className="navbar-nav mx-auto luxury-nav">
                  <li className="nav-item"><Link className="nav-link active" href="/">Inicio</Link></li>
                  <li className="nav-item"><Link className="nav-link" href="/about">Nosotros</Link></li>
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
          <section className="hero-section">
            <div className="container hero-content">
              <div className="hero-copy">
                <span className="eyebrow">Licores premium</span>
                <h1>Elegancia en cada botella.</h1>
                <h2>Descubre sabores exclusivos para celebrar mejor.</h2>
                <p>
                  Selección premium de whiskies, rones, vinos y bebidas de autor para quienes buscan
                  calidad, autenticidad y momentos inolvidables.
                </p>
                <div className="hero-actions">
                  <Link href="/shop" className="btn luxury-button primary">Explorar colección</Link>
                  <Link href="/about" className="btn luxury-button secondary">Nuestra historia</Link>
                </div>
              </div>

              <div className="hero-visual">
                <div className="visual-card large-card">
                  <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"
                    alt="Botellas premium"
                  />
                </div>
                <div className="visual-card floating-card">
                  <span>Top sellers</span>
                  <strong>Edition Reserve</strong>
                  <small>12 colecciones premium</small>
                </div>
              </div>
            </div>
          </section>

          <section className="container section-block">
            <div className="section-heading">
              <span className="eyebrow dark">Categorías destacadas</span>
              <h3>Explora nuestras mejores selecciones</h3>
            </div>

            {loading ? (
              <div className="loading-wrap">
                <div className="spinner-border luxury-spinner" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando categorías...</p>
              </div>
            ) : (
              <div className="category-grid">
                {categorias.map((categoria) => {
                  const image = categoryImages[categoria.slug] ||
                    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80';

                  return (
                    <Link key={categoria._id} href={`/categorias/${categoria.slug}`} className="category-card">
                      <div className="category-image" style={{ backgroundImage: `url(${image})` }} />
                      <div className="category-content">
                        <h4>{categoria.nombre}</h4>
                        <span>Ver colección</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {error && (
              <div className="alert luxury-alert mt-4" role="alert">
                {error}
              </div>
            )}
          </section>

          <section className="feature-band">
            <div className="container feature-grid">
              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-certificate"></i></div>
                <h4>Autenticidad garantizada</h4>
                <p>Productos originales con origen verificado y asesoría especializada.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-shipping-fast"></i></div>
                <h4>Envío premium</h4>
                <p>Embalaje profesional, puntualidad y entrega segura en todo el país.</p>
              </div>

              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-user-tie"></i></div>
                <h4>Asesoramiento experto</h4>
                <p>Te ayudamos a elegir la botella ideal según tu ocasión y gustos.</p>
              </div>
            </div>
          </section>

          <section className="container section-block story-block">
            <div className="story-visual">
              <img
                src="https://images.unsplash.com/photo-1523364735318-4110ddcfe95e?auto=format&fit=crop&w=1200&q=80"
                alt="Bodega premium"
              />
            </div>
            <div className="story-copy">
              <span className="eyebrow dark">Nuestra propuesta</span>
              <h3>Una experiencia premium para amantes del buen beber.</h3>
              <p>
                En Licores Deluxe trabajamos con marcas de referencia y colecciones exclusivas para
                ofrecer una experiencia más elegante, personalizada y confiable.
              </p>
              <ul className="check-list">
                <li>Selección curada por expertos</li>
                <li>Marcas premium y ediciones limitadas</li>
                <li>Compra segura y servicio de atención cercano</li>
              </ul>
            </div>
          </section>

          <section className="cta-section">
            <div className="container cta-box">
              <div>
                <span className="eyebrow">Cliente premium</span>
                <h3>Haz de cada ocasión un momento memorable.</h3>
              </div>
              <Link href="/shop" className="btn luxury-button primary">Ver catálogo</Link>
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
    </>
  );
}
