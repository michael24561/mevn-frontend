import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const DetalleProducto = () => {
  // Datos del producto (podrían venir de una API o props)
  const producto = {
    titulo: "Whisky Escocés Premium",
    precio: 89.99,
    calificacion: 4.8,
    reseñas: 42,
    marca: "Highland Reserve",
    descripcion: "Un whisky escocés de malta única, añejado por 12 años en barricas de roble. Notas de vainilla, caramelo y un suave toque ahumado. Perfecto para disfrutar solo o en tus cocktails favoritos.",
    colores: ["Ámbar", "Dorado"],
    especificaciones: [
      "Añejamiento: 12 años",
      "Tipo: Single Malt",
      "Región: Highlands",
      "Graduación alcohólica: 40%",
      "Volumen: 750ml",
      "Notas de cata: Vainilla, caramelo, ahumado ligero",
      "Perfecto para: Tomar solo, on the rocks o en cocktails"
    ],
    tamaños: ["500ml", "750ml", "1L"],
    imagenes: [
      "whisky_01.jpg",
      "whisky_02.jpg",
      "whisky_03.jpg",
      "whisky_04.jpg",
      "whisky_05.jpg",
      "whisky_06.jpg",
      "whisky_07.jpg",
      "whisky_08.jpg",
      "whisky_09.jpg"
    ],
    imagenPrincipal: "whisky_principal.jpg"
  };

  const productosRelacionados = [
    {
      id: 1,
      nombre: "Whisky Irlandés",
      precio: 75.99,
      imagen: "whisky_irlandes.jpg",
      calificacion: 4,
      colores: ["Dorado", "Ámbar"]
    },
    {
      id: 2,
      nombre: "Bourbon Selecto",
      precio: 65.50,
      imagen: "bourbon.jpg",
      calificacion: 5,
      colores: ["Ámbar oscuro"]
    },
    {
      id: 3,
      nombre: "Ron Añejo",
      precio: 55.00,
      imagen: "ron_anejo.jpg",
      calificacion: 4,
      colores: ["Caoba", "Dorado"]
    },
    {
      id: 4,
      nombre: "Tequila Reposado",
      precio: 49.99,
      imagen: "tequila.jpg",
      calificacion: 5,
      colores: ["Dorado claro"]
    },
    {
      id: 5,
      nombre: "Vodka Premium",
      precio: 39.99,
      imagen: "vodka.jpg",
      calificacion: 4,
      colores: ["Cristalino"]
    }
  ];

  return (
    <>
      <Head>
        <title>Licores Deluxe - Detalle del Producto</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/assets/img/apple-icon.png" />
        <link rel="shortcut icon" type="image/x-icon" href="/assets/img/favicon.ico" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/templatemo.css" />
        <link rel="stylesheet" href="/assets/css/custom.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/slick-theme.css" />
      </Head>

      {/* Modal de Búsqueda */}
      <div className="modal fade bg-white" id="templatemo_search" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="w-100 pt-1 mb-5 text-right">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <form action="" method="get" className="modal-content modal-body border-0 p-0">
            <div className="input-group mb-2">
              <input type="text" className="form-control" id="inputModalSearch" name="q" placeholder="Buscar..." />
              <button type="submit" className="input-group-text bg-success text-light">
                <i className="fa fa-fw fa-search text-white"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contenido del Producto */}
      <section className="bg-light">
        <div className="container pb-5">
          <div className="row">
            {/* Imágenes del Producto */}
            <div className="col-lg-5 mt-5">
              <div className="card mb-3">
                <img 
                  className="card-img img-fluid" 
                  src={`/assets/img/${producto.imagenPrincipal}`} 
                  alt={producto.titulo} 
                  id="producto-detalle" 
                />
              </div>
              
              {/* Carrusel de Imágenes */}
              <div className="row">
                <div className="col-1 align-self-center">
                  <a href="#multi-item-example" role="button" data-bs-slide="prev">
                    <i className="text-dark fas fa-chevron-left"></i>
                    <span className="sr-only">Anterior</span>
                  </a>
                </div>
                
                <div id="multi-item-example" className="col-10 carousel slide carousel-multi-item" data-bs-ride="carousel">
                  <div className="carousel-inner product-links-wap" role="listbox">
                    {/* Primer slide con 3 imágenes */}
                    <div className="carousel-item active">
                      <div className="row">
                        {producto.imagenes.slice(0, 3).map((img, index) => (
                          <div className="col-4" key={`first-${index}`}>
                            <a href="#">
                              <img className="card-img img-fluid" src={`/assets/img/${img}`} alt={`Producto ${index + 1}`} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Segundo slide con siguientes 3 imágenes */}
                    <div className="carousel-item">
                      <div className="row">
                        {producto.imagenes.slice(3, 6).map((img, index) => (
                          <div className="col-4" key={`second-${index}`}>
                            <a href="#">
                              <img className="card-img img-fluid" src={`/assets/img/${img}`} alt={`Producto ${index + 4}`} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tercer slide con imágenes restantes */}
                    <div className="carousel-item">
                      <div className="row">
                        {producto.imagenes.slice(6, 9).map((img, index) => (
                          <div className="col-4" key={`third-${index}`}>
                            <a href="#">
                              <img className="card-img img-fluid" src={`/assets/img/${img}`} alt={`Producto ${index + 7}`} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-1 align-self-center">
                  <a href="#multi-item-example" role="button" data-bs-slide="next">
                    <i className="text-dark fas fa-chevron-right"></i>
                    <span className="sr-only">Siguiente</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Detalles del Producto */}
            <div className="col-lg-7 mt-5">
              <div className="card">
                <div className="card-body">
                  <h1 className="h2">{producto.titulo}</h1>
                  <p className="h3 py-2">${producto.precio.toFixed(2)}</p>
                  <p className="py-2">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fa fa-star ${i < Math.floor(producto.calificacion) ? 'text-warning' : 'text-secondary'}`}
                      ></i>
                    ))}
                    <span className="list-inline-item text-dark">
                      Calificación {producto.calificacion} | {producto.reseñas} Reseñas
                    </span>
                  </p>
                  
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <h6>Marca:</h6>
                    </li>
                    <li className="list-inline-item">
                      <p className="text-muted"><strong>{producto.marca}</strong></p>
                    </li>
                  </ul>

                  <h6>Descripción:</h6>
                  <p>{producto.descripcion}</p>
                  
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <h6>Color:</h6>
                    </li>
                    <li className="list-inline-item">
                      <p className="text-muted"><strong>{producto.colores.join(' / ')}</strong></p>
                    </li>
                  </ul>

                  <h6>Especificaciones:</h6>
                  <ul className="list-unstyled pb-3">
                    {producto.especificaciones.map((espec, index) => (
                      <li key={index}>{espec}</li>
                    ))}
                  </ul>

                  <form action="" method="GET">
                    <input type="hidden" name="producto-titulo" value={producto.titulo} />
                    <div className="row">
                      <div className="col-auto">
                        <ul className="list-inline pb-3">
                          <li className="list-inline-item">Tamaño:
                            <input type="hidden" name="producto-tamaño" id="producto-tamaño" value="500ml" />
                          </li>
                          {producto.tamaños.map(tamaño => (
                            <li className="list-inline-item" key={tamaño}>
                              <span className="btn btn-success btn-size">{tamaño}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-auto">
                        <ul className="list-inline pb-3">
                          <li className="list-inline-item text-right">
                            Cantidad
                            <input type="hidden" name="producto-cantidad" id="producto-cantidad" value="1" />
                          </li>
                          <li className="list-inline-item">
                            <button type="button" className="btn btn-success" id="btn-minus">-</button>
                          </li>
                          <li className="list-inline-item">
                            <span className="badge bg-secondary" id="var-value">1</span>
                          </li>
                          <li className="list-inline-item">
                            <button type="button" className="btn btn-success" id="btn-plus">+</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="row pb-3">
                      <div className="col d-grid">
                        <button type="submit" className="btn btn-success btn-lg" name="submit" value="buy">Comprar</button>
                      </div>
                      <div className="col d-grid">
                        <button type="submit" className="btn btn-success btn-lg" name="submit" value="addtocard">Añadir al Carrito</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Relacionados */}
      <section className="py-5">
        <div className="container">
          <div className="row text-left p-2 pb-3">
            <h4>Productos Relacionados</h4>
          </div>

          <div className="row">
            {productosRelacionados.map(producto => (
              <div className="col-md-4 col-6 mb-4" key={producto.id}>
                <div className="card h-100 product-wap rounded-0">
                  <div className="card rounded-0">
                    <img 
                      className="card-img rounded-0 img-fluid" 
                      src={`/assets/img/${producto.imagen}`} 
                      alt={producto.nombre} 
                      style={{height: '300px', objectFit: 'cover'}}
                    />
                    <div className="card-img-overlay rounded-0 producto-overlay d-flex align-items-center justify-content-center">
                      <ul className="list-unstyled">
                        <li><button className="btn btn-success text-white"><i className="far fa-heart"></i></button></li>
                        <li><button className="btn btn-success text-white mt-2"><i className="far fa-eye"></i></button></li>
                        <li><button className="btn btn-success text-white mt-2"><i className="fas fa-cart-plus"></i></button></li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body text-center">
                    <a href="#" className="h3 text-decoration-none">{producto.nombre}</a>
                    <ul className="list-unstyled d-flex justify-content-center mb-1">
                      <li>
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fa fa-star ${i < producto.calificacion ? 'text-warning' : 'text-muted'}`}
                          ></i>
                        ))}
                      </li>
                    </ul>
                    <p className="text-center mb-0">${producto.precio.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scripts */}
      <script src="/assets/js/jquery-1.11.0.min.js"></script>
      <script src="/assets/js/jquery-migrate-1.2.1.min.js"></script>
      <script src="/assets/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/js/templatemo.js"></script>
      <script src="/assets/js/custom.js"></script>
      <script src="/assets/js/slick.min.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            $('#carousel-related-product').slick({
              infinite: true,
              arrows: false,
              slidesToShow: 4,
              slidesToScroll: 3,
              dots: true,
              responsive: [{
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 3
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 3
                }
              }]
            });
          `,
        }}
      />
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
};

export default DetalleProducto;