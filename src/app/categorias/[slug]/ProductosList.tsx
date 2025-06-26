'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Importa useRouter

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductosList({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const router = useRouter(); // Obtiene el router
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const getProductImageUrl = (imagePath: string | undefined | null) => {
    if (!imagePath) return null;
    return `${API_BASE_URL}${imagePath}`;
  };

  // Función para manejar el clic en la imagen
const handleProductClick = (productoId: string) => {
  router.push(`/shop/${productoId}`);
};

  const agregarAlCarrito = async (productoId: string) => {
    try {
      const producto = productos.find(p => p._id === productoId);
      const productoNombre = producto?.nombre || 'producto';
      
      const toastId = toast.loading(`Agregando ${productoNombre} al carrito...`);
      
      const clienteId = session?.user?.id || 'guest';

      const response = await fetch(`${API_BASE_URL}/api/carritos/items`, {
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
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categorias/slug/${slug}`);
        if (!res.ok) throw new Error('Error al obtener productos de la categoría');
        const data = await res.json();
        setProductos(data.productos || []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Cargando productos...</h4>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <h2 className="fw-bold border-bottom pb-2">Nuestra Colección</h2>
      </div>

      {productos.length > 0 ? (
        productos.map((producto) => (
          <div key={producto._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="card h-100 border-0 shadow-sm d-flex flex-column">
              <div className="position-relative" style={{ height: '250px', overflow: 'hidden', cursor: 'pointer' }}
                   onClick={() => handleProductClick(producto._id)}>
                {getProductImageUrl(producto.imagen) && (
                  <img
                    src={getProductImageUrl(producto.imagen)}
                    alt={producto.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      console.warn('Imagen fallida:', producto.imagen);
                    }}
                  />
                )}
                {producto.destacado && (
                  <span className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 small rounded">
                    Destacado
                  </span>
                )}
              </div>
              <div className="card-body">
                <Link href={`/productos/${producto.slug}`} className="text-decoration-none">
                  <h5 className="card-title text-dark">{producto.nombre}</h5>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="h5 text-success fw-bold">${producto.precio.toFixed(2)}</span>
                    {producto.rating && (
                      <div className="text-warning">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star${i < Math.floor(producto.rating) ? '' : '-half-alt'}`}
                          ></i>
                        ))}
                        <small className="text-muted ms-1">({producto.numReviews})</small>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              <div className="card-footer bg-transparent border-0 mt-auto">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    agregarAlCarrito(producto._id);
                  }}
                  className="btn btn-success w-100 py-2"
                  disabled={producto.stock <= 0}
                >
                  {producto.stock <= 0 ? 'Sin stock' : (
                    <>
                      <i className="fas fa-shopping-cart me-2"></i> 
                      Añadir al carrito
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center py-5">
          <h3 className="text-muted">No hay productos en esta categoría</h3>
        </div>
      )}
    </div>
  );
}