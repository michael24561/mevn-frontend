// app/shop/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Head from 'next/head';

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

      {/* Scripts necesarios para el funcionamiento */}
      <script src="/assets/js/jquery-1.11.0.min.js"></script>
      <script src="/assets/js/jquery-migrate-1.2.1.min.js"></script>
      <script src="/assets/js/bootstrap.bundle.min.js"></script>
      <script src="/assets/js/templatemo.js"></script>
      <script src="/assets/js/custom.js"></script>
    </>
  );
}