import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductosList from './ProductosList';
import { unstable_noStore as noStore } from 'next/cache';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// Función para obtener datos de la categoría
async function getCategoria(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categorias/slug/${slug}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching categoria:', error);
    return null;
  }
}

// Función para obtener todas las categorías
async function getCategorias() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categorias`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const data = await res.json();

    // 👇 Esta línea lo arregla todo
    return Array.isArray(data) ? data : data.categorias || [];
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return [];
  }
}


export default async function CategoriaPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  noStore();

  const { slug } = await params;
  const data = await getCategoria(slug);
  const categorias = await getCategorias();

  if (!data?.categoria) {
    return notFound();
  }

  return (
    <>
      {/* Navbar */}
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
              <a className="nav-icon d-none d-lg-inline" href="#" data-bs-toggle="modal" data-bs-target="#templatemo_search">
                <i className="fa fa-fw fa-search text-dark mr-2"></i>
              </a>
              
              <Link className="nav-icon position-relative text-decoration-none" href="/cart">
                <i className="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                <span className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">0</span>
              </Link>

              <Link className="nav-link" href="/auth/login">
                <i className="fa fa-user me-2"></i> Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container py-5">
        <div className="row">
          {/* Categorías al lado izquierdo */}
          <div className="col-lg-3 mb-4">
            <h5 className="fw-bold border-bottom pb-2">Categorías</h5>
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

          {/* Productos a la derecha */}
          <div className="col-lg-9">
            <h2 className="fw-bold mb-4">{data.categoria.nombre}</h2>
            <ProductosList slug={data.categoria.slug} />
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
              </ul>
            </div>

            <div className="col-md-4 pt-5">
              <h2 className="h2 border-bottom pb-3 border-light">Información</h2>
              <ul className="list-unstyled footer-link-list">
                <li className="mb-2"><Link className="text-light text-decoration-none" href="/">Inicio</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="/about">Sobre Nosotros</Link></li>
                <li className="mb-2"><Link className="text-light text-decoration-none" href="/contact">Contacto</Link></li>
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
              </ul>
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